## Hito 4: Composición de Servicios

### Elección del contenedor base:

Para este hito, he optado por utilizar **Docker** como nuestro contenedor base debido a su amplia adopción en la industria, facilidad de uso y robusta comunidad de soporte. Docker nos permite empaquetar nuestras aplicaciones y sus dependencias en contenedores ligeros y portátiles, facilitando la implementación y escalabilidad de nuestros servicios.

````yml
version: "3.8"
services:
  service_name:
    build:
      context: ${AUTH_BUILD_CONTEXT:-../../}
      dockerfile: ${AUTH_DOCKERFILE:-apps/auth/Dockerfile}
      args:
        NODE_ENV: ${NODE_ENV:-production}
    image: ${AUTH_IMAGE:-auth_service:latest}
    container_name: ${AUTH_CONTAINER_NAME:-auth_service}
    ports:
      - "${AUTH_PORT:-3001}:${AUTH_INTERNAL_PORT:-3000}"
    env_file:
      - .env
      - ../../.env
    environment:
      - NODE_ENV=${NODE_ENV:-production}
    restart: on-failure
    networks:
      - dexo_network

networks:
  dexo_network:
    driver: bridge
````

Primero, definimos un servicio llamado `service_name` en nuestro archivo `docker-compose.yml`. Este servicio se construye a partir de un contexto y un Dockerfile específicos, que se pueden personalizar mediante variables de entorno. La imagen resultante se etiqueta como `auth_service:latest`, pero puede variar de acuerdo al microservicio y el contenedor se nombra `auth_service` ó como se defina en las variables de entorno.

La base es un container de JavaScript (Node.js) optimizado para producción, lo que garantiza un entorno estable y eficiente para ejecutar nuestras aplicaciones.

Luego, se define **Dockerfile.base** que sirve como plantilla para construir imágenes de Docker para diferentes microservicios. Este Dockerfile utiliza una imagen base de Node.js, instala las dependencias necesarias y copia el código fuente al contenedor.

````Dockerfile
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
COPY libs ./libs

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
````

Primero, el Dockerfile define una etapa de construcción (`builder`) que utiliza una imagen base de Node.js en Alpine Linux para mantener la imagen ligera. En esta etapa, se copian los archivos de configuración y el código fuente necesario para construir la aplicación.

Luego, se instalan las dependencias utilizando `npm ci` y se ejecuta el comando de build de Nx para compilar la aplicación en modo producción.

Finalmente, en la etapa final, se crea una nueva imagen base de Node.js en Alpine Linux y se copian los archivos compilados desde la etapa de construcción. Se expone el puerto 3000 y se define el comando para iniciar la aplicación. El puerto debe cambiar de acuerdo al microservicio que se esté configurando.

