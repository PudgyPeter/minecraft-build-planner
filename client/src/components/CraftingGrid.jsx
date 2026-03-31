import { useState } from 'react';
import { X, Grid, ArrowRight, Package } from 'lucide-react';
import BlockIcon from './BlockIcon';

// Visual crafting recipes with grid layouts
const craftingRecipes = {
  // Polished stones (2x2 grid)
  'polished_diorite': {
    grid: [
      ['diorite', 'diorite', null],
      ['diorite', 'diorite', null],
      [null, null, null]
    ],
    output: { item: 'polished_diorite', count: 4 },
    shapeless: false
  },
  'polished_andesite': {
    grid: [
      ['andesite', 'andesite', null],
      ['andesite', 'andesite', null],
      [null, null, null]
    ],
    output: { item: 'polished_andesite', count: 4 },
    shapeless: false
  },
  'polished_granite': {
    grid: [
      ['granite', 'granite', null],
      ['granite', 'granite', null],
      [null, null, null]
    ],
    output: { item: 'polished_granite', count: 4 },
    shapeless: false
  },
  
  // Diorite (shapeless recipe)
  'diorite': {
    grid: [
      ['cobblestone', null, 'nether_quartz'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'diorite', count: 2 },
    shapeless: true,
    description: 'Shapeless: 2 Cobblestone + 1 Nether Quartz'
  },
  
  // Andesite (shapeless recipe)
  'andesite': {
    grid: [
      ['cobblestone', null, 'diorite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'andesite', count: 2 },
    shapeless: true,
    description: 'Shapeless: 2 Cobblestone + 1 Diorite'
  },
  
  // Granite (shapeless recipe)
  'granite': {
    grid: [
      ['diorite', null, 'nether_quartz'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'granite', count: 2 },
    shapeless: true,
    description: 'Shapeless: 2 Diorite + 1 Nether Quartz'
  },
  
  // Stairs (shapeless)
  'stone_stairs': {
    grid: [
      ['stone', null, null],
      ['stone', 'stone', null],
      ['stone', 'stone', 'stone']
    ],
    output: { item: 'stone_stairs', count: 4 },
    shapeless: false
  },
  'diorite_stairs': {
    grid: [
      ['diorite', null, null],
      ['diorite', 'diorite', null],
      ['diorite', 'diorite', 'diorite']
    ],
    output: { item: 'diorite_stairs', count: 4 },
    shapeless: false
  },
  'andesite_stairs': {
    grid: [
      ['andesite', null, null],
      ['andesite', 'andesite', null],
      ['andesite', 'andesite', 'andesite']
    ],
    output: { item: 'andesite_stairs', count: 4 },
    shapeless: false
  },
  'granite_stairs': {
    grid: [
      ['granite', null, null],
      ['granite', 'granite', null],
      ['granite', 'granite', 'granite']
    ],
    output: { item: 'granite_stairs', count: 4 },
    shapeless: false
  },
  
  // Slabs (shapeless)
  'stone_slab': {
    grid: [
      ['stone', 'stone', 'stone'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'stone_slab', count: 6 },
    shapeless: false
  },
  'diorite_slab': {
    grid: [
      ['diorite', 'diorite', 'diorite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'diorite_slab', count: 6 },
    shapeless: false
  },
  'andesite_slab': {
    grid: [
      ['andesite', 'andesite', 'andesite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'andesite_slab', count: 6 },
    shapeless: false
  },
  'granite_slab': {
    grid: [
      ['granite', 'granite', 'granite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'granite_slab', count: 6 },
    shapeless: false
  },
  
  // Walls (shapeless)
  'stone_wall': {
    grid: [
      ['stone', 'stone', 'stone'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'stone_wall', count: 6 },
    shapeless: true,
    description: 'Shapeless: Can be crafted in any arrangement'
  },
  'diorite_wall': {
    grid: [
      ['diorite', 'diorite', 'diorite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'diorite_wall', count: 6 },
    shapeless: true,
    description: 'Shapeless: Can be crafted in any arrangement'
  },
  'andesite_wall': {
    grid: [
      ['andesite', 'andesite', 'andesite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'andesite_wall', count: 6 },
    shapeless: true,
    description: 'Shapeless: Can be crafted in any arrangement'
  },
  'granite_wall': {
    grid: [
      ['granite', 'granite', 'granite'],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'granite_wall', count: 6 },
    shapeless: true,
    description: 'Shapeless: Can be crafted in any arrangement'
  },
  
  // Wood planks
  'oak_planks': {
    grid: [
      ['oak_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'oak_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Oak Log = 4 Planks'
  },
  'spruce_planks': {
    grid: [
      ['spruce_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'spruce_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Spruce Log = 4 Planks'
  },
  'birch_planks': {
    grid: [
      ['birch_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'birch_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Birch Log = 4 Planks'
  },
  'jungle_planks': {
    grid: [
      ['jungle_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'jungle_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Jungle Log = 4 Planks'
  },
  'acacia_planks': {
    grid: [
      ['acacia_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'acacia_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Acacia Log = 4 Planks'
  },
  'dark_oak_planks': {
    grid: [
      ['dark_oak_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'dark_oak_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Dark Oak Log = 4 Planks'
  },
  'mangrove_planks': {
    grid: [
      ['mangrove_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'mangrove_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Mangrove Log = 4 Planks'
  },
  'cherry_planks': {
    grid: [
      ['cherry_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'cherry_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Cherry Log = 4 Planks'
  },
  'pale_oak_planks': {
    grid: [
      ['pale_oak_log', null, null],
      [null, null, null],
      [null, null, null]
    ],
    output: { item: 'pale_oak_planks', count: 4 },
    shapeless: true,
    description: 'Shapeless: 1 Pale Oak Log = 4 Planks'
  },
  
  // Sticks
  'stick': {
    grid: [
      ['oak_planks', null, null],
      ['oak_planks', null, null],
      [null, null, null]
    ],
    output: { item: 'stick', count: 4 },
    shapeless: false
  }
};

export default function CraftingGrid({ item, onClose, onBlockClick }) {
  const recipe = craftingRecipes[item];
  
  if (!recipe) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Grid size={20} />
              Crafting Recipe
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-400">No crafting recipe found for {item}</p>
        </div>
      </div>
    );
  }

  const getDisplayName = (itemName) => {
    if (!itemName) return '';
    return itemName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Grid size={20} />
            Crafting Recipe: {getDisplayName(item)}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-8 mb-4">
          {/* Crafting Grid */}
          <div className="flex-1">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Crafting Grid</h4>
              <div className="bg-gray-900 border-2 border-gray-600 rounded-lg p-2 inline-block">
                <div className="grid grid-cols-3 gap-1">
                  {recipe.grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-12 h-12 border border-gray-600 rounded flex items-center justify-center transition-all ${
                          cell ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' : 'bg-gray-800'
                        }`}
                        onClick={() => cell && onBlockClick && onBlockClick(cell)}
                      >
                        {cell && (
                          <div className="transform scale-75">
                            <BlockIcon blockName={cell} size={24} />
                          </div>
                        )}
                      </div>
                    ))
                  ))}
                </div>
              </div>
            </div>

            {recipe.shapeless && (
              <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-3 mb-3">
                <p className="text-xs text-blue-300">
                  <strong>Shapeless Recipe:</strong> {recipe.description || 'Items can be placed in any arrangement'}
                </p>
              </div>
            )}
          </div>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center">
            <ArrowRight size={24} className="text-gray-400 mb-2" />
            <div className="text-xs text-gray-400 text-center">Craft</div>
          </div>

          {/* Output */}
          <div className="flex-1">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Result</h4>
              <div className="bg-gray-900 border-2 border-green-600 rounded-lg p-4 inline-block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-700 border border-gray-600 rounded flex items-center justify-center">
                    <BlockIcon blockName={recipe.output.item} size={32} />
                  </div>
                  <div>
                    <div className="text-white font-medium">{getDisplayName(recipe.output.item)}</div>
                    <div className="text-green-400 text-lg font-bold">x{recipe.output.count}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Materials List */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Required Materials</h4>
          <div className="space-y-1">
            {Object.entries(
              recipe.grid.flat().filter(Boolean).reduce((acc, item) => {
                acc[item] = (acc[item] || 0) + 1;
                return acc;
              }, {})
            ).map(([material, count]) => (
              <div key={material} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <BlockIcon blockName={material} size={16} />
                  <span className="text-gray-300">{getDisplayName(material)}</span>
                </div>
                <span className="text-white font-medium">x{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
