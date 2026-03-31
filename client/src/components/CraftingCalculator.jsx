import { useState } from 'react';
import { Calculator, TrendingUp, Clock, Package, DollarSign, X } from 'lucide-react';
import BlockIcon from './BlockIcon';

// Crafting recipes database
const craftingRecipes = {
  // Wood planks
  'oak_planks': { input: { 'oak_log': 1 }, output: 4 },
  'spruce_planks': { input: { 'spruce_log': 1 }, output: 4 },
  'birch_planks': { input: { 'birch_log': 1 }, output: 4 },
  'jungle_planks': { input: { 'jungle_log': 1 }, output: 4 },
  'acacia_planks': { input: { 'acacia_log': 1 }, output: 4 },
  'dark_oak_planks': { input: { 'dark_oak_log': 1 }, output: 4 },
  'mangrove_planks': { input: { 'mangrove_log': 1 }, output: 4 },
  'cherry_planks': { input: { 'cherry_log': 1 }, output: 4 },
  'bamboo_planks': { input: { 'bamboo_block': 1 }, output: 2 },
  'pale_oak_planks': { input: { 'pale_oak_log': 1 }, output: 4 },
  
  // Sticks
  'stick': { input: { 'oak_planks': 2 }, output: 4 },
  
  // Stone variants
  'stone_stairs': { input: { 'stone': 6 }, output: 4 },
  'stone_slab': { input: { 'stone': 3 }, output: 6 },
  'cobblestone_stairs': { input: { 'cobblestone': 6 }, output: 4 },
  'cobblestone_slab': { input: { 'cobblestone': 3 }, output: 6 },
  
  // Polished stone variants
  'polished_andesite_stairs': { input: { 'polished_andesite': 6 }, output: 4 },
  'polished_andesite_slab': { input: { 'polished_andesite': 3 }, output: 6 },
  'polished_diorite_stairs': { input: { 'polished_diorite': 6 }, output: 4 },
  'polished_diorite_slab': { input: { 'polished_diorite': 3 }, output: 6 },
  'polished_granite_stairs': { input: { 'polished_granite': 6 }, output: 4 },
  'polished_granite_slab': { input: { 'polished_granite': 3 }, output: 6 },
  
  // Deepslate variants
  'cobbled_deepslate_stairs': { input: { 'cobbled_deepslate': 6 }, output: 4 },
  'cobbled_deepslate_slab': { input: { 'cobbled_deepslate': 3 }, output: 6 },
  'polished_deepslate_stairs': { input: { 'polished_deepslate': 6 }, output: 4 },
  'polished_deepslate_slab': { input: { 'polished_deepslate': 3 }, output: 6 },
  'deepslate_brick_stairs': { input: { 'deepslate_bricks': 6 }, output: 4 },
  'deepslate_brick_slab': { input: { 'deepslate_bricks': 3 }, output: 6 },
  'deepslate_tile_stairs': { input: { 'deepslate_tiles': 6 }, output: 4 },
  'deepslate_tile_slab': { input: { 'deepslate_tiles': 3 }, output: 6 },
  
  // Sandstone variants
  'sandstone_stairs': { input: { 'sandstone': 6 }, output: 4 },
  'sandstone_slab': { input: { 'sandstone': 3 }, output: 6 },
  'smooth_sandstone_stairs': { input: { 'smooth_sandstone': 6 }, output: 4 },
  'smooth_sandstone_slab': { input: { 'smooth_sandstone': 3 }, output: 6 },
  'red_sandstone_stairs': { input: { 'red_sandstone': 6 }, output: 4 },
  'red_sandstone_slab': { input: { 'red_sandstone': 3 }, output: 6 },
  'smooth_red_sandstone_stairs': { input: { 'smooth_red_sandstone': 6 }, output: 4 },
  'smooth_red_sandstone_slab': { input: { 'smooth_red_sandstone': 3 }, output: 6 },
  
  // Concrete variants
  'white_concrete_stairs': { input: { 'white_concrete': 6 }, output: 4 },
  'white_concrete_slab': { input: { 'white_concrete': 3 }, output: 6 },
  'orange_concrete_stairs': { input: { 'orange_concrete': 6 }, output: 4 },
  'orange_concrete_slab': { input: { 'orange_concrete': 3 }, output: 6 },
  'magenta_concrete_stairs': { input: { 'magenta_concrete': 6 }, output: 4 },
  'magenta_concrete_slab': { input: { 'magenta_concrete': 3 }, output: 6 },
  'light_blue_concrete_stairs': { input: { 'light_blue_concrete': 6 }, output: 4 },
  'light_blue_concrete_slab': { input: { 'light_blue_concrete': 3 }, output: 6 },
  'yellow_concrete_stairs': { input: { 'yellow_concrete': 6 }, output: 4 },
  'yellow_concrete_slab': { input: { 'yellow_concrete': 3 }, output: 6 },
  'lime_concrete_stairs': { input: { 'lime_concrete': 6 }, output: 4 },
  'lime_concrete_slab': { input: { 'lime_concrete': 3 }, output: 6 },
  'pink_concrete_stairs': { input: { 'pink_concrete': 6 }, output: 4 },
  'pink_concrete_slab': { input: { 'pink_concrete': 3 }, output: 6 },
  'gray_concrete_stairs': { input: { 'gray_concrete': 6 }, output: 4 },
  'gray_concrete_slab': { input: { 'gray_concrete': 3 }, output: 6 },
  'light_gray_concrete_stairs': { input: { 'light_gray_concrete': 6 }, output: 4 },
  'light_gray_concrete_slab': { input: { 'light_gray_concrete': 3 }, output: 6 },
  'cyan_concrete_stairs': { input: { 'cyan_concrete': 6 }, output: 4 },
  'cyan_concrete_slab': { input: { 'cyan_concrete': 3 }, output: 6 },
  'purple_concrete_stairs': { input: { 'purple_concrete': 6 }, output: 4 },
  'purple_concrete_slab': { input: { 'purple_concrete': 3 }, output: 6 },
  'blue_concrete_stairs': { input: { 'blue_concrete': 6 }, output: 4 },
  'blue_concrete_slab': { input: { 'blue_concrete': 3 }, output: 6 },
  'brown_concrete_stairs': { input: { 'brown_concrete': 6 }, output: 4 },
  'brown_concrete_slab': { input: { 'brown_concrete': 3 }, output: 6 },
  'green_concrete_stairs': { input: { 'green_concrete': 6 }, output: 4 },
  'green_concrete_slab': { input: { 'green_concrete': 3 }, output: 6 },
  'red_concrete_stairs': { input: { 'red_concrete': 6 }, output: 4 },
  'red_concrete_slab': { input: { 'red_concrete': 3 }, output: 6 },
  'black_concrete_stairs': { input: { 'black_concrete': 6 }, output: 4 },
  'black_concrete_slab': { input: { 'black_concrete': 3 }, output: 6 },
  
  // Terracotta variants
  'white_terracotta_stairs': { input: { 'white_terracotta': 6 }, output: 4 },
  'white_terracotta_slab': { input: { 'white_terracotta': 3 }, output: 6 },
  'orange_terracotta_stairs': { input: { 'orange_terracotta': 6 }, output: 4 },
  'orange_terracotta_slab': { input: { 'orange_terracotta': 3 }, output: 6 },
  'magenta_terracotta_stairs': { input: { 'magenta_terracotta': 6 }, output: 4 },
  'magenta_terracotta_slab': { input: { 'magenta_terracotta': 3 }, output: 6 },
  'light_blue_terracotta_stairs': { input: { 'light_blue_terracotta': 6 }, output: 4 },
  'light_blue_terracotta_slab': { input: { 'light_blue_terracotta': 3 }, output: 6 },
  'yellow_terracotta_stairs': { input: { 'yellow_terracotta': 6 }, output: 4 },
  'yellow_terracotta_slab': { input: { 'yellow_terracotta': 3 }, output: 6 },
  'lime_terracotta_stairs': { input: { 'lime_terracotta': 6 }, output: 4 },
  'lime_terracotta_slab': { input: { 'lime_terracotta': 3 }, output: 6 },
  'pink_terracotta_stairs': { input: { 'pink_terracotta': 6 }, output: 4 },
  'pink_terracotta_slab': { input: { 'pink_terracotta': 3 }, output: 6 },
  'gray_terracotta_stairs': { input: { 'gray_terracotta': 6 }, output: 4 },
  'gray_terracotta_slab': { input: { 'gray_terracotta': 3 }, output: 6 },
  'light_gray_terracotta_stairs': { input: { 'light_gray_terracotta': 6 }, output: 4 },
  'light_gray_terracotta_slab': { input: { 'light_gray_terracotta': 3 }, output: 6 },
  'cyan_terracotta_stairs': { input: { 'cyan_terracotta': 6 }, output: 4 },
  'cyan_terracotta_slab': { input: { 'cyan_terracotta': 3 }, output: 6 },
  'purple_terracotta_stairs': { input: { 'purple_terracotta': 6 }, output: 4 },
  'purple_terracotta_slab': { input: { 'purple_terracotta': 3 }, output: 6 },
  'blue_terracotta_stairs': { input: { 'blue_terracotta': 6 }, output: 4 },
  'blue_terracotta_slab': { input: { 'blue_terracotta': 3 }, output: 6 },
  'brown_terracotta_stairs': { input: { 'brown_terracotta': 6 }, output: 4 },
  'brown_terracotta_slab': { input: { 'brown_terracotta': 3 }, output: 6 },
  'green_terracotta_stairs': { input: { 'green_terracotta': 6 }, output: 4 },
  'green_terracotta_slab': { input: { 'green_terracotta': 3 }, output: 6 },
  'red_terracotta_stairs': { input: { 'red_terracotta': 6 }, output: 4 },
  'red_terracotta_slab': { input: { 'red_terracotta': 3 }, output: 6 },
  'black_terracotta_stairs': { input: { 'black_terracotta': 6 }, output: 4 },
  'black_terracotta_slab': { input: { 'black_terracotta': 3 }, output: 6 },
  
  // Wood variants
  'oak_stairs': { input: { 'oak_planks': 6 }, output: 4 },
  'oak_slab': { input: { 'oak_planks': 3 }, output: 6 },
  'oak_fence': { input: { 'oak_planks': 2, 'stick': 4 }, output: 3 },
  'oak_fence_gate': { input: { 'oak_planks': 2, 'stick': 4 }, output: 1 },
  'oak_door': { input: { 'oak_planks': 6 }, output: 3 },
  'oak_trapdoor': { input: { 'oak_planks': 6 }, output: 2 },
  'oak_sign': { input: { 'oak_planks': 6, 'stick': 1 }, output: 3 },
  'oak_pressure_plate': { input: { 'oak_planks': 2 }, output: 1 },
  'oak_button': { input: { 'oak_planks': 1 }, output: 1 },
  
  'spruce_stairs': { input: { 'spruce_planks': 6 }, output: 4 },
  'spruce_slab': { input: { 'spruce_planks': 3 }, output: 6 },
  'spruce_fence': { input: { 'spruce_planks': 2, 'stick': 4 }, output: 3 },
  'spruce_fence_gate': { input: { 'spruce_planks': 2, 'stick': 4 }, output: 1 },
  'spruce_door': { input: { 'spruce_planks': 6 }, output: 3 },
  'spruce_trapdoor': { input: { 'spruce_planks': 6 }, output: 2 },
  'spruce_sign': { input: { 'spruce_planks': 6, 'stick': 1 }, output: 3 },
  'spruce_pressure_plate': { input: { 'spruce_planks': 2 }, output: 1 },
  'spruce_button': { input: { 'spruce_planks': 1 }, output: 1 },
  
  'birch_stairs': { input: { 'birch_planks': 6 }, output: 4 },
  'birch_slab': { input: { 'birch_planks': 3 }, output: 6 },
  'birch_fence': { input: { 'birch_planks': 2, 'stick': 4 }, output: 3 },
  'birch_fence_gate': { input: { 'birch_planks': 2, 'stick': 4 }, output: 1 },
  'birch_door': { input: { 'birch_planks': 6 }, output: 3 },
  'birch_trapdoor': { input: { 'birch_planks': 6 }, output: 2 },
  'birch_sign': { input: { 'birch_planks': 6, 'stick': 1 }, output: 3 },
  'birch_pressure_plate': { input: { 'birch_planks': 2 }, output: 1 },
  'birch_button': { input: { 'birch_planks': 1 }, output: 1 },
  
  'jungle_stairs': { input: { 'jungle_planks': 6 }, output: 4 },
  'jungle_slab': { input: { 'jungle_planks': 3 }, output: 6 },
  'jungle_fence': { input: { 'jungle_planks': 2, 'stick': 4 }, output: 3 },
  'jungle_fence_gate': { input: { 'jungle_planks': 2, 'stick': 4 }, output: 1 },
  'jungle_door': { input: { 'jungle_planks': 6 }, output: 3 },
  'jungle_trapdoor': { input: { 'jungle_planks': 6 }, output: 2 },
  'jungle_sign': { input: { 'jungle_planks': 6, 'stick': 1 }, output: 3 },
  'jungle_pressure_plate': { input: { 'jungle_planks': 2 }, output: 1 },
  'jungle_button': { input: { 'jungle_planks': 1 }, output: 1 },
  
  'acacia_stairs': { input: { 'acacia_planks': 6 }, output: 4 },
  'acacia_slab': { input: { 'acacia_planks': 3 }, output: 6 },
  'acacia_fence': { input: { 'acacia_planks': 2, 'stick': 4 }, output: 3 },
  'acacia_fence_gate': { input: { 'acacia_planks': 2, 'stick': 4 }, output: 1 },
  'acacia_door': { input: { 'acacia_planks': 6 }, output: 3 },
  'acacia_trapdoor': { input: { 'acacia_planks': 6 }, output: 2 },
  'acacia_sign': { input: { 'acacia_planks': 6, 'stick': 1 }, output: 3 },
  'acacia_pressure_plate': { input: { 'acacia_planks': 2 }, output: 1 },
  'acacia_button': { input: { 'acacia_planks': 1 }, output: 1 },
  
  'dark_oak_stairs': { input: { 'dark_oak_planks': 6 }, output: 4 },
  'dark_oak_slab': { input: { 'dark_oak_planks': 3 }, output: 6 },
  'dark_oak_fence': { input: { 'dark_oak_planks': 2, 'stick': 4 }, output: 3 },
  'dark_oak_fence_gate': { input: { 'dark_oak_planks': 2, 'stick': 4 }, output: 1 },
  'dark_oak_door': { input: { 'dark_oak_planks': 6 }, output: 3 },
  'dark_oak_trapdoor': { input: { 'dark_oak_planks': 6 }, output: 2 },
  'dark_oak_sign': { input: { 'dark_oak_planks': 6, 'stick': 1 }, output: 3 },
  'dark_oak_pressure_plate': { input: { 'dark_oak_planks': 2 }, output: 1 },
  'dark_oak_button': { input: { 'dark_oak_planks': 1 }, output: 1 },
  
  'mangrove_stairs': { input: { 'mangrove_planks': 6 }, output: 4 },
  'mangrove_slab': { input: { 'mangrove_planks': 3 }, output: 6 },
  'mangrove_fence': { input: { 'mangrove_planks': 2, 'stick': 4 }, output: 3 },
  'mangrove_fence_gate': { input: { 'mangrove_planks': 2, 'stick': 4 }, output: 1 },
  'mangrove_door': { input: { 'mangrove_planks': 6 }, output: 3 },
  'mangrove_trapdoor': { input: { 'mangrove_planks': 6 }, output: 2 },
  'mangrove_sign': { input: { 'mangrove_planks': 6, 'stick': 1 }, output: 3 },
  'mangrove_pressure_plate': { input: { 'mangrove_planks': 2 }, output: 1 },
  'mangrove_button': { input: { 'mangrove_planks': 1 }, output: 1 },
  
  'cherry_stairs': { input: { 'cherry_planks': 6 }, output: 4 },
  'cherry_slab': { input: { 'cherry_planks': 3 }, output: 6 },
  'cherry_fence': { input: { 'cherry_planks': 2, 'stick': 4 }, output: 3 },
  'cherry_fence_gate': { input: { 'cherry_planks': 2, 'stick': 4 }, output: 1 },
  'cherry_door': { input: { 'cherry_planks': 6 }, output: 3 },
  'cherry_trapdoor': { input: { 'cherry_planks': 6 }, output: 2 },
  'cherry_sign': { input: { 'cherry_planks': 6, 'stick': 1 }, output: 3 },
  'cherry_pressure_plate': { input: { 'cherry_planks': 2 }, output: 1 },
  'cherry_button': { input: { 'cherry_planks': 1 }, output: 1 },
  
  'pale_oak_stairs': { input: { 'pale_oak_planks': 6 }, output: 4 },
  'pale_oak_slab': { input: { 'pale_oak_planks': 3 }, output: 6 },
  'pale_oak_fence': { input: { 'pale_oak_planks': 2, 'stick': 4 }, output: 3 },
  'pale_oak_fence_gate': { input: { 'pale_oak_planks': 2, 'stick': 4 }, output: 1 },
  'pale_oak_door': { input: { 'pale_oak_planks': 6 }, output: 3 },
  'pale_oak_trapdoor': { input: { 'pale_oak_planks': 6 }, output: 2 },
  'pale_oak_sign': { input: { 'pale_oak_planks': 6, 'stick': 1 }, output: 3 },
  'pale_oak_pressure_plate': { input: { 'pale_oak_planks': 2 }, output: 1 },
  'pale_oak_button': { input: { 'pale_oak_planks': 1 }, output: 1 },
  
  'bamboo_mosaic_stairs': { input: { 'bamboo_mosaic': 6 }, output: 4 },
  'bamboo_mosaic_slab': { input: { 'bamboo_mosaic': 3 }, output: 6 },
  
  // Tools and weapons
  'wooden_pickaxe': { input: { 'oak_planks': 3, 'stick': 2 }, output: 1 },
  'wooden_axe': { input: { 'oak_planks': 3, 'stick': 2 }, output: 1 },
  'wooden_shovel': { input: { 'oak_planks': 1, 'stick': 2 }, output: 1 },
  'wooden_sword': { input: { 'oak_planks': 2, 'stick': 1 }, output: 1 },
  'wooden_hoe': { input: { 'oak_planks': 2, 'stick': 2 }, output: 1 },
  
  'stone_pickaxe': { input: { 'cobblestone': 3, 'stick': 2 }, output: 1 },
  'stone_axe': { input: { 'cobblestone': 3, 'stick': 2 }, output: 1 },
  'stone_shovel': { input: { 'cobblestone': 1, 'stick': 2 }, output: 1 },
  'stone_sword': { input: { 'cobblestone': 2, 'stick': 1 }, output: 1 },
  'stone_hoe': { input: { 'cobblestone': 2, 'stick': 2 }, output: 1 },
  
  'iron_pickaxe': { input: { 'iron_ingot': 3, 'stick': 2 }, output: 1 },
  'iron_axe': { input: { 'iron_ingot': 3, 'stick': 2 }, output: 1 },
  'iron_shovel': { input: { 'iron_ingot': 1, 'stick': 2 }, output: 1 },
  'iron_sword': { input: { 'iron_ingot': 2, 'stick': 1 }, output: 1 },
  'iron_hoe': { input: { 'iron_ingot': 2, 'stick': 2 }, output: 1 },
  
  'gold_pickaxe': { input: { 'gold_ingot': 3, 'stick': 2 }, output: 1 },
  'gold_axe': { input: { 'gold_ingot': 3, 'stick': 2 }, output: 1 },
  'gold_shovel': { input: { 'gold_ingot': 1, 'stick': 2 }, output: 1 },
  'gold_sword': { input: { 'gold_ingot': 2, 'stick': 1 }, output: 1 },
  'gold_hoe': { input: { 'gold_ingot': 2, 'stick': 2 }, output: 1 },
  
  'diamond_pickaxe': { input: { 'diamond': 3, 'stick': 2 }, output: 1 },
  'diamond_axe': { input: { 'diamond': 3, 'stick': 2 }, output: 1 },
  'diamond_shovel': { input: { 'diamond': 1, 'stick': 2 }, output: 1 },
  'diamond_sword': { input: { 'diamond': 2, 'stick': 1 }, output: 1 },
  'diamond_hoe': { input: { 'diamond': 2, 'stick': 2 }, output: 1 },
  
  // Armor
  'leather_helmet': { input: { 'leather': 5 }, output: 1 },
  'leather_chestplate': { input: { 'leather': 8 }, output: 1 },
  'leather_leggings': { input: { 'leather': 7 }, output: 1 },
  'leather_boots': { input: { 'leather': 4 }, output: 1 },
  
  'iron_helmet': { input: { 'iron_ingot': 5 }, output: 1 },
  'iron_chestplate': { input: { 'iron_ingot': 8 }, output: 1 },
  'iron_leggings': { input: { 'iron_ingot': 7 }, output: 1 },
  'iron_boots': { input: { 'iron_ingot': 4 }, output: 1 },
  
  'gold_helmet': { input: { 'gold_ingot': 5 }, output: 1 },
  'gold_chestplate': { input: { 'gold_ingot': 8 }, output: 1 },
  'gold_leggings': { input: { 'gold_ingot': 7 }, output: 1 },
  'gold_boots': { input: { 'gold_ingot': 4 }, output: 1 },
  
  'diamond_helmet': { input: { 'diamond': 5 }, output: 1 },
  'diamond_chestplate': { input: { 'diamond': 8 }, output: 1 },
  'diamond_leggings': { input: { 'diamond': 7 }, output: 1 },
  'diamond_boots': { input: { 'diamond': 4 }, output: 1 },
  
  // Utility blocks
  'crafting_table': { input: { 'oak_planks': 4 }, output: 1 },
  'furnace': { input: { 'cobblestone': 8 }, output: 1 },
  'chest': { input: { 'oak_planks': 8 }, output: 1 },
  'torch': { input: { 'coal': 1, 'stick': 1 }, output: 4 },
  'lantern': { input: { 'iron_nugget': 8, 'torch': 1 }, output: 1 },
};

