#!/usr/bin/env bash

# Install NPM dependencies
echo "Installing API dependencies..."
cd /app/gympass_api/
npm install

# Build Docker images
echo "Building Docker Images..."
./docker/dev-build.sh

echo "Starting up Docker Containers..."
./docker/dev-up.sh
