# ============================================
# WCTraining Frontend Admin - Next.js 16
# Multi-stage Dockerfile optimizado para producción
# ============================================

# ---- Etapa base ----
FROM node:22-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

# ---- Etapa de dependencias ----
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci

# ---- Etapa de build ----
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./

# Copiar configuraciones de build
COPY next.config.ts tsconfig.json postcss.config.mjs components.json ./
COPY eslint.config.mjs ./

# Copiar código fuente
COPY app/ ./app/
COPY components/ ./components/
COPY lib/ ./lib/
COPY public/ ./public/

# Variables de entorno necesarias en build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build de producción
RUN npm run build

# ---- Etapa de producción ----
FROM node:22-alpine AS production

# Metadatos de la imagen
LABEL maintainer="WCTraining Team"
LABEL description="WCTraining Frontend Admin - Panel de Administración"
LABEL version="0.1.0"

# Crear usuario no-root
RUN addgroup --system --gid 1001 nextjs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3557
ENV HOSTNAME="0.0.0.0"

# Copiar archivos públicos
COPY --from=builder /app/public ./public

# Copiar build de Next.js
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./
COPY --from=builder --chown=nextjs:nextjs /app/next.config.ts ./

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3557

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3557 || exit 1

# Comando de inicio
CMD ["npx", "next", "start", "-p", "3557"]
