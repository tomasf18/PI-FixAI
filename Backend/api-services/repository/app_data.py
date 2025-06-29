## External imports
from uuid import UUID
from typing import List, Dict, Optional

## Internal imports
from dto.user import UserCreate
from database import cassandra_client       
from config import APP_DATA_KEYSPACE as KEYSPACE, MAX_OCCURRENCES_SCROLL_MOBILE_LIST_PAGE, MAX_OCCURRENCES_SCROLL_WEBSITE_LIST_PAGE, MAX_OCCURRENCES_LOADING_WEBSITE_MAP_PAGE

# ======================== APP DATA KEYSPACE ========================
# a classe for each table in the `app_data` keyspace

class Organization:
    
    @staticmethod
    async def get_organization_language(organization_id: UUID) -> Optional[str]:
        """
        Retrieve the language of an organization.
        """
        query = f"""
        SELECT language
        FROM {KEYSPACE}.organization
        WHERE organization_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (organization_id,))
        row = result.one()
        return row["language"] if row else None

class Category: 
    
    @staticmethod
    async def get_categories_by_organization(organization_id: UUID) -> List[str]:
        """
        Returns a list of categories for a given organization.
        """
        query = f"""
        SELECT category
        FROM {KEYSPACE}.category
        WHERE organization_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (organization_id,))
        return [row['category'] for row in result]

    @staticmethod
    async def get_category_details(organization_id: UUID, category: str) -> Dict:
        """
        Returns the details of a specific category.
        """
        query = f"""
        SELECT description, num_pending, num_in_progress, num_resolved
        FROM {KEYSPACE}.category
        WHERE organization_id = %s
            AND category = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (organization_id, category))
        return result.one()

    @staticmethod
    async def update_categories_num(organization_id: UUID, category:str, status: str, num: int):
        """
        Update the number of occurrences for a given category and status.
        """
        query = f"""
        UPDATE {KEYSPACE}.category
        SET num_{status} = %s
        WHERE organization_id = %s
            AND category = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (num, organization_id, category))
        return result.one()
    
    @staticmethod
    async def get_organization_categories(organization_id: UUID):
        """
        Returns the categories, respective descriptions and number of occurrences for a given organization.
        """
        query = f"""
        SELECT category, description, num_pending, num_in_progress, num_resolved
        FROM {KEYSPACE}.category
        WHERE organization_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (organization_id,))
        return list(result)

class IncidentDetails:
    
    @staticmethod
    async def list_incidents_by_status(organization_id: UUID, reference_time_id: UUID, status: str, is_descendent: bool, ) -> List[Dict]:
        """
        Returns a list of incidents filtered by status.
        """
        query = f"""
        SELECT incident_id, main_category, severity, status, dateof(first_occurrence_time_id) as date, num_occurrences, first_occurrence_time_id
        FROM {KEYSPACE}.incident_by_status
        WHERE organization_id = %s
            AND status = %s
            AND first_occurrence_time_id {'<' if is_descendent else '>'} %s
        ORDER BY first_occurrence_time_id {'DESC' if is_descendent else 'ASC'}
        LIMIT {MAX_OCCURRENCES_SCROLL_WEBSITE_LIST_PAGE}
        """
        result = await cassandra_client.execute(KEYSPACE, query, (organization_id, status, reference_time_id))
        return list(result)
    
    @staticmethod
    async def list_incidents_by_status_and_category(organization_id: UUID, reference_time_id: UUID, status: str, category: str, is_descendent: bool, ) -> List[Dict]:
        """
        Returns a list of incidents filtered by status.
        """
        query = f"""
        SELECT incident_id, main_category, severity, status, dateof(first_occurrence_time_id) as date, num_occurrences, first_occurrence_time_id
        FROM {KEYSPACE}.incident_by_status_and_category
        WHERE organization_id = %s
            AND status = %s
            AND main_category = %s
            AND first_occurrence_time_id {'<' if is_descendent else '>'} %s
        ORDER BY first_occurrence_time_id {'DESC' if is_descendent else 'ASC'}
        LIMIT {MAX_OCCURRENCES_SCROLL_WEBSITE_LIST_PAGE}
        """
        result = await cassandra_client.execute(KEYSPACE, query, (organization_id, status, category, reference_time_id))
        return list(result)
    
    @staticmethod
    async def get_incidents_not_resolved(organization_id: UUID, status_list: List[str], category_list: List[str]) -> List[Dict]:
        """
        Returns incidents that are not resolved.
        """
        placeholders_status = ",".join(["%s"] * (len(status_list)))
        placeholders_category = ",".join(["%s"] * (len(category_list)))
        query = f"""
        SELECT incident_id, first_photo_id, centroid_latitude, centroid_longitude, main_category, first_occurrence_time_id
        FROM {KEYSPACE}.incident_by_status_and_category
        WHERE organization_id = %s
            AND status IN ({placeholders_status})
            AND main_category IN ({placeholders_category})
        """
        params = [organization_id] + status_list + category_list
        result = await cassandra_client.execute(KEYSPACE, query, params)
        return list(result)
    
    @staticmethod
    async def get_incident_details(incident_id: UUID) -> Dict:
        """
        Returns details of a specific incident.
        """
        query = f"""
        SELECT incident_id, organization_id, first_occurrence_time_id, first_photo_id, num_occurrences, severity, centroid_latitude, centroid_longitude, main_description, main_category, status, TTL(organization_id) AS remaining_ttl
        FROM {KEYSPACE}.incident_details
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (incident_id, ))
        return result.one()

    @staticmethod
    async def get_incident_suggestions(incident_id: UUID):
        """
        Returns a suggestion for the category and description
        """
        query = f"""
        SELECT main_description, main_category 
        FROM {KEYSPACE}.incident_details
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (incident_id,))
        return result.one()

    @staticmethod
    async def update_incident_details_status(incident_id: UUID, new_status: str):
        """
        Update the status of an incident in the incident_details table.
        """
        query = f"""
        UPDATE {KEYSPACE}.incident_details
        SET status = %s
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (new_status, incident_id))
        return result

    @staticmethod
    async def update_incident_details_num_occurrences(incident_id: UUID, num_occurrences: int):
        """
        Increment the number of occurrences.
        """
        query = f"""
        UPDATE {KEYSPACE}.incident_details 
        SET num_occurrences = %s
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (num_occurrences, incident_id))
        return result
    
    @staticmethod
    async def insert_incident_details(
        incident_id: UUID,
        organization_id: UUID,
        first_occurrence_time_id: UUID,
        first_photo_id: UUID,
        num_occurrences: int,
        severity: str,
        centroid_latitude: float,
        centroid_longitude: float,
        main_description: str,
        main_category: str,
        status: str,
        remaining_ttl: int = 0
    ) -> None:
        """
        Insert a new incident record into the incident_details table in App_data keyspace.
        """
        query = f"""
        INSERT INTO {KEYSPACE}.incident_details (
            incident_id, organization_id, first_occurrence_time_id, first_photo_id, num_occurrences,
            severity, centroid_latitude, centroid_longitude, main_description, main_category, status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        {"USING TTL " + str(remaining_ttl) if remaining_ttl else ""}
        """
        await cassandra_client.execute(
            KEYSPACE,
            query,
            (
                incident_id,
                organization_id,
                first_occurrence_time_id,
                first_photo_id,
                num_occurrences,
                severity,
                centroid_latitude,
                centroid_longitude,
                main_description,
                main_category,
                status,
            )
        )
    
    @staticmethod
    async def delete_incident_details(incident_id: UUID) -> None:
        """
        Delete a row from the incident_details table.
        """
        query = f"""
        DELETE 
        FROM {KEYSPACE}.incident_details 
        WHERE incident_id = %s
        """
        await cassandra_client.execute(KEYSPACE, query, (incident_id,))


    @staticmethod
    async def delete_incident_details(incident_id: UUID) -> None:
        """
        Delete a row from the incident_details table.
        """
        query = f"""
        DELETE 
        FROM {KEYSPACE}.incident_details 
        WHERE incident_id = %s
        """
        await cassandra_client.execute(KEYSPACE, query, (incident_id,))

    @staticmethod
    async def update_incident_details_category_description(incident_id, main_category, main_description, ttl: int = 0):
        """
        Update the category and description of an incident in the incident_details table.
        """
        query = f"""
        UPDATE {KEYSPACE}.incident_details
        {"USING TTL " + str(ttl) if ttl else ""}
        SET main_category = %s, main_description = %s
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (main_category, main_description, incident_id))
        return result

