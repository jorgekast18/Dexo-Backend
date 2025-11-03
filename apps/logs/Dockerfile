# Etapa 1: build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copiar package.json y package-lock.json / pnpm-lock.yaml
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código del microservicio
COPY . .

# Build del proyecto (Nx)
RUN npm run build

# Etapa 2: runtime
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias del build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copiar .env si quieres variables locales (opcional)
# COPY ../../.env .env

# Puerto expuesto
EXPOSE 3001

# Comando por defecto para arrancar el microservicio
CMD ["node", "dist/main.js"]
