import { randomUUID } from 'node:crypto';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { projects, materials } from '../../db/schema.ts';
import { endpoint, fail, requiredText } from './helpers.js';

export async function listProjects(database = db) {
  const rows = await database.select().from(projects).orderBy(desc(projects.createdAt));
  if (!rows.length) return [];
  const items = await database.select().from(materials).where(inArray(materials.projectId, rows.map(project => project.id)));
  return rows.map(project => ({ ...project, materials: items.filter(material => material.projectId === project.id) }));
}

export const getProjects = endpoint(async (req, res) => {
  res.json(await listProjects());
});

export const createProject = endpoint(async (req, res) => {
  const name = requiredText(req.body?.name, 'Project name');
  const [project] = await db.insert(projects).values({ id: randomUUID(), name }).returning();
  res.status(201).json({ ...project, materials: [] });
});

export const deleteProject = endpoint(async (req, res) => {
  const deleted = await db.delete(projects).where(eq(projects.id, req.params.id)).returning({ id: projects.id });
  if (!deleted.length) fail(404, 'Project not found');
  res.status(204).send();
});

export const duplicateProject = endpoint(async (req, res) => {
  const duplicate = await db.transaction(async transaction => {
    const [original] = await transaction.select().from(projects).where(eq(projects.id, req.params.id));
    if (!original) fail(404, 'Project not found');
    const items = await transaction.select().from(materials).where(eq(materials.projectId, original.id));
    const [project] = await transaction.insert(projects).values({ id: randomUUID(), name: `${original.name} (Copy)` }).returning();
    const copied = items.length ? await transaction.insert(materials).values(items.map(material => ({
      ...material, id: randomUUID(), projectId: project.id, collected: false
    }))).returning() : [];
    return { ...project, materials: copied };
  });
  res.status(201).json(duplicate);
});
