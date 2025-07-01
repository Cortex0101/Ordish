import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { log } from '../utils/logger.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      log.warn('Authentication failed - no token provided', { 
        ip: req.ip, 
        userAgent: req.get('User-Agent'),
        url: req.originalUrl 
      });
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = AuthService.verifyJWT(token);
    const user = await AuthService.getUserById(decoded.id);
    
    if (!user) {
      log.warn('Authentication failed - invalid token (user not found)', { 
        tokenId: decoded.id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl 
      });
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    log.debug('User authenticated successfully', { 
      userId: user.id, 
      username: user.username,
      url: req.originalUrl 
    });
    
    req.user = user;
    return next();
  } catch (error) {
    log.error('Authentication middleware error', error as Error, { 
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl 
    });
    return res.status(401).json({ error: 'Invalid token' });
  }
};