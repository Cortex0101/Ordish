import { getPool } from '../db.js';

/**
 * Check if all required tables exist in the database
 */
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; missingTables: string[]; error?: string }> {
  try {
    const pool = getPool();
    const requiredTables = [
      'users',
      'social_accounts', 
      'user_preferences',
      'user_sessions',
      'password_reset_tokens',
      'email_verification_tokens'
    ];

    const missingTables: string[] = [];

    for (const table of requiredTables) {
      try {
        await pool.execute(`SELECT 1 FROM ${table} LIMIT 1`);
      } catch (error: any) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
          missingTables.push(table);
        } else {
          throw error;
        }
      }
    }

    return {
      healthy: missingTables.length === 0,
      missingTables
    };
  } catch (error: any) {
    return {
      healthy: false,
      missingTables: [],
      error: error.message
    };
  }
}

/**
 * Wait for database to be ready and tables to exist
 */
export async function waitForDatabase(maxRetries = 100, retryInterval = 2000): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const health = await checkDatabaseHealth();
      
      if (health.healthy) {
        console.log('✅ Database is healthy and all tables exist');
        return;
      }
      
      if (health.error) {
        console.log(`⏳ Database connection attempt ${i + 1}/${maxRetries}: ${health.error}`);
      } else {
        console.log(`⏳ Database connected but missing tables: ${health.missingTables.join(', ')}`);
      }
    } catch (error: any) {
      console.log(`⏳ Database connection attempt ${i + 1}/${maxRetries}: ${error.message}`);
    }

    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }

  throw new Error('Database health check failed after maximum retries');
}
