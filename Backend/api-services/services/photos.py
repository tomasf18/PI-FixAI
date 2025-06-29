## External imports
from typing import List
from uuid import UUID
from fastapi.responses import StreamingResponse
from fastapi import HTTPException

## Internal imports
from repository import buckets

# ======================== PHOTOS SERVICE ========================

class PhotosService:

    @staticmethod
    async def download_photo(photo_id: UUID) -> StreamingResponse:
        photo_name = str(photo_id)
        
        try:
            result = await buckets.Photos.download_file(photo_name)
            mime_type = result.headers.get('content-type')
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Photo not found")
    
        return StreamingResponse(
            result.stream(), # MinIO's stream method
            media_type=mime_type,
            headers={"Content-Disposition": f"inline; filename={photo_name}"})
