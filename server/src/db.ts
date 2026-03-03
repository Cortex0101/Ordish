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

  const dbHost = process.env.DB_HOST || '127.0.0.1';
  const dbPort = parseInt(process.env.DB_PORT || '3307', 10);
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || 'devpassword';
  const dbName = process.env.DB_NAME || 'ordish_db_dev';

  log.info('Initializing database connection', {
    host: dbHost,
    port: dbPort,
    user: dbUser,
    database: dbName,
  });

  pool = mysql.createPool({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
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