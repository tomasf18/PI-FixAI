## External imports
import os
from fastapi import APIRouter, Query, status, Depends
from uuid import UUID
from typing import List

## Internal imports
from services.user import UserService
from dto.auth import UserAuth, CurrentUser
from services.auth import get_current_active_user
from dto.occurrence import OccurrenceMapResponse, OccurrenceResponse
from dto.user import UserStatsResponse, UserStatsResponse
from config import ENDPOINTS_PREFIX

users_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/users",
    tags=["Users"]
)

# ======================== USERS ROUTES ========================

@users_router.get("/stats", response_model=UserStatsResponse)
async def get_user_stats(current_user_data: CurrentUser = Depends(get_current_active_user)):
    user_profile: UserAuth = current_user_data.current_user
    return await UserService.get_user_stats(user_profile.user_id)

@users_router.get("/occurrences-by-time", response_model=List[OccurrenceResponse])
async def get_user_occurrences(current_user_data: CurrentUser = Depends(get_current_active_user), status: str = Query(...), max_time_ud: UUID = Query(...)):
    user_profile: UserAuth = current_user_data.current_user
    return await UserService.get_user_occurrences_by_time(user_profile.user_id, status, max_time_ud)    

@users_router.get("/occurrences-not-resolved", response_model=List[OccurrenceMapResponse])
async def get_user_occurrences_not_resolved(current_user_data: CurrentUser = Depends(get_current_active_user)):
    user_profile: UserAuth = current_user_data.current_user
    return await UserService.get_user_occurrences_not_resolved(user_profile.user_id)

@users_router.patch("/email-notifications", status_code=status.HTTP_200_OK)
async def update_email_notifications(email_notifications: bool, current_user_data: CurrentUser = Depends(get_current_active_user)):
    user_profile: UserAuth = current_user_data.current_user
    return await UserService.update_email_notifications(user_profile.user_id, email_notifications)

@users_router.get("/email-notifications", response_model=bool)
async def get_email_notifications(current_user_data: CurrentUser = Depends(get_current_active_user)):
    user_profile: UserAuth = current_user_data.current_user
    return await UserService.get_email_notifications(user_profile.user_id)