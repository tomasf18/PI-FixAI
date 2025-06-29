import json
import cv2 as cv
from PIL import ImageFile, Image
from google import genai
from google.genai import types
from typing import Optional
from utils.logger import logger

# GEMINI_API_KEY = add-key-here

# System instruction for the LLM
SYS_INSTRUCTION = """
You are reporting issues.
Analyze the image and return a JSON object with keys "description", "category", and "severity". 
Use %s for language, classify the issue as one of the categories in this list %s, and assign a severity level ["low", "medium", "high"].
In description, your task is to analyze the image and describe the problem. Be concise and clear in your description without being verbose.
If you think the problem does not fit into any of the categories in the provided list, return a JSON object with only the key "problem_found" with the value "false". 
Focus solely on the issue without using offensive language. 
"""

# Instruction without category
SYS_INSTRUCTION_2 = """
You are reporting issues.
Analyze the image and return a JSON object with keys "description" and "severity".
Use %s for language and assign a severity level ["low", "medium", "high"]
Combine the new occurrence description and image to obtain a new main description. 
In description, your task is to analyze the image and describe the problem. Be concise and clear in your description without being verbose.
Focus solely on the issue without using offensive language. 
Combine the new occurrence description and image to obtain a new severity.
"""

# Instruction for checking if the problem is resolved
SYS_INSTRUCTION_3 = """
You are a reports resolver.
Analyze the image of the problem and a video with the current situation and return a JSON object with the key "is_resolved" as "true" or "false".
You need to check if the problem is resolved or not. Having 100% confidence is required.
It is better to say "false" if you are not sure.
"""

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
        
    def generate_description_and_category_and_severity_from_photo(self, image: ImageFile, categories: list[str], language: str) -> types.GenerateContentResponse:
        try:
            sys_instruction = SYS_INSTRUCTION % (language, "/".join(categories))
            
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
            print(f"Error: {e}")
            raise
        
        return response
    
    def check_resolved_problem(self,  image: ImageFile, video_bytes: bytes) -> types.GenerateContentResponse:
        try:
            sys_instruction = SYS_INSTRUCTION_3
            
            response = self.client.models.generate_content(
                model=self.multi_model_model,
                contents=[
                    image,
                    types.Part.from_bytes(
                        data=video_bytes,
                        mime_type="video/quicktime",
                    ),
                ],
                config=types.GenerateContentConfig(
                    system_instruction=sys_instruction,
                )
            )
            
            return response
        
        except Exception as e:
            print(f"Error: {e}")
            raise
        
        
        

    def merge_descriptions_into_an_updated_main_description(
            self, 
            image: ImageFile, 
            categories: list[str],
            occurrence_description: str,
            previous_main_description: Optional[str], 
            previous_severity: Optional[str],
            language: str
    ):
        """
        Combines the image, occurrence description, and optionally the previous main description and severity
        to generate an updated main description, severity and depending on the scenario, a new category.

        Args:
            image (ImageFile): The image to be analyzed.
            occurrence_description (str): The new description to be merged.
            previous_main_description (Optional[str]): The existing main description. If None, a new one will be created.
            previous_severity (Optional[str]): The existing severity. If None, a new one will be assigned.
            language (str): The language for the response.

        Returns:
            tuple: Depending on the scenario:
            - (main_description, main_category, severity) if previous_main_description is None and previous_severity is None.
            - (main_description, severity) if previous_main_description is not None and previous_severity is not None.
        """
        try:
            if previous_main_description is None and previous_severity is None:
                # Scenario 1: Create main_description, main_category, and severity based on image and occurrence_description
                sys_instruction = SYS_INSTRUCTION % (language, "/".join(categories))

                response = self.client.models.generate_content(
                    model=self.multi_model_model,
                    contents=[
                        image,
                        occurrence_description
                    ],
                    config=types.GenerateContentConfig(
                        system_instruction=sys_instruction,
                    )
                )
                
                return response
            
            elif previous_main_description is not None and previous_severity is not None:
                # Scenario 2: Create main_description and severity based on all inputs
                sys_instruction = SYS_INSTRUCTION_2 % (language)
                
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
                
                return response
            
            else:
                raise ValueError("Invalid combination of previous_main_description and previous_severity.")
        
        except Exception as e:
            print(f"Error: {e}")
            raise

llm_client = LLMClient()

