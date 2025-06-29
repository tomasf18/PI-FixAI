## External imports
import os
import io
import h3
from PIL import Image
from uuid import UUID, uuid4
from fastapi import UploadFile, HTTPException, File
from cassandra.util import uuid_from_time
from datetime import datetime

## Internal imports
from dto.occurrence import OccurrenceDetailsResponse, OccurrencePreSubmissionResponse, OccurrenceSubmissionRequest
from repository import app_data, h3_index, buckets
from utils.h3_index import get_organization_id_from_cell
from config import H3_INCIDENT_RESOLUTION, H3_ORGANIZATION_MINIMUM_RESOLUTION, H3_ORGANIZATION_MAXIMUM_RESOLUTION, INCIDENT_TTL
from producers.llm_producer import llm_producer
from utils.logger import logger
import redis.asyncio as redis

# Redis async client
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST"),
    port=int(os.getenv("REDIS_PORT")),
    decode_responses=True
)

# ======================== OCCURRENCE SERVICE ========================

class OccurrenceService:

    @staticmethod
    async def get_occurrence_details(occurrence_id: UUID) -> OccurrenceDetailsResponse:
        details = await app_data.OccurrenceDetails.get_occurrence_details(occurrence_id)
        
        if not details:
            raise HTTPException(status_code=404, detail="Occurrence not found")
        
        return OccurrenceDetailsResponse(
            occurrence_id=details.get("occurrence_id"),
            photo_id=details.get("photo_id"),
            category=details.get("category"),
            date=details.get("date"),
            status=details.get("status"),
            photo_latitude=details.get("photo_latitude"),
            photo_longitude=details.get("photo_longitude"),
            description=details.get("description")
        )
            
    @staticmethod
    async def pre_submit_occurrence(latitude: float, longitude: float,  photo: UploadFile = File(...)) -> OccurrencePreSubmissionResponse:
        try:
            # Read the photo into memory to check size and dimensions
            photo.file.seek(0)  # Ensure we're at the start of the file
            photo_content = await photo.read()  # Read the file content
            photo_size_kb = len(photo_content) / 1024  # Convert bytes to KB

            # Check file size (must be < 100 KB)
            if photo_size_kb >= 100:
                raise HTTPException(
                    status_code=400,
                    detail=f"Photo size is {photo_size_kb:.2f} KB, which exceeds the maximum allowed size of 100 KB."
                )

            # Open the image to check dimensions
            img = Image.open(io.BytesIO(photo_content))
            width, height = img.size

            # Check dimensions (must be exactly 400x670)
            if width != 400 or height != 670:
                raise HTTPException(
                    status_code=400,
                    detail=f"Photo dimensions are {width}x{height}, but must be exactly 400x670."
                )

        except Exception as e:
            # If there's an error reading the image or validating, reject the request
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=400, detail="Invalid photo format or unable to process photo.")
        
        ## Get the organization_id from the (lat, long)
        photo_h3_index = h3.latlng_to_cell(latitude, longitude, H3_ORGANIZATION_MAXIMUM_RESOLUTION)
        organization_id = await get_organization_id_from_cell(photo_h3_index, H3_ORGANIZATION_MAXIMUM_RESOLUTION, H3_ORGANIZATION_MINIMUM_RESOLUTION) #UUID("00000000-0000-1111-0000-000000000000") for testing
        if not organization_id:
            raise HTTPException(status_code=404, detail="Organization not found")

        ## Upload the photo in MinIO (convert to WEBP)
        try:        
            img = Image.open(photo.file)
            
            # Correct the orientation based on EXIF data
            try:
                exif = img._getexif()
                if exif:
                    orientation_key = 274  # Exif tag for orientation
                    if orientation_key in exif:
                        orientation = exif[orientation_key]
                        if orientation == 3:
                            img = img.rotate(180, expand=True)
                        elif orientation == 6:
                            img = img.rotate(270, expand=True)
                        elif orientation == 8:
                            img = img.rotate(90, expand=True)
            except AttributeError:
                pass  # No EXIF data, skip orientation correction
            
            output = io.BytesIO()
            img.convert("RGB").save(output, format="WEBP")
            output.seek(0)
            
            photo_id = uuid4()
            await buckets.Photos.upload_file(
                file_name=str(photo_id),
                file_buffer=output,
                file_size=output.getbuffer().nbytes,
                content_type="image/webp"
            )
        except Exception:
            raise HTTPException(status_code=500, detail="Error uploading photo (the type might not be supported)")

        categories = await app_data.Category.get_categories_by_organization(organization_id)
        language = await app_data.Organization.get_organization_language(organization_id)

        photo_h3_index = h3.latlng_to_cell(latitude, longitude, H3_INCIDENT_RESOLUTION)
        
        incident_id = uuid4()
        category = None
        description = None
        severity = None
        status = "pending"
        num_occurrences = 0
        first_occurrence_time_id = uuid_from_time(datetime.now())
        ttl = INCIDENT_TTL
        
        # Insert incident with empty fields
        await app_data.IncidentDetails.insert_incident_details(incident_id, organization_id, first_occurrence_time_id, photo_id, num_occurrences, severity, latitude, longitude, description, category, status, ttl)
        await app_data.IncidentDetails.update_incident_details_category_description(incident_id, category, description, ttl)
    
        logger.info(f"Temporary incident created with ID: {incident_id}")
        
        llm_producer.generate_description_and_category_and_severity_from_photo(
            photo_id=photo_id,
            incident_id=incident_id,
            allowed_categories=categories,
            language=language,
            ttl=ttl
        )
            
        return OccurrencePreSubmissionResponse(
            incident_id=incident_id,
            max_time_to_submit=INCIDENT_TTL,
            allowed_categories=categories,
            photo_id=photo_id
        )
        
    @staticmethod
    async def submit_occurrence(request_body: OccurrenceSubmissionRequest, user_id: UUID):
        """
        Create occurrence associated with incident_id.
        Temporary Incident should be permanent (TTL 0).

        - Update incident TTL to 0
        - Insert into the occurrence_details
        - Add one in the number of the status in the category
        - Insert into the user_occurrences_by_status
        - Insert into the incident_occurrences
        - Update the number of occurrences in the incident_details
        - Update the number of occurrences in the incident_by_status
        - Update the number of occurrences in the incident_by_status_and_category
        """
        # TODO: validate the arguments!
        data = request_body.model_dump()

        # Extract data from the request body
        incident_id = data["incident_id"]
        photo_id = data["photo_id"]
        date = data["date"]
        photo_latitude = data["photo_latitude"]
        photo_longitude = data["photo_longitude"]
        severity = data["severity"]

        # Category and description might have been changed by the user
        user_category = data["category"]
        user_description = data["description"]

        category = await redis_client.get(f"llm:{incident_id}:category")
        description = await redis_client.get(f"llm:{incident_id}:description")
        severity = await redis_client.get(f"llm:{incident_id}:severity")

        description = description if description else user_description
        logger.info(f"Using description: {description}")
        
        # LLM severity. If LLM has failed or had not found a category, severity it will be DEFAULT_SEVERITY.
        severity = await redis_client.get(f"llm:{incident_id}:severity")

        logger.info(f"Category from redis: {category}")
        logger.info(f"Category from request body: {user_category}")
        logger.info(f"Description from redis: {description}")
        logger.info(f"Description from request body: {user_description}")

        incident_details = await app_data.IncidentDetails.get_incident_details(incident_id)
        if not incident_details:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        organization_id = incident_details.get("organization_id")
        status = incident_details.get("status")

        allowed_categories = await app_data.Category.get_categories_by_organization(organization_id)

        if category is None or category not in allowed_categories:
            raise HTTPException(status_code=400, detail="Category not allowed")
        
        print(f"\n\nINCIDENT DETAILS BEFORE LOCATION UPDATE: {incident_details}\n\n")
        incident_details["remaining_ttl"] = 0
        time_id = incident_details.get("first_occurrence_time_id") # since is the first occurrence
        
        incident_details["main_category"] = category
        incident_details["main_description"] = description
        incident_details["severity"] = severity
        incident_details["centroid_latitude"] = photo_latitude      # update to the location of the markers
        incident_details["centroid_longitude"] = photo_longitude    # update to the location of the markers
    
        print(f"\n\nINCIDENT DETAILS AFTER LOCATION UPDATE: {incident_details}\n\n")
        
        await app_data.IncidentDetails.delete_incident_details(incident_id)
        await app_data.IncidentDetails.insert_incident_details(**incident_details) # rewrite the incident with TTL 0
        await app_data.IncidentByStatus.insert_incident_by_status(**incident_details)
        await app_data.IncidentByStatusAndCategory.insert_incident_by_status_and_category(**incident_details)

        ## Now, with the already updated incident location (markers), we need to update the H3 index
        h3_cell = h3.latlng_to_cell(photo_latitude, photo_longitude, H3_INCIDENT_RESOLUTION)
        await h3_index.IncidentsRegions.insert_incident_id(h3_cell, incident_id)

        occurrence_id = uuid4()
        num_occurrences = incident_details.get("num_occurrences") + 1
        first_occurrence_time_id = incident_details.get("first_occurrence_time_id")

        ## Insert into the occurrence_details
        await app_data.OccurrenceDetails.insert_occurrence_details(occurrence_id, user_id, organization_id, incident_id, time_id, photo_id, photo_latitude, photo_longitude, user_description, user_category, status)

        ## Insert into the user_occurrences_by_status
        logger.info(f"User {user_id} inserting occurrence {occurrence_id} with status {status}")
        await app_data.UserOccurrenceByStatus.insert_user_occurrence_by_status(user_id, time_id, status, occurrence_id, photo_id, photo_latitude, photo_longitude, category)
        
        ## Insert into the incident_occurrences
        await app_data.IncidentOccurrences.insert_incident_occurrences(organization_id, incident_id, time_id, occurrence_id, user_id, photo_id, photo_latitude, photo_longitude)

        ## Update the number of occurrences in the incident_details
        await app_data.IncidentDetails.update_incident_details_num_occurrences(incident_id, num_occurrences)

        ## Update the number of occurrences in the incident_by_status
        await app_data.IncidentByStatus.update_incident_by_status_num_occurrences(organization_id, status, first_occurrence_time_id, num_occurrences)

        ## Update the number of occurrences in the incident_by_status_and_category
        await app_data.IncidentByStatusAndCategory.update_incident_by_status_and_category_num_occurrences(organization_id, status, category, first_occurrence_time_id, num_occurrences)

        llm_producer.clustering(occurrence_id, incident_id, h3_cell)

    @staticmethod
    async def can_get_occurrence(occurrence_id: UUID, token: dict) -> bool:
        """
        Check if the user can access the occurrence.
        """
        organization_id = token.get("organization_id")
        occurrence_details = await app_data.OccurrenceDetails.get_occurrence_details(occurrence_id)
        
        if organization_id:
            return occurrence_details.get("organization_id") == UUID(organization_id)
        else:
            return occurrence_details.get("user_id") == UUID(token.get("user_id"))