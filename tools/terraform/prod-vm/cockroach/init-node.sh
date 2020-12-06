sed -i "s/MIGRATE_PASS/$COCKROACH_MIGRATE_PASS/g" ./cockroach/init.sql
sed -i "s/ROACH_UI_PASS/$COCKROACH_ROACH_UI_PASS/g" ./cockroach/init.sql

docker exec $1 bash cockroach.sh init --certs-dir=/etc/cockroach-certs
docker exec -i $1 bash cockroach.sh sql --certs-dir=/etc/cockroach-certs < ./cockroach/init.sql