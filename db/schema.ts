import { boolean, check, index, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const materials = pgTable('materials', {
  id: text('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  collected: boolean('collected').notNull().default(false),
  category: text('category'),
  notes: text('notes')
}, (table) => [
  index('materials_project_id_idx').on(table.projectId),
  check('materials_quantity_positive', sql`${table.quantity} > 0`)
]);

export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const templateMaterials = pgTable('template_materials', {
  id: text('id').primaryKey(),
  templateId: text('template_id').notNull().references(() => templates.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  category: text('category')
}, (table) => [
  index('template_materials_template_id_idx').on(table.templateId),
  check('template_materials_quantity_positive', sql`${table.quantity} > 0`)
]);

export const backups = pgTable('backups', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  data: jsonb('data').notNull()
});
