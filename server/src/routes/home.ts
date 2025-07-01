import { Router } from 'express';
import { log } from '../utils/logger.js';

const router = Router();

router.get('/', (req, res) => {
  log.debug('Home endpoint accessed', { 
    ip: req.ip, 
    userAgent: req.get('User-Agent') 
  });
  
  // Return wordle game data
  res.json({ word: 'home' });
})

export default router;