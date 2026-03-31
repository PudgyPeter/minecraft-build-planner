# 🚂 Minecraft Build Planner

A full-stack web app for planning Minecraft builds, tracking materials, and calculating crafting requirements.

## Features

- 📋 Create and manage build projects
- ✅ Track material checklists with progress
- 🧮 Recursive crafting calculator
- 📦 Reusable templates
- 🌙 Dark mode UI
- 🚂 Railway-ready deployment

## Tech Stack

- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (production), SQLite (development)
- **Frontend**: React, Vite, TailwindCSS

## Local Development

1. Install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

2. Set up environment:
```bash
cp .env.example .env
```

3. Initialize database:
```bash
npx prisma migrate dev
```

4. Start development server:
```bash
npm run dev
```

5. In another terminal, start the client:
```bash
cd client && npm run dev
```

## Production Build

```bash
cd client && npm run build && cd ..
npm start
```

## Railway Deployment

1. Connect your GitHub repository to Railway
2. Add PostgreSQL database service
3. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `NODE_ENV=production`
   - `ACCESS_PASSWORD` (optional)
4. Deploy!

## Environment Variables

- `DATABASE_URL`: Database connection string
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `ACCESS_PASSWORD`: Optional password protection