class IncidentByStatus:
    @staticmethod
    async def insert_incident_by_status(
        organization_id: UUID,
        first_occurrence_time_id: UUID,
        status: str,
        main_category: str,
        incident_id: UUID,
        first_photo_id: UUID,
        severity: str,
        centroid_latitude: float,
        centroid_longitude: float,
        num_occurrences: int,
        **kwargs
    ):
        """
        Insert a row into the incident_by_status table.
        """
        query = f"""
        INSERT INTO {KEYSPACE}.incident_by_status (
            organization_id, first_occurrence_time_id, status, main_category, incident_id,
            first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        result = await cassandra_client.execute(
            KEYSPACE, query, (
                organization_id, first_occurrence_time_id, status, main_category, incident_id,
                first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences
            )
        )
        return result

    @staticmethod
    async def delete_incident_by_status(
        organization_id: UUID,
        status: str,
        first_occurrence_time_id: UUID
    ) -> None:
        """
        Delete a row from the incident_by_status table.
        """
        query = f"""
        DELETE 
        FROM {KEYSPACE}.incident_by_status 
        WHERE organization_id = %s AND status = %s AND first_occurrence_time_id = %s
        """
        await cassandra_client.execute(KEYSPACE, query, (organization_id, status, first_occurrence_time_id))

    @staticmethod
    async def update_incident_by_status_num_occurrences(
        organization_id: UUID,
        status: str,
        first_occurrence_time_id: UUID,
        num_occurrences: int
    ):
        """
        Update the number of occurrences in the incident_by_status table.
        """
        query = f"""
        UPDATE {KEYSPACE}.incident_by_status
        SET num_occurrences = %s
        WHERE organization_id = %s AND status = %s AND first_occurrence_time_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (num_occurrences, organization_id, status, first_occurrence_time_id))
        return result

