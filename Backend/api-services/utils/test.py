import h3
import math
from geographiclib.geodesic import Geodesic

def destination_point(point, distance, heading, radius=6371000):
    """
    Compute destination point given start lat/lon (degrees), distance (meters),
    heading (degrees clockwise from north), and Earth radius (meters).
    Returns (lat2, lon2) in degrees.
    """
    
    lat = point[0]
    long = point[1]
    
    # Convert to radians
    lat_rad = math.radians(lat)
    long_rad = math.radians(long)
    heading_rad  = math.radians(heading)
    angular_dist  = distance / radius

    # Destination latitude
    new_lat_rad = math.asin(
        math.sin(lat_rad)*math.cos(angular_dist) +
        math.cos(lat_rad)*math.sin(angular_dist)*math.cos(heading_rad)
    )

    # Destination longitude
    new_long_rad = long_rad + math.atan2(
        math.sin(heading_rad)*math.sin(angular_dist)*math.cos(lat_rad),
        math.cos(angular_dist) - math.sin(lat_rad)*math.sin(new_lat_rad)
    )

    # Back to degrees
    new_lat = math.degrees(new_lat_rad)
    new_long = math.degrees(new_long_rad)

    # Normalize long to -180 ... +180
    new_long = (new_long + 540) % 360 - 180

    return new_lat, new_long

def destination_point_geodetic(point, distance, heading_deg):
    """
    VERY high-accuracy direct geodesic on the WGS-84 ellipsoid.
    Returns (lat2, lon2) in degrees.
    """
    lat, lon = point
    g = Geodesic.WGS84.Direct(lat, lon, heading_deg, distance)
    return g["lat2"], g["lon2"]


if __name__ == "__main__":

    p0 = (40.50580738988812, -8.486353268806774)
    lateral_sight = 7
    frontal_sight = 100 # 18.5
    heading = 0
    degree_sight = 50
    
    p1 = destination_point_geodetic(p0, lateral_sight, heading-degree_sight)
    p2 = destination_point_geodetic(p0, frontal_sight, heading)
    p3 = destination_point_geodetic(p0, lateral_sight, heading+degree_sight)
    
    print("P1:",p1)
    print("P2:",p2)
    print("P3",p3)
    
    
    # h3
    p0_h3 = h3.latlng_to_cell(p0[0], p0[1], 13)
    
    h3_shape = h3.LatLngPoly([p0,p1,p2,p3])

    # Convert to H3 Cells
    print("Converting to H3 Cells...")
    aveiro_cells = h3.h3shape_to_cells_experimental(h3_shape, 13, contain="overlap")

    print("h3_index","value",sep=", ")
    print(p0_h3, 1, sep=", ")
    for cell in aveiro_cells:
        print(cell, 1, sep=", ")
