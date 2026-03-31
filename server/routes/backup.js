import express from 'express';
import { 
  createManualBackup, 
  restoreManualBackup, 
  getBackupStatus, 
  downloadBackup 
} from '../services/backupService.js';

const router = express.Router();

// Get backup status
router.get('/status', async (req, res) => {
  try {
    const status = await getBackupStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create manual backup
router.post('/create', async (req, res) => {
  try {
    console.log('📦 Creating manual backup...');
    const backup = await createManualBackup();
    res.json({ 
      message: 'Backup created and committed to Git',
      backup: {
        timestamp: backup.timestamp,
        projectsCount: backup.projects.length,
        templatesCount: backup.templates.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restore from backup
router.post('/restore', async (req, res) => {
  try {
    console.log('🔄 Restoring from backup...');
    const data = await restoreManualBackup();
    
    if (data) {
      res.json({ 
        message: 'Data restored from backup',
        restored: {
          timestamp: data.timestamp,
          projectsCount: data.projects.length,
          templatesCount: data.templates.length
        }
      });
    } else {
      res.json({ message: 'No backup found to restore' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download backup as JSON
router.get('/download', async (req, res) => {
  try {
    const data = await downloadBackup();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="minecraft-planner-backup-${new Date().toISOString().split('T')[0]}.json"`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