class IncidentByStatusAndCategory:
    @staticmethod
    async def insert_incident_by_status_and_category(
        organization_id: UUID,
        first_occurrence_time_id: UUID,
        status: str,
        main_category: str,
        incident_id: UUID,
        first_photo_id: UUID,
        severity: str,
        centroid_latitude: float,
        centroid_longitude: float,
        num_occurrences: int,
        **kwargs
    ):
        """
        Insert a row into the incident_by_status_and_category table.
        """
        query = f"""
        INSERT INTO {KEYSPACE}.incident_by_status_and_category (
            organization_id, first_occurrence_time_id, status, main_category, incident_id,
            first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        result = await cassandra_client.execute(
            KEYSPACE, query, (
                organization_id, first_occurrence_time_id, status, main_category, incident_id,
                first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences
            )
        )
        return result
    
    @staticmethod
    async def delete_incident_by_status_and_category(
        organization_id: UUID,
        status: str,
        main_category: str,
        first_occurrence_time_id: UUID
    ) -> None:
        """
        Delete a row from the incident_by_status_and_category table.
        """
        query = f"""
        DELETE 
        FROM {KEYSPACE}.incident_by_status_and_category 
        WHERE organization_id = %s AND status = %s AND main_category = %s AND first_occurrence_time_id = %s
        """
        await cassandra_client.execute(KEYSPACE, query, (organization_id, status, main_category, first_occurrence_time_id))
    
    @staticmethod
    async def update_incident_by_status_and_category_num_occurrences(
        organization_id: UUID,
        status: str,
        main_category: str,
        first_occurrence_time_id: UUID,
        num_occurrences: int
    ):
        """
        Update the number of occurrences in the incident_by_status_and_category table.
        """
        query = f"""
        UPDATE {KEYSPACE}.incident_by_status_and_category
        SET num_occurrences = %s
        WHERE organization_id = %s AND status = %s AND main_category = %s AND first_occurrence_time_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (num_occurrences, organization_id, status, main_category, first_occurrence_time_id))
        return result
    
