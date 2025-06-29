## External imports
import os
import h3
import json
import asyncio
import time
from PIL import Image
from io import BytesIO
from uuid import UUID
from kafka import KafkaConsumer
import redis.asyncio as redis
from google.genai import types

## Internal imports
from utils.llm import generate_description_and_category_and_severity_from_photo, merge_descriptions_into_an_updated_main_description
from dto.ai import AIDescriptionCategorySeverityRequest, AIMergeDescriptionsRequest
from config import LLM_BOOTSTRAP_SERVERS, TOPIC_NAME, DESCRIPTION_CATEGORY_SEVERITY_TOPIC, JOB_CLUSTERING_TOPIC, H3_INDEX_KEYSPACE, PHOTOS_BUCKET_NAME, VIDEOS_BUCKET_NAME, LLM_GROUP_ID, LLM_GROUP_INSTANCE_ID, APP_DATA_KEYSPACE, INCIDENT_DESCRIPTION_SIMILARITY_THRESHOLD, DEFAULT_CATEGORY, DEFAULT_SEVERITY, CHECK_INCIDENT_RESOLVED_TOPIC
from utils.llm import generate_description_and_category_and_severity_from_photo, merge_descriptions_into_an_updated_main_description, get_most_similar_near_incident, check_incident_resolved_from_video
from dto.ai import AIDescriptionCategorySeverityRequest
from utils.database import minio_client, cassandra_client
from utils.logger import logger

# Redis async client
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    decode_responses=True
)

def tic():
    return time.time()


def tac(start_time):
    return time.time() - start_time


def print_message(message):
    logger.info(f"message: {message}")
    logger.info("\n\n============================================")
    logger.info(f"Photo ID:           {message['photo_id']}")
    logger.info(f"Incident ID:        {message['incident_id']}")
    logger.info(f"Allowed categories: {message['allowed_categories'][0]} ...")
    logger.info(f"Language:           {message['language']}")
    logger.info(f"TTL:                {message['ttl']}")
    logger.info("\n==============================================")

def print_message_merge_descriptions(message):
    logger.info(f"message: {message}")
    logger.info("\n\n============================================")
    logger.info(f"Photo ID:           {message['photo_id']}")
    logger.info(f"Incident ID:        {message['incident_id']}")
    logger.info(f"Occurrence Description: {message['occurrence_description']}")
    logger.info(f"Previous Main Description: {message['previous_main_description']}")
    logger.info(f"Previous Severity: {message['previous_severity']}")
    logger.info(f"Language:           {message['language']}")
    logger.info("\n==============================================")


