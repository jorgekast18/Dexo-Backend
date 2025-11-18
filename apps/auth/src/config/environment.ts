export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  environment: process.env.ENVIRONMENT,
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
    version: process.env.POSTGRES_VERSION,
  },
  mongodb: {
    uri: process.env.MONGO_URI,
  }
});

export const getJwtSecret = () =>
  process.env.JWT_SECRET || 'SuperSecretKeyChangeMe!';
