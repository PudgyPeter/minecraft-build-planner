import express from 'express';
import cors from 'cors';
import { sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { optionalAuth } from './middleware/auth.js';
import projectRoutes from './routes/projects.js';
import materialRoutes from './routes/materials.js';
import templateRoutes from './routes/templates.js';
import calculatorRoutes from './routes/calculator.js';
import backupRoutes from './routes/backup.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(optionalAuth);

app.get('/api/health', async (req, res, next) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.json({ status: 'healthy', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    next(error);
  }
});

app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/calculate', calculatorRoutes);
app.use('/api/backup', backupRoutes);

app.use((req, res) => res.status(404).json({ error: 'API endpoint not found' }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  const constraintError = ['23503', '23514', '22P02'].includes(error.cause?.code || error.code);
  const status = error.status || (constraintError ? 400 : 500);
  const message = constraintError ? 'The submitted data is invalid or references a missing record.'
    : status < 500 ? error.message : 'Unable to complete the request. Please try again.';
  res.status(status).json({ error: message });
});

export default app;
