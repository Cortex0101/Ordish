import { Router } from 'express';
import { getPool } from '../db.js';
import { log } from '../utils/logger.js';

const router = Router();

router.get('/', (_req, res) => {
  // Return wordle game data
  res.json({ word: 'spelling-bee' });
});

export default router;