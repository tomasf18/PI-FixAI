## External imports
from fastapi import APIRouter, Depends
from uuid import UUID

## Internal imports
from services.auth import get_current_active_user
from services.photos import PhotosService
from config import ENDPOINTS_PREFIX, PHOTOS_BUCKET_NAME

photos_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/photos",
    tags=["Photos"]
)

# ======================== INCIDENT ROUTES ========================

@photos_router.get("/{photo_id}", response_model=bytes)
async def get_photo(photo_id: UUID, current_user_data = Depends(get_current_active_user)):
    # TODO: add permission check
    return await PhotosService.download_photo(photo_id)

