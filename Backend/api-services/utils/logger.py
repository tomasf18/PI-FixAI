import logging

# Create a custom logger
logger = logging.getLogger("api-logger")
logger.setLevel(logging.DEBUG)  # Set the default logging level

# Create handlers
console_handler = logging.StreamHandler()

# Set logging levels for handlers
console_handler.setLevel(logging.INFO)

# Create formatters
console_formatter = logging.Formatter(
    "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Add formatters to handlers
console_handler.setFormatter(console_formatter)

# Add handlers to the logger
logger.addHandler(console_handler)
