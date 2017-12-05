#!/bin/bash

FORCE_BUILD="${1:-0}"
IMAGE_NAME="citiesapp"
CONTAINER_NAME="$IMAGE_NAME-container"
HOST_PORT=3001


# Buil Image
if [ $FORCE_BUILD -eq "1" ]; then
	echo "building image .."
    docker build -t $IMAGE_NAME .
fi

if [ ! "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
		echo "Container $CONATAINER_NAME exited... starting it"
        # cleanup
        #docker rm $CONTAINER_NAME
        docker restart $CONTAINER_NAME
    else
        # run container
		echo "Running container $CONATAINER_NAME ..."
		docker run \
			-it \
			--name $CONTAINER_NAME \
			-p $HOST_PORT:3001 \
			-p 5858:5858 \
			-v "$(pwd)/src":/home/node/server/src \
			-v "$(pwd)/client/build":/home/node/server/client/build \
			$IMAGE_NAME
    fi
else
	echo "Container $CONTAINER_NAME already running"
fi

