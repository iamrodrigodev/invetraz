
FROM node:22-alpine AS frontend-builder

WORKDIR /app/invetraz-frontend

COPY invetraz-frontend/package.json invetraz-frontend/package-lock.json ./

RUN npm ci --prefer-offline --no-audit

COPY invetraz-frontend/ ./

ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

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

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    bash \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 10001 invetraz && \
    useradd -u 10001 -g invetraz -s /bin/bash -m invetraz

WORKDIR /app

COPY requirements/ ./requirements/
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY pyproject.toml ./
COPY alembic.ini ./
COPY alembic/ ./alembic/
COPY invetraz/ ./invetraz/
COPY docker/ ./docker/
COPY sql/ ./sql/

RUN pip install --no-cache-dir -e .

COPY --from=frontend-builder /app/invetraz-frontend/dist /app/invetraz-frontend/dist

RUN chmod +x /app/docker/*.sh && \
    chown -R invetraz:invetraz /app

USER invetraz

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["/app/docker/docker-entrypoint.sh"]
CMD ["run", "--host", "0.0.0.0", "--port", "8080"]
