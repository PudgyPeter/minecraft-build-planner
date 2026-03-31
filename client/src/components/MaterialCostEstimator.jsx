import { useState } from 'react';
import { Calculator, TrendingUp, Clock, Package, DollarSign, X } from 'lucide-react';
import { getBlockIcon } from '../data/minecraftBlocks';

// Rough time estimates (in seconds) for gathering/crafting
const timeEstimates = {
  // Mining times (rough estimates per block)
  'stone': 3,
  'cobblestone': 3,
  'coal_ore': 3,
  'iron_ore': 4,
  'gold_ore': 4,
  'diamond_ore': 8,
  'emerald_ore': 10,
  'oak_log': 2,
  'spruce_log': 2,
  'birch_log': 2,
  'jungle_log': 2,
  'acacia_log': 2,
  'dark_oak_log': 2,
  'mangrove_log': 2,
  'cherry_log': 2,
  'pale_oak_log': 2,
  'sand': 2,
  'gravel': 2,
  'dirt': 1,
  'grass_block': 1,
  
  // Crafting times (rough estimates per item)
  'plank': 1,
  'stick': 0.5,
  'stair': 2,
  'slab': 1.5,
  'fence': 3,
  'door': 4,
  'trapdoor': 3,
  'sign': 3,
  'button': 0.5,
  'pressure_plate': 2,
  'crafting_table': 3,
  'furnace': 4,
  'chest': 5,
  'torch': 1,
  'lantern': 3,
  
  // Tool/armor crafting times
  'pickaxe': 5,
  'axe': 5,
  'shovel': 4,
  'sword': 4,
  'hoe': 4,
  'helmet': 6,
  'chestplate': 8,
  'leggings': 7,
  'boots': 5,
};

// Rough cost estimates (in emeralds, based on trading)
const costEstimates = {
  // Base materials
  'stone': 0.1,
  'cobblestone': 0.05,
  'coal': 1,
  'charcoal': 0.8,
  'iron_ingot': 8,
  'gold_ingot': 10,
  'diamond': 12,
  'emerald': 1,
  
  // Wood products
  'oak_planks': 0.5,
  'spruce_planks': 0.5,
  'birch_planks': 0.5,
  'jungle_planks': 0.5,
  'acacia_planks': 0.5,
  'dark_oak_planks': 0.5,
  'mangrove_planks': 0.5,
  'cherry_planks': 0.5,
  'pale_oak_planks': 0.5,
  'stick': 0.1,
  
  // Building materials
  'sand': 0.2,
  'gravel': 0.1,
  'dirt': 0.05,
  'glass': 1,
  'brick': 2,
  'concrete': 3,
  'terracotta': 1.5,
  
  // Tools and armor
  'wooden_pickaxe': 2,
  'stone_pickaxe': 5,
  'iron_pickaxe': 20,
  'gold_pickaxe': 25,
  'diamond_pickaxe': 35,
  
  'leather_helmet': 3,
  'iron_helmet': 15,
  'gold_helmet': 20,
  'diamond_helmet': 30,
  
  'leather_chestplate': 5,
  'iron_chestplate': 25,
  'gold_chestplate': 30,
  'diamond_chestplate': 40,
  
  'leather_leggings': 4,
  'iron_leggings': 20,
  'gold_leggings': 25,
  'diamond_leggings': 35,
  
  'leather_boots': 2,
  'iron_boots': 10,
  'gold_boots': 15,
  'diamond_boots': 25,
  
  // Utility blocks
  'crafting_table': 2,
  'furnace': 8,
  'chest': 4,
  'torch': 0.5,
  'lantern': 5,
};

function estimateTime(materials) {
  let totalTime = 0;
  let breakdown = {};
  
  for (const [materialName, quantity] of Object.entries(materials)) {
    const baseName = materialName.replace(/^(oak_|spruce_|birch_|jungle_|acacia_|dark_oak_|mangrove_|cherry_|pale_oak_|polished_|cobbled_|smooth_|cut_|chiseled_|cracked_|reinforced_)/, '').replace(/_stairs$|_slab$|_wall$|_fence$|_gate$|_door$|_trapdoor$|_sign$|_pressure_plate$|_button$|_bricks$|_tiles$|_brick$|_tile$|_powder$/, '');
    
    let timePerItem = timeEstimates[baseName] || timeEstimates[materialName] || 2;
    
    // Adjust time for complex items
    if (materialName.includes('stairs')) timePerItem = timeEstimates['stair'] || 2;
    if (materialName.includes('slab')) timePerItem = timeEstimates['slab'] || 1.5;
    if (materialName.includes('fence')) timePerItem = timeEstimates['fence'] || 3;
    if (materialName.includes('door')) timePerItem = timeEstimates['door'] || 4;
    if (materialName.includes('trapdoor')) timePerItem = timeEstimates['trapdoor'] || 3;
    if (materialName.includes('sign')) timePerItem = timeEstimates['sign'] || 3;
    if (materialName.includes('pressure_plate')) timePerItem = timeEstimates['pressure_plate'] || 2;
    if (materialName.includes('button')) timePerItem = timeEstimates['button'] || 0.5;
    if (materialName.includes('helmet')) timePerItem = timeEstimates['helmet'] || 6;
    if (materialName.includes('chestplate')) timePerItem = timeEstimates['chestplate'] || 8;
    if (materialName.includes('leggings')) timePerItem = timeEstimates['leggings'] || 7;
    if (materialName.includes('boots')) timePerItem = timeEstimates['boots'] || 5;
    if (materialName.includes('pickaxe')) timePerItem = timeEstimates['pickaxe'] || 5;
    if (materialName.includes('axe')) timePerItem = timeEstimates['axe'] || 5;
    if (materialName.includes('shovel')) timePerItem = timeEstimates['shovel'] || 4;
    if (materialName.includes('sword')) timePerItem = timeEstimates['sword'] || 4;
    if (materialName.includes('hoe')) timePerItem = timeEstimates['hoe'] || 4;
    
    const itemTime = timePerItem * quantity;
    totalTime += itemTime;
    breakdown[materialName] = itemTime;
  }
  
  return { totalTime, breakdown };
}

