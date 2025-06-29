## External imports
from fastapi import APIRouter, Depends
from uuid import UUID

from fastapi.responses import StreamingResponse

## Internal imports
from services.auth import get_current_active_user
from services.videos import VideosService
from config import ENDPOINTS_PREFIX, VIDEOS_BUCKET_NAME

videos_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/videos",
    tags=["Videos"]
)

# ======================== INCIDENT ROUTES ========================

@videos_router.get("/{video_id}", 
    responses={
        200: {
            "content": {"video/mp4": {}},
            "description": "Streaming do vídeo em formato MP4"
        }
    },
    response_model=bytes)
async def get_video(video_id: UUID):#, current_user_data = Depends(get_current_active_user)):
    # TODO: add permission check
    return await VideosService.download_video(video_id)