function calculateMaterials(blockName, quantity) {
  const materialKey = blockName.toLowerCase().replace(/\s+/g, '_');
  const recipe = craftingRecipes[materialKey];
  
  if (!recipe) {
    return { canCraft: false, message: 'No crafting recipe available' };
  }
  
  const numCrafts = Math.ceil(quantity / recipe.output);
  const totalMaterials = {};
  
  for (const [material, amount] of Object.entries(recipe.input)) {
    totalMaterials[material] = amount * numCrafts;
  }
  
  return {
    canCraft: true,
    numCrafts,
    outputPerCraft: recipe.output,
    totalOutput: numCrafts * recipe.output,
    materials: totalMaterials
  };
}

export default function CraftingCalculator({ material, onClose }) {
  if (!material) return null;
  
  const calculation = calculateMaterials(material.name, material.quantity);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-white">Crafting Calculator</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <BlockIcon 
                blockName={material.name.toLowerCase().replace(/\s+/g, '_')} 
                size={40}
              />
              <div>
                <h4 className="text-lg font-semibold text-white">{material.name}</h4>
                <p className="text-gray-400">Quantity needed: {material.quantity}</p>
              </div>
            </div>
          </div>
          
          {!calculation.canCraft ? (
            <div className="text-center py-8">
              <p className="text-gray-400">{calculation.message}</p>
            </div>
          ) : (
            <div>
              <div className="bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Crafting operations needed:</span>
                  <span className="text-white font-bold">{calculation.numCrafts}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Output per craft:</span>
                  <span className="text-white font-bold">{calculation.outputPerCraft}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Total output:</span>
                  <span className="text-green-400 font-bold">{calculation.totalOutput}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="text-white font-semibold mb-3">Materials Required:</h5>
                <div className="space-y-2">
                  {Object.entries(calculation.materials).map(([materialName, amount]) => (
                    <div key={materialName} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <BlockIcon 
                          blockName={materialName}
                          size={24}
                        />
                        <span className="text-white capitalize">
                          {materialName.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRight size={16} className="text-gray-400" />
                        <span className="text-white font-bold">{amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {calculation.totalOutput > material.quantity && (
                <div className="bg-blue-600/20 border border-blue-600 rounded-lg p-3">
                  <p className="text-blue-400 text-sm">
                    ⚠️ You'll have {calculation.totalOutput - material.quantity} extra items
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
