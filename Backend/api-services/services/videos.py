## External imports
from typing import List
from uuid import UUID
from fastapi.responses import StreamingResponse
from fastapi import HTTPException
import io
import threading
import tempfile
import os
from moviepy import VideoFileClip

## Internal imports
from repository import buckets

# ======================== VIDEOS SERVICE ========================

class VideosService:

    @staticmethod
    async def download_video(video_id: UUID) -> StreamingResponse:
        video_name = str(video_id)
        
        try:
            # Download the video from MinIO
            result = await buckets.Videos.download_file(video_name)
            mime_type = result.headers.get('content-type')
        except Exception as e:
            raise HTTPException(status_code=404, detail=f"Video not found")
        
        print("Processing video")
        print("MIME type:", mime_type)
        print("Video name:", video_name)
        
        if mime_type == "video/mp4":
            print("Video is already in MP4 format")
            return StreamingResponse(
                io.BytesIO(result.read()),
                media_type="video/mp4",
                headers={"Content-Disposition": f"attachment; filename={video_name}.mp4"}
            )

        # Create temporary files for input and output
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mov") as tmp_in, \
             tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_out:
            try:
                # Write the downloaded video to the input temporary file
                tmp_in.write(result.read())
                tmp_in_path = tmp_in.name
                tmp_out_path = tmp_out.name

                # Process the video using VideoFileClip
                video_clip = VideoFileClip(tmp_in_path)
                video_clip.write_videofile(
                    tmp_out_path,
                    codec='libx264',
                    audio_codec='aac',
                    ffmpeg_params=['-preset', 'ultrafast', '-crf', '35', '-threads', '4']
                )

                # Stream the processed video back to the client
                def gen():
                    with open(tmp_out_path, "rb") as f:
                        while chunk := f.read(32 * 1024):
                            yield chunk

                print("Starting streaming response")
                return StreamingResponse(
                    gen(),
                    media_type="video/mp4",
                    headers={"Content-Disposition": f"attachment; filename={video_name}.mp4"}
                )
            finally:
                # Clean up temporary files
                tmp_in.close()
                tmp_out.close()
                    
