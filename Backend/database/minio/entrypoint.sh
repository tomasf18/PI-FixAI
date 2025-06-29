#!/bin/bash

# Wait for MinIO server to start (in the background)
minio server /data --console-address ":${MINIO_ADMIN_WEBSITE_LOCAL_PORT}" &

# Wait a few seconds to ensure the server is up
sleep 5

# Configure the alias for the MinIO server
echo "Configuring MinIO server alias... http://${MINIO_HOST}:${MINIO_LOCAL_PORT}"
mc alias set my_minio http://${MINIO_HOST}:${MINIO_LOCAL_PORT} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create the bucket
mc mb my_minio/"${PHOTOS_BUCKET_NAME}"
mc mb my_minio/"${VIDEOS_BUCKET_NAME}"

# Keep the container running by waiting for the MinIO process
wait
