#!/bin/bash -eux

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "/var/correctly:/var/correctly:ro" -w="/var/correctly" docker/compose:latest up -d
