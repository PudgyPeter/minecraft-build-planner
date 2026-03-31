import prisma from '../db/prisma.js';

export async function getMaterials(req, res) {
  try {
    const { id } = req.params;
    const materials = await prisma.material.findMany({
      where: { projectId: id },
      orderBy: [
        { collected: 'asc' },
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createMaterial(req, res) {
  try {
    const { projectId, name, quantity, category } = req.body;
    const material = await prisma.material.create({
      data: {
        projectId,
        name,
        quantity: parseInt(quantity),
        category: category || null
      }
    });
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateMaterial(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const material = await prisma.material.update({
      where: { id },
      data: updates
    });
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteMaterial(req, res) {
  try {
    const { id } = req.params;
    await prisma.material.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function bulkCreateMaterials(req, res) {
  try {
    const { projectId, materials } = req.body;
    
    const created = await prisma.material.createMany({
      data: materials.map(m => ({
        projectId,
        name: m.name,
        quantity: parseInt(m.quantity),
        category: m.category || null
      }))
    });
    
    const allMaterials = await prisma.material.findMany({
      where: { projectId }
    });
    
    res.status(201).json(allMaterials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