class LLMConsumer:

    def __init__(self, topic: str):
        logger.info(f"[✅] Starting LLM Consumer...")
        self.bootstrap_servers = LLM_BOOTSTRAP_SERVERS
        self.topic = topic
        self.group_id = LLM_GROUP_ID
        self.group_instance_id = LLM_GROUP_INSTANCE_ID

        self.consumer = KafkaConsumer(
            self.topic,
            bootstrap_servers=self.bootstrap_servers,
            group_id=self.group_id,
            group_instance_id=self.group_instance_id,
            enable_auto_commit=False,
            auto_offset_reset='earliest',
            leave_group_on_close=True,
        )
        logger.info(f"[✅] Kafka Consumer initialized with servers: {self.bootstrap_servers}")

    async def send_to_websocket_channel(self, incident_id, description, category, severity):
        data = {
            "type": "llm_response",
            "description": description,
            "category": category,
            "severity": severity
        }
        await redis_client.publish(f"llm:{incident_id}", json.dumps(data))
        await redis_client.set(f"llm:{incident_id}:category", category, ex=300)  # set TTL of 5 minutes (300 seconds)
        await redis_client.set(f"llm:{incident_id}:description", description, ex=300)
        await redis_client.set(f"llm:{incident_id}:severity", severity, ex=300)

        logger.info(f"[📡] Published to Redis channel llm: {incident_id}")
        
    async def handle_check_incident_resolved(self, message_dict):
        logger.info("[🧪] Handling check incident resolved")
        
        incident_id = UUID(message_dict.get("incident_id"))
        photo_id = UUID(message_dict.get("photo_id"))
        video_id = UUID(message_dict.get("video_id"))
        description = message_dict.get("description")
        category = message_dict.get("category")
        edge_data_id = UUID(message_dict.get("edge_data_id"))
        
        # get photo from MinIO
        result = await minio_client.download_file(
            bucket_name=PHOTOS_BUCKET_NAME,
            file_name=str(photo_id),
        )
        photo = Image.open(BytesIO(result.data))
        logger.info(f"Image size: {photo.size}")
        
        # get video from MinIO
        video = await minio_client.download_file(
            bucket_name=VIDEOS_BUCKET_NAME,
            file_name=str(video_id),
        )
        
        video_bytes = video.data
                 
        # check if incident is resolved
        start_time = tic()
        try:
            ai_response_json = check_incident_resolved_from_video(
                photo=photo,
                video=types.Part.from_bytes(
                    data=video_bytes,
                    mime_type="video/quicktime",
                ),
                description=description,
                category=category,
            )
        except Exception as e:
            logger.info(f"[❌] Error during AI check: {e}", exc_info=True)
            return

        duration = tac(start_time)
        logger.info(f"AI check successfully in {duration} seconds")
        logger.info(f"AI response: {ai_response_json}")
        logger.info(f"Total tokens used: {ai_response_json.get('usage_metadata').total_token_count}")
        
        is_resolved = ai_response_json.get("resolved")
        
        if is_resolved == "true" or is_resolved == True:
            await insert_incident_resolved_reason(incident_id, video_id, edge_data_id)
        
            logger.info(f"[✅] Incident {incident_id} is resolved.")
            logger.info(f"Video ID: {video_id}")

    async def handle_description_category_severity(self, message_dict):

        request = AIDescriptionCategorySeverityRequest(**message_dict)

        # Download image from MinIO
        result = await minio_client.download_file(
            bucket_name=PHOTOS_BUCKET_NAME,
            file_name=str(request.photo_id),
        )
        img = Image.open(BytesIO(result.data))
        logger.info(f"Image size: {img.size}")

        logger.info(f"[⚠️] Allowed categories: {request.allowed_categories}")

        # Remove DEFAULT_CATEGORY category if present 
        if DEFAULT_CATEGORY in request.allowed_categories:
            request.allowed_categories.remove(DEFAULT_CATEGORY)
            logger.info(f"[⚠️] Removed default category: {DEFAULT_CATEGORY} from allowed categories {request.allowed_categories}")
        
        # Generate AI info
        start_time = tic()
        try:
            ai_response_json = generate_description_and_category_and_severity_from_photo(
                image=img,
                categories=request.allowed_categories,
                language=request.language
            )
        except Exception as e:
            logger.info(f"[❌] Error during AI generation: {e}", exc_info=True)
            return

        duration = tac(start_time)
        logger.info(f"AI generated successfully in {duration} seconds")
        logger.info(f"AI response: {ai_response_json}")

        ai_description = ai_response_json.get("description")
        ai_category = ai_response_json.get("category")
        ai_severity = ai_response_json.get("severity")

        if not all([ai_description, ai_category, ai_severity]):
            # Problem not found or LLM not working
            logger.info("[⚠️] AI response is incomplete. Sending default values to WebSocket.")
            await self.send_to_websocket_channel(
                incident_id=request.incident_id,
                description="",
                category=DEFAULT_CATEGORY,
                severity=DEFAULT_SEVERITY
            )
            return

        logger.info(f"Total tokens used: {ai_response_json.get('usage_metadata').total_token_count}")
        
        # Send to WebSocket (via Redis pub/sub)
        await self.send_to_websocket_channel(
            incident_id=request.incident_id,
            description=ai_response_json.get("description"),
            category=ai_response_json.get("category"),
            severity=ai_response_json.get("severity")
        )

        logger.info(f"[✅] Data sent to WebSocket subscribers for incident {request.incident_id}")
    
    async def handle_clustering(self, message_dict):
        logger.info("[🧪] Handling job clustering")
        occurrence_id = UUID(message_dict.get("occurrence_id"))
        incident_id = UUID(message_dict.get("incident_id"))
        h3_cell = message_dict.get("h3_cell")
        
        logger.info(f"[📦] Job clustering for incident {incident_id} in H3 cell {h3_cell}")
        
        near_incident_ids = await find_near_incident_ids_from_incident_in_h3_cell(incident_id, h3_cell)
            
        logger.info(f"[📦] Found near incident IDs: {near_incident_ids}")
        
        data_to_merge_description_job = await get_data_to_merge_description_job(incident_id, occurrence_id)

        if len(near_incident_ids) == 0:
            logger.info("[⚠️] No incident IDs found for clustering.")
            ## Add one in the number of the status in the category
            await update_num_pending_on_category(incident_id)

            return await self.handle_merge_descriptions(data_to_merge_description_job)
    
        current_incident_id_details = await get_details_of_incident(incident_id)
        logger.info(f"\n\n[📦] Current incident details: {current_incident_id_details}\n\n")
        
        near_incidents_with_same_category = await get_near_incidents_with_same_category(current_incident_id_details, near_incident_ids)
               
        logger.info(f"\n\n[📦] Found near incidents with same category: {near_incidents_with_same_category}\n\n")
        
        if len(near_incidents_with_same_category) == 0:
            logger.info("[⚠️] No incidents found with the same category.")
            ## Add one in the number of the status in the category
            await update_num_pending_on_category(incident_id)

            return await self.handle_merge_descriptions(data_to_merge_description_job)        
        
        ai_response_json = get_ai_response_for_most_similar_near_incident(current_incident_id_details, near_incidents_with_same_category)
        
        similar_incident_id = UUID(ai_response_json["similar_incident_id"])
        similarity_percentage = ai_response_json["similarity_percentage"]
        
        logger.info(f"\n\n\n[📦] Found incident with same category and with similarity: {similarity_percentage}%\n\n\n")
        
        if similarity_percentage < float(INCIDENT_DESCRIPTION_SIMILARITY_THRESHOLD):
            logger.info(f"[⚠️] Similarity percentage {similarity_percentage} is below the threshold.")
            ## Add one in the number of the status in the category
            await update_num_pending_on_category(incident_id)

            return await self.handle_merge_descriptions(data_to_merge_description_job)

        similar_incident_details = await make_clustering_operations(incident_id, h3_cell, current_incident_id_details, similar_incident_id, occurrence_id)
        
        data_to_merge_description_job["incident_id"] = similar_incident_id
        data_to_merge_description_job["previous_main_description"] = similar_incident_details["main_description"]
        return await self.handle_merge_descriptions(data_to_merge_description_job)

    async def handle_merge_descriptions(self, message_dict):
        print("[🧪] Handling merge descriptions")
        
        print_message_merge_descriptions(message_dict)

        request = AIMergeDescriptionsRequest(**message_dict)

        # Download image from MinIO
        result = await minio_client.download_file(
            bucket_name=PHOTOS_BUCKET_NAME,
            file_name=str(request.photo_id),
        )
        img = Image.open(BytesIO(result.data))
        logger.info(f"Image size: {img.size}")

        # Generate AI info
        start_time = tic()
        try:
            ai_response_json = merge_descriptions_into_an_updated_main_description(
                image=img,
                occurrence_description=request.occurrence_description,
                previous_main_description=request.previous_main_description,
                previous_severity=request.previous_severity,
                language=request.language
            )
        except Exception as e:
            logger.info(f"[❌] Error during merge descriptions: {e}", exc_info=True)
            return

        duration = tac(start_time)
        logger.info(f"Merge descriptions done successfully in {duration} seconds")

        if len(ai_response_json) == 2:
            # Update main_description and severity
            data = {
                "description": ai_response_json["description"],
                "severity": ai_response_json["severity"]
            }

            # Update main description and severity on incident_details where incident_id
            await update_incident_details(
                incident_id=request.incident_id,
                main_description=data["description"],
                severity=data["severity"]
            )
        else:
            logger.info("[⚠️] Invalid AI response format.")
            return

        logger.info("Merging descriptions successfully completed.")

    async def run(self):
        logger.info("[✅] Kafka Consumer started.")

        for message in self.consumer:
            try:
                message_dict = json.loads(message.value.decode("utf-8"))
                
                logger.info(f"[📥] Message received from topic '{self.topic}'")
                if self.topic == DESCRIPTION_CATEGORY_SEVERITY_TOPIC:
                    await self.handle_description_category_severity(message_dict)
                elif self.topic == JOB_CLUSTERING_TOPIC:
                    await self.handle_clustering(message_dict)
                elif self.topic == CHECK_INCIDENT_RESOLVED_TOPIC:
                    await self.handle_check_incident_resolved(message_dict)
                else:
                    logger.warning(f"[⚠️] Message received from unknown topic: {self.topic}")

                self.consumer.commit()
            except Exception as e:
                logger.info(f"[❌] Error processing message: {e}", exc_info=True)
            finally:
                await asyncio.sleep(0)  # Yield control to event loop

        logger.info("[✅] Kafka Consumer stopped.")
       
        
