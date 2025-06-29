## External imports
from pydantic import BaseModel
from uuid import UUID

# ======================== User DTO ========================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    
class UserStatsResponse(BaseModel):
    name: str
    pendingOccurrences: int
    inProgressOccurrences: int
    resolvedOccurrences: int