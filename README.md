# Ordish

A modern full-stack web application built with React, TypeScript, Express, and MariaDB. Features include internationalization support, React Bootstrap UI components, and Docker-based database management.

## 🚀 Quick Start

```bash
# Clone and install all dependencies
git clone <repository-url>
cd ordish
npm run install:all

# Start MariaDB with Docker and run dev servers
npm run dev:all
```

## 📁 Project Structure

```
ordish/
├── client/                    # React Frontend (TypeScript + Vite)
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components (Home, Login, Wordle)
│   │   ├── locales/          # i18n translation files
│   │   ├── assets/           # Images, fonts, etc.
│   │   ├── App.tsx           # Main React component
│   │   ├── main.tsx          # React entry point
│   │   ├── index.scss        # Global styles with Bootstrap
│   │   └── i18n.ts           # Internationalization config
│   ├── public/               # Static assets (favicon, etc.)
│   ├── dist/                 # Built React app (generated)
│   ├── vite.config.ts        # Vite config with API proxy
│   └── package.json          # Client dependencies
├── server/                    # Express Backend (TypeScript)
│   ├── src/
│   │   ├── routes/           # API route handlers
│   │   ├── WordleCruncher/   # Wordle game logic
│   │   ├── benchmarks/       # Performance benchmarks
│   │   ├── index.ts          # Main server file
│   │   └── db.ts             # Database connection pool
│   ├── dist/                 # Compiled TypeScript (generated)
│   ├── .env.development      # Development environment variables
│   ├── .env.production       # Production environment variables
│   ├── tsconfig.json         # TypeScript configuration
│   ├── jest.config.cjs       # Jest testing configuration
│   └── package.json          # Server dependencies
├── docker-compose.yml         # MariaDB container setup
├── package.json              # Root scripts and dependencies
├── DEPLOYMENT.md             # Deployment instructions
└── .gitignore                # Git ignore rules
```

## 🛠 Prerequisites

- **Node.js** (v24.2.0 or higher)
- **npm** (latest)
- **Docker** and **Docker Compose** (for database)
- **Git**

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ordish
```

### 2. Install All Dependencies
```bash
# Install root, client, and server dependencies
npm run install:all
```

This installs:
- Root dependencies (`concurrently`, `cross-env`)
- Client dependencies (React, Bootstrap, i18next, etc.)
- Server dependencies (Express, mysql2, dotenv, etc.)

### 3. Setup Environment Variables

Create environment files in the `server/` directory:

**`.env.development`:**
```bash
# Server development Configuration
PORT=3001

# Database
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=devpassword
DB_NAME=woordle_db_dev
```

### 4. Start MariaDB Database
```bash
# Start MariaDB container
docker compose up -d

# Verify it's running
docker ps
```

## 🚀 Development

### Start Everything at Once
```bash
# Starts database, client, and server
npm run dev:all
```

This command:
1. Starts MariaDB Docker container
2. Runs React dev server on `http://localhost:5173/`
3. Runs Express API server on `http://localhost:3001/`
4. Automatically stops database when you exit

### Individual Commands
```bash
# Frontend only
npm run dev:client

# Backend only  
npm run dev:server

# Database only
npm run dev:db

# Combined frontend + backend (no DB)
npm run dev
```

### Database Management
```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Reset database (removes all data)
docker compose down -v
docker compose up -d

# Access MariaDB CLI
docker exec -it <container_name> mariadb -u root -p
```

## 🔧 Build Process

### Development Build
```bash
# Build client only
npm run build:client

# Build server only
npm run build:server

# Build everything
npm run build
```

### Production Build
```bash
# Full production build
npm run build

# Start production server
npm start
```

## 🐛 Debugging

### VS Code Debug Setup

The project includes VS Code debug configurations for full-stack debugging:

1. **Debug Full Stack**: Starts database, client, and server with debugging enabled
2. **Debug Server Only**: Debugs just the Express server

#### How to Debug:
1. Open VS Code Debug Panel (`Ctrl+Shift+D`)
2. Select "Debug Full Stack" from dropdown
3. Press `F5` to start debugging
4. Set breakpoints in any server TypeScript files
5. Make API requests from React app to hit breakpoints

#### Debug Features:
- **Breakpoints**: Set in routes, services, middleware
- **Watch Variables**: Monitor values in real-time
- **Call Stack**: See full execution path
- **Hot Reload**: Server restarts on changes while maintaining debug session

### Manual Debug Commands
```bash
# Start individual components for debugging
npm run dev:db           # Database only
npm run dev:db:init      # reinitialize tables to default values
npm run dev:client       # React dev server
npm run dev:server       # Express with debugging enabled

# normal flow
npm run dev:db           # Database only
npm run dev:db:init      # reinitialize tables to default values
npm run dev:all
```

