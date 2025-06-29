## External imports
import json
import os
from typing import List, Optional
from fastapi import APIRouter, File, Form, Query, Depends, Body, HTTPException, UploadFile, status
from typing import Optional
from uuid import UUID

## Internal imports
from dto.auth import Auth, OperatorAuth, CurrentUser
from dto.occurrence import OccurrenceIdResponse
from services.incident import IncidentService
from services.auth import get_current_active_user
from dto.incident import IncidentSuggestedResponse, IncidentDetailsWebResponse, IncidentGeoData, IncidentVideoSuggestion
from config import ENDPOINTS_PREFIX

incidents_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/incidents",
    tags=["Incidents"]
)

# ======================== INCIDENT ROUTES ========================

@incidents_router.get("/map") # NOTE: do not move this route to the end of the file, it will not work!
async def get_incidents_map(category_list: List[str] = Query(), current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    organization_id = operator_profile.organization_id
    return await IncidentService.get_incidents_not_resolved(organization_id, category_list)

@incidents_router.patch("/{incident_id}/status", status_code=status.HTTP_200_OK) # patch is a partial update, in this case we are just updating the status
async def update_incident_status(incident_id: UUID, status: str = Body(...), current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    incident_data = await IncidentService.get_incident_details(incident_id)
    if incident_data.organization_id != operator_profile.organization_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this incident")
    return await IncidentService.update_incident_status(incident_id, status)

@incidents_router.get("/list-by-time") # /incidents/list?is_descendent={}&status={}&category={}&reference_time_id={}
async def list_incidents_by_status_and_optionally_category(is_descendent: bool, status: str, reference_time_id: UUID, category: str = None, current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    organization_id = operator_profile.organization_id
    # TODO: make RBAC!
    return await IncidentService.list_incidents_by_status_and_optionally_category(organization_id, reference_time_id, status, category, is_descendent)

@incidents_router.get("/{incident_id}/occurrences", response_model=List[OccurrenceIdResponse])
async def get_incident_occurrences_ids(incident_id: UUID, current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    incident_data = await IncidentService.get_incident_details(incident_id)
    if incident_data.organization_id != operator_profile.organization_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this incident")
    return await IncidentService.get_incident_occurrences_ids(incident_id)

@incidents_router.get("/{incident_id}/suggestions", response_model=IncidentSuggestedResponse)
async def get_incident_suggestions(incident_id: UUID, current_user_data: CurrentUser = Depends(get_current_active_user)):
    return await IncidentService.get_incident_suggestions(incident_id)

@incidents_router.get("/check-nearby", response_model=set[UUID])
async def check_nearby_incidents(latitude: float, longitude: float, heading:float, frontal_sight:float, lateral_sight:float, degree_sight:float):
    return await IncidentService.check_nearby_incidents(IncidentGeoData(latitude=latitude, longitude=longitude, heading=heading, frontal_sight=frontal_sight, lateral_sight=lateral_sight, degree_sight=degree_sight))

@incidents_router.post("/process-video", status_code=status.HTTP_200_OK)
async def scan_video_nearby(incident_id: UUID = Form(), edge_data_id: UUID = Form(), video: UploadFile = File(...)):
    return await IncidentService.process_video(incident_id, video, edge_data_id)

@incidents_router.get("/check-nearby/stats")
async def get_check_nearby_stats(organization_id: UUID):
    return await IncidentService.get_check_nearby_stats(organization_id)

@incidents_router.get("/{incident_id}", response_model=IncidentDetailsWebResponse)
async def get_incident_details(incident_id: UUID, current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    incident_data = await IncidentService.get_incident_details(incident_id)
    if incident_data.organization_id != operator_profile.organization_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this incident")
    return incident_data

@incidents_router.get("/{incident_id}/videos", response_model=List[IncidentVideoSuggestion])
async def get_incident_videos(incident_id: UUID, current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    incident_data = await IncidentService.get_incident_details(incident_id)
    if not incident_data:
        raise HTTPException(status_code=404, detail="Incident not found")
    if incident_data.organization_id != operator_profile.organization_id:
        raise HTTPException(status_code=403, detail="You are not allowed to access this incident")
    return await IncidentService.get_incident_videos(incident_id)