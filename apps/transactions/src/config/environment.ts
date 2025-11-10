export const getDatabaseConfig = () => ({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'dexo',
});

export const getPort = () => parseInt(process.env.TRANSACTION_PORT || '3002');
