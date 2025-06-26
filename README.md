# Ordish

A full-stack web application built with React and Node.js.

## Project Structure

```
ordish/
├── client/          # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Public assets
│   └── package.json # Frontend dependencies
├── server/          # Node.js backend application
│   └── (server files)
├── README.md        # Project documentation
└── .gitignore       # Git ignore rules
```

## Getting Started

### Prerequisites

- Node.js (v18.20.0 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ordish
   ```

2. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

3. Install backend dependencies (when server is set up):
   ```bash
   cd ../server
   npm install
   ```

### Development

1. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

2. Start the backend server (when available):
   ```bash
   cd server
   npm run dev
   ```

The frontend will be available at `http://localhost:5173/`

## Available Scripts

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

### Frontend
- React 19.1.0
- Vite 7.0.0
- ESLint for code linting

### Backend
- Node.js (to be implemented)

## License

This project is private and not licensed for public use.