# ======================== DATABASE OPERATIONS ========================
# TODO: move this to a separate file

async def insert_incident_resolved_reason(incident_id, video_id, edge_data_id):
    query = f"""
    INSERT INTO {APP_DATA_KEYSPACE}.incident_resolved_reason 
    (incident_id, video_id, created_at, edge_data_id)
    VALUES (%s, %s, toTimestamp(now()), %s)
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, query, (incident_id, video_id, edge_data_id))
    return result
        
async def update_incident_details(incident_id, main_description, severity):
    query = f"""
    UPDATE {APP_DATA_KEYSPACE}.incident_details
    SET main_description = %s,
        severity = %s
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(
        APP_DATA_KEYSPACE,
        query,
        (main_description, severity, incident_id)
    )
    logger.info(f"[✅] Updated incident details for incident {incident_id}")

    
async def find_incident_ids_in_h3_cell(cell):
    query = f"""
    SELECT incident_ids
    FROM {H3_INDEX_KEYSPACE}.incidents_regions
    WHERE h3_index = %s
    """
    result = await cassandra_client.execute(H3_INDEX_KEYSPACE, query, (cell,))
    if result:
        return result.one().get("incident_ids", [])
    return []

async def find_near_incident_ids_from_incident_in_h3_cell(incident_id, h3_cell):
    neighbors = h3.grid_ring(h3_cell, 1)
    neighbors.append(h3_cell)
    near_incident_ids = set()
    for cell in neighbors:
        cell_incidents = await find_incident_ids_in_h3_cell(cell)
        near_incident_ids.update(near_incident_id for near_incident_id in cell_incidents if near_incident_id != incident_id)
    return near_incident_ids

