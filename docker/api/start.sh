#!/usr/bin/env bash

cd /app/

echo 'Starting API with PM2...'
if [ "$NODE_ENV" == "development" ]
then
    echo "Development MODE"
    pm2-runtime start docker/api/pm2/pm2-development.json
else
    echo "Production MODE"
    pm2-runtime start docker/api/pm2/pm2-production.json
fi
