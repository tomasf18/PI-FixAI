## External imports
import h3
import math
from typing import Optional
from geographiclib.geodesic import Geodesic

## Internal imports
from repository import h3_index

# ======================== H3_INDEX UTILS ========================

async def get_organization_id_from_cell(h3_index_val: str, max_resolution: int = 13, min_resolution: int = 6) -> Optional[int]:
    """
    Determine the organization_id based on the provided latitude and longitude by traversing
    from the highest resolution H3 cell to its parent cells until a match is found in the database.

    Parameters:
    - lat (float): Latitude of the point.
    - lng (float): Longitude of the point.
    - max_resolution (int): Starting H3 resolution (default is 13).
    - min_resolution (int): Minimum H3 resolution to check (default is 6).

    Returns:
    - Optional[int]: The organization_id if found; otherwise, None.
    """
    # Traverse from the highest resolution to the lowest specified resolution
    for _ in range(max_resolution, min_resolution - 1, -1):
        # Check if the current H3 index exists in the organization's database

        organization_id = await h3_index.OrganizationRegions.get_organization_id(h3_index_val)
        
        if organization_id:
            return organization_id
        
        # Move to the parent H3 cell at the next coarser resolution
        h3_index_val = h3.cell_to_parent(h3_index_val)

    # Return None if no matching organization_id is found
    return None

def destination_point_geodetic(point, distance, heading_deg):
    """
    VERY high-accuracy direct geodesic on the WGS-84 ellipsoid.
    Returns (lat2, lon2) in degrees.
    """
    lat, lon = point
    g = Geodesic.WGS84.Direct(lat, lon, heading_deg, distance)
    return g["lat2"], g["lon2"]

if __name__ == "__main__":
    
    point = (40.505817, -8.486405)
    distance = 12.5
    heading = 30
    
    destination_point_geodetic(point, distance, heading)
