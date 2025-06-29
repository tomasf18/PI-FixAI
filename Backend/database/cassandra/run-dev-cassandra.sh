#!/bin/bash
CONTAINER_NAME="database-cassandra"
IMAGE_NAME="db_cassandra"

# Stop and remove the container if it exists
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Remove the image if it exists
if [ $(docker images -q $IMAGE_NAME) ]; then
    echo "Removing existing image: $IMAGE_NAME"
    docker rmi $IMAGE_NAME
fi

# Run the new container
docker build -t $IMAGE_NAME .
docker run --name $CONTAINER_NAME -p 9042:9042 $IMAGE_NAME
