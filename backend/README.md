# ChoreNest API Backend

A Node.js/Express API backend for the ChoreNest application, designed for Railway deployment.

## Features

- **Express.js** server with TypeScript
- **Prisma ORM** for database operations
- **PostgreSQL** database (Neon)
- **CORS** configured for frontend domains
- **Health check** endpoint with database connectivity testing
- **Railway** deployment ready

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and other settings
```

### 3. Database Setup
```bash
npm run prisma:generate
npm run prisma:push
```

### 4. Development
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 5. Production Build
```bash
npm run build
npm start
```

## Railway Deployment

### Method 1: Connect GitHub Repository
1. Go to [Railway](https://railway.app)
2. Create new project from GitHub repo
3. Select this backend folder as the root
4. Railway will auto-detect and deploy

### Method 2: Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Environment Variables in Railway
Set these in Railway dashboard:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NODE_ENV`: `production`
- `PORT`: Railway will auto-set this
- `FRONTEND_URL`: Your frontend domain

## API Endpoints

- `GET /` - API info and status
- `GET /api/health` - Health check with database connectivity

## Database Schema

The API uses Prisma with the following main models:
- `users` - User accounts
- `people` - Family members
- `chores` - Chore definitions
- `chore_assignments` - Assigned chores
- `timezones` - Time zones for scheduling

## CORS Configuration

Currently configured to allow:
- `http://localhost:5173` (Vite dev)
- `http://localhost:3000` (React dev)
- `https://chorenest.com` (Production)
- `https://www.chorenest.com` (Production)
- `https://family-chores-frontend.vercel.app` (Vercel)

## Monitoring

The health endpoint (`/api/health`) provides:
- Database connection status
- Response times
- Basic statistics (timezone and user counts)
- Server uptime

Example response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-08-07T12:00:00.000Z",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "responseTime": "45ms",
    "provider": "postgresql",
    "host": "neon"
  },
  "stats": {
    "timezones": 5,
    "users": 2
  }
}
```
