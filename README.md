# Minecraft Build Planner

A full-stack web app for planning Minecraft builds, tracking materials, and calculating crafting requirements.

## Features

- 📋 Create and manage build projects
- ✅ Track material checklists with progress
- 🧮 Recursive crafting calculator
- 📦 Reusable templates
- 🌙 Dark mode UI
- Netlify deployment with persistent project storage

## Tech Stack

- **Backend**: Node.js, Express, Netlify Functions, Drizzle ORM
- **Database**: Netlify Database (managed PostgreSQL)
- **Frontend**: React, Vite, TailwindCSS

## Local Development

Use Node.js 22.18 or later and install dependencies:
```bash
npm ci
npm --prefix client ci
```

Start the frontend and API together with Netlify Dev:
```bash
netlify dev --port 8889
```

Open the site on port 8889. Netlify manages the database connection; database migrations are applied during deployment.

## Netlify Deployment

Connect this repository to Netlify using the repository root as the build base. `netlify.toml` configures the frontend build, publishes `client/dist`, and routes API requests to the backend function. Frontend navigation falls back to `index.html` instead of returning a page-not-found error.

See `DEPLOYMENT.md` for deployment, database migrations, backups, and troubleshooting.

Backups are saved as database snapshots, not committed to Git. Restoring a snapshot replaces the current projects and templates; downloading a backup exports the current data.
