import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { waitForDatabase } from './utils/databaseHealth.js';
import { initializeDatabase } from './db.js';

async function startServer() {
  // Load environment variables FIRST
  dotenv.config();
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  dotenv.config({ path: envFile });

  console.log('🔧 Environment loaded:', {
    NODE_ENV: process.env.NODE_ENV,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME
  });

  // Initialize database pool AFTER environment variables are loaded
  initializeDatabase();

  const app = express();
  const PORT = process.env.PORT || 3001;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  // Get the directory name for ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Wait for database to be ready before starting the server
  console.log('🔍 Checking database health...');
  try {
    await waitForDatabase();
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    console.error('💡 Make sure MariaDB is running and the database is initialized');
    process.exit(1);
  }

  // Middleware
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Import routes AFTER loading environment variables using dynamic imports
  const homeRoutes = (await import('./routes/home.js')).default;
  const loginRoutes = (await import('./routes/login.js')).default;
  const authRoutes = (await import('./routes/auth.js')).default;
  const aboutRoutes = (await import('./routes/about.js')).default;

  app.use('/api/home', homeRoutes);
  app.use('/api/login', loginRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/about', aboutRoutes);

app.use((err: Error, req: Request, res: Response, _next: any) => {
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    query: req.query,
  });
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve static files from the React app build directory
if (NODE_ENV === 'production') {
  // In production, serve the built React app
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
}

// Routes
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ 
    message: "Server works!", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  if (NODE_ENV === 'production') {
    // In production, serve index.html for any unmatched routes (SPA routing)
    const clientBuildPath = path.join(__dirname, '../../client/dist');
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  } else {
    // In development, return 404 JSON
    res.status(404).json({ error: 'Route not found' });
  }
});

  app.listen(PORT, () => {
    if (NODE_ENV === 'production') {
      console.log(`🌐 Serving React app from http://localhost:${PORT}`);
    } else {
      console.log(`🔧 Development mode - React dev server should run on port 5173`);
    }
  });
}

// Start the server
startServer().catch(console.error);
