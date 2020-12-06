mkdir -p /var/praxisprojekt/cockroach/$2
cp -r /mnt/disks/data-disk/safe/$1/certs /var/praxisprojekt/cockroach/$2

docker run --rm \
  -v "/var/praxisprojekt/cockroach/$2/certs:/certs" \
  -v "/mnt/disks/data-disk/safe/$1/secret/ca.key:/secret/ca.key:ro" \
  -w "/" \
  cockroachdb/cockroach:latest cert create-node \
  $2 \
  main-vm.praxisprojekt.cf \
  database.correctly.frankfurt.school \
  localhost \
  127.0.0.1 \
  --certs-dir=./certs \
  --ca-key=./secret/ca.key

docker run --rm \
  -v "/var/praxisprojekt/cockroach/$2/certs:/certs" \
  -v "/mnt/disks/data-disk/safe/$1/secret/ca.key:/secret/ca.key:ro" \
  -w "/" \
  cockroachdb/cockroach:latest cert create-client \
  root \
  --certs-dir=./certs \
  --ca-key=./secret/ca.key