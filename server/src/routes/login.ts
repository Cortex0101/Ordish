import { Router } from 'express';
import { getPool } from '../db.js';
import { log } from '../utils/logger.js';

const router = Router();

router.get('/', (_req, res) => {
  // Return wordle game data
  res.json({ word: 'login' });
});

router.get('/api/users', async (req, res) => {
  try {
    log.info('Fetching all users', { 
      ip: req.ip, 
      userAgent: req.get('User-Agent') 
    });
    
    const startTime = Date.now();
    const pool = getPool();
    const [rows] = await pool.query('SELECT id, email, username, created_at FROM users');
    const duration = Date.now() - startTime;
    
    log.dbQuery('SELECT id, email, username, created_at FROM users', [], duration);
    log.info('Users fetched successfully', { count: (rows as any[]).length, duration });
    
    res.json(rows);
  } catch (err) {
    log.dbError('Failed to fetch users', err as Error, 'SELECT * FROM users');
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;