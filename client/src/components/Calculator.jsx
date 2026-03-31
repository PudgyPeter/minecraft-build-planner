import { useState } from 'react';
import { Calculator as CalcIcon, Plus } from 'lucide-react';
import { calculate } from '../api';

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
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          <CalcIcon size={20} />
          Calculator
        </h2>
        
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Item name (e.g., chest)"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
          />
          
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-gray-900 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none"
          />
          
          <label className="flex items-center gap-2 text-gray-300 text-sm">
            <input
              type="checkbox"
              checked={breakdown}
              onChange={(e) => setBreakdown(e.target.checked)}
              className="rounded"
            />
            Show crafting steps
          </label>
          
          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Calculate
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
                <div key={idx} className="bg-gray-900 p-2 rounded flex justify-between items-center">
                  <span className="text-white">{mat.name}</span>
                  <span className="text-gray-400 font-semibold">{mat.quantity}</span>
                </div>
              ))}
            </div>

            {result.craftingSteps && result.craftingSteps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-white font-semibold mb-2">Crafting Steps</h3>
                <div className="space-y-2">
                  {result.craftingSteps.map((step, idx) => (
                    <div key={idx} className="bg-gray-900 p-2 rounded" style={{ marginLeft: `${step.depth * 12}px` }}>
                      <div className="text-white text-sm">
                        {step.item} x{step.quantity}
                      </div>
                      <div className="text-gray-500 text-xs">
                        {Object.entries(step.ingredients).map(([ing, qty]) => (
                          <span key={ing} className="mr-2">
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
