import { useState } from 'react';
import { Plus, Trash2, Check, X, Package, Search, Filter, Star, Calculator, TrendingUp, Zap, FileText, ArrowDown, Grid3x3 } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import BulkOperations from './BulkOperations';
import CraftingCalculator from './CraftingCalculator';
import MaterialCostEstimator from './MaterialCostEstimator';
import QuickSearch from './QuickSearch';
import ProjectTemplates from './ProjectTemplates';
import BaseMaterialsCalculator from './BaseMaterialsCalculator';
import CraftingGrid from './CraftingGrid';
import BlockIcon from './BlockIcon';
import { useFavorites } from '../hooks/useFavorites';

export default function MaterialChecklist({ project, materials, onAdd, onUpdate, onDelete, onSaveTemplate }) {
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', category: '' });
  const [filter, setFilter] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBaseMaterials, setShowBaseMaterials] = useState(false);
  const [showCraftingGrid, setShowCraftingGrid] = useState(false);
  const [selectedCraftingItem, setSelectedCraftingItem] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const handleAdd = () => {
    if (newMaterial.name && newMaterial.quantity) {
      onAdd({
        projectId: project.id,
        name: newMaterial.name,
        quantity: parseInt(newMaterial.quantity),
        category: newMaterial.category || 'General'
      });
      setNewMaterial({ name: '', quantity: '', category: '' });
    }
  };

  const handleBulkUpdate = (updatedMaterials) => {
    updatedMaterials.forEach(material => {
      onUpdate(material.id, material);
    });
  };

  const handleBulkDelete = (materialIds) => {
    materialIds.forEach(id => {
      onDelete(id);
    });
  };

  const handleBulkExport = (selectedMaterials) => {
    const exportData = {
      timestamp: new Date().toISOString(),
      projectName: project.name,
      materials: selectedMaterials.map(m => ({
        name: m.name,
        quantity: m.quantity,
        category: m.category,
        collected: m.collected
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}-materials-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleBulkImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target.result);
          
          if (importData.materials && Array.isArray(importData.materials)) {
            importData.materials.forEach(material => {
              onAdd({
                projectId: project.id,
                name: material.name,
                quantity: material.quantity,
                category: material.category || 'General',
                collected: material.collected || false
              });
            });
            
            alert(`Successfully imported ${importData.materials.length} materials!`);
          } else {
            alert('Invalid file format. Please select a valid materials export file.');
          }
        } catch (error) {
          alert('Error reading file. Please ensure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const toggleCollected = (material) => {
    onUpdate(material.id, { collected: !material.collected });
  };

  const incrementQuantity = (material, amount) => {
    onUpdate(material.id, { quantity: material.quantity + amount });
  };

  const filteredMaterials = materials.filter(m => {
    if (filter === 'missing') return !m.collected;
    if (filter === 'collected') return m.collected;
    return true;
  });

  const groupedMaterials = filteredMaterials.reduce((acc, m) => {
    const cat = m.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  const totalMaterials = materials.length;
  const collectedMaterials = materials.filter(m => m.collected).length;
  const progress = totalMaterials > 0 ? (collectedMaterials / totalMaterials) * 100 : 0;

  if (!project) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Select a project to view materials</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 flex flex-col overflow-hidden" style={{ minWidth: 0, width: '100%' }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-gray-800/30 backdrop-blur-sm shrink-0">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm text-gray-400">{collectedMaterials}/{totalMaterials}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-green-500" size={24} />
            <h2 className="text-xl font-bold text-white">Materials</h2>
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {totalMaterials} items
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuickSearch(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              title="Quick Add Materials"
            >
              <Zap size={16} />
            </button>
            <button
              onClick={() => setShowCostEstimator(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              title="Cost Analysis"
            >
              <TrendingUp size={16} />
            </button>
            <button
              onClick={() => setShowBaseMaterials(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              title="Base Materials Calculator"
            >
              <ArrowDown size={16} />
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              title="Project Templates"
            >
              <FileText size={16} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Filter Tabs */}
      <div className="px-6 py-3 border-b border-gray-800 bg-gray-800/20 shrink-0">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
              filter === 'all' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            All ({totalMaterials})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
              filter === 'missing' 
                ? 'bg-orange-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Missing ({totalMaterials - collectedMaterials})
          </button>
          <button
            onClick={() => setFilter('collected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
              filter === 'collected' 
                ? 'bg-green-600 text-white shadow-lg' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Collected ({collectedMaterials})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Add Material Form */}
        <div className="p-6 border-b border-gray-800 bg-gray-800/20 shrink-0">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-2">Add Material</label>
              <AutocompleteInput
                value={newMaterial.name}
                onChange={(value) => setNewMaterial({ ...newMaterial, name: value })}
                placeholder="Search for a material..."
                className="bg-gray-800"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs font-medium text-gray-400 mb-1">Quantity</label>
              <input
                type="number"
                placeholder="Qty"
                value={newMaterial.quantity}
                onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none text-center"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
              <input
                type="text"
                placeholder="Category"
                value={newMaterial.category}
                onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              title="Add Material"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900/50">
          {Object.entries(groupedMaterials).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="text-gray-400 font-semibold mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map(material => (
                <div
                  key={material.id}
                  className={`bg-gray-800 p-3 rounded-lg border transition-all transform hover:scale-[1.02] cursor-pointer ${
                    material.collected 
                      ? 'border-green-600 shadow-green-600/20 shadow-lg' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedMaterial(material)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCollected(material);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                          material.collected 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {material.collected && <Check size={16} className="text-white" />}
                      </button>
                      <div className="flex items-center gap-2">
                        <BlockIcon 
                          blockName={material.name.toLowerCase().replace(/\s+/g, '_')} 
                          size={24}
                        />
                        <span className={`text-white font-medium ${material.collected ? 'line-through text-gray-500' : ''}`}>
                          {material.name}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMaterial(material);
                          }}
                          className="p-1 hover:bg-blue-600 rounded transition-all transform hover:scale-110"
                          title="Calculate crafting materials"
                        >
                          <Calculator size={14} className="text-blue-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCraftingItem(material.name.toLowerCase().replace(/\s+/g, '_'));
                            setShowCraftingGrid(true);
                          }}
                          className="p-1 hover:bg-purple-600 rounded transition-all transform hover:scale-110"
                          title="View crafting recipe"
                        >
                          <Grid3x3 size={14} className="text-purple-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            isFavorite(material.name) ? removeFavorite(material.name) : addFavorite(material);
                          }}
                          className="p-1 hover:bg-gray-700 rounded transition-all transform hover:scale-110"
                          title={isFavorite(material.name) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star 
                            size={14} 
                            className={isFavorite(material.name) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}
                          />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            incrementQuantity(material, 1);
                          }}
                          className="bg-gray-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-all transform hover:scale-110"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            incrementQuantity(material, 10);
                          }}
                          className="bg-gray-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-all transform hover:scale-110"
                          title="Add 10"
                        >
                          +10
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            incrementQuantity(material, 64);
                          }}
                          className="bg-gray-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-all transform hover:scale-110"
                          title="Add Stack"
                        >
                          +64
                        </button>
                      </div>
                      <div className="bg-gray-700 px-3 py-1 rounded-lg min-w-[60px] text-center">
                        <span className="text-white font-bold">{material.quantity}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(material.id);
                        }}
                        className="p-2 hover:bg-red-600 rounded-lg transition-all transform hover:scale-110"
                        title="Delete Material"
                      >
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Crafting Calculator Modal */}
      {selectedMaterial && (
        <CraftingCalculator
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
      
      {/* Cost Estimator Modal */}
      {showCostEstimator && (
        <MaterialCostEstimator
          materials={materials}
          onClose={() => setShowCostEstimator(false)}
        />
      )}
      
      {/* Quick Search Modal */}
      {showQuickSearch && (
        <QuickSearch
          onAddMaterial={(material) => {
            onAdd({
              projectId: project.id,
              name: material.name,
              quantity: material.quantity,
              category: material.category
            });
          }}
          onClose={() => setShowQuickSearch(false)}
        />
      )}
      
      {/* Project Templates Modal */}
      {showTemplates && (
        <ProjectTemplates
          onUseTemplate={(template) => {
            // Add all materials from template
            template.materials.forEach(material => {
              onAdd({
                projectId: project.id,
                name: material.name,
                quantity: material.quantity,
                category: material.category
              });
            });
          }}
          onClose={() => setShowTemplates(false)}
        />
      )}
      
      {/* Base Materials Calculator Modal */}
      {showBaseMaterials && (
        <BaseMaterialsCalculator
          materials={materials}
          onClose={() => setShowBaseMaterials(false)}
        />
      )}
      
      {/* Crafting Grid Modal */}
      {showCraftingGrid && (
        <CraftingGrid
          item={selectedCraftingItem}
          onClose={() => setShowCraftingGrid(false)}
          onBlockClick={(blockName) => {
            // Add the clicked block to materials
            onAdd({
              projectId: project.id,
              name: blockName.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
              quantity: 1,
              category: 'General'
            });
          }}
        />
      )}
      </div>
    </div>
  );
}
