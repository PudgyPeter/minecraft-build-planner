# Netlify Deployment

This project deploys its React frontend as static files and its Express API as a Netlify Function. It does not require a continuously running server or a local SQLite file.

## Deployment settings

The repository's `netlify.toml` configures the build command, publishes `client/dist`, routes `/api/*` to the API function, and serves `index.html` for frontend navigation. Keep the build base at the repository root so both the frontend and backend dependencies are installed. The committed root and client lockfiles support reproducible installation.

## Database

Projects, materials, templates, and backup snapshots are stored in Netlify Database using Drizzle ORM. Netlify configures the connection automatically. The database schema is defined in `db/schema.ts`; generated migrations in `netlify/database/migrations` are applied during deployment.

After changing the schema, check migration status and generate a named migration:

```bash
netlify db status
npm run db:generate -- --name add_planner_field
```

The legacy Prisma schema and SQL files are historical SQLite definitions, not the active database setup. Existing SQLite files or Git-based backups are not automatically imported into Netlify Database.

## Local development

Install dependencies in both the root and the client, then run Netlify Dev for frontend, API routing, and the managed database connection:

```bash
npm ci
npm --prefix client ci
netlify dev --port 8889
```

Use Node.js 22.18 or later. Open the local site on port 8889 rather than the frontend-only Vite port. Netlify Dev uses a local development database. Database-backed routes need the generated schema migrations applied; migrations for deployed environments are applied automatically during deployment.

## Backups

Project changes are saved directly to the database. **Backup Now** and the save keyboard shortcut create a snapshot in Netlify Database, replacing the previous snapshot. **Restore** replaces projects and templates with the saved snapshot inside a transaction. **Download** exports the current data as JSON. These operations do not write local files, run Git commands, or depend on background timers.

## Troubleshooting

If the homepage returns a 404, verify that the deploy publishes `client/dist` and completed the configured frontend build. If API requests fail, check `/api/health`, the API function logs, and database migration status. Unknown API routes return JSON errors rather than the frontend HTML.
