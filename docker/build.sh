#!/bin/bash

# Determine script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to project root (parent directory)
cd "$SCRIPT_DIR/.."

echo "Building make-sense Docker image..."
echo "Current directory: $(pwd)"
echo "User: $(whoami) (UID: $(id -u), GID: $(id -g))"

# Build the Docker image with user arguments
docker build \
  --build-arg USRNM=$(whoami) \
  --build-arg USRUID=$(id -u) \
  --build-arg USRGID=$(id -g) \
  -t make-sense:dev \
  -f docker/Dockerfile \
  .

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Image: make-sense:dev"
    echo ""
    echo "To run the container, use: ./docker/run.sh"
else
    echo "❌ Build failed!"
    exit 1
fi
