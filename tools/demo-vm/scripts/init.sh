#!/bin/bash -eux

cd /var/correctly

# override some config
rm -rf ./source/.keys
cp -r /home/correctly/config/ ./source/.keys
cp -f ./Dockerfile ./source/Dockerfile

# pull the images
sh ./start.sh

echo "Waiting for flyway to finish migration"
docker wait flyway

echo "Syncing CSV users"
curl --output /dev/null --silent --fail http://localhost/api/auth/csv/sync