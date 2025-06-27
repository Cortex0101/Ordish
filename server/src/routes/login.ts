import { Router } from 'express';
import { getPool } from '../db';
const router = Router();

router.get('/', (_req, res) => {
  // Return wordle game data
  res.json({ word: 'login' });
});

router.get('/api/users', async (_req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    // Log full error details for debugging
    console.error('Database error in /api/users:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;