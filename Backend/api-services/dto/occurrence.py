## External imports
from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime

# ======================== OCCURRENCE DTO ========================

class OccurrenceDetailsResponse(BaseModel):
    occurrence_id: UUID
    photo_id: UUID
    category: str
    date: datetime
    status: str
    photo_latitude: float
    photo_longitude: float
    description: str

class OccurrencePhotoDetailsResponse(BaseModel):
    category: str
    photo_latitude: float
    photo_longitude: float
    description: str

class OccurrenceResponse(BaseModel):
    occurrence_id: UUID
    category: str
    status: str
    photo_id: UUID
    date: datetime
    time_id: UUID
    
class OccurrenceMapResponse(BaseModel):
    occurrence_id: UUID
    category: str
    photo_id: UUID
    photo_latitude: float
    photo_longitude: float
    
class OccurrencePreSubmissionResponse(BaseModel):
    incident_id: UUID
    max_time_to_submit: int
    allowed_categories: List[str]
    photo_id: UUID

class OccurrenceSubmissionRequest(BaseModel):
    incident_id: UUID
    photo_id: UUID
    category: str
    date: datetime
    photo_latitude: float
    photo_longitude: float
    # marker_latitude: float
    # marker_longitude: float
    description: str
    severity: str

class OccurrenceIdResponse(BaseModel):
    occurrence_id: UUID