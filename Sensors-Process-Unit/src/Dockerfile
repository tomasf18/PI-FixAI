# Use Miniconda as the base image
FROM continuumio/miniconda3

WORKDIR /app
COPY . /app

RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Create environment and install packages

RUN conda create -y -n opencv_env python=3.12 && \
    conda install -y -n opencv_env -c conda-forge opencv=4.10 ffmpeg && \
    /opt/conda/envs/opencv_env/bin/pip install -r requirements.txt

# Set environment path
ENV PATH=/opt/conda/envs/opencv_env/bin:$PATH

CMD ["python", "main.py"]
