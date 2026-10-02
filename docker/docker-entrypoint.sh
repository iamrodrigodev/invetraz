#!/usr/bin/env bash
# ==============================================================================
# Invetraz (Sistema de Investigación) - Docker Entrypoint
# Inspirado en docker-entrypoint.sh de Apache Superset
# ==============================================================================

set -e

# Si el primer argumento es un comando reconocido de invetraz, invocarlo con invetraz
if [ "$1" = "run" ] || [ "$1" = "init" ] || [ "$1" = "db" ] || [ "$1" = "create-admin" ]; then
    exec invetraz "$@"
fi

# Si se pasa un comando bash o general, ejecutarlo directamente
exec "$@"
