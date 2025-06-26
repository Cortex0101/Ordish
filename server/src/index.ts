import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import homeRoutes from './routes/home';
import loginRoutes from './routes/login';

// Load environment variables
dotenv.config();

const app = express();
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/home', homeRoutes);
app.use('/api/login', loginRoutes);

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
