#!/usr/bin/env bash

echo 'Checking database connection...'

DATABASE_HOST=$(echo $DATABASE_URL | grep -oP '(?<=@)[^:]+' | cut -d'/' -f1)
DATABASE_PORT=5432

until nc -z $DATABASE_HOST $DATABASE_PORT; do
    echo 'Waiting for Neon database...'
    sleep 5
done

echo 'Database is ready!'

echo "Running migrations..."
cd /app/gympass_api/
npm run db:migrate

echo "Generating Prisma Client..."
npx prisma generate

echo 'Starting API with PM2...'
if [ "$NODE_ENV" == "development" ]
then
    echo "Development MODE"
    pm2-runtime start docker/api/pm2/pm2-development.json
else
    echo "Production MODE"
    pm2-runtime start docker/api/pm2/pm2-production.json
fi

pm2 logs --lines 50

tail -f /dev/null
