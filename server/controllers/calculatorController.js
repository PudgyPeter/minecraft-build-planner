import { calculateMaterials } from '../services/craftingCalculator.js';
import { endpoint, positiveQuantity, requiredText } from './helpers.js';

export const calculate = endpoint(async (req, res) => {
  const item = requiredText(req.body?.item, 'Item');
  const quantity = positiveQuantity(req.body?.quantity);
  res.json(calculateMaterials(item, quantity, Boolean(req.body?.breakdown)));
});
