#!/bin/bash

# Determine script location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Navigate to project root
cd "$SCRIPT_DIR/.."

echo "Starting make-sense development container..."
echo "Project directory: $(pwd)"
echo "Container will be accessible at: http://localhost:9500"
echo ""
echo "Volume mount: $(pwd) -> /app"
echo "Running as: $(whoami) (UID: $(id -u), GID: $(id -g))"
echo ""
echo "Inside the container, run:"
echo "  npm run dev     - Start development server"
echo "  npm run build   - Build for production"
echo "  npm test        - Run tests"
echo ""

# Run the container
docker run -it \
  --name make-sense-dev \
  --rm \
  -p 9500:3000 \
  -v "$(pwd)":/app \
  -w /app \
  --user $(id -u):$(id -g) \
  make-sense:dev

# Note: The container will be removed when stopped due to --rm flag
# If you want it to persist, remove the --rm flag above
