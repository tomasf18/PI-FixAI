# Use an official Python runtime as a parent image
FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
       ffmpeg \
       && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Define environment variable
# ENV NAME World

# Run main.py when the container launches
CMD ["python3", "main.py"]