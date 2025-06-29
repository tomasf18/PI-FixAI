import h3
import numpy as np
from utils.logger import logger


PRECISION = 13


university_coords = list(map(tuple, np.loadtxt("university-coords.csv", delimiter=',', dtype=float)))
university_h3shape = h3.LatLngPoly(university_coords)

# Convert to Polygon

aveiro_coords = list(map(tuple, np.loadtxt("aveiro-coords.csv", delimiter=',', dtype=float)))
aveiro_h3shape = h3.LatLngPoly(aveiro_coords, university_coords)

# Convert to H3 Cells

university_cells = h3.polygon_to_cells(university_h3shape, PRECISION)
aveiro_cells = h3.polygon_to_cells(aveiro_h3shape, PRECISION)


# Compact cells
logger.info("h3_index, value, height")

university_compacted = h3.compact_cells(university_cells)
for cell in university_compacted:
    logger.info(f"{cell}, 2, 0")


aveiro_compacted = h3.compact_cells(aveiro_cells)
for cell in aveiro_compacted:
    logger.info(f"{cell}, 1, 0")
    
