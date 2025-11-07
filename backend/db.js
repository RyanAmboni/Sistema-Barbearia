const { Pool } = require('pg');

const buildConfig = () => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'sistema_barbearia',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  };
};

const pool = new Pool(buildConfig());

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
