## External imports
import asyncio
import redis.asyncio as redis
from cassandra.cluster import Cluster, NoHostAvailable
from cassandra.cqlengine.connection import register_connection, set_default_connection
from cassandra.query import SimpleStatement
from cassandra import OperationTimedOut
from cassandra.policies import DCAwareRoundRobinPolicy
from minio import Minio
from fastapi import UploadFile
from uuid import UUID
import io

## Internal imports
from config import CASSANDRA_NODES, CASSANDRA_PORT, CASSANDRA_KEYSPACES, MINIO_HOST, MINIO_PORT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, MINIO_BUCKETS, REDIS_HOST, REDIS_PORT
from utils.logger import logger

# ======================== DATABASE CLIENT ========================

class CassandraClient:
    def __init__(self):
        self.cluster = None
        self.sessions = {}  # Dictionary to hold sessions for each keyspace

    async def connect(self):
        """Connect to Cassandra asynchronously for all keyspaces."""
        try:
            # auth_provider = PlainTextAuthProvider(
            #     username=CASSANDRA_USERNAME, 
            #     password=CASSANDRA_PASSWORD
            # )
            self.cluster = Cluster(
                CASSANDRA_NODES,
                port=CASSANDRA_PORT,
                # auth_provider=auth_provider,  # Only necessary for docker instance with authentication
                load_balancing_policy=DCAwareRoundRobinPolicy(local_dc='datacenter1'),
                protocol_version=5  # TODO -> understand this
            )
            logger.info(f"[✅] Connected to Cassandra nodes: {CASSANDRA_NODES}:{CASSANDRA_PORT}")

            # Connect to each keyspace asynchronously
            for keyspace in CASSANDRA_KEYSPACES:
                loop = asyncio.get_event_loop()
                session = await loop.run_in_executor(
                    None, lambda ks=keyspace: self.cluster.connect(ks)
                )
                self.sessions[keyspace] = session
                register_connection(keyspace, session=session)
                set_default_connection(keyspace)
                logger.info(f"[✅] Connected to Cassandra keyspace: {keyspace}")

        except NoHostAvailable as e:
            logger.info(f"[❌] Cassandra connection failed: {e}")
            exit(1)
        except Exception as e:
            logger.info(f"[❌] Error connecting to Cassandra: {e}")
            exit(1)

    async def shutdown(self):
        """Shutdown the Cassandra cluster and sessions."""
        if self.cluster:
            try:
                loop = asyncio.get_event_loop()
                await loop.run_in_executor(None, self.cluster.shutdown)
                logger.info("[✅] Cassandra cluster shutdown")
            except Exception as e:
                logger.info(f"[❌] Error shutting down Cassandra cluster: {e}")
            finally:
                self.sessions.clear()

    async def execute(self, keyspace: str, query: str, params=None):
        """Execute a query asynchronously in the specified keyspace."""
        if keyspace not in self.sessions:
            raise ValueError(f"No session found for keyspace: {keyspace}")

        session = self.sessions[keyspace]
        if not session:
            raise Exception(f"Session for keyspace {keyspace} is not initialized")

        statement = SimpleStatement(query)
        try:
            future = session.execute_async(statement, params)
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, future.result)
            return result
        except OperationTimedOut as e:
            logger.info(f"Query timed out in keyspace {keyspace}: {query}, error: {e}")
            raise
        except Exception as e:
            logger.info(f"Error executing query in keyspace {keyspace}: {query}, error: {e}")
            raise

class MinIOClient:
    def __init__(self):
        self.client = None
        
    async def connect(self):
        # Initialize the MinIO client
        self.client = Minio(f"{MINIO_HOST}:{MINIO_PORT}", MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, secure=False) # NOTE: secure=False to deactivate HTTPS to avoid SSL errors
        logger.info(f"[✅] Connected to MinIO at {MINIO_HOST}:{MINIO_PORT} with user {MINIO_ROOT_USER}")
        self.buckets = MINIO_BUCKETS

        # Check if the buckets exist
        for bucket in self.buckets:
            if not self.client.bucket_exists(bucket):
                logger.info(f"[❌] Bucket {bucket} does not exist")
                exit(1)
            else:
                logger.info(f"[✅] Connected to MinIO bucket: {bucket}")
                        
    async def upload_file(self, bucket_name: str, file_name: str, file_buffer: io.BytesIO, file_size: int, content_type: str):
        if bucket_name not in self.buckets:
            raise ValueError(f"No bucket found: {bucket_name}")

        try:
            self.client.put_object(bucket_name, file_name, file_buffer, file_size, content_type)
            logger.info(f"[✅] Uploaded file to bucket {bucket_name}: {file_name}")
        except Exception as e:
            logger.info(f"[❌] Error uploading file to bucket {bucket_name}, error: {e}")
            logger.info(f"[❌] File name: {file_name}, File size: {file_size}, Content type: {content_type}")
            raise

        return
    
    async def download_file(self, bucket_name: str, file_name: str):
        if bucket_name not in self.buckets:
            raise ValueError(f"No bucket found: {bucket_name}")

        try:
            result = self.client.get_object(bucket_name, file_name)
        except Exception as e:
            logger.info(f"[❌] Error downloading file from bucket {bucket_name}, error: {e}")
            logger.info(f"[❌] File name: {file_name}")
            raise

        return result

# Singleton instance for the CassandraClient
cassandra_client = CassandraClient()
asyncio.run(cassandra_client.connect())

# Singleton instance for the MinIOClient
minio_client = MinIOClient()
asyncio.run(minio_client.connect())

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True
)
