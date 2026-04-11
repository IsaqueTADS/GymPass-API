#!/usr/bin/env bash

# Start up Docker for Dev Environment
docker-compose -f docker-compose.dev.yml up

# Start up Docker for Dev Environment in Daemon MODE
# docker-compose -f docker-compose.dev.yml up -d