class IncidentResolvedReason:
    
    @staticmethod
    async def insert_incident_resolved_reason(
        incident_id: UUID,
        video_id: UUID,
        edge_data_id: UUID
    ):
        """
        Insert a resolved reason into the incident_resolved_reason table.
        """
        query = f"""
        INSERT INTO {KEYSPACE}.incident_resolved_reason (incident_id, video_id, created_at, edge_data_id)
        VALUES (%s, %s, toTimestamp(now()), %s)
        """
        result = await cassandra_client.execute(KEYSPACE, query, (incident_id, video_id, edge_data_id))
        return result
    
    @staticmethod
    async def get_incident_videos(incident_id: UUID) -> List[Dict]:
        """
        Retrieve the videos associated with an incident.
        """
        query = f"""
        SELECT video_id, created_at, edge_data_id
        FROM {KEYSPACE}.incident_resolved_reason
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (incident_id,))
        return list(result)

class OccurrenceDetails:

    @staticmethod
    async def get_occurrence_category(occurrence_id: UUID):
        """
        Retrieve the category of an occurrence.
        """
        query = f"""
        SELECT category
        FROM {KEYSPACE}.occurrence_details
        WHERE occurrence_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (occurrence_id,))
        row = result.one()
        return row["category"] if row else None

    @staticmethod
    async def get_occurrence_details(occurrence_id: UUID) -> Dict:
        """
        Return details of a specific occurrence.
        """
        query = f"""
        SELECT occurrence_id, organization_id, user_id, photo_id, category, dateof(time_id) AS date, status, photo_latitude, photo_longitude, description
        FROM {KEYSPACE}.occurrence_details
        WHERE occurrence_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (occurrence_id,))
        return result.one()
    
    @staticmethod
    async def update_occurrence_details(occurrence_id: UUID, new_status: str):
        """
        Update the status of an occurrence in the occurrence_details table.
        """
        query = f"""
        UPDATE {KEYSPACE}.occurrence_details
        SET status = %s
        WHERE occurrence_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (new_status, occurrence_id))
        return result

    @staticmethod
    async def insert_occurrence_details(
        occurrence_id: UUID, user_id: UUID, organization_id: UUID, incident_id: UUID, 
        time_id: UUID, photo_id: UUID, photo_latitude: float, photo_longitude: float, 
        description: str, category: str, status: str 
    ):
        query = f"""
        INSERT INTO {KEYSPACE}.occurrence_details (occurrence_id, user_id, organization_id, incident_id, time_id, 
                                        photo_id, photo_latitude, photo_longitude, description, category, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        result = await cassandra_client.execute(KEYSPACE, query, (
            occurrence_id, user_id, organization_id, incident_id, time_id, 
            photo_id, photo_latitude, photo_longitude, description, category, status
        ))
        return result


class IncidentOccurrences:
    @staticmethod
    async def get_incident_occurrences(incident_id: UUID) -> List[Dict]:
        """
        Return all occurrences associated with an incident
        """
        query = f"""
        SELECT occurrence_id, occurrence_time_id, user_id, photo_id, photo_latitude, photo_longitude
        FROM {KEYSPACE}.incident_occurrences
        WHERE incident_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (incident_id,))
        return list(result)

    @staticmethod
    async def insert_incident_occurrences(
        organization_id: UUID, incident_id: UUID, occurrence_time_id: UUID, 
        occurrence_id: UUID, user_id: UUID, photo_id: UUID, photo_latitude: float, photo_longitude: float
    ):
        query = f"""
        INSERT INTO {KEYSPACE}.incident_occurrences (organization_id, incident_id, occurrence_time_id, occurrence_id, user_id, photo_id, photo_latitude, photo_longitude)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        result = await cassandra_client.execute(KEYSPACE, query, (
            organization_id, incident_id, occurrence_time_id, occurrence_id, user_id, photo_id, photo_latitude, photo_longitude
        ))
        return result
    
    @staticmethod
    async def get_incident_occurrences_ids(incident_id: UUID) -> List[UUID]:
        """
        Return the list of occurrence_ids associated with an incident.
        """
        query = f"""
        SELECT occurrence_id
        FROM {KEYSPACE}.incident_occurrences
        WHERE incident_id = %s
        """
        return await cassandra_client.execute(KEYSPACE, query, (incident_id,))


class OccurrenceByStatus:
    @staticmethod
    async def update_occurrence_by_status(user_id: UUID, status: str, first_occurrence_time_id: UUID, new_status: str):
        """
        Update the status of an occurrence in the occurrence_by_status table.
        """
        query = f"""
        UPDATE {KEYSPACE}.occurrence_by_status
        SET status = %s
        WHERE user_id = %s
            AND status = %s
            AND time_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (new_status, user_id, status, first_occurrence_time_id))
        return result


