import { useState } from 'react';
import { Plus, Trash2, Check, X, Package, Search, Filter } from 'lucide-react';
import AutocompleteInput from './AutocompleteInput';
import BulkOperations from './BulkOperations';
import { getBlockIcon } from '../data/minecraftBlocks';

export default function MaterialChecklist({ project, materials, onAdd, onUpdate, onDelete, onSaveTemplate }) {
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', category: '' });
  const [filter, setFilter] = useState('all');

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
    <div className="flex-1 bg-gray-900 flex flex-col">
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package className="text-green-500" size={24} />
            <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          </div>
          <button
            onClick={() => onSaveTemplate(project.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            Save as Template
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm font-bold text-white">{collectedMaterials} / {totalMaterials}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">{Math.round(progress)}% Complete</div>
        </div>

        <div className="flex gap-2 mb-4">
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

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Material Name</label>
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
      </div>

      {/* Bulk Operations */}
      <div className="p-4 border-b border-gray-700">
        <BulkOperations
          materials={materials}
          onBulkUpdate={handleBulkUpdate}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onBulkImport={handleBulkImport}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedMaterials).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="text-gray-400 font-semibold mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map(material => (
                <div
                  key={material.id}
                  className={`bg-gray-800 p-3 rounded-lg border transition-all transform hover:scale-[1.02] ${
                    material.collected 
                      ? 'border-green-600 shadow-green-600/20 shadow-lg' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCollected(material)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${
                          material.collected 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {material.collected && <Check size={16} className="text-white" />}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getBlockIcon(material.name.toLowerCase().replace(/\s+/g, '_'))}</span>
                        <span className={`text-white font-medium ${material.collected ? 'line-through text-gray-500' : ''}`}>
                          {material.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => incrementQuantity(material, 1)}
                          className="bg-gray-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-all transform hover:scale-110"
                          title="Add 1"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => incrementQuantity(material, 10)}
                          className="bg-gray-700 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition-all transform hover:scale-110"
                          title="Add 10"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => incrementQuantity(material, 64)}
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
                        onClick={() => onDelete(material.id)}
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
    </div>
  );
}
