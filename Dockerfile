# Etapa de construccion
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa de produccion segura (no-root)
FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

# Instalar serve
RUN npm install -g serve

# Copiar artefactos de compilacion asignando propiedad al usuario no-root 'node'
COPY --chown=node:node --from=builder /app/dist ./dist

# Ejecutar como usuario sin privilegios
USER node

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
