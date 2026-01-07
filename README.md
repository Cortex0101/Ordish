# Ordish

A modern full-stack web application built with React, TypeScript, Express, and MariaDB. Features include user authentication with OAuth (Google, Facebook, Apple), session management, internationalization support, React Bootstrap UI components, and Docker-based database management.

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
│   │   │   ├── Header/        # Navigation header
│   │   │   └── ThemeToggle/   # Dark/light theme switcher
│   │   ├── pages/             # Page components
│   │   │   ├── home/          # Home page
│   │   │   ├── about/         # About page
│   │   │   ├── login/         # Login and SignUp pages
│   │   │   └── profile/       # Profile and Settings pages
│   │   ├── contexts/          # React contexts (Auth, Theme)
│   │   ├── locales/           # i18n translation files (en, da)
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── App.tsx            # Main React component
│   │   ├── main.tsx           # React entry point
│   │   ├── index.scss         # Global styles with Bootstrap
│   │   └── i18n.ts            # Internationalization config
│   ├── tests/                 # Playwright tests
│   ├── public/                # Static assets (favicon, etc.)
│   ├── dist/                  # Built React app (generated)
│   ├── vite.config.ts         # Vite config with API proxy
│   └── package.json           # Client dependencies
├── server/                    # Express Backend (TypeScript)
│   ├── src/
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic (auth, user management)
│   │   ├── middleware/        # Express middleware
│   │   ├── models/            # Database models
│   │   ├── config/            # Configuration (passport, database)
│   │   ├── utils/             # Utility functions
│   │   ├── assets/            # Server assets (CSV files, etc.)
│   │   ├── index.ts           # Main server file
│   │   └── db.ts              # Database connection pool
│   ├── database/
│   │   ├── init.sql           # Database initialization script
│   │   └── migrations/        # Database migrations
│   ├── scripts/               # Utility scripts (initDb, checkDb)
│   ├── dist/                  # Compiled TypeScript (generated)
│   ├── .env.example           # Example environment variables
│   ├── tsconfig.json          # TypeScript configuration
│   ├── jest.config.cjs        # Jest testing configuration
│   └── package.json           # Server dependencies
├── docker-compose.yml         # MariaDB container setup
├── package.json               # Root scripts and dependencies
├── DEPLOYMENT.md              # Deployment instructions
├── GOOGLE_OAUTH_SETUP.md      # Google OAuth setup guide
└── .gitignore                 # Git ignore rules
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

Create environment file in the `server/` directory based on the example:

**`server/.env.development`** (or copy from `.env.example`):
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=devpassword
DB_NAME=ordish_db_dev

# Session Secret (change in production!)
SESSION_SECRET=your-super-secret-session-key-change-in-production

# OAuth Credentials (optional - see GOOGLE_OAUTH_SETUP.md)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

