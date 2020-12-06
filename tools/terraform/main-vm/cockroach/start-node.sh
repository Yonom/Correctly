docker create \
  --name=$2 \
  --restart=unless-stopped \
  --network="roachnet-$1" \
  -v "/var/praxisprojekt/cockroach/$2/certs:/etc/cockroach-certs:ro" \
  -v "/mnt/disks/data-disk/cockroach/$2:/cockroach/cockroach-data" \
  -e "VIRTUAL_HOST=$2.praxisprojekt.cf" \
  -e "VIRTUAL_PORT=8080" \
  -e "VIRTUAL_PROTO=https" \
  -p $3:26257 \
  cockroachdb/cockroach:latest start \
  --certs-dir=/etc/cockroach-certs \
  --advertise-addr=$2 \
  --join=$(seq -f "roach-$1-%g" -s, 1 $4)

docker network connect vhost $2
docker start $2