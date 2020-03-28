#!/bin/bash

mysqldump-server &
docker-entrypoint.sh --sort_buffer_size=2M