function estimateCost(materials) {
  let totalCost = 0;
  let breakdown = {};
  
  for (const [materialName, quantity] of Object.entries(materials)) {
    const baseName = materialName.replace(/^(oak_|spruce_|birch_|jungle_|acacia_|dark_oak_|mangrove_|cherry_|pale_oak_|polished_|cobbled_|smooth_|cut_|chiseled_|cracked_|reinforced_)/, '').replace(/_stairs$|_slab$|_wall$|_fence$|_gate$|_door$|_trapdoor$|_sign$|_pressure_plate$|_button$|_bricks$|_tiles$|_brick$|_tile$|_powder$/, '');
    
    let costPerItem = costEstimates[baseName] || costEstimates[materialName] || 1;
    
    // Adjust cost for complex items
    if (materialName.includes('plank')) costPerItem = costEstimates['plank'] || 0.5;
    if (materialName.includes('stairs')) costPerItem = (costEstimates['plank'] || 0.5) * 1.5;
    if (materialName.includes('slab')) costPerItem = (costEstimates['plank'] || 0.5) * 0.75;
    if (materialName.includes('fence')) costPerItem = (costEstimates['plank'] || 0.5) * 2;
    if (materialName.includes('gate')) costPerItem = (costEstimates['plank'] || 0.5) * 2;
    if (materialName.includes('door')) costPerItem = (costEstimates['plank'] || 0.5) * 3;
    if (materialName.includes('trapdoor')) costPerItem = (costEstimates['plank'] || 0.5) * 2.5;
    if (materialName.includes('sign')) costPerItem = (costEstimates['plank'] || 0.5) * 2.5;
    if (materialName.includes('pressure_plate')) costPerItem = (costEstimates['plank'] || 0.5) * 1;
    if (materialName.includes('button')) costPerItem = (costEstimates['plank'] || 0.5) * 0.25;
    
    const itemCost = costPerItem * quantity;
    totalCost += itemCost;
    breakdown[materialName] = itemCost;
  }
  
  return { totalCost, breakdown };
}

function formatTime(seconds) {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}h`;
  return `${Math.round(seconds / 86400)}d`;
}

export default function MaterialCostEstimator({ materials, onClose }) {
  const [activeTab, setActiveTab] = useState('time');
  
  const allMaterials = materials.reduce((acc, material) => {
    acc[material.name.toLowerCase().replace(/\s+/g, '_')] = material.quantity;
    return acc;
  }, {});
  
  const timeAnalysis = estimateTime(allMaterials);
  const costAnalysis = estimateCost(allMaterials);
  
  const sortedTimeBreakdown = Object.entries(timeAnalysis.breakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  const sortedCostBreakdown = Object.entries(costAnalysis.breakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-white">Project Cost Analysis</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="text-blue-400" size={20} />
                <span className="text-gray-300 text-sm">Total Items</span>
              </div>
              <div className="text-2xl font-bold text-white">{materials.length}</div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-green-400" size={20} />
                <span className="text-gray-300 text-sm">Est. Time</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(timeAnalysis.totalTime)}</div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="text-yellow-400" size={20} />
                <span className="text-gray-300 text-sm">Est. Cost</span>
              </div>
              <div className="text-2xl font-bold text-white">{Math.round(costAnalysis.totalCost)}💎</div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('time')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'time'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Clock size={16} className="inline mr-2" />
              Time Analysis
            </button>
            <button
              onClick={() => setActiveTab('cost')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'cost'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <DollarSign size={16} className="inline mr-2" />
              Cost Analysis
            </button>
          </div>
          
          {/* Content */}
          {activeTab === 'time' && (
            <div>
              <h4 className="text-white font-semibold mb-4">Most Time-Consuming Items</h4>
              <div className="space-y-2">
                {sortedTimeBreakdown.map(([materialName, time]) => (
                  <div key={materialName} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getBlockIcon(materialName)}</span>
                      <span className="text-white capitalize">
                        {materialName.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{formatTime(time)}</div>
                      <div className="text-gray-400 text-sm">{Math.round((time / timeAnalysis.totalTime) * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/20 border border-blue-600 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 Time estimates include mining, smelting, and crafting. Actual times may vary based on your tools and efficiency.
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'cost' && (
            <div>
              <h4 className="text-white font-semibold mb-4">Most Expensive Items</h4>
              <div className="space-y-2">
                {sortedCostBreakdown.map(([materialName, cost]) => (
                  <div key={materialName} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getBlockIcon(materialName)}</span>
                      <span className="text-white capitalize">
                        {materialName.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{Math.round(cost)}💎</div>
                      <div className="text-gray-400 text-sm">{Math.round((cost / costAnalysis.totalCost) * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-600 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  💰 Cost estimates are based on typical villager trading prices. You might find better deals through other means!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
