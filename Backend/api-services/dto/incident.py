## External imports
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# ======================== INCIDENT DTO ========================

class IncidentDetailsWebResponse(BaseModel):
    incident_id: UUID
    organization_id: UUID
    main_category: str
    severity: str
    occurrences: int
    status: str
    main_description: str
    centroid_latitude: float 
    centroid_longitude: float

class IncidentStatusUpdateResponse(BaseModel):
    message: str

class IncidentSummaryResponse(BaseModel):
    incident_id: UUID
    main_category: str
    severity: str
    status: str
    date: datetime
    num_occurrences: int
    time_id: UUID
    
class IncidentMapResponse(BaseModel):
    incident_id: UUID
    photo_id: UUID
    centroid_latitude: float 
    centroid_longitude: float
    main_category: str

class IncidentSuggestedResponse(BaseModel):
    main_category: str
    main_description: str

class IncidentGeoData(BaseModel):
    latitude: float
    longitude: float
    heading: float
    frontal_sight: float
    lateral_sight: float
    degree_sight: float

class IncidentVideoSuggestion(BaseModel):
    video_id: UUID
    incident_id: UUID
    created_at: datetime
    edge_data_id: UUID
