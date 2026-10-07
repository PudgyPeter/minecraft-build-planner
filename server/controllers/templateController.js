import { randomUUID } from 'node:crypto';
import { desc, eq, inArray } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { materials, projects, templateMaterials, templates } from '../../db/schema.ts';
import { endpoint, fail, requiredText } from './helpers.js';

export async function listTemplates(database = db) {
  const rows = await database.select().from(templates).orderBy(desc(templates.createdAt));
  if (!rows.length) return [];
  const items = await database.select().from(templateMaterials).where(inArray(templateMaterials.templateId, rows.map(template => template.id)));
  return rows.map(template => ({ ...template, materials: items.filter(material => material.templateId === template.id) }));
}

export const getTemplates = endpoint(async (req, res) => {
  res.json(await listTemplates());
});

export const createTemplate = endpoint(async (req, res) => {
  const name = requiredText(req.body?.name, 'Template name');
  const projectId = requiredText(req.body?.projectId, 'Project ID');
  const template = await db.transaction(async transaction => {
    const [project] = await transaction.select().from(projects).where(eq(projects.id, projectId));
    if (!project) fail(404, 'Project not found');
    const items = await transaction.select().from(materials).where(eq(materials.projectId, projectId));
    const [created] = await transaction.insert(templates).values({ id: randomUUID(), name }).returning();
    const copied = items.length ? await transaction.insert(templateMaterials).values(items.map(material => ({
      id: randomUUID(), templateId: created.id, name: material.name,
      quantity: material.quantity, category: material.category
    }))).returning() : [];
    return { ...created, materials: copied };
  });
  res.status(201).json(template);
});

export const applyTemplate = endpoint(async (req, res) => {
  const projectId = requiredText(req.body?.projectId, 'Project ID');
  const project = await db.transaction(async transaction => {
    const [template] = await transaction.select().from(templates).where(eq(templates.id, req.params.id));
    if (!template) fail(404, 'Template not found');
    const [target] = await transaction.select().from(projects).where(eq(projects.id, projectId));
    if (!target) fail(404, 'Project not found');
    const items = await transaction.select().from(templateMaterials).where(eq(templateMaterials.templateId, template.id));
    if (items.length) await transaction.insert(materials).values(items.map(material => ({
      id: randomUUID(), projectId, name: material.name, quantity: material.quantity, category: material.category
    })));
    return { ...target, materials: await transaction.select().from(materials).where(eq(materials.projectId, projectId)) };
  });
  res.json(project);
});

export const deleteTemplate = endpoint(async (req, res) => {
  const deleted = await db.delete(templates).where(eq(templates.id, req.params.id)).returning({ id: templates.id });
  if (!deleted.length) fail(404, 'Template not found');
  res.status(204).send();
});
