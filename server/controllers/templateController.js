import prisma from '../db/prisma.js';

export async function getTemplates(req, res) {
  try {
    const templates = await prisma.template.findMany({
      include: {
        materials: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createTemplate(req, res) {
  try {
    const { name, projectId } = req.body;
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { materials: true }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const template = await prisma.template.create({
      data: {
        name,
        materials: {
          create: project.materials.map(m => ({
            name: m.name,
            quantity: m.quantity,
            category: m.category
          }))
        }
      },
      include: {
        materials: true
      }
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function applyTemplate(req, res) {
  try {
    const { id } = req.params;
    const { projectId } = req.body;

    const template = await prisma.template.findUnique({
      where: { id },
      include: { materials: true }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const materials = await prisma.material.createMany({
      data: template.materials.map(m => ({
        projectId,
        name: m.name,
        quantity: m.quantity,
        category: m.category
      }))
    });

    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { materials: true }
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;
    await prisma.template.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
