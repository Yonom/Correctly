#!/bin/sh

# run docker-compose
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD:$PWD:ro" -w="$PWD" docker/compose:1.24.0 up -d

# remove existing cockroach db nodes / certs
docker container stop $(docker container ls -q --filter name=roach-*)
docker container rm $(docker container ls -q --filter name=roach-*)
rm /var/praxisprojekt/cockroach -r

# setup cockroach db - alpha
docker network create roachnet-alpha
bash ./cockroach/create-ca.sh alpha

for NODE_ID in `seq 1 $1`
do
  bash ./cockroach/create-node.sh alpha roach-alpha-$NODE_ID
  bash ./cockroach/start-node.sh alpha roach-alpha-$NODE_ID $((26257 + $NODE_ID - 1)) $1
done


# setup cockroach db - prod
docker network create roachnet-prod
bash ./cockroach/create-ca.sh prod

for NODE_ID in `seq 1 $2`
do
  bash ./cockroach/create-node.sh prod roach-prod-$NODE_ID
  bash ./cockroach/start-node.sh prod roach-prod-$NODE_ID $((26357 + $NODE_ID - 1)) $2
done


# initialize cluster
sleep 5s

if [ $1 -eq 0 ]; then
  bash ./cockroach/init-node.sh roach-alpha-1
fi
if [ $2 -eq 0 ]; then
  bash ./cockroach/init-node.sh roach-prod-1
fi