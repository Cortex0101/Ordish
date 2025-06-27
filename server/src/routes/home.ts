import { Router } from 'express';
const router = Router();

router.get('/', (_req, res) => {
  // Return wordle game data
  res.json({ word: 'home' });
})

export default router;