async def get_photo_id_of_incident(incident_id):
    get_photo_id = f"""
    SELECT photo_id
    FROM {APP_DATA_KEYSPACE}.incident_occurrences
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_photo_id, (incident_id,))
    return result.one().get("photo_id")

async def get_organization_id_of_incident(incident_id):
    get_organization_id = f"""
    SELECT organization_id
    FROM {APP_DATA_KEYSPACE}.incident_occurrences
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_organization_id, (incident_id,))
    return result.one().get("organization_id")
        
async def get_description_of_occurrence(occurrence_id):
    get_description = f"""
    SELECT description
    FROM {APP_DATA_KEYSPACE}.occurrence_details
    WHERE occurrence_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_description, (occurrence_id,))
    return result.one().get("description") 

async def get_previous_main_description_of_incident(incident_id):
    get_previous_main_description = f"""
    SELECT main_description
    FROM {APP_DATA_KEYSPACE}.incident_details
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_previous_main_description, (incident_id,))
    return result.one().get("main_description")

async def get_main_category_of_incident(incident_id):
    get_main_category = f"""
    SELECT main_category
    FROM {APP_DATA_KEYSPACE}.incident_details
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_main_category, (incident_id,))
    return result.one().get("main_category")

async def get_previous_severity_of_incident(incident_id):
    get_previous_severity = f"""
    SELECT severity
    FROM {APP_DATA_KEYSPACE}.incident_details
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_previous_severity, (incident_id,))
    return result.one().get("severity")

