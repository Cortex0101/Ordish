import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = AuthService.verifyJWT(token);
    const user = await AuthService.getUserById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};