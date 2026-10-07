import express from 'express';
import { createManualBackup, restoreManualBackup, getBackupStatus, downloadBackup } from '../services/backupService.js';
import { endpoint } from '../controllers/helpers.js';

const router = express.Router();

router.get('/status', endpoint(async (req, res) => {
  res.json(await getBackupStatus());
}));

router.post('/create', endpoint(async (req, res) => {
  const backup = await createManualBackup();
  res.json({
    message: 'Backup saved to Netlify Database',
    backup: { timestamp: backup.timestamp, projectsCount: backup.projects.length, templatesCount: backup.templates.length }
  });
}));

router.post('/restore', endpoint(async (req, res) => {
  const data = await restoreManualBackup();
  res.json({
    message: 'Data restored from backup',
    restored: { timestamp: data.timestamp, projectsCount: data.projects.length, templatesCount: data.templates.length }
  });
}));

router.get('/download', endpoint(async (req, res) => {
  res.setHeader('Content-Disposition', `attachment; filename="minecraft-planner-backup-${new Date().toISOString().split('T')[0]}.json"`);
  res.json(await downloadBackup());
}));

export default router;