async def get_language_of_organization(organization_id):
    get_language = f"""
    SELECT language
    FROM {APP_DATA_KEYSPACE}.organization
    WHERE organization_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_language, (organization_id,))
    return result.one().get("language")
        
async def get_data_to_merge_description_job(incident_id, occurrence_id):
    photo_id = await get_photo_id_of_incident(incident_id)
    logger.info(f"[📦] Photo ID: {photo_id}")
    
    organization_id = await get_organization_id_of_incident(incident_id)
    logger.info(f"[📦] Organization ID: {organization_id}")
    
    occurrence_description = await get_description_of_occurrence(occurrence_id)
    logger.info(f"[📦] Occurrence description: {occurrence_description}")
    
    previous_main_description = await get_previous_main_description_of_incident(incident_id)
    logger.info(f"[📦] Previous main description: {previous_main_description}")
    
    previous_severity = await get_previous_severity_of_incident(incident_id)
    logger.info(f"[📦] Previous severity: {previous_severity}")
    
    language = await get_language_of_organization(organization_id)
    logger.info(f"[📦] Language: {language}")
    
    return {
        "photo_id": photo_id,
        "incident_id": incident_id,
        "occurrence_description": occurrence_description,
        "previous_main_description": previous_main_description,
        "previous_severity": previous_severity,
        "language": language
    }
    
async def get_details_of_incident(incident_id):
    get_details = f"""
    SELECT incident_id, organization_id, first_occurrence_time_id, first_photo_id, num_occurrences, severity, centroid_latitude, centroid_longitude, main_description, main_category, status, TTL(organization_id) AS remaining_ttl
    FROM {APP_DATA_KEYSPACE}.incident_details
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_details, (incident_id,))
    return result.one()
          
async def get_near_incidents_with_same_category(current_incident_id_details, near_incident_ids):
    near_incidents_with_same_category = []
    for near_incident_id in near_incident_ids:
        near_incident_id_details = await get_details_of_incident(near_incident_id)
        if near_incident_id_details:
            if near_incident_id_details["main_category"] == current_incident_id_details["main_category"]:
                near_incidents_with_same_category.append({
                    "incident_id": near_incident_id_details["incident_id"],
                    "description": near_incident_id_details["main_description"],
                })
    return near_incidents_with_same_category
       
def get_ai_response_for_most_similar_near_incident(current_incident_id_details, near_incidents_with_same_category):
    try:
        ai_response_json = get_most_similar_near_incident(
            incident_description=current_incident_id_details["main_description"],
            neighbours=near_incidents_with_same_category
            )
        return ai_response_json
    except Exception as e:
        logger.info(f"[❌] Error during getting most similar near incident: {e}")
        return  
     
async def delete_incident_from_h3_cell(incident_id, h3_cell):
    delete_from_h3_index = f"""
    UPDATE {H3_INDEX_KEYSPACE}.incidents_regions 
    SET incident_ids = incident_ids - %s
    WHERE h3_index = %s
    """
    await cassandra_client.execute(H3_INDEX_KEYSPACE, delete_from_h3_index, ({incident_id}, h3_cell))
    
async def delete_incident_from_incident_details(incident_id):
    delete_from_incident_details = f"""
    DELETE
    FROM {APP_DATA_KEYSPACE}.incident_details
    WHERE incident_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, delete_from_incident_details, (incident_id,))    

async def delete_incident_from_incident_by_status(organization_id, status, first_occurrence_time_id):
    delete_from_incident_by_status = f"""
    DELETE
    FROM {APP_DATA_KEYSPACE}.incident_by_status
    WHERE organization_id = %s AND status = %s AND first_occurrence_time_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, delete_from_incident_by_status, (organization_id, status, first_occurrence_time_id))
    
