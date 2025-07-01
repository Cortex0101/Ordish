import * as mysql from 'mysql2/promise';
import { log } from './utils/logger.js';

let pool: mysql.Pool;

/**
 * Initialize the database pool with environment variables
 * This must be called after environment variables are loaded
 */
export function initializeDatabase() {
  if (pool) {
    return pool;
  }

  log.info('Initializing database connection', {
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
    charset: 'utf8mb4',
    authPlugins: {
      mysql_native_password: () => require('mysql2/lib/auth_plugins').mysql_native_password
    }
  });

  log.info('Database pool created successfully');
  return pool;
}

/**
 * Get the database pool (must call initializeDatabase first)
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    log.error('Attempted to get database pool before initialization');
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return pool;
}

export default getPool;