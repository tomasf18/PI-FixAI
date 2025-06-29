import h3
import numpy as np
import os
import asyncio

from uuid import UUID
from dotenv import load_dotenv, find_dotenv
from passlib.context import CryptContext
from cassandra.cluster import Cluster, NoHostAvailable
from cassandra.cqlengine.connection import register_connection, set_default_connection
from cassandra.query import SimpleStatement
from cassandra import OperationTimedOut
from cassandra.policies import DCAwareRoundRobinPolicy

from utils.logger import logger

load_dotenv(find_dotenv())
logger.info(f"dot_env: {find_dotenv()}")
logger.info(os.getenv('AUTH_KEYSPACE'))

## Cassandra Database
CASSANDRA_NODES = [os.getenv('CASSANDRA_HOST')]
CASSANDRA_PORT = os.getenv('CASSANDRA_CONTAINER_PORT')
CASSANDRA_KEYSPACES = [os.getenv('AUTH_KEYSPACE'), os.getenv('H3_INDEX_KEYSPACE'), os.getenv('APP_DATA_KEYSPACE')]
H3_INDEX_KEYSPACE = os.getenv('H3_INDEX_KEYSPACE')
APP_DATA_KEYSPACE = os.getenv('APP_DATA_KEYSPACE')
AUTH_KEYSPACE = os.getenv('AUTH_KEYSPACE')

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

# Singleton instance for the CassandraClient
cassandra_client = CassandraClient()
asyncio.run(cassandra_client.connect())


################################################################################################
# H3 Index
################################################################################################

PRECISION = 13

# Convert to Polygon
logger.info("Converting to Polygon...")
aveiro_coords = list(map(tuple, np.loadtxt("oliveira-coords.csv", delimiter=',', dtype=float)))
aveiro_h3shape = h3.LatLngPoly(aveiro_coords)

# Convert to H3 Cells
logger.info("Converting to H3 Cells...")
aveiro_cells = h3.polygon_to_cells(aveiro_h3shape, PRECISION)

logger.info("Compacting cells...")
aveiro_compacted = h3.compact_cells(aveiro_cells)

################################################################################################
# Insert Organization in the Database
################################################################################################

logger.info("Inserting Organization in the Database...")
organization_id = UUID("fa3b0c8e-4f2d-4f5b-9c7d-1a2e3b4c5d6e") # TODO: change this!
organization_logo = "https://www.cm-olb.pt/oliveiradobairro/uploads/writer_file/document/859/logo_ncb_cinza_01.png"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # default hashing algorithm
email = "cmo@example.com"
password_hash = pwd_context.hash("pass1")
categories = {
    "traffic_lights": "Malfunctioning or damaged traffic lights",
    "urban_drainage": "Water accumulation or flooding in the streets",
    "pavement": "Damaged pavement or sidewalks",
    "traffic_signs": "Missing or damaged traffic signs",
    "infrastructure": "Damaged infrastructure, including buildings and bridges",
    "lighting": "Broken or malfunctioning street lighting",
    "others": "Other types of incidents"
}

query = f"""
    INSERT INTO {APP_DATA_KEYSPACE}.organization (organization_id, name, language, logo)
    VALUES (%s, %s, %s, %s)
"""

asyncio.run(cassandra_client.execute(APP_DATA_KEYSPACE, query, (organization_id, "Câmara Municipal de Oliveira do Bairro", "Portuguese of Portugal", organization_logo)))

query = f"""
    INSERT INTO {AUTH_KEYSPACE}.operators (email, password_hash, created_at, organization_id, operator_id)
    VALUES (%s, %s, toTimestamp(now()), %s, uuid())
"""

asyncio.run(cassandra_client.execute(AUTH_KEYSPACE, query, (email, password_hash, organization_id)))


query = f"""
INSERT INTO {APP_DATA_KEYSPACE}.category (organization_id, category, description, num_pending, num_in_progress, num_resolved)
VALUES (%s, %s, %s, %s, %s, %s);
"""

for category, description in categories.items():
    asyncio.run(cassandra_client.execute(APP_DATA_KEYSPACE, query, (organization_id, category, description, 0, 0, 0)))

################################################################################################
# Insert Regions in the Database
################################################################################################

logger.info("Inserting Regions in the Database...")
for h3_index in aveiro_compacted:

    query = f"""
        INSERT INTO {H3_INDEX_KEYSPACE}.organization_regions (h3_index, organization_id)
        VALUES (%s, %s)
    """
    asyncio.run(cassandra_client.execute(H3_INDEX_KEYSPACE, query, (h3_index, organization_id)))

