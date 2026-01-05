FROM node:20-alpine

WORKDIR /app

# 1. Copiamos solo lo necesario para instalar dependencias de PRODUCCIÓN
COPY package*.json ./

# 2. Instalamos solo dependencias de producción (Mucho más rápido y ligero)
# Omitimos 'dev' porque TypeScript ya fue compilado a JS
RUN npm ci --omit=dev --legacy-peer-deps

# 3. Copiamos el código YA COMPILADO desde la carpeta 'dist' que subirá GitHub
# Asegúrate de que esta ruta coincida con la salida de tu build de Nx
COPY dist/apps/transactions ./dist/apps/transactions

# 4. Ajustamos permisos (opcional pero buena práctica)
RUN chown -R node:node /app
USER node

EXPOSE 3002

# 5. Ejecutamos directamente el archivo JS compilado
# Ajusta la ruta si tu main.js está en otro lugar dentro de dist
CMD ["node", "dist/apps/transactions/main.js"]
