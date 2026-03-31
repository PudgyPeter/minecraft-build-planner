import { calculateMaterials } from '../services/craftingCalculator.js';

export async function calculate(req, res) {
  try {
    const { item, quantity, breakdown } = req.body;
    
    if (!item || !quantity) {
      return res.status(400).json({ error: 'Item and quantity are required' });
    }

    const result = calculateMaterials(item, parseInt(quantity), breakdown);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