async def delete_incident_from_incident_by_status_and_category(organization_id, status, main_category, first_occurrence_time_id):
    delete_from_incident_by_status_and_category = f"""
    DELETE 
    FROM {APP_DATA_KEYSPACE}.incident_by_status_and_category 
    WHERE organization_id = %s AND status = %s AND main_category = %s AND first_occurrence_time_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, delete_from_incident_by_status_and_category, (organization_id, status, main_category, first_occurrence_time_id))    
    
async def get_the_occurrence_details_of_incident(incident_id):
    get_incident_occurrence = f"""
    SELECT *
    FROM {APP_DATA_KEYSPACE}.incident_occurrences
    WHERE incident_id = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, get_incident_occurrence, (incident_id,))
    return result.one()
   
async def delete_incident_from_incident_occurrences(incident_id):
    delete_from_incident_occurrences = f"""
    DELETE
    FROM {APP_DATA_KEYSPACE}.incident_occurrences
    WHERE incident_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, delete_from_incident_occurrences, (incident_id,))
         
async def insert_new_occurrence_for_incident(organization_id, incident_id, occurrence_time_id, photo_id, photo_latitude, photo_longitude, occurrence_id, user_id):
    incident_occurrence = f"""
    INSERT INTO {APP_DATA_KEYSPACE}.incident_occurrences 
    (organization_id, incident_id, occurrence_time_id, photo_id, photo_latitude, photo_longitude, occurrence_id, user_id)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, incident_occurrence, (organization_id, incident_id, occurrence_time_id, photo_id, photo_latitude, photo_longitude, occurrence_id, user_id))
    
async def update_occurrence_details_for_incident(incident_id, occurrence_id):
    update_incident_id_on_occurrence_details = f"""
    UPDATE {APP_DATA_KEYSPACE}.occurrence_details
    SET incident_id = %s
    WHERE occurrence_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, update_incident_id_on_occurrence_details, (incident_id, occurrence_id))
             
async def update_num_occurrences_on_incident_details_for_incident(num_occurrences, incident_id):
    # Update num occurrences on Incident Details (app_data)
    update_num_occurrences_on_incident_details = f"""
    UPDATE {APP_DATA_KEYSPACE}.incident_details 
    SET num_occurrences = %s
    WHERE incident_id = %s
    """ 
    await cassandra_client.execute(APP_DATA_KEYSPACE, update_num_occurrences_on_incident_details, (num_occurrences, incident_id))
   
async def update_num_occurrences_on_incident_by_status_for_incident(num_occurrences, organization_id, status, first_occurrence_time_id):
    update_num_occurrences_on_incident_by_status = f"""
    UPDATE {APP_DATA_KEYSPACE}.incident_by_status
    SET num_occurrences = %s
    WHERE organization_id = %s AND status = %s AND first_occurrence_time_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, update_num_occurrences_on_incident_by_status, (num_occurrences, organization_id, status, first_occurrence_time_id))
          
async def update_num_occurrences_on_incident_by_status_and_category(num_occurrences, organization_id, status, main_category, first_occurrence_time_id):
    update_num_occurrences_on_incident_by_status_and_category = f"""
    UPDATE {APP_DATA_KEYSPACE}.incident_by_status_and_category
    SET num_occurrences = %s
    WHERE organization_id = %s AND status = %s AND main_category = %s AND first_occurrence_time_id = %s
    """
    await cassandra_client.execute(APP_DATA_KEYSPACE, update_num_occurrences_on_incident_by_status_and_category, (num_occurrences, organization_id, status, main_category, first_occurrence_time_id))

async def update_num_pending_on_category(incident_id):
    # Step 1: Get the organization ID and category
    org_id = await get_organization_id_of_incident(incident_id)
    category = await get_main_category_of_incident(incident_id)

    # Step 2: Read the current value
    select_query = f"""
    SELECT num_pending 
    FROM {APP_DATA_KEYSPACE}.category
    WHERE organization_id = %s AND category = %s
    """
    result = await cassandra_client.execute(APP_DATA_KEYSPACE, select_query, (org_id, category))
    logger.info(f"[📦] Query result: {result}")
    current = result.one().get("num_pending", 0) if result else 0
    logger.info(f"[📦] Current num_pending value: {current}")

    # Step 3: Update with new value
    new_value = current + 1
    update_query = f"""
    UPDATE {APP_DATA_KEYSPACE}.category 
    SET num_pending = %s
    WHERE organization_id = %s AND category = %s
    """
    logger.info(f"[📦] Updating num_pending from {current} to {new_value}")
    await cassandra_client.execute(APP_DATA_KEYSPACE, update_query, (new_value, org_id, category))


