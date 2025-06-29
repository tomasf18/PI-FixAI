## External imports
from typing import List
from uuid import UUID, uuid4
from fastapi import File, HTTPException, UploadFile
import h3
import asyncio

## Internal imports
from dto.incident import IncidentGeoData, IncidentSuggestedResponse, IncidentDetailsWebResponse, IncidentSummaryResponse, IncidentMapResponse, IncidentVideoSuggestion
from dto.occurrence import OccurrenceIdResponse
from repository import app_data, h3_index, buckets
from utils.h3_index import destination_point_geodetic, get_organization_id_from_cell
from utils.logger import logger
from config import H3_INCIDENT_RESOLUTION, AVAILABLE_STATUS, REDIS_TTL_SEC_NEARBY_INCIDENTS
from producers.llm_producer import llm_producer
from database import redis_client

# ======================== INCIDENT SERVICE ========================

class IncidentService:

    @staticmethod
    async def get_incident_suggestions(incident_id: UUID) -> IncidentSuggestedResponse:
        result = await app_data.IncidentDetails.get_incident_suggestions(incident_id)
        
        if not result:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        if not result.get('main_category') or not result.get('main_description'):
            raise HTTPException(status_code=404, detail="Incident not resolved yet")

        return IncidentSuggestedResponse(
            main_category=result.get('main_category'),
            main_description=result.get('main_description'),
        )
    
    @staticmethod
    async def get_incident_details(incident_id: UUID) -> IncidentDetailsWebResponse:
        result = await app_data.IncidentDetails.get_incident_details(incident_id)

        if not result:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return IncidentDetailsWebResponse(
            incident_id=incident_id,
            organization_id=result.get('organization_id'),
            main_category=result.get('main_category'),
            severity=result.get('severity'),
            occurrences=result.get('num_occurrences'),
            status=result.get('status'),
            main_description=result.get('main_description'),
            centroid_latitude=result.get('centroid_latitude'),
            centroid_longitude=result.get('centroid_longitude'),
        )
    
    @staticmethod
    async def update_incident_status(incident_id: UUID, status: str):
        """
        Complex business logic to update the status of an incident
         - Fetch the incident details from App_data.incident_details
         - Update status in App_data.incident_details
         - Delete from h3_index if new status is resolved
         - Update status in App_data.incident_by_status
         - Update status in App_data.incident_by_status_and_category
         - In the category of the incident, subtract the number of occurrences from the previous status and add to the new status in App_data.category
         - Fetch all the occurrences of the incident in the App_data.incident_occurrences
         - For each occurrence_id, update the status in App_data.occurrence_details
         - For each occurrence_id in App_data.user_occurrences_by_status, update the status
        """

        #TODO: Check if the organization_id is valid for the operator
        
        incident = await app_data.IncidentDetails.get_incident_details(incident_id)
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")

        organization_id = incident.get('organization_id')   
        first_occurrence_time_id = incident.get('first_occurrence_time_id')
        first_photo_id = incident.get('first_photo_id')
        num_occurrences = incident.get('num_occurrences')
        severity = incident.get('severity')
        centroid_latitude = incident.get('centroid_latitude')
        centroid_longitude = incident.get('centroid_longitude')
        main_description = incident.get('main_description')
        main_category = incident.get('main_category')
        previous_status = incident.get('status')

        #TODO: Update the check to see if the status is valid and if the change is allowed
        if status == previous_status:
            raise HTTPException(status_code=400, detail="Incident is already in the requested status")
        
        if status not in AVAILABLE_STATUS:
            raise HTTPException(status_code=400, detail="Invalid status (e.g. pending, in_progress, resolved)")


        await app_data.IncidentDetails.update_incident_details_status(incident_id, status)

        if status == 'resolved':
            resolution = H3_INCIDENT_RESOLUTION
            incident_h3_index = h3.latlng_to_cell(centroid_latitude, centroid_longitude, resolution)
            await h3_index.IncidentsRegions.delete_incident_id(incident_h3_index, incident_id)

        await app_data.IncidentByStatus.delete_incident_by_status(organization_id, previous_status, first_occurrence_time_id)
        await app_data.IncidentByStatus.insert_incident_by_status(organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)

        await app_data.IncidentByStatusAndCategory.delete_incident_by_status_and_category(organization_id, previous_status, main_category, first_occurrence_time_id)
        await app_data.IncidentByStatusAndCategory.insert_incident_by_status_and_category(organization_id, first_occurrence_time_id, status, main_category, incident_id, first_photo_id, severity, centroid_latitude, centroid_longitude, num_occurrences)

        category_details = await app_data.Category.get_category_details(organization_id, main_category)
        prev_status_count = category_details.get(f"num_{previous_status}") - 1
        new_status_count = category_details.get(f"num_{status}") + 1
        await app_data.Category.update_categories_num(organization_id, main_category, previous_status, prev_status_count)
        await app_data.Category.update_categories_num(organization_id, main_category, status, new_status_count)

        occurrences = await app_data.IncidentOccurrences.get_incident_occurrences(incident_id)
        update_tasks = []
        for occurrence in occurrences:
            occurrence_id = occurrence.get("occurrence_id")
            user_id = occurrence.get("user_id")
            time_id = occurrence.get("occurrence_time_id")

            # Update occurrence_details record (partitioned by occurrence_id)
            update_details = app_data.OccurrenceDetails.update_occurrence_details(occurrence_id, status)

            # Update user_occurrence_by_status: first delete from old status partition then insert with new status.
            delete_user_occ = app_data.UserOccurrenceByStatus.delete_user_occurrence_by_status(user_id, previous_status, time_id)
            insert_user_occ = app_data.UserOccurrenceByStatus.insert_user_occurrence_by_status(user_id, time_id, status, occurrence_id, occurrence.get("photo_id"), occurrence.get("photo_latitude"), occurrence.get("photo_longitude"), main_category)

            update_tasks.extend([update_details, delete_user_occ, insert_user_occ])
        
        await asyncio.gather(*update_tasks) # Using asyncio.gather lets the updates run concurrently and return when all are done

        return 
    
    @staticmethod
    async def list_incidents_by_status_and_optionally_category(organization_id: UUID, reference_time_id: UUID, status: str, category: str, is_descendent: bool):
        
        # Pre-conditions
        if status not in AVAILABLE_STATUS:
            raise HTTPException(status_code=400, detail="Invalid status (e.g. pending, in_progress, resolved)")
                
        if category:
            result = await app_data.IncidentDetails.list_incidents_by_status_and_category(organization_id, reference_time_id, status, category, is_descendent)
        else:
            result = await app_data.IncidentDetails.list_incidents_by_status(organization_id, reference_time_id, status, is_descendent)
        return [ #incident_id, main_category, severity, status, date, num_occurrences, first_occurrence_time_id
             IncidentSummaryResponse(
                incident_id=incident.get('incident_id'),
                main_category=incident.get('main_category'),
                severity=incident.get('severity'),
                status=status,
                date=incident.get('date'),
                num_occurrences=incident.get('num_occurrences'),
                time_id=incident.get('first_occurrence_time_id')
            )
            for incident in result
        ]
        
    @staticmethod
    async def get_incidents_not_resolved(organization_id: UUID, category_list: List[str]) -> List[IncidentMapResponse]:
        status_list = ['pending', 'in_progress'] # not resolved
        result = await app_data.IncidentDetails.get_incidents_not_resolved(organization_id, status_list, category_list)
        return [
            IncidentMapResponse(
                incident_id=row.get('incident_id'),
                photo_id=row.get('first_photo_id'),
                centroid_latitude=row.get('centroid_latitude'),
                centroid_longitude=row.get('centroid_longitude'),
                main_category=row.get('main_category')
            )
            for row in result
        ]

    @staticmethod
    async def get_incident_occurrences_ids(incident_id: UUID) -> List[UUID]:
        result = await app_data.IncidentOccurrences.get_incident_occurrences_ids(incident_id)

        if not result:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return [
            OccurrenceIdResponse(
                occurrence_id=row.get('occurrence_id')
            )
            for row in result
        ]
        
    @staticmethod
    async def check_nearby_incidents(geo: IncidentGeoData) -> set[UUID]:
        """
        Check if there are any incidents in the given geo sight
        """
        p0 = (geo.latitude, geo.longitude)
        
        organization_id = await get_organization_id_from_cell(h3.latlng_to_cell(geo.latitude, geo.longitude, H3_INCIDENT_RESOLUTION))
        
        if not organization_id:
            raise HTTPException(status_code=404, detail="No organization found for the given coordinates")
        
        print("Organization ID: ", organization_id)
        
        p1 = destination_point_geodetic(p0, geo.lateral_sight, geo.heading-geo.degree_sight % 360)
        p2 = destination_point_geodetic(p0, geo.frontal_sight, geo.heading)
        p3 = destination_point_geodetic(p0, geo.lateral_sight, geo.heading+geo.degree_sight % 360)
                
        sight_shape = h3.LatLngPoly([p0,p1,p2,p3])
        sight_h3_cells = h3.h3shape_to_cells_experimental(sight_shape, H3_INCIDENT_RESOLUTION, contain="overlap")
        
        all_incidents, all_h3_index = await h3_index.IncidentsRegions.get_incident_ids(sight_h3_cells)
        
        h3_sight = str(sight_h3_cells)
        h3_incidents = str(list(all_h3_index))
        await redis_client.setex(f"check_nearby_stats:{organization_id}", REDIS_TTL_SEC_NEARBY_INCIDENTS, h3_sight)
        await redis_client.setex(f"check_nearby_incidents_stats:{organization_id}", REDIS_TTL_SEC_NEARBY_INCIDENTS, h3_incidents)

        return all_incidents
    
    @staticmethod
    async def get_check_nearby_stats(organization_id: UUID):
        sight = await redis_client.get(f"check_nearby_stats:{organization_id}")
        incidents = await redis_client.get(f"check_nearby_incidents_stats:{organization_id}")
        sight_list = (
            sight.replace("'", "").split("[")[1].split("]")[0].split(", ")
            if sight and sight != "[]"
            else []
        )
        incidents_list = (
            incidents.replace("'", "").split("[")[1].split("]")[0].split(", ")
            if incidents and incidents != "[]"
            else []
        )
        return {"sight": sight_list, "incidents": incidents_list}
    
    @staticmethod
    async def process_video(incident_id: UUID, video: UploadFile = File(...), edge_data_id: UUID = None):
        """
        Process the video
        """
        
        logger.info(f"Incident ID: {incident_id}")
        
        # Check arguments
        incident = await app_data.IncidentDetails.get_incident_details(incident_id)
        if not incident:
            raise HTTPException(status_code=404, detail="Incident not found")
                
        # Upload to MinIO
        video_id = uuid4()
        logger.info(f"Uploading video {video_id} to MinIO")
        logger.info(f"Video name: {video.filename}")
        logger.info(f"Video size: {video.size}")
        logger.info(f"Video content type: {video.content_type}")                    # Upload the video to MinIO
        
        await buckets.Videos.upload_file(
            file_name=str(video_id),
            file_buffer=video.file,
            file_size=video.size,
            content_type=video.content_type
        )    
        
        
        photo_id = incident.get('first_photo_id')
        description = incident.get('main_description')
        category = incident.get('main_category')
                        
        # Trigger the LLM consumer
        llm_producer.check_incident_resolved(
            incident_id=incident_id,
            video_id=video_id,
            photo_id=photo_id,
            description=description,
            category=category,
            edge_data_id=edge_data_id,
        )
        
    @staticmethod
    async def get_incident_videos(incident_id: UUID) -> List[IncidentVideoSuggestion]:
        """
        Get the videos of an incident
        """        
        result = await app_data.IncidentResolvedReason.get_incident_videos(incident_id)

        if not result:
            raise HTTPException(status_code=404, detail="Incident videos not found")
                            
        return [
            IncidentVideoSuggestion(
                video_id=video.get('video_id'),
                incident_id=incident_id,
                created_at=video.get('created_at'),
                edge_data_id=video.get('edge_data_id'),
            )
            for video in result
        ]

