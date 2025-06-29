## External imports
import io
from typing import Optional
from abc import ABC

## Internal imports
from database import minio_client
from config import PHOTOS_BUCKET_NAME, VIDEOS_BUCKET_NAME
from abc import abstractmethod

# ======================== PHOTOS BUCKET ========================
# a class for each table in the `photos` bucket

class Photos:
    
    @staticmethod
    async def upload_file(file_name: str, file_buffer: io.BytesIO, file_size: int, content_type: str):
        """
        Upload a file to the phtos bucket.
        """
        await minio_client.upload_file(
            bucket_name=PHOTOS_BUCKET_NAME,
            file_name=file_name,
            file_buffer=file_buffer,
            file_size=file_size,
            content_type=content_type
        )
        
    @staticmethod
    async def download_file(file_name: str) -> Optional[io.BytesIO]:
        """
        Download a file from the photos bucket.
        """
        return await minio_client.download_file(
            bucket_name=PHOTOS_BUCKET_NAME,
            file_name=file_name
        )
        
# ======================== VIDEOS BUCKET ========================
# a class for each table in the `videos` bucket

class Videos:

    @staticmethod
    async def upload_file(file_name: str, file_buffer: io.BytesIO, file_size: int, content_type: str):
        """
        Upload a file to the videos bucket.
        """
        await minio_client.upload_file(
            bucket_name=VIDEOS_BUCKET_NAME,
            file_name=file_name,
            file_buffer=file_buffer,
            file_size=file_size,
            content_type=content_type
        )

    @staticmethod
    async def download_file(file_name: str) -> Optional[io.BytesIO]:
        """
        Download a file from the videos bucket.
        """
        return await minio_client.download_file(
            bucket_name=VIDEOS_BUCKET_NAME,
            file_name=file_name
        )