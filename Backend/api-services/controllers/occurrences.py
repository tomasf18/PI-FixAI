## External imports
import os
from typing import Tuple
from fastapi import Depends, HTTPException
from fastapi import APIRouter, UploadFile, File, status
from uuid import UUID

# Internal imports
from services.occurrence import OccurrenceService
from dto.auth import Auth, CurrentUser
from services.auth import get_current_active_user
from dto.occurrence import OccurrenceDetailsResponse, OccurrencePreSubmissionResponse, OccurrenceSubmissionRequest
from config import ENDPOINTS_PREFIX

occurrences_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/occurrences",
    tags=["Occurrences"]
)

# ======================== OCCURRENCES ROUTES ========================

@occurrences_router.get("/{occurrence_id}", response_model=OccurrenceDetailsResponse)
async def get_occurrence_details(occurrence_id: UUID, current_user_data: CurrentUser = Depends(get_current_active_user)):
    if not await OccurrenceService.can_get_occurrence(occurrence_id, current_user_data.token):
        raise HTTPException(status_code=403, detail="You are not allowed to access this occurrence")
    return await OccurrenceService.get_occurrence_details(occurrence_id)

@occurrences_router.post("/pre-submission", response_model=OccurrencePreSubmissionResponse)
async def pre_submit_occurrence(latitude: float, longitude: float, photo: UploadFile = File(...), current_user_data: CurrentUser = Depends(get_current_active_user)):
    return await OccurrenceService.pre_submit_occurrence(latitude, longitude, photo)

@occurrences_router.post("", status_code=status.HTTP_201_CREATED)
async def submit_occurrence(request_body: OccurrenceSubmissionRequest, current_user_data: CurrentUser = Depends(get_current_active_user)):    
    user_profile = current_user_data.current_user
    return await OccurrenceService.submit_occurrence(request_body, user_profile.user_id)
