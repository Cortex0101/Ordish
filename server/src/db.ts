import * as mysql from 'mysql2/promise';

let pool: mysql.Pool;

/**
 * Initialize the database pool with environment variables
 * This must be called after environment variables are loaded
 */
export function initializeDatabase() {
  if (pool) {
    return pool;
  }

  console.log('🔌 Initializing database connection with:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
  });

  pool = mysql.createPool({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

/**
 * Get the database pool (must call initializeDatabase first)
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

export default getPool;