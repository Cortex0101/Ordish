import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { waitForDatabase } from './utils/databaseHealth.js';
import { initializeDatabase } from './db.js';
import { log, initializeFileLogging } from './utils/logger.js';
import { httpLogger, errorLogger } from './middleware/httpLogger.js';
import passport, { initializePassport } from './config/passport.js';

async function startServer() {
  // Load environment variables FIRST
  dotenv.config();
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  dotenv.config({ path: envFile });

  // Initialize file logging AFTER environment variables are loaded
  initializeFileLogging();

  log.info('Server startup initiated', {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT || 3001
  });

  // Initialize Passport configuration AFTER environment variables are loaded
  initializePassport();

  // Initialize database pool AFTER environment variables are loaded
  initializeDatabase();

  const app = express();
  const PORT = process.env.PORT || 3001;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Get the directory name for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Wait for database to be ready before starting the server
  log.info('Checking database health...');
  try {
    await waitForDatabase();
    log.info('Database health check passed');
  } catch (error) {
    log.error('Database health check failed', error, {
      suggestion: 'Make sure MariaDB is running and the database is initialized'
    });
    process.exit(1);
  }

  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());
  
  // Session middleware for OAuth
  app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Add HTTP logging middleware
  app.use(httpLogger);

  // Import routes AFTER loading environment variables using dynamic imports
  const homeRoutes = (await import('./routes/home.js')).default;
  const loginRoutes = (await import('./routes/login.js')).default;
  const authRoutes = (await import('./routes/auth.js')).default;
  const aboutRoutes = (await import('./routes/about.js')).default;
  const spellingBeeRoutes = (await import('./routes/spellingBee.js')).default;

  app.use('/api/home', homeRoutes);
  app.use('/api/login', loginRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/about', aboutRoutes);
  app.use('/api/spelling-bee', spellingBeeRoutes);

app.use((err: Error, req: Request, res: Response, _next: any) => {
  log.apiError('Unhandled application error', err, req);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve static files from the React app build directory
if (NODE_ENV === 'production') {
  // In production, serve the built React app
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  log.info('Serving static files from React build', { path: clientBuildPath });
}

// Routes
app.get('/api/test', (_req: Request, res: Response) => {
  log.info('Test endpoint accessed');
  res.json({ 
    message: "Server works!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Add error logging middleware before other error handlers
app.use(errorLogger);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  log.error('Global error handler caught error', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  if (NODE_ENV === 'production') {
    // In production, serve index.html for any unmatched routes (SPA routing)
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  } else {
    // In development, return 404 JSON
    log.warn('404 - Route not found', { 
      url: req.originalUrl, 
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip 
    });
    res.status(404).json({ error: 'Route not found' });
  }
});

  app.listen(PORT, () => {
    if (NODE_ENV === 'production') {
      log.info('Server started in production mode', { 
        port: PORT, 
        url: `http://localhost:${PORT}`,
        message: 'Serving React app'
      });
    } else {
      log.info('Server started in development mode', { 
        port: PORT, 
        message: 'React dev server should run on port 5173'
      });
    }
  });
}

// Start the server
startServer().catch((error) => {
  log.error('Failed to start server', error);
  process.exit(1);
});
