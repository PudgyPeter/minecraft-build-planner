import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { backups, materials, projects, templateMaterials, templates } from '../../db/schema.ts';
import { listProjects } from '../controllers/projectController.js';
import { listTemplates } from '../controllers/templateController.js';
import { fail } from '../controllers/helpers.js';

async function exportData(database) {
  return {
    timestamp: new Date().toISOString(),
    projects: await listProjects(database),
    templates: await listTemplates(database)
  };
}

export async function createManualBackup() {
  return db.transaction(async transaction => {
    const data = await exportData(transaction);
    await transaction.insert(backups).values({ id: 'latest', createdAt: new Date(), data })
      .onConflictDoUpdate({ target: backups.id, set: { createdAt: new Date(), data } });
    return data;
  }, { isolationLevel: 'repeatable read' });
}

export async function restoreManualBackup() {
  return db.transaction(async transaction => {
    const [backup] = await transaction.select().from(backups).where(eq(backups.id, 'latest'));
    if (!backup) fail(404, 'No backup found to restore');
    const data = backup.data;
    await transaction.delete(projects);
    await transaction.delete(templates);
    for (const project of data.projects) {
      await transaction.insert(projects).values({ id: project.id, name: project.name, createdAt: new Date(project.createdAt) });
      if (project.materials.length) await transaction.insert(materials).values(project.materials);
    }
    for (const template of data.templates) {
      await transaction.insert(templates).values({ id: template.id, name: template.name, createdAt: new Date(template.createdAt) });
      if (template.materials.length) await transaction.insert(templateMaterials).values(template.materials);
    }
    return data;
  });
}

export async function getBackupStatus() {
  const [projectCount, templateCount, latest] = await Promise.all([
    db.select({ count: sql`count(*)::int` }).from(projects),
    db.select({ count: sql`count(*)::int` }).from(templates),
    db.select({ createdAt: backups.createdAt }).from(backups).orderBy(desc(backups.createdAt)).limit(1)
  ]);
  return {
    projectsCount: projectCount[0].count,
    templatesCount: templateCount[0].count,
    lastBackup: latest[0]?.createdAt || null,
    autoBackupEnabled: false
  };
}

export async function downloadBackup() {
  return db.transaction(exportData, { isolationLevel: 'repeatable read' });
}
