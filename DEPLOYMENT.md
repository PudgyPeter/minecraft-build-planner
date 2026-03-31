# Railway Deployment Guide

## Prerequisites

- GitHub account
- Railway account (https://railway.app)
- PostgreSQL database (provided by Railway)

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Minecraft Build Planner"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect the configuration

### 3. Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will automatically set `DATABASE_URL` environment variable

### 4. Configure Environment Variables

In Railway project settings, add these variables:

- `NODE_ENV` = `production`
- `DATABASE_URL` = (auto-set by Railway PostgreSQL)
- `PORT` = (auto-set by Railway)
- `ACCESS_PASSWORD` = (optional - set if you want password protection)

### 5. Deploy

Railway will automatically:
- Install dependencies
- Generate Prisma client
- Build the React frontend
- Run database migrations
- Start the server

### 6. Run Database Migrations

After first deployment, you may need to run migrations:

1. Go to Railway project
2. Open the service
3. Click "Settings" → "Variables"
4. Add a new variable: `RAILWAY_RUN_BUILD_COMMAND` = `npx prisma migrate deploy`
5. Redeploy

Or use Railway CLI:
```bash
railway run npx prisma migrate deploy
```

## Post-Deployment

Your app will be available at: `https://your-app.up.railway.app`

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL service is running
- Check `DATABASE_URL` is set correctly
- Run `npx prisma migrate deploy` manually

### Build Failures
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Frontend Not Loading
- Ensure `npm run build` completed successfully
- Check that `client/dist` folder exists after build
- Verify Express is serving static files in production mode

## Local Development

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Set up database
cp .env.example .env
# Edit .env with your local database URL
npx prisma migrate dev

# Run development servers
npm run dev  # Backend on port 3000
cd client && npm run dev  # Frontend on port 5173
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | Server port (auto-set by Railway) |
| `NODE_ENV` | Yes | Set to `production` for Railway |
| `ACCESS_PASSWORD` | No | Optional password protection |
