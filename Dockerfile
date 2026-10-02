# ==============================================================================
# Invetraz (Sistema de Investigación) - Dockerfile Unificado All-in-One
# Arquitectura y estructura idéntica a Apache Superset
# ==============================================================================

# ------------------------------------------------------------------------------
# Etapa 1: Compilación de Frontend (invetraz-frontend: React 19 + TypeScript + Vite)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS frontend-builder

WORKDIR /app/invetraz-frontend

# Copiar manifiestos de dependencias
COPY invetraz-frontend/package.json invetraz-frontend/package-lock.json ./

# Instalar dependencias limpias
RUN npm ci --prefer-offline --no-audit

# Copiar el código fuente del frontend
COPY invetraz-frontend/ ./

# Argumento para URL base de API (mismo origen por defecto en el contenedor)
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Compilar producción (genera invetraz-frontend/dist)
RUN npm run build


# ------------------------------------------------------------------------------
# Etapa 2: Imagen Final de Producción (Python 3.12 + FastAPI + Uvicorn)
# ------------------------------------------------------------------------------
FROM python:3.12-slim AS runner

LABEL org.opencontainers.image.title="Invetraz - Sistema de Investigación" \
      org.opencontainers.image.description="Plataforma integral de gestión y seguimiento de investigación académica con integración Google Classroom & Drive" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.authors="Equipo Invetraz <contacto@invetraz.org>" \
      org.opencontainers.image.licenses="Apache-2.0"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    PYTHONPATH=/app \
    PORT=8080 \
    HOST=0.0.0.0 \
    DIR_ESTATICOS_FRONTEND=/app/invetraz-frontend/dist

# Instalar dependencias mínimas del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Crear usuario de sistema no privilegiado para ejecutar la aplicación
RUN groupadd -g 10001 invetraz && \
    useradd -u 10001 -g invetraz -s /bin/bash -m invetraz

WORKDIR /app

# Instalar dependencias de Python (estructura requirements/ estilo Superset)
COPY requirements/ ./requirements/
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código del backend, configuración y scripts docker
COPY pyproject.toml ./
COPY alembic.ini ./
COPY alembic/ ./alembic/
COPY invetraz/ ./invetraz/
COPY docker/ ./docker/
COPY sql/ ./sql/

# Instalar paquete invetraz en modo editable/paquete
RUN pip install --no-cache-dir -e .

# Copiar estáticos del frontend compilados en Etapa 1
COPY --from=frontend-builder /app/invetraz-frontend/dist /app/invetraz-frontend/dist

# Permisos para scripts y archivos
RUN chmod +x /app/docker/*.sh && \
    chown -R invetraz:invetraz /app

# Cambiar a usuario no root
USER invetraz

# Exponer el puerto HTTP
EXPOSE 8080

# Comprobación de salud (Healthcheck) compatible con Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Entrypoint y comando por defecto estilo Apache Superset
ENTRYPOINT ["/app/docker/docker-entrypoint.sh"]
CMD ["run", "--host", "0.0.0.0", "--port", "8080"]