> **Note**: For OAuth setup, see [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

### 4. Start MariaDB Database
```bash
# Start MariaDB container
docker compose up -d

# Initialize database tables
npm run dev:db:init

# Verify it's running
docker ps
```

## 🚀 Development

### Start Everything at Once
```bash
# Recommended: Starts database, initializes tables, client, and server
npm run dev
```

This command:
1. Starts MariaDB Docker container
2. Initializes database tables if needed
3. Runs React dev server on `http://localhost:5173/`
4. Runs Express API server on `http://localhost:3001/`
5. Automatically stops database when you exit

### Individual Commands
```bash
# Frontend only
npm run dev:client

# Backend only  
npm run dev:server

# Database only
npm run dev:db

# Initialize/reset database tables
npm run dev:db:init

# Check database status
npm run dev:db:check

# Combined frontend + backend (assumes DB already running)
npm run dev:quick
```

### Database Management
```bash
# Start database
docker compose up -d

# Initialize/reset tables to default schema
npm run dev:db:init

# Check database status
npm run dev:db:check

# Stop database
docker compose down

# Reset database (removes all data and volumes)
docker compose down -v
docker compose up -d
npm run dev:db:init

# View database logs
npm run dev:db:logs

# Access MariaDB CLI
docker exec -it ordish-mariadb-1 mariadb -u root -pdevpassword ordish_db_dev
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
npm run dev:db           # Start database
npm run dev:db:init      # Initialize/reset tables
npm run dev:client       # React dev server
npm run dev:server       # Express with debugging enabled
```

## 🧪 Testing

### Client Tests (Playwright)
```bash
# Run all tests
cd client
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Run specific test suite
npm run test:auth

# View test report
npm run test:report
```

### Server Tests (Jest)
```bash
# Run server tests
cd server
npm test
```

## 📚 Available Scripts

### Root Scripts
- `npm run dev` - Start database, initialize tables, client, and server
- `npm run dev:quick` - Start client and server (assumes DB running)
- `npm run dev:db` - Start MariaDB container
- `npm run dev:db:init` - Initialize/reset database tables
- `npm run dev:db:check` - Check database status
- `npm run dev:db:logs` - View database logs
- `npm run build` - Build client and server for production
- `npm start` - Start production server
- `npm run install:all` - Install all dependencies

### Client Scripts (`client/`)
- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build React app for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run Playwright tests
- `npm run test:ui` - Run tests in UI mode

### Server Scripts (`server/`)
- `npm run dev` - Start Express dev server with watch mode
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Start production server
- `npm test` - Run Jest unit tests

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
- **Passport.js** - Authentication middleware
  - Google OAuth 2.0
  - Facebook OAuth
  - Apple OAuth
  - Local strategy (username/password)
- **bcrypt** - Password hashing
- **express-session** - Session management
- **jsonwebtoken** - JWT tokens
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing
- **winston** - Logging
- **Jest** - Unit testing
- **validator** - Input validation

### Database
- **MariaDB 11** - Primary database
- **Docker Compose** - Container orchestration

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple commands
- **tsx** - TypeScript execution
- **Docker** - Database containerization
- **Playwright** - End-to-end testing

## 🔐 Authentication

The application supports multiple authentication methods:

### Local Authentication
- Email/password registration and login
- Password hashing with bcrypt
- Email verification (structure in place)

### OAuth Authentication
- **Google** - Sign in with Google account
- **Facebook** - Sign in with Facebook account
- **Apple** - Sign in with Apple ID

For OAuth setup instructions, see [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)

### Session Management
- Express sessions with secure cookies
- Session persistence in database
- Automatic session cleanup

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

## 💾 Database Schema

The application uses MariaDB with the following main tables:

- **users** - User accounts (email, username, password, avatar)
- **social_accounts** - OAuth provider accounts linked to users
- **user_preferences** - User settings (theme, language, timezone)
- **user_sessions** - Active user sessions

The complete schema is defined in `server/database/init.sql`.

### Database Initialization

The database is automatically initialized when you run:
```bash
npm run dev:db:init
```

This script creates all necessary tables and indexes. To reset the database to a clean state, use:
```bash
docker compose down -v  # Remove all data
docker compose up -d    # Start fresh
npm run dev:db:init     # Recreate tables
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error: Database tables missing**
```bash
# Initialize tables
npm run dev:db:init

# Or reset database completely
docker compose down -v
docker compose up -d
npm run dev:db:init
```

**Error: Port 3306 already in use**
```bash
# Check if another MariaDB is running
netstat -ano | findstr :3306  # Windows
lsof -i :3306                 # Linux/Mac

# Stop Docker container
docker compose down
```

**Error: Cannot connect to database**
```bash
# Check if container is running
docker ps

# View container logs
npm run dev:db:logs

# Restart database
docker compose restart mariadb
```

### Application Issues

**Port conflicts (3000, 3001, 5173)**
```bash
# Windows: Find process using port
netstat -ano | findstr :5173
taskkill /pid <PID> /F

# Linux/Mac: Find and kill process
lsof -i :5173
kill <PID>
```

**Environment variables not loading**
- Ensure `.env.development` exists in `server/` directory
- Restart the server after editing env files
- Verify environment variables are correctly formatted

**OAuth authentication not working**
- See [GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md) for setup instructions
- Verify OAuth credentials in `.env.development`
- Check callback URLs match Google Console configuration

**Build errors**
```bash
# Clear build cache
rm -rf client/dist server/dist

# Reinstall dependencies
npm run install:all
```

## 📄 License

This project is private and not licensed for public use.
