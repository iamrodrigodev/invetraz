#!/usr/bin/env bash

set -e

if [ "$1" = "run" ] || [ "$1" = "init" ] || [ "$1" = "db" ] || [ "$1" = "create-admin" ]; then
    exec invetraz "$@"
fi

exec "$@"
