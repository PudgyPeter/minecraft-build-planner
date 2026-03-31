import { useState } from 'react';
import { Plus, Trash2, Check, X } from 'lucide-react';

export default function MaterialChecklist({ project, materials, onAdd, onUpdate, onDelete, onSaveTemplate }) {
  const [newMaterial, setNewMaterial] = useState({ name: '', quantity: '', category: '' });
  const [filter, setFilter] = useState('all');

  const handleAdd = () => {
    if (newMaterial.name && newMaterial.quantity) {
      onAdd({
        projectId: project.id,
        name: newMaterial.name,
        quantity: parseInt(newMaterial.quantity),
        category: newMaterial.category || null
      });
      setNewMaterial({ name: '', quantity: '', category: '' });
    }
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
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          <button
            onClick={() => onSaveTemplate(project.id)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
          >
            Save as Template
          </button>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Progress</span>
            <span>{collectedMaterials} / {totalMaterials}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm transition ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1 rounded text-sm transition ${
              filter === 'missing' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Missing
          </button>
          <button
            onClick={() => setFilter('collected')}
            className={`px-3 py-1 rounded text-sm transition ${
              filter === 'collected' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Collected
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Material name"
            value={newMaterial.name}
            onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Qty"
            value={newMaterial.quantity}
            onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
            className="w-20 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Category"
            value={newMaterial.category}
            onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
            className="w-32 bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
          />
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedMaterials).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="text-gray-400 font-semibold mb-2">{category}</h3>
            <div className="space-y-2">
              {items.map(material => (
                <div
                  key={material.id}
                  className={`bg-gray-800 p-3 rounded border ${
                    material.collected ? 'border-green-600' : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleCollected(material)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition ${
                          material.collected ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {material.collected && <Check size={16} className="text-white" />}
                      </button>
                      <span className={`text-white ${material.collected ? 'line-through text-gray-500' : ''}`}>
                        {material.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => incrementQuantity(material, 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => incrementQuantity(material, 10)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => incrementQuantity(material, 64)}
                          className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
                        >
                          +64
                        </button>
                      </div>
                      <span className="text-white font-semibold w-16 text-center">
                        {material.quantity}
                      </span>
                      <button
                        onClick={() => onDelete(material.id)}
                        className="p-1 hover:bg-red-600 rounded transition"
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