class UserProfile:

    @staticmethod
    async def get_user_name(user_id: UUID) -> Optional[str]:
        """
        Retrieve the name of a user by user_id.
        """
        query = f"""
        SELECT name
        FROM {KEYSPACE}.user_profile
        WHERE user_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id,))
        row = result.one()
        return row["name"] if row else None
    
    @staticmethod
    async def update_user_name(user_id: UUID, new_name: str):
        """
        Update the name of a user in the user_profile table.
        """
        query = f"""
        UPDATE {KEYSPACE}.user_profile
        SET name = %s
        WHERE user_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (new_name, user_id))
        return result

    @staticmethod
    async def get_email_notification_flag(user_id: UUID) -> Optional[bool]:
        """
        Retrieve the email notification flag of a user.
        """
        query = f"""
        SELECT email_notification_flag
        FROM {KEYSPACE}.user_profile
        WHERE user_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id,))
        row = result.one()
        return row["email_notification_flag"] if row else None

    @staticmethod
    async def update_email_notification_flag(user_id: UUID, email_notification_flag: bool):
        """
        Update the email notification flag for a user.
        """
        query = f"""
        UPDATE {KEYSPACE}.user_profile
        SET email_notification_flag = %s
        WHERE user_id = %s
        """
        await cassandra_client.execute(KEYSPACE, query, (email_notification_flag, user_id))
        
    @staticmethod
    async def create_user_profile(user_id: UUID, user: UserCreate):
        """
        Create a user profile.
        """
        query = f"""
        INSERT INTO {KEYSPACE}.user_profile (user_id, name, email_notification_flag)
        VALUES (%s, %s, false)
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id, user.name))
        return result
    
    @staticmethod
    async def delete_user(user_id: UUID):
        """
        Delete a user profile.
        """
        query = f"""
        DELETE FROM {KEYSPACE}.user_profile
        WHERE user_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id,))
        return result
    
    @staticmethod
    async def update_email_notifications(user_id: UUID, email_notifications: bool):
        query = f"""
        UPDATE {KEYSPACE}.user_profile
        SET email_notification_flag = %s
        WHERE user_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (email_notifications, user_id))
        return result
    
    @staticmethod
    async def get_email_notifications(user_id: UUID):
        query = f"""
        SELECT email_notification_flag
        FROM {KEYSPACE}.user_profile
        WHERE user_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id,))
        return result.one()["email_notification_flag"]


class UserOccurrenceByStatus:
    @staticmethod
    async def get_user_number_occurrences_by_status(user_id: UUID, status: str) -> int:
        """
        Return the number of occurrences with a specific status.
        """
        query = f"""
        SELECT COUNT(*) as count
        FROM {KEYSPACE}.user_occurrence_by_status
        WHERE user_id = %s
            AND status = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id, status))
        return result.one()["count"]
    
    @staticmethod
    async def get_user_occurrences_by_status(user_id: UUID, status_list: list[str]) -> List[Optional[Dict]]:
        """
        Retrieve the occurrences of a user filtered by status.
        """
        placeholders = ",".join(["%s"] * len(status_list))
        query = f"""
        SELECT occurrence_id, category, photo_id, photo_latitude, photo_longitude
        FROM {KEYSPACE}.user_occurrence_by_status
        WHERE user_id = %s
            AND status IN ({placeholders})
        """
        params = [user_id] + status_list
        result = await cassandra_client.execute(KEYSPACE, query, params)
        return list(result)
    
    @staticmethod
    async def get_user_occurrences_by_status_by_time(user_id: UUID, status: str, max_time_id: UUID) -> List[Optional[Dict]]:
        """
        Retrieve the occurrences of a user filtered by status.
        """
        query = f"""
        SELECT occurrence_id, category, status, photo_id, dateof(time_id) AS date, time_id
        FROM {KEYSPACE}.user_occurrence_by_status
        WHERE user_id = %s
            AND status = %s
            AND time_id < %s
        ORDER BY time_id DESC
        LIMIT {MAX_OCCURRENCES_SCROLL_MOBILE_LIST_PAGE}
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id, status, max_time_id))
        return list(result) # list for standard service

    @staticmethod
    async def get_user_occurrences_in_progress_or_pending(user_id: UUID) -> List[Dict]:
        """
        Retrieve the occurrences of a user that are either 'Pending' or 'In Progress'.
        """
        query = f"""
        SELECT occurrence_id, category, photo_id, photo_latitude, photo_longitude
        FROM {KEYSPACE}.user_occurrence_by_status
        WHERE user_id = %s
            AND status IN ('Pending', 'In Progress')
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id,))
        return list(result)

    @staticmethod
    async def insert_user_occurrence_by_status(
        user_id: UUID, time_id: UUID, status: str, occurrence_id: UUID, 
        photo_id: UUID, photo_latitude: float, photo_longitude: float, category: str
    ):
        query = f"""
        INSERT INTO {KEYSPACE}.user_occurrence_by_status (user_id, time_id, status, occurrence_id, photo_id, 
                                            photo_latitude, photo_longitude, category)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        result = await cassandra_client.execute(KEYSPACE, query, (
            user_id, time_id, status, occurrence_id, photo_id, 
            photo_latitude, photo_longitude, category
        ))
        return result
    
    @staticmethod
    async def delete_user_occurrence_by_status(user_id: UUID, status: str, time_id: UUID):
        query = f"""
        DELETE FROM {KEYSPACE}.user_occurrence_by_status
        WHERE user_id = %s AND status = %s AND time_id = %s
        """
        result = await cassandra_client.execute(KEYSPACE, query, (user_id, status, time_id))
        return result
