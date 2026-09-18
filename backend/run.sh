#!/bin/bash
# Run eBanking backend with .env loaded
# Usage: ./run.sh

set -a
source .env
set +a

echo "Starting eBanking with profile: dev"
echo "DB: $DB_URL | Redis: $REDIS_HOST:$REDIS_PORT | Port: $PORT"

./mvnw spring-boot:run
