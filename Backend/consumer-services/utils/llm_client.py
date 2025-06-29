## External imports
from PIL import ImageFile
from google import genai
from google.genai import types
from google.genai.types import Part

## Internal imports
from config import GEMINI_API_KEY, DESCRIPTION_CATEGORY_SEVERITY_SYS_INSTRUCTION, INCIDENT_DESCRIPTION_SIMILARITY_INSTRUCTION, MERGE_DESCRIPTION_CATEGORY_SEVERITY_SYS_INSTRUCTION, CHECK_INCIDENT_RESOLVED_FROM_VIDEO_SYS_INSTRUCTION
from utils.logger import logger
from typing import Optional

# ======================== LLM CLIENT ========================

class LLMClient:
    """
    A client for interacting with the Gemini API.
    """

    def __init__(self):
        """
        Initializes the GeminiClient with the provided API key and model.

        Args:
            api_key (str): The API key for authenticating with the Gemini API.
            model (str): The model to be used for generating content.
        """
        self.multi_model_model = "gemini-2.0-flash"
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        
    def check_incident_resolved_from_video(self, photo: ImageFile, video: Part, description: str, category: str) -> types.GenerateContentResponse: # change video type later
        """
        Checks if an incident is resolved based on the provided video and photo using the LLM client.
        Args:
            photo (ImageFile): The photo file to analyze.
            video (Part): The video file to analyze.
            description (str): The description of the incident.
            category (str): The category of the incident.
        Returns:
            Dict[str, Any]: A dictionary containing the resolution status and usage metadata.
        """
        try:
            sys_instruction = CHECK_INCIDENT_RESOLVED_FROM_VIDEO_SYS_INSTRUCTION 
            
            response = self.client.models.generate_content(
                model=self.multi_model_model,
                contents=[
                    photo,
                    video,
                    description,
                    category
                ],
                config=types.GenerateContentConfig(
                    system_instruction=sys_instruction,
                )
            )
        except Exception as e:
            logger.info(f"Error: {e}")
            raise
        
        return response
        
    def generate_description_and_category_and_severity_from_photo(self, image: ImageFile, categories: list[str], language: str) -> types.GenerateContentResponse:
        try:
            sys_instruction = DESCRIPTION_CATEGORY_SEVERITY_SYS_INSTRUCTION % (language, "/".join(categories))
            
            response = self.client.models.generate_content(
                model=self.multi_model_model,
                contents=[
                    image,
                ],
                config=types.GenerateContentConfig(
                    system_instruction=sys_instruction,
                )
            )
        except Exception as e:
            logger.info(f"Error: {e}")
            raise
        
        return response
    
    def get_most_similar_near_incident(self, incident_description: str, neighbours: list) -> dict:
        neighbours_pairs = []
        
        for neighbour in neighbours:
            neighbours_pairs.append(f"* '{neighbour['incident_id']}' - '{neighbour['description']}'\n")
        
        neighbours_pairs_str = "".join(neighbours_pairs)
        
        try:
            logger.info(f"NEIGHBOURS STRING: {neighbours_pairs_str}")
            logger.info(f"INCIDENT DESCRIPTION: {incident_description}")
            logger.info(f"INSTRUCTION: {INCIDENT_DESCRIPTION_SIMILARITY_INSTRUCTION}")
            sys_instruction = INCIDENT_DESCRIPTION_SIMILARITY_INSTRUCTION % (incident_description, neighbours_pairs_str)
            
            response = self.client.models.generate_content(
                model=self.multi_model_model,
                contents=sys_instruction,
            )
        except Exception as e:
            logger.info(f"Error: {e}")
            raise
        
        return response

    def merge_descriptions_into_an_updated_main_description(
            self, 
            image: ImageFile, 
            occurrence_description: str,
            previous_main_description: Optional[str], 
            previous_severity: Optional[str],
            language: str
    ):
        """
        Combines the image, occurrence description, the previous main description and previous_severity
        to generate an updated main description and updated severity.
        """
        try:
            if previous_main_description is not None and previous_severity is not None:
                # Update main_description and severity based on the inputs
                logger.info(f"Occurrence description: {occurrence_description}")
                logger.info(f"Previous main description: {previous_main_description}")
                logger.info(f"Previous severity: {previous_severity}")
                sys_instruction = MERGE_DESCRIPTION_CATEGORY_SEVERITY_SYS_INSTRUCTION % (language)
                
                response = self.client.models.generate_content(
                model=self.multi_model_model,
                    contents=[
                        image,
                        occurrence_description,
                        previous_main_description,
                        previous_severity
                    ],
                    config=types.GenerateContentConfig(
                        system_instruction=sys_instruction,
                    )
                )
                
                logger.info("Created main description and severity based on all inputs")
                return response
            
            else:
                raise ValueError("Invalid combination of previous_main_description and previous_severity.")
        
        except Exception as e:
            logger.info(f"Error: {e}")
            raise

llm_client = LLMClient()
