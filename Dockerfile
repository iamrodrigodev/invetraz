# ==============================================================================
# SisInv (Sistema de Investigación) - Dockerfile Unificado All-in-One
# Arquitectura inspirada en Apache Superset: Frontend SPA + Backend FastAPI
# ==============================================================================

# ------------------------------------------------------------------------------
# Etapa 1: Compilación de Frontend (React + TypeScript + Vite)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

# Copiar manifiestos de dependencias para aprovechar la caché de Docker
COPY frontend/package.json frontend/package-lock.json ./

# Instalar dependencias limpias
RUN npm ci --prefer-offline --no-audit

# Copiar el código fuente del frontend
COPY frontend/ ./

# Argumento para la URL base de API (por defecto /api/v1 en el mismo host)
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Compilar producción (genera frontend/dist)
RUN npm run build


# ------------------------------------------------------------------------------
# Etapa 2: Imagen Final de Producción (Python 3.12 + FastAPI + Uvicorn)
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runner

# Metadatos del contenedor
LABEL org.opencontainers.image.title="SisInv - Sistema de Investigación" \
      org.opencontainers.image.description="Plataforma integral de gestión y seguimiento de investigación académica con integración Google Classroom & Drive" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Equipo SisInv <contacto@sisinv.org>" \
      org.opencontainers.image.licenses="Apache-2.0"

# Variables de entorno de Python y del sistema
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PYTHONPATH=/app \
    PORT=8080 \
    HOST=0.0.0.0 \
    DIR_ESTATICOS_FRONTEND=/app/frontend/dist

# Instalar dependencias del sistema mínimas requeridas para producción
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario de sistema no privilegiado para ejecutar la aplicación
RUN groupadd -g 10001 sisinv && \
    useradd -u 10001 -g sisinv -s /bin/bash -m sisinv

WORKDIR /app

# Instalar dependencias de Python
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código del backend y configuración
COPY backend/pyproject.toml ./
COPY backend/alembic.ini ./
COPY backend/alembic ./alembic
COPY backend/sisinv ./sisinv

# Instalar la herramienta CLI sisinv
RUN pip install --no-cache-dir -e .

# Copiar scripts de inicialización SQL
COPY sql/ ./sql/

# Copiar estáticos del frontend compilados en la Etapa 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Ajustar permisos para el usuario sisinv
RUN chown -R sisinv:sisinv /app

# Cambiar a usuario no root
USER sisinv

# Exponer el puerto de la aplicación
EXPOSE 8080

# Comprobación de salud (Healthcheck) compatible con Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Punto de entrada CLI (estilo Superset: sisinv run, sisinv init, sisinv create-admin)
ENTRYPOINT ["sisinv"]

# Comando por defecto para iniciar el servidor HTTP
CMD ["run", "--host", "0.0.0.0", "--port", "8080"]
