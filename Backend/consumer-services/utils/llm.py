## External imports
import json
from typing import Dict, Optional
from PIL import ImageFile
from google.genai.types import Part

## Internal imports
from utils.llm_client import llm_client
from utils.logger import logger

def check_incident_resolved_from_video(
    photo: ImageFile,
    video: Part,
    description: str,
    category: str,
) -> Optional[Dict[str, str]]:
    """
    Checks if an incident is resolved based on the provided video and photo using the LLM client.
    Args:
        photo (ImageFile): The photo file to analyze.
        video (Video): The video file to analyze.
        description (str): The description of the incident.
        category (str): The category of the incident.
    Returns:
        Dict[str, Any]: A dictionary containing the resolution status and usage metadata.
    """
    try:
        response = llm_client.check_incident_resolved_from_video(
            photo=photo,
            video=video,
            description=description,
            category=category
        )
    except Exception as e:
        logger.info(f"Error: {e}")
        raise
    
    logger.info(f"LLM response: {response.text}")
    response_json = None
    try:
        response_json = json.loads(response.text.split("```json")[1].split("```")[0])
    except Exception:
        logger.info("No ```json found in LLM response...")

    if response_json is None:
        try:
            response_json = json.loads("{"+response.text.split("{")[1].split("}")[0] + "}")
        except Exception as e:
            logger.info(f"Error parsing LLM response: {e}")
            raise
    
    logger.info(f"\n\nLLM response: {response_json}\n\n")
    
    return {
        "resolved": response_json["resolved"],
        "usage_metadata": response.usage_metadata
    }

def generate_description_and_category_and_severity_from_photo(
    image: ImageFile,
    categories: list[str],
    language: str
) -> Optional[Dict[str, str]]:
    """
    Generates a description, category, and severity from a photo using the LLM client.
    Args:
        image (ImageFile): The image file to analyze.
        categories (list[str]): The list of categories to consider.
        language (str): The language for the response.
    Returns:
        Dict[str, Any]: A dictionary containing the description, category, and severity.
    """
    try:
        response = llm_client.generate_description_and_category_and_severity_from_photo(
            image=image,
            categories=categories,
            language=language
        )
    except Exception as e:
        logger.info(f"Error: {e}")
        raise
    
    logger.info(f"LLM response: {response.text}")
    response_json = json.loads(response.text.split("```json")[1].split("```")[0])
    
    logger.info(f"\n\nLLM response: {response_json}\n\n")

    # Check if the response is valid, i.e., a dictionary with 3 keys "description", "category", and "severity"
    if not isinstance(response_json, dict) or len(response_json) != 3 or not all(key in response_json for key in ["description", "category", "severity"]):
        logger.info("No valid response from LLM.")
        logger.info("Returning None for description, category, and severity.")
        return {
            "description": None,
            "category": None,
            "severity": None,
            "usage_metadata": response.usage_metadata
        }
    
    # Handle the case where LLM didn't found a category for the image or LLM failed
    if any(response_json.get(field) == "false" for field in ["description", "category", "severity"]):
        return {
            "description": None,
            "category": None,
            "severity": None,
            "usage_metadata": response.usage_metadata
        }

    return {
        "description": response_json["description"],
        "category": response_json["category"],
        "severity": response_json["severity"],
        "usage_metadata": response.usage_metadata
    }

def merge_descriptions_into_an_updated_main_description(
    image: ImageFile,
    occurrence_description: str,
    previous_main_description: Optional[str], 
    previous_severity: Optional[str],
    language: str
) -> Optional[Dict[str, str]]:
    """
    Combines the image, occurrence description, the previous main description and previous_severity 
    to generate an updated main description and updated severity.
    For that, it uses the LLM Client.

    Args:
        image (ImageFile): The image file to analyze.
        occurrence_description (str): The new description to be merged.
        previous_main_description (Optional[str]): The existing main description.
        previous_severity (Optional[str]): The existing severity. 
        language (str): The language for the response.
    Returns:
        Optional[Dict[str, str]]: A dictionary containing the updated main description and updated severity.
    """

    try:
        response = llm_client.merge_descriptions_into_an_updated_main_description(
            image=image,
            occurrence_description=occurrence_description,
            previous_main_description=previous_main_description,
            previous_severity=previous_severity,
            language=language
        )
    except Exception as e:
        logger.info(f"Error: {e}")
        raise
    
    # Extract the JSON response from the text
    print(f"LLM response: {response.text}")
    response_json = json.loads(response.text.split("```json")[1].split("```")[0])
    
    logger.info(f"\n\nLLM response: {response_json}\n\n")
    
    if len(response_json) == 2:
        # Update main_description and severity
        data = {
            "description": response_json["description"],
            "severity": response_json["severity"]
        }
    else:
        logger.info("No valid response from LLM.")
        return None
    
    return data

def get_most_similar_near_incident(incident_description: str, neighbours: dict) -> dict:
    """
    Get the most similar near incident description from the list of neighbours.
    
    Args:
        incident_description (str): The description of the incident.
        neighbours (dict): A dictionary containing the neighbours incident_ids and descriptions.
    
    Returns:
        dict: The most similar near incident.
    """
    
    try:
        response = llm_client.get_most_similar_near_incident(incident_description, neighbours)
    except Exception as e:
        logger.info(f"Error: {e}")
        raise
    
    
    response_json = json.loads(response.text.split("```json")[1].split("```")[0])
    
    return {
        "similar_incident_id": response_json["similar_incident_id"],
        "similarity_percentage": response_json["similarity_percentage"]
    }
    