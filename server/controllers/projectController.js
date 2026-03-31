import prisma from '../db/prisma.js';

export async function getProjects(req, res) {
  try {
    const projects = await prisma.project.findMany({
      include: {
        materials: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createProject(req, res) {
  try {
    const { name } = req.body;
    const project = await prisma.project.create({
      data: { name },
      include: {
        materials: true
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteProject(req, res) {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function duplicateProject(req, res) {
  try {
    const { id } = req.params;
    const original = await prisma.project.findUnique({
      where: { id },
      include: { materials: true }
    });

    if (!original) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const duplicate = await prisma.project.create({
      data: {
        name: `${original.name} (Copy)`,
        materials: {
          create: original.materials.map(m => ({
            name: m.name,
            quantity: m.quantity,
            collected: false,
            category: m.category
          }))
        }
      },
      include: {
        materials: true
      }
    });

    res.status(201).json(duplicate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
