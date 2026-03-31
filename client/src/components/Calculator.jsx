import { useState } from 'react';
import { Calculator as CalcIcon, Plus, Zap, Package } from 'lucide-react';
import { calculate } from '../api';
import AutocompleteInput from './AutocompleteInput';
import { getBlockIcon } from '../data/minecraftBlocks';

export default function Calculator({ project, onAddToProject }) {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [breakdown, setBreakdown] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = async () => {
    if (!item || !quantity) return;
    
    try {
      const data = await calculate(item, parseInt(quantity), breakdown);
      setResult(data);
    } catch (error) {
      console.error('Calculation error:', error);
    }
  };

  const handleAddAll = () => {
    if (result && project) {
      onAddToProject(result.baseMaterials);
      setResult(null);
      setItem('');
      setQuantity('');
    }
  };

  return (
    <div className="w-80 bg-gradient-to-b from-gray-800 to-gray-900 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-blue-900 to-purple-900">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Zap className="text-yellow-400" size={24} />
          Crafting Calculator
        </h2>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Item Name</label>
            <AutocompleteInput
              value={item}
              onChange={setItem}
              placeholder="Search for an item..."
              className="bg-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Quantity</label>
            <input
              type="number"
              placeholder="How many?"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
            />
          </div>
          
          <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer hover:text-white transition">
            <input
              type="checkbox"
              checked={breakdown}
              onChange={(e) => setBreakdown(e.target.checked)}
              className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">Show crafting steps</span>
          </label>
          
          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
          >
            <CalcIcon size={16} className="inline mr-2" />
            Calculate Materials
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {result && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Base Materials</h3>
              {project && (
                <button
                  onClick={handleAddAll}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1 transition"
                >
                  <Plus size={14} />
                  Add All
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {result.baseMaterials.map((mat, idx) => (
                <div key={idx} className="bg-gray-900 p-3 rounded-lg flex justify-between items-center border border-gray-700 hover:border-gray-600 transition">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getBlockIcon(mat.name.toLowerCase().replace(/\s+/g, '_'))}</span>
                    <span className="text-white font-medium">{mat.name}</span>
                  </div>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                    {mat.quantity}
                  </span>
                </div>
              ))}
            </div>

            {result.craftingSteps && result.craftingSteps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Package size={16} />
                  Crafting Steps
                </h3>
                <div className="space-y-2">
                  {result.craftingSteps.map((step, idx) => (
                    <div key={idx} className="bg-gray-900 p-3 rounded-lg border border-gray-700" style={{ marginLeft: `${step.depth * 16}px` }}>
                      <div className="flex items-center gap-2 text-white text-sm font-medium">
                        <span className="text-lg">{getBlockIcon(step.item.toLowerCase().replace(/\s+/g, '_'))}</span>
                        {step.item} x{step.quantity}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {Object.entries(step.ingredients).map(([ing, qty]) => (
                          <span key={ing} className="mr-3 inline-flex items-center gap-1">
                            <span>{getBlockIcon(ing.toLowerCase().replace(/\s+/g, '_'))}</span>
                            {ing}: {qty}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && (
          <div className="text-center text-gray-500 mt-8">
            <CalcIcon size={48} className="mx-auto mb-2 opacity-50" />
            <p>Enter an item and quantity to calculate required materials</p>
          </div>
        )}
      </div>
    </div>
  );
}