if __name__ == "__main__":
    
    image = Image.open("images/not_resolved.jpg")
    
    with open('videos/resolved.mov', 'rb') as f:
        video_bytes = f.read()
    
    response = llm_client.check_resolved_problem(
        image=image,
        video_bytes=video_bytes
    )
    
    response_json = json.loads(response.text)
    print(response_json)
    
    usage = response.usage_metadata
    print(f"\nInput tokens: {usage.prompt_token_count}")
    print(f"Output tokens: {usage.candidates_token_count}")
    print(f"Total tokens: {usage.total_token_count}")

    
    # Example usage
    # print("Example usage")
    
    # image = Image.open("images/buraco.jpeg")
    # # image = Image.open("images/no_problem/bedroom.jpg")
    # image = Image.open("images/buildings_problems.png")

    # categories = ["traffic_lights", "urban_drainage", "pavement", "traffic_signs", "infrastructure", "lighting"] # "others"
    # language = "Portuguese of Portugal"

    # response = llm_client.generate_description_and_category_and_severity_from_photo(
    #     image=image,
    #     categories=categories,
    #     language=language
    # )

    # response_json = json.loads(response.text.split("```json")[1].split("```")[0])

    # if response_json.get("problem_found") == "false":
    #     print("No problem found in the image.")
    # else:
    #     DESCRIPTION_PREFIX = "Description:\n"
    #     print(f"{DESCRIPTION_PREFIX}{response_json['description']}")
    #     print(f"Category: {response_json['category']}")
    #     print(f"Severity: {response_json['severity']}")

    # # Optional: Check token usage
    # usage = response.usage_metadata
    # print(f"\nInput tokens: {usage.prompt_token_count}")
    # print(f"Output tokens: {usage.candidates_token_count}")
    # print(f"Total tokens: {usage.total_token_count}")

    # # Scenario 1
    # print("\n\nScenario 1 - With occurrence description very big and with errors")
    # response = llm_client.merge_descriptions_into_an_updated_main_description(
    #     image=image,
    #     categories=categories,
    #     occurrence_description= "Foi identificado um g e iminente ris lapso parcial da estrutura exterior de um edifício gradação. A queda de tijolos e detritos já afetou significativamente a área envolvente, atingindo inclusive a via pública, e continua a representar perigo real e imediato para peões e veículos. Há indícios de que outras partes da fachada possam ruir a qualquer momennda mais a situação. Solicita-se cca da estabilidade estrutural do edifício e a adoçãoeventivas, como o isolamento da zona de risco, de forma a evitar acidentes potencialmente graves.",
    #     previous_main_description=None,
    #     previous_severity=None,
    #     language=language
    # )

    # response_json = json.loads(response.text.split("```json")[1].split("```")[0])
    # main_description = response_json["description"]
    # main_category = response_json["category"]
    # severity = response_json["severity"]

    # print(f"Description:\n{main_description}")
    # print(f"\nCategory: {main_category}")
    # print(f"Severity: {severity}")

    # # Optional: Check token usage
    # usage = response.usage_metadata
    # print(f"\nInput tokens: {usage.prompt_token_count}")
    # print(f"Output tokens: {usage.candidates_token_count}")
    # print(f"Total tokens: {usage.total_token_count}")

    # Scenario 2
    # print("\n\nScenario 2 - With low severity")
    # response = llm_client.merge_descriptions_into_an_updated_main_description(
    #     image=image,
    #     categories=categories,
    #     occurrence_description= "Foi identificado um risco. A queda de tijolos afetou a área.",
    #     previous_main_description="Constata-se um grave problema de infraestrutura num edifício visivelmente degradado, com uma parte significativa da sua estrutura exterior colapsada. Solicita-se uma avaliação urgente da estabilidade estrutural do edifício.",
    #     previous_severity="low",
    #     language=language
    # )

    # response_json = json.loads(response.text.split("```json")[1].split("```")[0])
    # main_description = response_json["description"]
    # severity = response_json["severity"]

    # print("Description:\n", main_description)
    # print("\nSeverity:", severity)

    # # Optional: Check token usage
    # usage = response.usage_metadata
    # print(f"\nInput tokens: {usage.prompt_token_count}")
    # print(f"Output tokens: {usage.candidates_token_count}")
    # print(f"Total tokens: {usage.total_token_count}")
    

