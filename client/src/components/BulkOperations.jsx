import { useState } from 'react';
import { CheckSquare, Square, Trash2, Download, Upload, Tag } from 'lucide-react';

export default function BulkOperations({ materials, onBulkUpdate, onBulkDelete, onBulkExport, onBulkImport }) {
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectMaterial = (materialId) => {
    const newSelected = new Set(selectedMaterials);
    if (newSelected.has(materialId)) {
      newSelected.delete(materialId);
    } else {
      newSelected.add(materialId);
    }
    setSelectedMaterials(newSelected);
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMaterials(new Set());
    } else {
      setSelectedMaterials(new Set(materials.map(m => m.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleBulkMarkCollected = (collected) => {
    const selectedMaterialsList = materials.filter(m => selectedMaterials.has(m.id));
    onBulkUpdate(selectedMaterialsList.map(m => ({ ...m, collected })));
    setSelectedMaterials(new Set());
    setSelectAll(false);
  };

  const handleBulkDelete = () => {
    if (!confirm(`Are you sure you want to delete ${selectedMaterials.size} materials?`)) {
      return;
    }
    const selectedMaterialsList = materials.filter(m => selectedMaterials.has(m.id));
    onBulkDelete(selectedMaterialsList.map(m => m.id));
    setSelectedMaterials(new Set());
    setSelectAll(false);
  };

  const handleBulkExport = () => {
    const selectedMaterialsList = materials.filter(m => selectedMaterials.has(m.id));
    if (selectedMaterialsList.length === 0) {
      alert('Please select materials to export');
      return;
    }
    onBulkExport(selectedMaterialsList);
  };

  const handleBulkImport = () => {
    onBulkImport();
  };

  const selectedCount = selectedMaterials.size;
  const hasSelection = selectedCount > 0;

  if (!materials || materials.length === 0) {
    return (
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="text-gray-400 text-center">No materials to manage</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <CheckSquare size={18} />
          Bulk Operations
        </h3>
        <span className="text-sm text-gray-400">
          {selectedCount} of {materials.length} selected
        </span>
      </div>

      {/* Selection Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
        >
          {selectAll ? <Square size={16} /> : <CheckSquare size={16} />}
          {selectAll ? 'Deselect All' : 'Select All'}
        </button>

        {hasSelection && (
          <span className="text-sm text-blue-400">
            {selectedCount} material{selectedCount !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {/* Bulk Actions */}
      {hasSelection && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => handleBulkMarkCollected(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
          >
            <CheckSquare size={14} />
            Mark Collected
          </button>

          <button
            onClick={() => handleBulkMarkCollected(false)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
          >
            <Square size={14} />
            Mark Missing
          </button>

          <button
            onClick={handleBulkExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
          >
            <Download size={14} />
            Export
          </button>

          <button
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      {/* Import Button (always visible) */}
      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={handleBulkImport}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center gap-2 transition"
        >
          <Upload size={16} />
          Import Materials from JSON
        </button>
      </div>

      {/* Quick Selection Tags */}
      <div className="border-t border-gray-700 pt-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Tag size={14} className="text-gray-400" />
          <span className="text-sm text-gray-400">Quick Select:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const collected = materials.filter(m => m.collected);
              setSelectedMaterials(new Set(collected.map(m => m.id)));
              setSelectAll(false);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
          >
            Collected ({materials.filter(m => m.collected).length})
          </button>
          
          <button
            onClick={() => {
              const missing = materials.filter(m => !m.collected);
              setSelectedMaterials(new Set(missing.map(m => m.id)));
              setSelectAll(false);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
          >
            Missing ({materials.filter(m => !m.collected).length})
          </button>

          <button
            onClick={() => {
              // Group by category and select most common
              const categoryCounts = {};
              materials.forEach(m => {
                categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
              });
              const mostCommonCategory = Object.entries(categoryCounts)
                .sort(([,a], [,b]) => b - a)[0]?.[0];
              
              if (mostCommonCategory) {
                const categoryMaterials = materials.filter(m => m.category === mostCommonCategory);
                setSelectedMaterials(new Set(categoryMaterials.map(m => m.id)));
                setSelectAll(false);
              }
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition"
          >
            Most Common Category
          </button>
        </div>
      </div>
    </div>
  );
}
