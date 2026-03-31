import { useState } from 'react';
import { Package, ArrowDown, TreeTrunk, Pickaxe, X, Info } from 'lucide-react';
import { getBlockIcon } from '../data/minecraftBlocks';

// Comprehensive crafting recipes database
const craftingRecipes = {
  // Wood planks from logs
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
  
  // Sticks from planks
  'stick': { input: { 'oak_planks': 2 }, output: 4 },
  
  // Wood variants from planks
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

// Base materials that can't be crafted further
const baseMaterials = new Set([
  'oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log', 
  'mangrove_log', 'cherry_log', 'pale_oak_log', 'bamboo_block',
  'stone', 'cobblestone', 'sand', 'gravel', 'dirt', 'grass_block',
  'coal', 'charcoal', 'iron_ingot', 'gold_ingot', 'diamond', 'emerald',
  'leather', 'iron_nugget', 'gold_nugget', 'redstone', 'lapis_lazuli',
  'sandstone', 'red_sandstone', 'terracotta', 'white_terracotta', 'orange_terracotta',
  'magenta_terracotta', 'light_blue_terracotta', 'yellow_terracotta', 'lime_terracotta',
  'pink_terracotta', 'gray_terracotta', 'light_gray_terracotta', 'cyan_terracotta',
  'purple_terracotta', 'blue_terracotta', 'brown_terracotta', 'green_terracotta',
  'red_terracotta', 'black_terracotta',
  'white_concrete', 'orange_concrete', 'magenta_concrete', 'light_blue_concrete',
  'yellow_concrete', 'lime_concrete', 'pink_concrete', 'gray_concrete',
  'light_gray_concrete', 'cyan_concrete', 'purple_concrete', 'blue_concrete',
  'brown_concrete', 'green_concrete', 'red_concrete', 'black_concrete',
  'andesite', 'diorite', 'granite', 'tuff', 'calcite', 'deepslate',
  'cobbled_deepslate', 'polished_andesite', 'polished_diorite', 'polished_granite',
  'polished_deepslate', 'deepslate_bricks', 'deepslate_tiles'
]);

function calculateBaseMaterials(materials) {
  const requirements = {};
  const processed = new Set();
  
  // Initialize with current materials
  materials.forEach(material => {
    const key = material.name.toLowerCase().replace(/\s+/g, '_');
    requirements[key] = (requirements[key] || 0) + material.quantity;
  });
  
  // Iteratively break down materials to base components
  let changed = true;
  while (changed) {
    changed = false;
    const newRequirements = { ...requirements };
    
    for (const [materialName, quantity] of Object.entries(requirements)) {
      if (processed.has(materialName) || baseMaterials.has(materialName)) {
        continue;
      }
      
      const recipe = craftingRecipes[materialName];
      if (!recipe) {
        // If no recipe, treat as base material
        processed.add(materialName);
        continue;
      }
      
      const numCrafts = Math.ceil(quantity / recipe.output);
      
      // Replace current material with its inputs
      delete newRequirements[materialName];
      
      for (const [inputMaterial, inputAmount] of Object.entries(recipe.input)) {
        const totalInput = inputAmount * numCrafts;
        newRequirements[inputMaterial] = (newRequirements[inputMaterial] || 0) + totalInput;
      }
      
      changed = true;
    }
    
    requirements = newRequirements;
  }
  
  return requirements;
}

function categorizeBaseMaterials(materials) {
  const categories = {
    'Wood': {},
    'Stone': {},
    'Ores & Metals': {},
    'Other': {}
  };
  
  Object.entries(materials).forEach(([name, quantity]) => {
    let category = 'Other';
    
    if (name.includes('_log') || name.includes('bamboo_block')) {
      category = 'Wood';
    } else if (name.includes('stone') || name.includes('cobblestone') || 
               name.includes('sand') || name.includes('gravel') || name.includes('dirt') ||
               name.includes('terracotta') || name.includes('concrete') ||
               name.includes('andesite') || name.includes('diorite') || name.includes('granite') ||
               name.includes('tuff') || name.includes('calcite') || name.includes('deepslate')) {
      category = 'Stone';
    } else if (name.includes('ingot') || name.includes('ore') || name.includes('diamond') || 
               name.includes('emerald') || name.includes('coal') || name.includes('charcoal') ||
               name.includes('leather') || name.includes('nugget') || name.includes('redstone') ||
               name.includes('lapis')) {
      category = 'Ores & Metals';
    }
    
    categories[category][name] = quantity;
  });
  
  return categories;
}

export default function BaseMaterialsCalculator({ materials, onClose }) {
  const baseMaterials = calculateBaseMaterials(materials);
  const categorized = categorizeBaseMaterials(baseMaterials);
  
  const sortedMaterials = Object.entries(baseMaterials)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="text-orange-500" size={24} />
              <h3 className="text-xl font-bold text-white">Base Materials Calculator</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div className="mb-6 p-4 bg-orange-600/20 border border-orange-600 rounded-lg">
            <div className="flex items-start gap-3">
              <Info size={20} className="text-orange-400 mt-1" />
              <div>
                <h4 className="text-orange-400 font-semibold mb-1">What this shows</h4>
                <p className="text-orange-300 text-sm">
                  This calculator breaks down all your materials into their base components. 
                  For example, cherry stairs and slabs are converted back to the number of cherry logs you need.
                </p>
              </div>
            </div>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TreeTrunk className="text-green-400" size={20} />
                <span className="text-gray-300 text-sm">Wood Items</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Object.values(categorized['Wood']).reduce((sum, qty) => sum + qty, 0)}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Pickaxe className="text-gray-400" size={20} />
                <span className="text-gray-300 text-sm">Stone Items</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Object.values(categorized['Stone']).reduce((sum, qty) => sum + qty, 0)}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-blue-400" size={20} />
                <span className="text-gray-300 text-sm">Metals & Ores</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Object.values(categorized['Ores & Metals']).reduce((sum, qty) => sum + qty, 0)}
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="text-purple-400" size={20} />
                <span className="text-gray-300 text-sm">Total Base</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {Object.values(baseMaterials).reduce((sum, qty) => sum + qty, 0)}
              </div>
            </div>
          </div>
          
          {/* Categorized Materials */}
          <div className="space-y-6">
            {Object.entries(categorized).map(([category, items]) => (
              Object.keys(items).length > 0 && (
                <div key={category}>
                  <h4 className="text-white font-semibold mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(items)
                      .sort(([,a], [,b]) => b - a)
                      .map(([materialName, quantity]) => (
                        <div key={materialName} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{getBlockIcon(materialName)}</span>
                            <span className="text-white capitalize">
                              {materialName.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="text-white font-bold">{quantity}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )
            ))}
          </div>
          
          {/* Top Materials */}
          {sortedMaterials.length > 0 && (
            <div className="mt-6">
              <h4 className="text-white font-semibold mb-3">Most Needed Materials</h4>
              <div className="space-y-2">
                {sortedMaterials.map(([materialName, quantity]) => (
                  <div key={materialName} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getBlockIcon(materialName)}</span>
                      <span className="text-white capitalize">
                        {materialName.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-white font-bold">{quantity}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
