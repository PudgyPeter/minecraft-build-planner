import { useState } from 'react';
import { FileText, Download, Upload, Star, Clock, Users, X, Plus } from 'lucide-react';

const projectTemplates = [
  {
    id: 'starter_house',
    name: 'Starter House',
    description: 'Basic wooden house with crafting area and storage',
    icon: '🏠',
    difficulty: 'Easy',
    estimatedTime: '2-3 hours',
    materials: [
      { name: 'Oak Planks', quantity: 256, category: 'Wood' },
      { name: 'Oak Logs', quantity: 64, category: 'Wood' },
      { name: 'Cobblestone', quantity: 128, category: 'Stone' },
      { name: 'Glass', quantity: 32, category: 'Decoration' },
      { name: 'Wooden Door', quantity: 4, category: 'Wood' },
      { name: 'Crafting Table', quantity: 2, category: 'Utility' },
      { name: 'Chest', quantity: 4, category: 'Utility' },
      { name: 'Furnace', quantity: 2, category: 'Utility' },
      { name: 'Torch', quantity: 16, category: 'Decoration' },
      { name: 'Bed', quantity: 2, category: 'Decoration' }
    ]
  },
  {
    id: 'stone_foundation',
    name: 'Stone Foundation Base',
    description: 'Stone base for larger buildings with walls and basic rooms',
    icon: '🏰',
    difficulty: 'Medium',
    estimatedTime: '4-6 hours',
    materials: [
      { name: 'Cobblestone', quantity: 512, category: 'Stone' },
      { name: 'Stone Bricks', quantity: 256, category: 'Stone' },
      { name: 'Oak Planks', quantity: 128, category: 'Wood' },
      { name: 'Glass', quantity: 64, category: 'Decoration' },
      { name: 'Iron Door', quantity: 2, category: 'Items' },
      { name: 'Chest', quantity: 8, category: 'Utility' },
      { name: 'Crafting Table', quantity: 3, category: 'Utility' },
      { name: 'Furnace', quantity: 4, category: 'Utility' },
      { name: 'Torch', quantity: 32, category: 'Decoration' },
      { name: 'Ladder', quantity: 16, category: 'Decoration' }
    ]
  },
  {
    id: 'farm_setup',
    name: 'Complete Farm Setup',
    description: 'Wheat, carrot, potato, and animal farm with storage',
    icon: '🌾',
    difficulty: 'Easy',
    estimatedTime: '1-2 hours',
    materials: [
      { name: 'Oak Planks', quantity: 128, category: 'Wood' },
      { name: 'Fence', quantity: 64, category: 'Wood' },
      { name: 'Fence Gate', quantity: 8, category: 'Wood' },
      { name: 'Water Bucket', quantity: 4, category: 'Items' },
      { name: 'Hoe', quantity: 2, category: 'Items' },
      { name: 'Wheat Seeds', quantity: 32, category: 'Farming' },
      { name: 'Carrot', quantity: 16, category: 'Farming' },
      { name: 'Potato', quantity: 16, category: 'Farming' },
      { name: 'Chest', quantity: 4, category: 'Utility' },
      { name: 'Torch', quantity: 8, category: 'Decoration' }
    ]
  },
  {
    id: 'nether_portal',
    name: 'Nether Portal Room',
    description: 'Safe portal room with storage and protection',
    icon: '🌀',
    difficulty: 'Medium',
    estimatedTime: '2-3 hours',
    materials: [
      { name: 'Obsidian', quantity: 14, category: 'Special' },
      { name: 'Cobblestone', quantity: 256, category: 'Stone' },
      { name: 'Iron Blocks', quantity: 8, category: 'Special' },
      { name: 'Iron Door', quantity: 2, category: 'Items' },
      { name: 'Chest', quantity: 2, category: 'Utility' },
      { name: 'Crafting Table', quantity: 1, category: 'Utility' },
      { name: 'Furnace', quantity: 1, category: 'Utility' },
      { name: 'Flint and Steel', quantity: 1, category: 'Items' },
      { name: 'Torch', quantity: 16, category: 'Decoration' },
      { name: 'Water Bucket', quantity: 2, category: 'Items' }
    ]
  },
  {
    id: 'storage_system',
    name: 'Mass Storage System',
    description: 'Organized storage room with sorting system',
    icon: '📦',
    difficulty: 'Hard',
    estimatedTime: '6-8 hours',
    materials: [
      { name: 'Chest', quantity: 64, category: 'Utility' },
      { name: 'Hopper', quantity: 32, category: 'Redstone' },
      { name: 'Redstone', quantity: 128, category: 'Redstone' },
      { name: 'Stone', quantity: 1024, category: 'Stone' },
      { name: 'Sign', quantity: 64, category: 'Wood' },
      { name: 'Torch', quantity: 32, category: 'Decoration' },
      { name: 'Iron Bars', quantity: 16, category: 'Items' },
      { name: 'Redstone Torch', quantity: 16, category: 'Redstone' },
      { name: 'Repeater', quantity: 8, category: 'Redstone' },
      { name: 'Comparator', quantity: 4, category: 'Redstone' }
    ]
  },
  {
    id: 'enchanting_room',
    name: 'Enchanting Room',
    description: 'Full enchanting setup with bookshelves and storage',
    icon: '✨',
    difficulty: 'Medium',
    estimatedTime: '3-4 hours',
    materials: [
      { name: 'Bookshelf', quantity: 15, category: 'Decoration' },
      { name: 'Obsidian', quantity: 4, category: 'Special' },
      { name: 'Diamond', quantity: 2, category: 'Items' },
      { name: 'Book', quantity: 1, category: 'Items' },
      { name: 'Cobblestone', quantity: 128, category: 'Stone' },
      { name: 'Chest', quantity: 4, category: 'Utility' },
      { name: 'Crafting Table', quantity: 2, category: 'Utility' },
      { name: 'Anvil', quantity: 1, category: 'Utility' },
      { name: 'Torch', quantity: 16, category: 'Decoration' },
      { name: 'Lapis Lazuli', quantity: 64, category: 'Items' }
    ]
  },
  {
    id: 'redstone_machine',
    name: 'Redstone Sorting Machine',
    description: 'Automatic item sorter with storage system',
    icon: '⚡',
    difficulty: 'Hard',
    estimatedTime: '8-10 hours',
    materials: [
      { name: 'Redstone', quantity: 256, category: 'Redstone' },
      { name: 'Hopper', quantity: 48, category: 'Redstone' },
      { name: 'Chest', quantity: 32, category: 'Utility' },
      { name: 'Redstone Torch', quantity: 32, category: 'Redstone' },
      { name: 'Repeater', quantity: 16, category: 'Redstone' },
      { name: 'Comparator', quantity: 12, category: 'Redstone' },
      { name: 'Stone', quantity: 512, category: 'Stone' },
      { name: 'Iron Bars', quantity: 32, category: 'Items' },
      { name: 'Dropper', quantity: 16, category: 'Redstone' },
      { name: 'Observer', quantity: 8, category: 'Redstone' }
    ]
  },
  {
    id: 'tree_farm',
    name: 'Automatic Tree Farm',
    description: 'Fully automatic tree farm with collection system',
    icon: '🌳',
    difficulty: 'Hard',
    estimatedTime: '5-7 hours',
    materials: [
      { name: 'Oak Sapling', quantity: 32, category: 'Farming' },
      { name: 'Observer', quantity: 16, category: 'Redstone' },
      { name: 'Piston', quantity: 16, category: 'Redstone' },
      { name: 'Hopper', quantity: 8, category: 'Redstone' },
      { name: 'Chest', quantity: 4, category: 'Utility' },
      { name: 'Redstone', quantity: 64, category: 'Redstone' },
      { name: 'Dirt', quantity: 64, category: 'Items' },
      { name: 'Glass', quantity: 32, category: 'Decoration' },
      { name: 'Torch', quantity: 16, category: 'Decoration' },
      { name: 'Bone Meal', quantity: 16, category: 'Items' }
    ]
  }
];

export default function ProjectTemplates({ onUseTemplate, onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  const handleUseTemplate = (template) => {
    onUseTemplate(template);
    onClose();
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="text-purple-500" size={24} />
              <h3 className="text-xl font-bold text-white">Project Templates</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTemplates.map(template => (
              <div
                key={template.id}
                className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all cursor-pointer"
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <h4 className="text-white font-semibold">{template.name}</h4>
                      <p className="text-gray-400 text-sm">{template.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Clock size={12} />
                    {template.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Package size={12} />
                    {template.materials.length} items
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-all transform hover:scale-105"
                >
                  Use Template
                </button>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h4 className="text-white font-semibold mb-3">Materials for {selectedTemplate.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {selectedTemplate.materials.map((material, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{material.name}</span>
                    <span className="text-white font-medium">{material.quantity}</span>
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
