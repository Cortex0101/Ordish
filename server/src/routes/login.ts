import { Router } from 'express';
import pool from '../db';
const router = Router();

router.get('/', (req, res) => {
  // Return wordle game data
  res.json({ word: 'login' });
});

router.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;