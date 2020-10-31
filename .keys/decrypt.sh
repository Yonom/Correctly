#!/bin/bash

openssl enc -d -aes-256-cbc -md md5 -in .keys/key.enc -out .keys/key.json -k $ENCRYPTION_KEY
openssl enc -d -aes-256-cbc -md md5 -in .keys/users.enc -out .keys/users.csv -k $ENCRYPTION_KEY