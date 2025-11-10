# Etapa de build
FROM node:20-alpine AS builder
WORKDIR /app

# Copia archivos de configuración
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./
COPY eslint.config.js jest.preset.js ./

# Copia los apps necesarios
COPY apps/auth ./apps/auth
# COPY libs ./libs

# Instala dependencias
RUN npm ci --legacy-peer-deps

# Build de producción con Nx
RUN npx nx build auth --prod

# Etapa final
FROM node:20-alpine
WORKDIR /app

# Copia la aplicación compilada
COPY --from=builder /app/dist/apps/auth ./
COPY --from=builder /app/node_modules ./node_modules

# Si tu app necesita package.json en runtime:
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "main.js"]
