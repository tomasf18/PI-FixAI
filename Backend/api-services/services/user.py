## External imports
from uuid import UUID
from fastapi import HTTPException

## Internal imports
from dto.occurrence import OccurrenceMapResponse, OccurrenceResponse
from dto.user import UserStatsResponse
from dto.occurrence import OccurrenceResponse
from dto.user import UserStatsResponse
from repository import app_data
from utils.logger import logger

# ======================== USER SERVICE ========================

class UserService:

    @staticmethod
    async def get_user_stats(user_id: UUID):
        # get name
        user_name = await app_data.UserProfile.get_user_name(user_id)
        
        # get occurrences numbers
        pending = await app_data.UserOccurrenceByStatus.get_user_number_occurrences_by_status(user_id, "pending")
        in_progress = await app_data.UserOccurrenceByStatus.get_user_number_occurrences_by_status(user_id, "in_progress")
        resolved = await app_data.UserOccurrenceByStatus.get_user_number_occurrences_by_status(user_id, "resolved")
        
        # return the dto
        return UserStatsResponse(
            name=user_name,
            pendingOccurrences=pending,
            inProgressOccurrences=in_progress,
            resolvedOccurrences=resolved
        )
        
    @staticmethod
    async def get_user_occurrences_by_time(user_id: UUID, status: str, max_time_id: UUID):
        
        if status not in ["pending", "in_progress", "resolved"]:
            raise HTTPException(status_code=400, detail="Invalid status (pending, in_progress, resolved)")
            
        result = await app_data.UserOccurrenceByStatus.get_user_occurrences_by_status_by_time(user_id, status, max_time_id)
        
        user_occurrences_by_time = []

        for row in result:
            fetched_category=await app_data.OccurrenceDetails.get_occurrence_category(row.get("occurrence_id"))
            
            user_occurrences_by_time.append(OccurrenceResponse(
                occurrence_id=row.get("occurrence_id"),
                category=fetched_category,
                status=row.get("status"),
                date=row.get("date"),
                time_id=row.get("time_id"),
                photo_id=row.get("photo_id"),
            )
            )
        
        return user_occurrences_by_time
        
    @staticmethod
    async def get_user_occurrences_not_resolved(user_id: UUID):
        status_list = ["pending", "in_progress"]
        result = await app_data.UserOccurrenceByStatus.get_user_occurrences_by_status(user_id, status_list)

        return [
            OccurrenceMapResponse(
                occurrence_id=row.get("occurrence_id"),
                category=row.get("category"),
                photo_id=row.get("photo_id"),
                photo_latitude=row.get("photo_latitude"),
                photo_longitude=row.get("photo_longitude")
            )
            for row in result
        ]
        
    @staticmethod
    async def update_email_notifications(user_id: UUID, email_notifications: bool):
        await app_data.UserProfile.update_email_notifications(user_id, email_notifications)
        return {"message": "Email notifications updated successfully"}
    
    @staticmethod
    async def get_email_notifications(user_id: UUID):
        return await app_data.UserProfile.get_email_notifications(user_id)
    