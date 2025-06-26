# Deployment Guide - Ordish Full Stack App

## 🚀 Current Setup

Your application is now configured to serve the React client from the Express server in production, while maintaining separate development servers for optimal development experience.

## 📁 Project Structure
```
ordish/
├── client/              # React Frontend (TypeScript + Vite)
│   ├── src/
│   │   ├── App.tsx      # Main React component with API integration
│   │   └── main.tsx     # React entry point
│   ├── dist/            # Built React app (generated)
│   ├── vite.config.ts   # Vite config with API proxy
│   └── package.json     # Client dependencies
├── server/              # Express Backend (TypeScript)
│   ├── src/
│   │   └── index.ts     # Main server file with static serving
│   ├── dist/            # Compiled TypeScript (generated)
│   ├── tsconfig.json    # TypeScript configuration
│   └── package.json     # Server dependencies
├── package.json         # Root package.json with concurrently
├── .env.example         # Environment variables template
└── .gitignore           # Git ignore rules
```

## 🛠 Development Workflow

### Start Development (Both servers)
```bash
npm run dev
```
This runs:
- React dev server on `http://localhost:5173/`
- Express API server on `http://localhost:3001/`
- API calls are proxied from client to server

### Individual Development Servers
```bash
# Frontend only
npm run dev:client

# Backend only  
npm run dev:server
```

## 🌐 Production Deployment

### 1. Build for Production
```bash
npm run build
```
This will:
1. Build the React app (`client/dist/`)
2. Compile TypeScript server (`server/dist/`)

### 2. Deploy to VPS

#### Option A: Simple Node.js Deployment
```bash
# On your VPS
git clone <your-repo>
cd ordish
npm run install:all
npm run build
npm start
```

#### Option B: PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
cd ordish
npm run build
pm2 start server/dist/index.js --name "ordish-app"
pm2 startup
pm2 save
```

### 3. Environment Variables
Create `.env` file in the server directory:
```bash
NODE_ENV=production
PORT=3001
# Add your production secrets here
```

### 4. Nginx Reverse Proxy (Recommended)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔒 Security for Production

1. **Environment Variables**: Never commit `.env` files
2. **Secrets Management**: Use environment variables for:
   - Database credentials
   - API keys
   - JWT secrets
   - SSL certificates

3. **HTTPS**: Enable SSL/TLS in production
4. **Firewall**: Configure firewall rules
5. **Updates**: Keep dependencies updated

## 📊 Available Endpoints

### Development
- Frontend: `http://localhost:5173/`
- API Test: `http://localhost:5173/api/test` (proxied)
- Health Check: `http://localhost:5173/health` (proxied)

### Production
- Application: `http://localhost:3001/`
- API Test: `http://localhost:3001/api/test`
- Health Check: `http://localhost:3001/health`

## 🎯 Next Steps

1. **Database Integration**: Add MongoDB/PostgreSQL
2. **Authentication**: Implement JWT authentication
3. **API Routes**: Add more API endpoints
4. **State Management**: Add Redux/Zustand if needed
5. **Testing**: Add unit and integration tests
6. **CI/CD**: Set up GitHub Actions for deployment

## 🐛 Troubleshooting

### Development Issues
- **CORS errors**: Check Vite proxy configuration
- **API not found**: Ensure server is running on port 3001
- **Build errors**: Check TypeScript compilation

### Production Issues
- **404 on refresh**: Ensure catch-all route serves index.html
- **API calls fail**: Check environment variables
- **Static files not served**: Verify build output paths
