#!/bin/bash -eux

cd /var/correctly

# copy config
cp -r /home/correctly/config/ ./source/.keys

# pull the images
sh ./start.sh

echo "Waiting for flyway to finish migration"
docker wait flyway

echo "Syncing CSV users"
curl --output /dev/null --silent --fail http://localhost/api/auth/csv/sync