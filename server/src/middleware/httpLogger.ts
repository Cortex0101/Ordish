import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger.js';

// Extended Request interface to include timing
interface TimedRequest extends Request {
  startTime?: number;
}

// HTTP request logging middleware
export const httpLogger = (req: TimedRequest, res: Response, next: NextFunction) => {
  // Record start time
  req.startTime = Date.now();

  // Get user ID if authenticated
  const userId = (req as any).user?.id;

  // Log incoming request
  log.apiRequest(req.method, req.originalUrl, userId, {
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('User-Agent'),
    contentLength: req.get('Content-Length'),
    referer: req.get('Referer'),
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    // Don't log sensitive data in body
    bodyKeys: req.body && typeof req.body === 'object' ? Object.keys(req.body) : undefined
  });

  // Capture the original end method
  const originalEnd = res.end;

  // Override res.end to log response
  res.end = function(this: Response, chunk?: any, encoding?: any, cb?: any): Response {
    // Calculate duration
    const duration = req.startTime ? Date.now() - req.startTime : undefined;

    // Log response
    log.apiResponse(req.method, req.originalUrl, res.statusCode, duration, {
      contentLength: res.get('Content-Length'),
      userId
    });

    // Log slow requests as warnings
    if (duration && duration > 2000) {
      log.warn('Slow Request Detected', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
        userId
      });
    }

    // Call the original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

// Error logging middleware (should be used after routes)
export const errorLogger = (err: Error, req: Request, _res: Response, next: NextFunction) => {
  // Log the error with full context
  log.apiError('Unhandled route error', err, req);

  // Don't handle the error, just log it and pass to next error handler
  next(err);
};
