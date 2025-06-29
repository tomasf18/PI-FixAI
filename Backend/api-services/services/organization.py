## External imports
from typing import List
from uuid import UUID

## Internal imports
from dto.category import OrganizationCategoriesResponse
from repository import app_data

# ======================== ORGANIZATION SERVICE ========================

class OrganizationService:

    @staticmethod
    async def get_organization_categories(organization_id: UUID) -> List[OrganizationCategoriesResponse]:
        result = await app_data.Category.get_organization_categories(organization_id)
        return [
            OrganizationCategoriesResponse(
                category=category.get('category'),
                description=category.get('description'),
                num_pending=category.get('num_pending'),
                num_in_progress=category.get('num_in_progress'),
                num_resolved=category.get('num_resolved')
            ) for category in result
        ]