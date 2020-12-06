if [[ ! -e /mnt/disks/data-disk/safe/$1/secret/ca.key ]]; then
  mkdir -p /mnt/disks/data-disk/safe/$1/secret
  docker run --rm -v "/mnt/disks/data-disk/safe/$1:/safe" -w "/safe" cockroachdb/cockroach:latest cert create-ca \
    --certs-dir=./certs \
    --ca-key=./secret/ca.key
fi