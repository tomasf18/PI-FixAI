## External imports
from typing import List
from uuid import UUID
from pydantic import BaseModel


# ======================== AI DTO ========================

class AIDescriptionCategorySeverityRequest(BaseModel):
    photo_id: UUID
    incident_id: UUID
    allowed_categories: List[str]
    language: str
    ttl: int

class AIMergeDescriptionsRequest(BaseModel):
    photo_id: UUID
    incident_id: UUID
    occurrence_description: str
    previous_main_description: str
    previous_severity: str
    language: str