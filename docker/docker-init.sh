#!/usr/bin/env bash
# ==============================================================================
# SisInv (Sistema de Investigación) - Script de Inicialización
# Inspirado en docker-init.sh de Apache Superset
# ==============================================================================

set -e

echo "======================================================================"
echo "🚀 [SisInv] Inicializando base de datos y esquemas de SisInv..."
echo "======================================================================"

# 1. Crear esquemas y aplicar migraciones de Alembic
sisinv init

# 2. Si se proporcionaron credenciales por variable de entorno, crear admin
if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "👤 [SisInv] Creando usuario administrador inicial ($ADMIN_EMAIL)..."
    sisinv create-admin --email "$ADMIN_EMAIL" --password "$ADMIN_PASSWORD" || true
fi

echo "======================================================================"
echo "✅ [SisInv] Inicialización completada exitosamente."
echo "======================================================================"
