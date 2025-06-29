## External imports
from typing import List
from fastapi import APIRouter, Depends
from uuid import UUID

## Internal imports
from dto.category import OrganizationCategoriesResponse
from services.organization import OrganizationService
from dto.auth import CurrentUser, OperatorAuth
from services.auth import get_current_active_user
from config import ENDPOINTS_PREFIX

organizations_router = APIRouter(
    prefix=f"{ENDPOINTS_PREFIX}/organizations",
    tags=["Organizations"]
)

# ======================== ORGANIZATION ROUTES ========================

@organizations_router.get("/categories", response_model=List[OrganizationCategoriesResponse])
async def get_organization_categories(current_user_data: CurrentUser = Depends(get_current_active_user)):
    operator_profile: OperatorAuth = current_user_data.current_user
    organization_id = operator_profile.organization_id
    return await OrganizationService.get_organization_categories(organization_id)
