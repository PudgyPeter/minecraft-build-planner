import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import prisma from '../db/prisma.js';

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, 'minecraft-planner-data.json');
const BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Ensure backup directory exists
async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    console.log('📁 Created backup directory');
  }
}

// Export all data to JSON
async function exportData() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        materials: true
      }
    });

    const templates = await prisma.template.findMany({
      include: {
        materials: true
      }
    });

    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      projects,
      templates
    };

    return backupData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
}

// Save backup to JSON file
async function saveBackup() {
  try {
    await ensureBackupDir();
    const data = await exportData();
    
    // Save current backup
    await fs.writeFile(BACKUP_FILE, JSON.stringify(data, null, 2));
    
    // Also save timestamped backup
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const timestampedFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    await fs.writeFile(timestampedFile, JSON.stringify(data, null, 2));
    
    console.log(`💾 Backup saved: ${data.projects.length} projects, ${data.templates.length} templates`);
    
    // Keep only last 10 timestamped backups
    await cleanupOldBackups();
    
    return data;
  } catch (error) {
    console.error('❌ Error saving backup:', error);
    throw error;
  }
}

// Clean up old backup files (keep only last 10)
async function cleanupOldBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
      .map(f => ({
        name: f,
        path: path.join(BACKUP_DIR, f),
        time: f.split('-').slice(1).join('-').replace('.json', '')
      }))
      .sort((a, b) => b.time.localeCompare(a.time));
    
    // Delete old backups (keep only last 10)
    if (backupFiles.length > 10) {
      for (let i = 10; i < backupFiles.length; i++) {
        await fs.unlink(backupFiles[i].path);
        console.log(`🗑️ Deleted old backup: ${backupFiles[i].name}`);
      }
    }
  } catch (error) {
    console.error('❌ Error cleaning up backups:', error);
  }
}

// Restore data from JSON backup
async function restoreFromBackup() {
  try {
    await ensureBackupDir();
    
    try {
      const backupData = await fs.readFile(BACKUP_FILE, 'utf-8');
      const data = JSON.parse(backupData);
      
      console.log(`🔄 Restoring backup: ${data.projects.length} projects, ${data.templates.length} templates`);
      
      // Clear existing data
      await prisma.material.deleteMany({});
      await prisma.templateMaterial.deleteMany({});
      await prisma.project.deleteMany({});
      await prisma.template.deleteMany({});
      
      // Restore projects
      for (const project of data.projects) {
        await prisma.project.create({
          data: {
            id: project.id,
            name: project.name,
            createdAt: new Date(project.createdAt),
            materials: {
              create: project.materials.map(m => ({
                id: m.id,
                name: m.name,
                quantity: m.quantity,
                category: m.category,
                collected: m.collected
              }))
            }
          }
        });
      }
      
      // Restore templates
      for (const template of data.templates) {
        await prisma.template.create({
          data: {
            id: template.id,
            name: template.name,
            createdAt: new Date(template.createdAt),
            materials: {
              create: template.materials.map(m => ({
                id: m.id,
                name: m.name,
                quantity: m.quantity,
                category: m.category
              }))
            }
          }
        });
      }
      
      console.log('✅ Backup restored successfully');
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📝 No backup file found, starting fresh');
        return null;
      }
      throw error;
    }
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    throw error;
  }
}

// Commit backup to Git
async function commitBackupToGit() {
  try {
    // Check if there are changes to commit
    try {
      execSync('git diff --quiet backups/', { stdio: 'ignore' });
      return; // No changes to commit
    } catch {
      // There are changes, proceed with commit
    }
    
    console.log('📤 Committing backup to Git...');
    
    // Add backup files
    execSync('git add backups/', { stdio: 'inherit' });
    
    // Commit changes
    const timestamp = new Date().toISOString();
    execSync(`git commit -m "📦 Auto backup - ${timestamp}"`, { stdio: 'inherit' });
    
    // Push to remote
    execSync('git push origin main', { stdio: 'inherit' });
    
    console.log('✅ Backup committed and pushed to Git');
  } catch (error) {
    console.error('❌ Error committing to Git:', error.message);
    // Don't throw error, just log it - Git push might fail due to conflicts
  }
}

// Start automatic backup system
let backupInterval;

export function startBackupSystem() {
  console.log('🔄 Starting automatic backup system...');
  
  // Initial backup
  saveBackup().then(() => {
    commitBackupToGit();
  }).catch(console.error);
  
  // Set up interval backups
  backupInterval = setInterval(async () => {
    try {
      await saveBackup();
      await commitBackupToGit();
    } catch (error) {
      console.error('❌ Auto backup failed:', error);
    }
  }, BACKUP_INTERVAL);
  
  console.log(`⏰ Auto backups scheduled every ${BACKUP_INTERVAL / 60000} minutes`);
}

export function stopBackupSystem() {
  if (backupInterval) {
    clearInterval(backupInterval);
    console.log('⏹️ Auto backup system stopped');
  }
}

// Manual backup functions
export async function createManualBackup() {
  const data = await saveBackup();
  await commitBackupToGit();
  return data;
}

export async function restoreManualBackup() {
  return await restoreFromBackup();
}

// API functions for backup endpoints
export async function getBackupStatus() {
  try {
    await ensureBackupDir();
    const stats = await fs.stat(BACKUP_FILE);
    const data = await exportData();
    
    return {
      lastBackup: stats.mtime.toISOString(),
      projectsCount: data.projects.length,
      templatesCount: data.templates.length,
      autoBackupEnabled: !!backupInterval
    };
  } catch (error) {
    return {
      lastBackup: null,
      projectsCount: 0,
      templatesCount: 0,
      autoBackupEnabled: !!backupInterval
    };
  }
}

export async function downloadBackup() {
  const data = await exportData();
  return data;
}
