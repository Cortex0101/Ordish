import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import { log } from '../utils/logger.js';

export interface SiteIdRequest extends Request {
  siteId?: string;
  anonymousUserId?: number;
}

/**
 * Middleware to handle site-id cookies for tracking anonymous users
 * - If user has auth_token: they're authenticated, continue normally
 * - If user has site_id cookie: load their anonymous user data
 * - If user has neither: generate new site_id and create anonymous user
 */
export const siteIdMiddleware = async (req: SiteIdRequest, res: Response, next: NextFunction) => {
  try {
    const siteIdCookie = req.cookies.site_id;
    
    // If user is already authenticated via JWT, skip site-id logic
    if (req.cookies.auth_token) {
      log.debug('Authenticated user - skipping site-id middleware', { 
        ip: req.ip,
        url: req.originalUrl 
      });
      return next();
    }

    // User has a site-id cookie, validate it
    if (siteIdCookie) {
      log.debug('Checking existing site-id', { siteId: siteIdCookie });
      
      try {
        const user = await AuthService.getUserBySiteId(siteIdCookie);
        
        if (user) {
          req.siteId = siteIdCookie;
          req.anonymousUserId = user.id;
          
          log.debug('Anonymous user identified by site-id', { 
            userId: user.id, 
            siteId: siteIdCookie 
          });
          
          return next();
        } else {
          // Site-id exists in cookie but user not in database, regenerate
          log.warn('Site-id in cookie but user not found in database', { 
            siteId: siteIdCookie 
          });
          
          const newSiteId = AuthService.generateSiteId();
          const newUser = await AuthService.createAnonymousUser(newSiteId);
          
          res.cookie('site_id', newSiteId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
          });
          
          req.siteId = newSiteId;
          req.anonymousUserId = newUser.id;
          
          log.business('New site-id generated for orphaned cookie', { 
            userId: newUser.id, 
            newSiteId 
          });
          
          return next();
        }
      } catch (error) {
        log.error('Error checking site-id', error as Error, { 
          siteId: siteIdCookie,
          ip: req.ip 
        });
        
        // On error, generate new site-id
        const newSiteId = AuthService.generateSiteId();
        const newUser = await AuthService.createAnonymousUser(newSiteId);
        
        res.cookie('site_id', newSiteId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
        });
        
        req.siteId = newSiteId;
        req.anonymousUserId = newUser.id;
        
        return next();
      }
    } else {
      // No site-id cookie, generate new one and create anonymous user
      log.debug('Generating new site-id for anonymous user', { ip: req.ip });
      
      try {
        const newSiteId = AuthService.generateSiteId();
        const newUser = await AuthService.createAnonymousUser(newSiteId);
        
        res.cookie('site_id', newSiteId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
        });
        
        req.siteId = newSiteId;
        req.anonymousUserId = newUser.id;
        
        log.business('Anonymous user created with site-id', { 
          userId: newUser.id, 
          siteId: newSiteId,
          ip: req.ip 
        });
        
        return next();
      } catch (error) {
        log.error('Error creating anonymous user', error as Error, { 
          ip: req.ip 
        });
        
        // Continue without site-id on error (fail gracefully)
        req.siteId = undefined;
        req.anonymousUserId = undefined;
        return next();
      }
    }
  } catch (error) {
    log.error('Unexpected error in site-id middleware', error as Error, { 
      ip: req.ip 
    });
    
    // Continue without site-id on error (fail gracefully)
    return next();
  }
};
