import google.generativeai as genai
from utils.logger import logger

model_info = genai.get_model("models/gemini-1.5-flash")

# Returns the "context window" for the model,
# which is the combined input and output token limits.
logger.info(f"{model_info.input_token_limit=}")
logger.info(f"{model_info.output_token_limit=}")
# ( input_token_limit=30720, output_token_limit=2048 )