async def make_clustering_operations(incident_id_to_group, h3_cell_of_incident_id_to_group, details_of_incident_to_group, similar_incident_id, occurrence_id):
    logger.info(f"[1️⃣] Deleting incident {incident_id_to_group} from H3 Index")
    await delete_incident_from_h3_cell(incident_id_to_group, h3_cell_of_incident_id_to_group)

    logger.info(f"[2️⃣] Deleting incident {incident_id_to_group} from Incident Details")
    await delete_incident_from_incident_details(incident_id_to_group)
    
    logger.info(f"[3️⃣] Deleting incident {incident_id_to_group} from Incident By Status")
    await delete_incident_from_incident_by_status(details_of_incident_to_group["organization_id"], details_of_incident_to_group["status"], details_of_incident_to_group["first_occurrence_time_id"])
        
    logger.info(f"[4️⃣] Deleting incident {incident_id_to_group} from Incident By Status And Category")
    await delete_incident_from_incident_by_status_and_category(details_of_incident_to_group["organization_id"], details_of_incident_to_group["status"], details_of_incident_to_group["main_category"], details_of_incident_to_group["first_occurrence_time_id"])
    
    logger.info(f"[5️⃣] Getting the occurrence details of incident {incident_id_to_group} (it only has one occurrence)")
    incident_occurrence = await get_the_occurrence_details_of_incident(incident_id_to_group)
    organization_id, occurrence_time_id, photo_id, photo_latitude, photo_longitude, user_id = (
        incident_occurrence["organization_id"], incident_occurrence["occurrence_time_id"], incident_occurrence["photo_id"], 
        incident_occurrence["photo_latitude"], incident_occurrence["photo_longitude"], incident_occurrence["user_id"]
    )
    
    logger.info(f"[6️⃣] Deleting incident {incident_id_to_group} from Incident Occurrences")
    await delete_incident_from_incident_occurrences(incident_id_to_group)
    
    logger.info(f"[] Inserting new occurrence for incident {similar_incident_id}")
    await insert_new_occurrence_for_incident(organization_id, similar_incident_id, occurrence_time_id, photo_id, photo_latitude, photo_longitude, occurrence_id, user_id)
    
    logger.info(f"[7️⃣] Updating incident_id on Occurrence Details for incident {similar_incident_id}")
    await update_occurrence_details_for_incident(similar_incident_id, occurrence_id)
    
    logger.info(f"[8️⃣] Getting incident details for the similar incident {similar_incident_id}")
    similar_incident_details = await get_details_of_incident(similar_incident_id)
    num_occurrences = similar_incident_details["num_occurrences"] + 1
    
    logger.info(f"[9️⃣] Updating num occurrences on Incident Details for incident {similar_incident_id}")
    await update_num_occurrences_on_incident_details_for_incident(num_occurrences, similar_incident_id)
    
    logger.info(f"[1️⃣0️⃣] Updating num occurrences on Incident By Status for incident {similar_incident_id}")
    await update_num_occurrences_on_incident_by_status_for_incident(num_occurrences, similar_incident_details["organization_id"], similar_incident_details["status"], similar_incident_details["first_occurrence_time_id"])
    
    logger.info(f"[1️⃣1️⃣] Updating num occurrences on Incident By Status And Category for incident {similar_incident_id}")
    await update_num_occurrences_on_incident_by_status_and_category(num_occurrences, similar_incident_details["organization_id"], similar_incident_details["status"], similar_incident_details["main_category"], similar_incident_details["first_occurrence_time_id"])
    
    logger.info("[✅] All clustering operations completed successfully!")
    return similar_incident_details
           
if __name__ == "__main__":
    topic = TOPIC_NAME
    if not topic:
        raise ValueError("TOPIC_NAME environment variable is not set.")

    logger.info(f"[🎧] Starting consumer for topic: {topic}")
    llm_consumer = LLMConsumer(topic)
    asyncio.run(llm_consumer.run())

