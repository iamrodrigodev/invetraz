#!/usr/bin/env bash
# ==============================================================================
# Inveli (Sistema de Investigación) - Script de Inicialización
# Inspirado en docker-init.sh de Apache Superset
# ==============================================================================

set -e

echo "======================================================================"
echo "🚀 [Inveli] Inicializando base de datos y esquemas de Inveli..."
echo "======================================================================"

# 1. Crear esquemas y aplicar migraciones de Alembic
inveli init

# 2. Si se proporcionaron credenciales por variable de entorno, crear admin
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "👤 [Inveli] Creando usuario administrador inicial ($ADMIN_EMAIL)..."
    inveli create-admin --email "$ADMIN_EMAIL" --password "$ADMIN_PASSWORD" || true
fi

echo "======================================================================"
echo "✅ [Inveli] Inicialización completada exitosamente."
echo "======================================================================"
