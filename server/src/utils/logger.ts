import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

// Define log directory
const logDir = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(colors);

// Custom format for console output with colors and detailed info
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf(
    (info) => {
      const { timestamp, level, message, stack, ...meta } = info;
      
      let logMessage = `${timestamp} [${level}]: ${message}`;
      
      // Add stack trace for errors
      if (stack) {
        logMessage += `\n${stack}`;
      }
      
      // Add metadata if present
      if (Object.keys(meta).length > 0) {
        logMessage += `\nMetadata: ${JSON.stringify(meta, null, 2)}`;
      }
      
      return logMessage;
    }
  )
);

// Custom format for file output (no colors but with full details)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Create transports array
const transports: winston.transport[] = [
  // Console transport for development
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: consoleFormat,
  }),
];

// Function to initialize file transports after environment variables are loaded
export function initializeFileLogging() {
  // Check if file transports are already added
  const hasFileTransports = transports.some(t => t instanceof DailyRotateFile);
  if (hasFileTransports) {
    return; // Already initialized
  }

  // Add file transports only in production or when LOG_TO_FILE is set
  if (process.env.NODE_ENV === 'production' || process.env.LOG_TO_FILE === 'true') {
    console.log('🔧 Adding file transports to Winston logger');
    console.log('Log directory:', logDir);
    
    // Daily rotate file for all logs
    const allLogsTransport = new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
      level: 'debug',
    });

    // Daily rotate file for error logs only
    const errorLogsTransport = new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
      level: 'error',
    });

    // Daily rotate file for HTTP requests
    const httpLogsTransport = new DailyRotateFile({
      filename: path.join(logDir, 'http-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      format: fileFormat,
      level: 'http',
    });

    // Add transports to logger
    logger.add(allLogsTransport);
    logger.add(errorLogsTransport);
    logger.add(httpLogsTransport);
    
    console.log('✅ File transports added. Total transports:', logger.transports.length);
    
    // Log a test message to verify file logging
    logger.info('File logging initialized', {
      NODE_ENV: process.env.NODE_ENV,
      LOG_TO_FILE: process.env.LOG_TO_FILE,
      logDirectory: logDir
    });
  } else {
    console.log('📝 File logging disabled. Only console logging enabled.');
  }
}

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  transports,
  exitOnError: false, // Don't exit on handled exceptions
  // Handle uncaught exceptions and rejections
  exceptionHandlers: process.env.NODE_ENV === 'production' ? [
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    })
  ] : [
    // In development, also log exceptions to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
  rejectionHandlers: process.env.NODE_ENV === 'production' ? [
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: fileFormat,
    })
  ] : [
    // In development, also log rejections to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

console.log('🚀 Winston logger created with', transports.length, 'transports');
console.log('📊 Logger level:', logger.level);
console.log('🎯 Transports:', transports.map(t => t.constructor.name));

// Enhanced logging methods with context
class Logger {
  private static instance: Logger;
  private winston: winston.Logger;

  private constructor() {
    this.winston = logger;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Standard logging methods
  error(message: string, error?: Error | any, meta?: object) {
    this.winston.error(message, { error, ...meta });
  }

  warn(message: string, meta?: object) {
    this.winston.warn(message, meta);
  }

  info(message: string, meta?: object) {
    this.winston.info(message, meta);
  }

  http(message: string, meta?: object) {
    this.winston.http(message, meta);
  }

  debug(message: string, meta?: object) {
    this.winston.debug(message, meta);
  }

  // Database operation logging
  dbQuery(query: string, params?: any[], duration?: number) {
    this.winston.debug('Database Query', {
      query: query.replace(/\s+/g, ' ').trim(),
      params,
      duration: duration ? `${duration}ms` : undefined,
      type: 'database'
    });
  }

  dbError(message: string, error: Error, query?: string, params?: any[]) {
    this.winston.error(`Database Error: ${message}`, {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      query: query?.replace(/\s+/g, ' ').trim(),
      params,
      type: 'database'
    });
  }

  // API request/response logging
  apiRequest(method: string, url: string, userId?: number, meta?: object) {
    this.winston.http('API Request', {
      method,
      url,
      userId,
      type: 'api_request',
      ...meta
    });
  }

  apiResponse(method: string, url: string, statusCode: number, duration?: number, meta?: object) {
    this.winston.http('API Response', {
      method,
      url,
      statusCode,
      duration: duration ? `${duration}ms` : undefined,
      type: 'api_response',
      ...meta
    });
  }

  apiError(message: string, error: Error, req?: any) {
    this.winston.error(`API Error: ${message}`, {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      request: req ? {
        method: req.method,
        url: req.originalUrl || req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection?.remoteAddress,
        userId: req.user?.id
      } : undefined,
      type: 'api_error'
    });
  }

  // Authentication logging
  authAttempt(email: string, success: boolean, ip?: string, userAgent?: string) {
    const level = success ? 'info' : 'warn';
    this.winston[level](`Authentication ${success ? 'Success' : 'Failed'}`, {
      email,
      success,
      ip,
      userAgent,
      type: 'authentication'
    });
  }

  // Security logging
  securityEvent(event: string, details: object, severity: 'low' | 'medium' | 'high' = 'medium') {
    this.winston.warn(`Security Event: ${event}`, {
      severity,
      type: 'security',
      ...details
    });
  }

  // Performance logging
  performance(operation: string, duration: number, meta?: object) {
    const level = duration > 1000 ? 'warn' : 'debug';
    this.winston[level](`Performance: ${operation}`, {
      duration: `${duration}ms`,
      type: 'performance',
      slow: duration > 1000,
      ...meta
    });
  }

  // Business logic logging
  business(event: string, meta?: object) {
    this.winston.info(`Business Event: ${event}`, {
      type: 'business',
      ...meta
    });
  }
}

// Export singleton instance
export const log = Logger.getInstance();

// Test log entry to verify file logging is working
log.info('Logger initialized successfully', {
  NODE_ENV: process.env.NODE_ENV,
  LOG_TO_FILE: process.env.LOG_TO_FILE,
  transportsCount: transports.length,
  logDirectory: logDir
});

// Export winston logger for direct access if needed
export { logger as winstonLogger };

// Export types for better TypeScript support
export type LogLevel = keyof typeof levels;
export type LogMeta = Record<string, any>;
