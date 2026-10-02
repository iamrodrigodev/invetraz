#!/usr/bin/env bash
# ==============================================================================
# Invetraz (Sistema de Investigación) - Script de Inicialización
# Inspirado en docker-init.sh de Apache Superset
# ==============================================================================

set -e

echo "======================================================================"
echo "🚀 [Invetraz] Inicializando base de datos y esquemas de Invetraz..."
echo "======================================================================"

# 1. Crear esquemas y aplicar migraciones de Alembic
invetraz init

# 2. Si se proporcionaron credenciales por variable de entorno, crear admin
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "👤 [Invetraz] Creando usuario administrador inicial ($ADMIN_EMAIL)..."
    invetraz create-admin --email "$ADMIN_EMAIL" --password "$ADMIN_PASSWORD" || true
fi

echo "======================================================================"
echo "✅ [Invetraz] Inicialización completada exitosamente."
echo "======================================================================"