## 🧪 Testing & Benchmarking

### Unit Tests
```bash
# Run server tests
cd server
npm test

# Run client tests (when available)
cd client
npm test
```

### Performance Benchmarks
```bash
# Run all server benchmarks
cd server
npm run bench
```

## 📚 Available Scripts

### Root Scripts
- `npm run dev` - Start client and server dev mode
- `npm run dev:all` - Start database, client, and server
- `npm run dev:db` - Start MariaDB container
- `npm run build` - Build client and server for production
- `npm run start` - Start production server
- `npm run install:all` - Install all dependencies

### Client Scripts (`client/`)
- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build React app for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Scripts (`server/`)
- `npm run dev` - Start Express dev server with watch mode
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run test` - Run Jest unit tests
- `npm run bench` - Run performance benchmarks

## 🌐 Technology Stack

### Frontend
- **React 19.1.0** - UI framework
- **TypeScript** - Type safety
- **Vite 7.0.0** - Build tool and dev server
- **React Bootstrap 2.10.10** - UI components
- **Bootstrap 5.3.7** - CSS framework
- **SCSS** - Styling with variables and nesting
- **react-i18next** - Internationalization
- **react-router-dom** - Client-side routing

### Backend
- **Node.js 24.2.0** - Runtime
- **Express 4.21.2** - Web framework
- **TypeScript** - Type safety
- **mysql2** - MariaDB/MySQL client
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **Jest** - Unit testing
- **Benchmark.js** - Performance testing

### Database
- **MariaDB 11** - Primary database
- **Docker Compose** - Container orchestration

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **tsx** - TypeScript execution
- **Docker** - Database containerization

## 🌍 Internationalization

The app supports multiple languages using `react-i18next`:

```typescript
// Usage in components
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('common');
  return <h1>{t('welcome')}</h1>;
}
```

Translation files are organized by namespace:
- `client/src/locales/en/common.json`
- `client/src/locales/da/common.json`
- `client/src/locales/en/login.json`

## 🎯 API Endpoints

### Development
- Frontend: `http://localhost:5173/`
- API Base: `http://localhost:5173/api/` (proxied to 3001)
- Test Endpoint: `http://localhost:5173/api/test`

### Production
- Application: `http://localhost:3000/`
- API Base: `http://localhost:3000/api/`
- Test Endpoint: `http://localhost:3000/api/test`

## Database

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for social logins
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE social_accounts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  provider ENUM('google', 'apple', 'facebook') NOT NULL,
  provider_id VARCHAR(255) NOT NULL, -- ID from the social provider
  provider_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider_account (provider, provider_id)
);

CREATE TABLE user_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  theme ENUM('light', 'dark', 'auto') DEFAULT 'auto',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token_hash (token_hash),
  INDEX idx_expires_at (expires_at)
);

## 🐛 Troubleshooting

### Common Issues

**Database tables missing (shows "Database connected but missing tables"):**
```bash
# The init.sql script doesn't run if the Docker volume already exists
# Solution: Manually create tables
Get-Content server/database/init.sql | docker exec -i ordish-mariadb-1 mariadb -u root -pdevpassword ordish_db_dev

# OR reset database completely (removes all data)
docker compose down -v
docker compose up -d
```

**Authentication method failures:**
```bash
# Check if another MariaDB instance is running
netstat -ano | findstr :3306

# Kill conflicting process
taskkill /pid <PID> /F

# Restart with clean database
docker compose down -v
docker compose up -d
```

**Port conflicts:**
```bash
# Check what's using a port
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Kill process by PID
Stop-Process -Id <PID> -Force
```

**Database connection errors:**
```bash
# Ensure MariaDB is running
docker ps

# Check container logs
docker logs ordish-mariadb-1

# Test connection manually
docker exec -it ordish-mariadb-1 mariadb -u root -pdevpassword ordish_db_dev

# Reset database (removes all data)
docker compose down -v && docker compose up -d
```

**Environment variables not loading:**
- Ensure `.env.development` exists in `server/` directory
- Restart the server after editing env files
- Check that dynamic imports are used in server startup

**Debug mode not hitting breakpoints:**
- Ensure you're using "Debug Full Stack" configuration
- Set breakpoints in server TypeScript files (not compiled JS)
- Make sure the request actually reaches your breakpoint code path

**Build errors:**
```bash
# Clear build cache
rm -rf client/dist server/dist

# Reinstall dependencies
npm run install:all
```

## 📄 License

This project is private and not licensed for public use.

## Known issues
If starting the database fails with (authententicaiton method xxxxx failed), a different 
mariadb might be runnning

1. Run netstat -ano -p tcp
2. See if anything is running on port 3000/3006, if so do taskkill /pid xyxy /F    