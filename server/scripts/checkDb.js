/**
 * Simple script to check database connection and table existence
 * Run with: node server/scripts/checkDb.js
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.development') });

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'devuser',
  password: process.env.DB_PASSWORD || 'devpassword',
  database: process.env.DB_NAME || 'ordish_db_dev',
};

async function checkDatabase() {
  let connection;
  
  try {
    console.log('🔍 Connecting to database...');
    console.log('Config:', { ...config, password: '***' });
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database successfully');
    
    // Check if database exists
    const [databases] = await connection.query(
      `SHOW DATABASES LIKE '${config.database}'`
    );
    
    if (databases.length === 0) {
      console.log(`❌ Database '${config.database}' does not exist`);
      return;
    }
    
    console.log(`✅ Database '${config.database}' exists`);
    
    // Check tables
    const [tables] = await connection.query("SHOW TABLES");
    console.log(`📊 Found ${tables.length} tables:`);
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database');
      console.log('💡 The init.sql script may not have run properly');
      return;
    }
    
    for (const table of tables) {
      const tableName = table[`Tables_in_${config.database}`];
      console.log(`  - ${tableName}`);
      
      // Check table structure
      const [rows] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``);
      console.log(`    (${rows[0].count} rows)`);
    }
    
    console.log('✅ Database check completed successfully');
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure MariaDB container is running: npm run dev:db');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Check database credentials in .env.development');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Database may still be initializing. Wait a moment and try again.');
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkDatabase();
