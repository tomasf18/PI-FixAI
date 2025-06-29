## External imports
from pydantic import BaseModel
from typing import List
from uuid import UUID
from datetime import datetime

# ======================== ORGANIZATION DTO ========================

class OrganizationCategoriesResponse(BaseModel):
    category: str
    description: str
    num_pending: int
    num_in_progress: int
    num_resolved: int