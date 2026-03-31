const recipes = {
  'oak_planks': { ingredients: { 'oak_log': 0.25 }, output: 1 },
  'spruce_planks': { ingredients: { 'spruce_log': 0.25 }, output: 1 },
  'birch_planks': { ingredients: { 'birch_log': 0.25 }, output: 1 },
  'jungle_planks': { ingredients: { 'jungle_log': 0.25 }, output: 1 },
  'acacia_planks': { ingredients: { 'acacia_log': 0.25 }, output: 1 },
  'dark_oak_planks': { ingredients: { 'dark_oak_log': 0.25 }, output: 1 },
  'stick': { ingredients: { 'oak_planks': 0.5 }, output: 1 },
  'crafting_table': { ingredients: { 'oak_planks': 4 }, output: 1 },
  'chest': { ingredients: { 'oak_planks': 8 }, output: 1 },
  'torch': { ingredients: { 'stick': 0.25, 'coal': 0.25 }, output: 1 },
  'ladder': { ingredients: { 'stick': 7 }, output: 3 },
  'fence': { ingredients: { 'oak_planks': 4, 'stick': 2 }, output: 3 },
  'fence_gate': { ingredients: { 'oak_planks': 2, 'stick': 4 }, output: 1 },
  'door': { ingredients: { 'oak_planks': 6 }, output: 3 },
  'trapdoor': { ingredients: { 'oak_planks': 6 }, output: 2 },
  'stairs': { ingredients: { 'oak_planks': 6 }, output: 4 },
  'slab': { ingredients: { 'oak_planks': 3 }, output: 6 },
  'stone_bricks': { ingredients: { 'stone': 1 }, output: 1 },
  'stone_brick_stairs': { ingredients: { 'stone_bricks': 6 }, output: 4 },
  'stone_brick_slab': { ingredients: { 'stone_bricks': 3 }, output: 6 },
  'iron_ingot': { ingredients: { 'iron_ore': 1, 'coal': 0.125 }, output: 1 },
  'gold_ingot': { ingredients: { 'gold_ore': 1, 'coal': 0.125 }, output: 1 },
  'iron_block': { ingredients: { 'iron_ingot': 9 }, output: 1 },
  'gold_block': { ingredients: { 'gold_ingot': 9 }, output: 1 },
  'diamond_block': { ingredients: { 'diamond': 9 }, output: 1 },
  'emerald_block': { ingredients: { 'emerald': 9 }, output: 1 },
  'glass': { ingredients: { 'sand': 1, 'coal': 0.125 }, output: 1 },
  'glass_pane': { ingredients: { 'glass': 6 }, output: 16 },
  'brick': { ingredients: { 'clay_ball': 1, 'coal': 0.125 }, output: 1 },
  'bricks': { ingredients: { 'brick': 4 }, output: 1 },
  'brick_stairs': { ingredients: { 'bricks': 6 }, output: 4 },
  'brick_slab': { ingredients: { 'bricks': 3 }, output: 6 },
  'stone_stairs': { ingredients: { 'cobblestone': 6 }, output: 4 },
  'stone_slab': { ingredients: { 'cobblestone': 3 }, output: 6 },
  'smooth_stone': { ingredients: { 'stone': 1, 'coal': 0.125 }, output: 1 },
  'smooth_stone_slab': { ingredients: { 'smooth_stone': 3 }, output: 6 },
  'quartz_block': { ingredients: { 'quartz': 4 }, output: 1 },
  'quartz_stairs': { ingredients: { 'quartz_block': 6 }, output: 4 },
  'quartz_slab': { ingredients: { 'quartz_block': 3 }, output: 6 },
  'sandstone': { ingredients: { 'sand': 4 }, output: 1 },
  'sandstone_stairs': { ingredients: { 'sandstone': 6 }, output: 4 },
  'sandstone_slab': { ingredients: { 'sandstone': 3 }, output: 6 },
  'red_sandstone': { ingredients: { 'red_sand': 4 }, output: 1 },
  'red_sandstone_stairs': { ingredients: { 'red_sandstone': 6 }, output: 4 },
  'red_sandstone_slab': { ingredients: { 'red_sandstone': 3 }, output: 6 },
};

function calculateMaterials(itemName, quantity, breakdown = false) {
  const visited = new Set();
  const baseMaterials = {};
  const craftingSteps = [];

  function recursiveCalculate(item, qty, depth = 0) {
    const normalizedItem = item.toLowerCase().trim();
    
    if (visited.has(normalizedItem)) {
      return;
    }

    const recipe = recipes[normalizedItem];
    
    if (!recipe) {
      baseMaterials[normalizedItem] = (baseMaterials[normalizedItem] || 0) + qty;
      return;
    }

    const craftingBatches = Math.ceil(qty / recipe.output);
    
    if (breakdown) {
      craftingSteps.push({
        item: normalizedItem,
        quantity: qty,
        depth,
        ingredients: recipe.ingredients
      });
    }

    for (const [ingredient, amountPerCraft] of Object.entries(recipe.ingredients)) {
      const totalNeeded = craftingBatches * amountPerCraft;
      recursiveCalculate(ingredient, totalNeeded, depth + 1);
    }
  }

  recursiveCalculate(itemName, quantity);

  const result = {
    baseMaterials: Object.entries(baseMaterials).map(([name, qty]) => ({
      name,
      quantity: Math.ceil(qty)
    }))
  };

  if (breakdown) {
    result.craftingSteps = craftingSteps;
  }

  return result;
}

export { calculateMaterials, recipes };
