import { Router } from 'express';
import { log } from '../utils/logger.js';

const router = Router();

router.get('/', (req, res) => {
  log.debug('About endpoint accessed', { 
    ip: req.ip, 
    userAgent: req.get('User-Agent') 
  });
  
  res.json({ word: 'about' });
})

export default router;