## External imports
import json
from typing import List
from uuid import UUID
from kafka import KafkaProducer
from kafka.errors import KafkaError
from kafka.admin import KafkaAdminClient, NewTopic

## Internal imports
from config import LLM_BOOTSTRAP_SERVERS, DESCRIPTION_CATEGORY_SEVERITY_TOPIC, JOB_CLUSTERING_TOPIC, CHECK_INCIDENT_RESOLVED_TOPIC
from utils.logger import logger

# ======================== Kafka Configuration ========================

class LLMProducer:
    
    def __init__(self, bootstrap_servers):
        self.bootstrap_servers = bootstrap_servers
        self.producer = KafkaProducer(bootstrap_servers=self.bootstrap_servers)
        self.admin_client = KafkaAdminClient(bootstrap_servers=self.bootstrap_servers)
        
        self.topics = [ 
            DESCRIPTION_CATEGORY_SEVERITY_TOPIC,
            JOB_CLUSTERING_TOPIC,
            CHECK_INCIDENT_RESOLVED_TOPIC
        ]

        logger.info("Kafka topics:")
        logger.info(DESCRIPTION_CATEGORY_SEVERITY_TOPIC)
        logger.info(JOB_CLUSTERING_TOPIC)
        logger.info(CHECK_INCIDENT_RESOLVED_TOPIC)


        self.create_topics(self.topics)
        logger.info(f"[✅] Kafka Producer initialized with servers: {self.bootstrap_servers}")
        
    def create_topics(self, topic_names: List[str], num_partitions: int = 1, replication_factor: int = 1):
        """
        Create a new topic in Kafka.
        
        Args:
            topic_name (str): The name of the topic to create.
            num_partitions (int): The number of partitions for the topic.
            replication_factor (int): The replication factor for the topic.
        """
        new_topics = [
            NewTopic(name=name, num_partitions=num_partitions, replication_factor=replication_factor)
            for name in topic_names
        ]

        try:
            self.admin_client.create_topics(new_topics, validate_only=False)
            logger.info(f"[✅] Topics created: {', '.join(topic_names)}")
        except KafkaError as e:
            logger.info(f"[⚠️] Some topics might already exist. Details: {e}")

    def send_message(self, topic: str, message_dict: dict):
        message = json.dumps(message_dict).encode('utf-8')
        future = self.producer.send(topic, message)
        try:
            future.get(timeout=10)
            logger.info(f"[📤] Message sent to topic '{topic}' successfully.")
        except KafkaError as e:
            logger.info(f"[❌] Failed to send message to topic '{topic}': {e}")

    def generate_description_and_category_and_severity_from_photo(self, photo_id: UUID, incident_id: UUID, allowed_categories: List[str], language: str, ttl: int):
        self.send_message(
            DESCRIPTION_CATEGORY_SEVERITY_TOPIC,
            {
                "photo_id": str(photo_id),
                "incident_id": str(incident_id),
                "allowed_categories": allowed_categories,
                "language": language,
                "ttl": ttl
            }
        )
    
    def clustering(self, occurrence_id: UUID, incident_id: UUID, h3_cell: str):
        topic = JOB_CLUSTERING_TOPIC
        self.send_message(
            topic,
            {
                "occurrence_id": str(occurrence_id),
                "incident_id": str(incident_id),
                "h3_cell": h3_cell
            }
        )
    
    def check_incident_resolved(self, incident_id: UUID, photo_id: UUID, video_id: UUID, description: str, category: str, edge_data_id: UUID):
        topic = CHECK_INCIDENT_RESOLVED_TOPIC
        self.send_message(
            topic,
            {
                "incident_id": str(incident_id),
                "photo_id": str(photo_id),
                "video_id": str(video_id),
                "description": description,
                "category": category,
                "edge_data_id": str(edge_data_id)
            }
        )
        

llm_producer = LLMProducer(LLM_BOOTSTRAP_SERVERS)
