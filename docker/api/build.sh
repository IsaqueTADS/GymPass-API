#!/usr/bin/env bash

# Remove Old Image
docker rm -f gympass_api

# No Cache Build
docker build --no-cache -t gympass-api -f Dockerfile .

# Cache Build (commented)
# docker build -t gympass-api -f Dockerfile .
