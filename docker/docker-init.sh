#!/usr/bin/env bash

set -e

echo "======================================================================"
echo "🚀 [Invetraz] Inicializando base de datos y esquemas de Invetraz..."
echo "======================================================================"

invetraz init

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    echo "👤 [Invetraz] Creando usuario administrador inicial ($ADMIN_EMAIL)..."
    invetraz create-admin --email "$ADMIN_EMAIL" --password "$ADMIN_PASSWORD" || true
fi

echo "======================================================================"
echo "✅ [Invetraz] Inicialización completada exitosamente."
echo "======================================================================"
