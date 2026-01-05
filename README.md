# Dexo App 🏦

Dexo es una aplicación de finanzas personales diseñada para acompañar a los usuarios en el manejo inteligente de su dinero. Su objetivo principal es facilitar la toma de decisiones financieras mediante el uso de inteligencia artificial, que analiza los hábitos de gasto y ahorro para ofrecer recomendaciones personalizadas.

Con Dexo, cada usuario podrá recibir opciones de inversión adaptadas a su perfil y objetivos, ayudando a aumentar su capital de manera segura y eficiente. Más que una herramienta, Dexo actúa como un asistente financiero que impulsa un futuro económico más sólido y tranquilo.

## Por qué Dexo es diferente

A diferencia de otras aplicaciones populares que se enfocan principalmente en el control de gastos, presupuestos y alertas, Dexo utiliza inteligencia artificial avanzada para ir un paso más allá. No solo ayuda a administrar las finanzas, sino que también acompaña al usuario en la toma de decisiones inteligentes para aumentar su capital mediante propuestas de inversión personalizadas.

Mientras otras apps ofrecen funciones limitadas de inversión o recomendaciones genéricas, Dexo analiza patrones únicos de cada usuario y su contexto financiero para sugerir portafolios diversificados y adaptados, facilitando una gestión activa y productiva del dinero. Esto convierte a Dexo en un asistente financiero integral que hace que la inteligencia financiera esté al alcance de todos.

## Tecnologías utilizadas

- **Backend:** NestJS, una plataforma sólida y escalable para construir APIs eficientes y seguras.
- **Mobile:** Flutter, para ofrecer una experiencia móvil fluida, rápida y multiplataforma.


## Hitos

- [Hito 1](docs/Hito1.md)
- [Hito 2](docs/Hito2.md)
- [Hito 3](docs/Hito3.md)

## Instalación

### Prequisitos

- Docker >= 24.0
- Docker Compose >= 2.20

1. Clona el repositorio:
 ```bash
 git clone
  ```
2. Navega al directorio del proyecto y copia las variables de entorno en tu archivo .env
```bash
 cd dexo-app
 ```
3. Instala las dependencias:
 ```bash
 npm install
 ```
4. Configura las variables de entorno según las necesidades del proyecto o del microservicio.
````
# postgres
ENVIRONMENT=<environment>
POSTGRES_USER=<user>
POSTGRES_PASSWORD=<secret_password>
POSTGRES_DB=<dn_name>
POSTGRES_PORT=<port>
POSTGRES_VERSION=<db_version>

# Auth API
AUTH_PORT=<Auth_port>
````

**Nota**: En la raíz del proyecto, hay un archivo `.env.example` que sirve como plantilla para crear el archivo `.env` con las variables de entorno necesarias y en cada microservicio también encontrará un archivo similar que define
las variables específicas para ese servicio.

5. Inicia el servidor de desarrollo: Tener en cuenta que el proyecto ha sido construido con **NX** y también ha sido dockerizado.

Se debe crear la red de docker personalizada:
```bash
docker network create dexo-network
```

Construir las imágenes desde el código fuente
```bash
docker compose -f docker-compose.yml pull
```

Levantar todo
```bash
docker compose -f docker-compose.yml up -d
```

El siguiente paso es construir la imagen de la base de datos (PostgreSQL):

Si desea solo construir imágenes sin levantar los contenedores, puede usar:

Construir imagen de la base de datos postgresql:
```bash
docker compose up -d
```

Construir imagen de la base de datos mongo:
```bash
docker compose -f docker-compose.mongo.yml up -d
```

Luego, para iniciar los servicios sin usar docker por separado.


Iniciar con nx:
```bash
nx serve <nombre-del-servicio>
```

## Licencia

Este proyecto usa la licencia MIT, una licencia permisiva que permite uso libre, modificación y distribución con mínima restricción, facilitando la colaboración y adopción del código. Más información sobre la licencia MIT puede encontrarse [aquí](https://es.wikipedia.org/wiki/Licencia_MIT).

---

Dexo combina tecnología de punta y análisis inteligente para transformar la forma en que las personas gestionan y hacen crecer su dinero, ofreciendo una experiencia única en el mercado de aplicaciones de finanzas personales.
