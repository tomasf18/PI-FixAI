FROM quay.io/minio/minio:RELEASE.2023-03-20T20-16-18Z

# Install mc (MinIO Client)
RUN curl -o /usr/local/bin/mc https://dl.min.io/client/mc/release/linux-amd64/mc && \
    chmod +x /usr/local/bin/mc

# Arguments for configuration
ARG MINIO_HOST
ARG MINIO_LOCAL_PORT
ARG MINIO_ACCESS_KEY
ARG MINIO_ROOT_PASSWORD
ARG PHOTOS_BUCKET_NAME
ARG VIDEOS_BUCKET_NAME
ARG MINIO_ADMIN_WEBSITE_LOCAL_PORT

# Environment variables to pass args into the container
ENV MINIO_HOST=${MINIO_HOST} \
    MINIO_LOCAL_PORT=${MINIO_LOCAL_PORT} \
    MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY} \
    MINIO_ROOT_PASSWORD=${MINIO_ROOT_PASSWORD} \
    PHOTOS_BUCKET_NAME=${PHOTOS_BUCKET_NAME} \
    VIDEOS_BUCKET_NAME=${VIDEOS_BUCKET_NAME} \
    MINIO_ADMIN_WEBSITE_LOCAL_PORT=${MINIO_ADMIN_WEBSITE_LOCAL_PORT}

# Copy an entrypoint script to initialize the bucket
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set the entrypoint to run the script
ENTRYPOINT ["/entrypoint.sh"]

# Default command to start MinIO server
CMD ["server", "/data", "--console-address", ":${MINIO_ADMIN_WEBSITE_LOCAL_PORT}"]
