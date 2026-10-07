import { randomUUID } from 'node:crypto';
import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { materials, projects } from '../../db/schema.ts';
import { endpoint, fail, optionalText, positiveQuantity, requiredText } from './helpers.js';

function materialValues(data, projectId) {
  return {
    id: randomUUID(),
    projectId,
    name: requiredText(data?.name, 'Material name'),
    quantity: positiveQuantity(data?.quantity),
    category: optionalText(data?.category, 'Category'),
    notes: optionalText(data?.notes, 'Notes')
  };
}

async function requireProject(projectId) {
  const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.id, projectId));
  if (!project) fail(404, 'Project not found');
}

export const getMaterials = endpoint(async (req, res) => {
  await requireProject(req.params.id);
  res.json(await db.select().from(materials).where(eq(materials.projectId, req.params.id))
    .orderBy(asc(materials.collected), asc(materials.category), asc(materials.name)));
});

export const createMaterial = endpoint(async (req, res) => {
  const projectId = requiredText(req.body?.projectId, 'Project ID');
  const values = materialValues(req.body, projectId);
  await requireProject(projectId);
  const [material] = await db.insert(materials).values(values).returning();
  res.status(201).json(material);
});

export const updateMaterial = endpoint(async (req, res) => {
  const body = req.body || {};
  const updates = {};
  if ('name' in body) updates.name = requiredText(body.name, 'Material name');
  if ('quantity' in body) updates.quantity = positiveQuantity(body.quantity);
  if ('category' in body) updates.category = optionalText(body.category, 'Category');
  if ('notes' in body) updates.notes = optionalText(body.notes, 'Notes');
  if ('collected' in body) {
    if (typeof body.collected !== 'boolean') fail(400, 'Collected must be a boolean');
    updates.collected = body.collected;
  }
  if (!Object.keys(updates).length) fail(400, 'No material updates provided');
  const [material] = await db.update(materials).set(updates).where(eq(materials.id, req.params.id)).returning();
  if (!material) fail(404, 'Material not found');
  res.json(material);
});

export const deleteMaterial = endpoint(async (req, res) => {
  const deleted = await db.delete(materials).where(eq(materials.id, req.params.id)).returning({ id: materials.id });
  if (!deleted.length) fail(404, 'Material not found');
  res.status(204).send();
});

export const bulkCreateMaterials = endpoint(async (req, res) => {
  const projectId = requiredText(req.body?.projectId, 'Project ID');
  if (!Array.isArray(req.body?.materials)) fail(400, 'Materials must be a list');
  const values = req.body.materials.map(material => materialValues(material, projectId));
  await requireProject(projectId);
  if (values.length) await db.insert(materials).values(values);
  res.status(201).json(await db.select().from(materials).where(eq(materials.projectId, projectId)));
});
