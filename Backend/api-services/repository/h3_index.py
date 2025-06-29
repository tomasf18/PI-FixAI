## External imports
from uuid import UUID
from typing import Optional

## Internal imports
from database import cassandra_client
from config import H3_INDEX_KEYSPACE as KEYSPACE

# ======================== H3_INDEX KEYSPACE ========================
# a class for each table in the `h3_index` keyspace

class OrganizationRegions:
    @staticmethod
    async def get_organization_id(h3_index: str) -> Optional[UUID]:
        """
        Get organization id by h3 index
        """
        query = f"""
        SELECT organization_id
        FROM {KEYSPACE}.organization_regions
        WHERE h3_index = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (h3_index,))
        return result.one()["organization_id"] if result else None

class IncidentsRegions:
    @staticmethod
    async def get_incident_id(h3_index: str) -> Optional[UUID]:
        """
        Get the first incident id from the incident_ids set for the specified h3_index.
        Returns the incident id if present, otherwise returns None.
        """
        query = f"""
        SELECT incident_ids
        FROM {KEYSPACE}.incidents_regions
        WHERE h3_index = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (h3_index,))
        incidents_set = result.one()["incident_ids"] if result else None
        return next(iter(incidents_set)) if incidents_set else None
    
    @staticmethod
    async def get_incident_ids(h3_index_list: list[str]) -> set[UUID]:
        """
        Get the incident ids for a list of h3 indexes.
        Returns a dictionary with h3_index as key and a list of incident ids as value.
        """
        query = f"""
        SELECT h3_index, incident_ids
        FROM {KEYSPACE}.incidents_regions
        WHERE h3_index IN %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (tuple(h3_index_list),)) # {'incident_ids': SortedSet([UUID('9e563b52-a8f8-432b-9af6-bb3f2e0f094f')])}
        all_incidents = set()
        all_h3_indexes = set()
        for row in result:
            incident_ids = row.get("incident_ids")
            h3_index = row.get("h3_index")
            if incident_ids and h3_index:
                all_incidents.update(incident_ids)
                all_h3_indexes.add(h3_index)
        
        return all_incidents, all_h3_indexes
    
    @staticmethod
    async def delete_incident_id(h3_index: str, incident_id: UUID) -> None:
        """
        Delete an incident id from the incident_ids set in incident_regions table.
        """
        query = f"""
        UPDATE {KEYSPACE}.incidents_regions 
        SET incident_ids = incident_ids - %s
        WHERE h3_index = %s
        """

        await cassandra_client.execute(KEYSPACE, query, ({incident_id}, h3_index))

    @staticmethod
    async def insert_incident_id(h3_index: str, incident_id: UUID, remaining_ttl: int = 0) -> None:
        """
        Add an incident ID to the incident_ids set in the incidents_regions table.
        If TTL is set, delete the existing set and overwrite it with the new set using TTL.
        """
        if remaining_ttl > 0:
            # Step 1: Read existing incident_ids
            select_query = f"""
            SELECT incident_ids FROM {KEYSPACE}.incidents_regions
            WHERE h3_index = %s
            """
            result = await cassandra_client.execute(KEYSPACE, select_query, (h3_index,))
            row = result.one()  # Use the `one()` method to fetch a single row
            existing_ids = row["incident_ids"] if row and row["incident_ids"] else set()

            # Step 2: Add the new incident_id
            updated_ids = existing_ids | {incident_id}

            # Step 3: Delete the existing set
            delete_query = f"""
            DELETE FROM {KEYSPACE}.incidents_regions
            WHERE h3_index = %s
            """
            await cassandra_client.execute(KEYSPACE, delete_query, (h3_index,))

            # Step 4: Overwrite the whole set with TTL
            update_query = f"""
            UPDATE {KEYSPACE}.incidents_regions
            USING TTL %s
            SET incident_ids = %s
            WHERE h3_index = %s
            """
            await cassandra_client.execute(KEYSPACE, update_query, (remaining_ttl, updated_ids, h3_index))

        else:
            # Normal append (no TTL)
            update_query = f"""
            UPDATE {KEYSPACE}.incidents_regions
            SET incident_ids = incident_ids + %s
            WHERE h3_index = %s
            """
            await cassandra_client.execute(KEYSPACE, update_query, ({incident_id}, h3_index))