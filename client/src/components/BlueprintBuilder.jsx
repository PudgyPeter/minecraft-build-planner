import { useState, useRef, useCallback, useEffect } from 'react';
import { Grid, Eraser, Download, Upload, Trash2, ZoomIn, ZoomOut, Layers, Package, X, ChevronLeft, ChevronRight, Plus, Minus, RotateCcw, Save, Eye } from 'lucide-react';
import BlockIcon from './BlockIcon';
import AutocompleteInput from './AutocompleteInput';

const CELL_SIZE = 32;
const DEFAULT_GRID_WIDTH = 32;
const DEFAULT_GRID_HEIGHT = 32;
const MAX_LAYERS = 16;

export default function BlueprintBuilder({ project, onAddToProject }) {
  const [gridWidth, setGridWidth] = useState(DEFAULT_GRID_WIDTH);
  const [gridHeight, setGridHeight] = useState(DEFAULT_GRID_HEIGHT);
  const [layers, setLayers] = useState([createEmptyLayer(DEFAULT_GRID_WIDTH, DEFAULT_GRID_HEIGHT)]);
  const [activeLayer, setActiveLayer] = useState(0);
  const [selectedBlock, setSelectedBlock] = useState('stone');
  const [tool, setTool] = useState('place'); // 'place' or 'erase'
  const [zoom, setZoom] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [showBlockPicker, setShowBlockPicker] = useState(true);
  const [blueprintName, setBlueprintName] = useState('Untitled Blueprint');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showLayerPreview, setShowLayerPreview] = useState(false);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  function createEmptyLayer(w, h) {
    return Array(h).fill(null).map(() => Array(w).fill(null));
  }

  // Save state to history for undo
  const saveToHistory = useCallback((newLayers) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.stringify(newLayers));
    // Keep max 50 history entries
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers(JSON.parse(history[historyIndex - 1]));
    }
  }, [history, historyIndex]);

  // Place or erase a block
  const handleCellAction = useCallback((x, y) => {
    if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return;
    
    const newLayers = layers.map(l => l.map(r => [...r]));
    if (tool === 'place') {
      newLayers[activeLayer][y][x] = selectedBlock;
    } else {
      newLayers[activeLayer][y][x] = null;
    }
    setLayers(newLayers);
  }, [layers, activeLayer, selectedBlock, tool, gridWidth, gridHeight]);

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (CELL_SIZE * zoom));
    const y = Math.floor((e.clientY - rect.top) / (CELL_SIZE * zoom));
    setIsDrawing(true);
    handleCellAction(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (CELL_SIZE * zoom));
    const y = Math.floor((e.clientY - rect.top) / (CELL_SIZE * zoom));
    handleCellAction(x, y);
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory(layers);
    }
  };

  // Calculate materials from all layers
  const getMaterials = () => {
    const counts = {};
    layers.forEach(layer => {
      layer.forEach(row => {
        row.forEach(cell => {
          if (cell) {
            counts[cell] = (counts[cell] || 0) + 1;
          }
        });
      });
    });
    return Object.entries(counts).sort(([,a], [,b]) => b - a);
  };

  const getTotalBlocks = () => {
    let total = 0;
    layers.forEach(layer => {
      layer.forEach(row => {
        row.forEach(cell => {
          if (cell) total++;
        });
      });
    });
    return total;
  };

  // Add materials to project
  const handleAddToProject = () => {
    const materials = getMaterials();
    if (materials.length === 0) return;
    
    const materialList = materials.map(([name, qty]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      quantity: qty
    }));
    
    onAddToProject(materialList);
  };

  // Clear current layer
  const clearLayer = () => {
    const newLayers = layers.map(l => l.map(r => [...r]));
    newLayers[activeLayer] = createEmptyLayer(gridWidth, gridHeight);
    setLayers(newLayers);
    saveToHistory(newLayers);
  };

  // Clear all layers
  const clearAll = () => {
    if (!confirm('Clear all layers?')) return;
    const newLayers = [createEmptyLayer(gridWidth, gridHeight)];
    setLayers(newLayers);
    setActiveLayer(0);
    saveToHistory(newLayers);
  };

  // Add a new layer
  const addLayer = () => {
    if (layers.length >= MAX_LAYERS) return;
    const newLayers = [...layers, createEmptyLayer(gridWidth, gridHeight)];
    setLayers(newLayers);
    setActiveLayer(newLayers.length - 1);
    saveToHistory(newLayers);
  };

  // Remove current layer
  const removeLayer = () => {
    if (layers.length <= 1) return;
    const newLayers = layers.filter((_, i) => i !== activeLayer);
    setLayers(newLayers);
    setActiveLayer(Math.min(activeLayer, newLayers.length - 1));
    saveToHistory(newLayers);
  };

  // Export blueprint as JSON
  const exportBlueprint = () => {
    const data = {
      name: blueprintName,
      width: gridWidth,
      height: gridHeight,
      layers: layers,
      materials: getMaterials(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${blueprintName.replace(/\s+/g, '_')}.blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import blueprint from JSON
  const importBlueprint = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.layers && data.width && data.height) {
            setGridWidth(data.width);
            setGridHeight(data.height);
            setLayers(data.layers);
            setBlueprintName(data.name || 'Imported Blueprint');
            setActiveLayer(0);
            saveToHistory(data.layers);
          }
        } catch {
          alert('Invalid blueprint file');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Quick block categories for the picker
  const blockCategories = {
    'Stone': ['stone', 'cobblestone', 'stone_bricks', 'andesite', 'diorite', 'granite', 'polished_andesite', 'polished_diorite', 'polished_granite', 'deepslate', 'tuff', 'calcite'],
    'Wood': ['oak_planks', 'spruce_planks', 'birch_planks', 'jungle_planks', 'acacia_planks', 'dark_oak_planks', 'mangrove_planks', 'cherry_planks', 'bamboo_planks', 'crimson_planks', 'warped_planks'],
    'Logs': ['oak_log', 'spruce_log', 'birch_log', 'jungle_log', 'acacia_log', 'dark_oak_log', 'mangrove_log', 'cherry_log'],
    'Concrete': ['white_concrete', 'orange_concrete', 'magenta_concrete', 'light_blue_concrete', 'yellow_concrete', 'lime_concrete', 'pink_concrete', 'gray_concrete', 'light_gray_concrete', 'cyan_concrete', 'purple_concrete', 'blue_concrete', 'brown_concrete', 'green_concrete', 'red_concrete', 'black_concrete'],
    'Wool': ['white_wool', 'orange_wool', 'magenta_wool', 'light_blue_wool', 'yellow_wool', 'lime_wool', 'pink_wool', 'gray_wool', 'light_gray_wool', 'cyan_wool', 'purple_wool', 'blue_wool', 'brown_wool', 'green_wool', 'red_wool', 'black_wool'],
    'Glass': ['glass', 'white_stained_glass', 'orange_stained_glass', 'magenta_stained_glass', 'light_blue_stained_glass', 'yellow_stained_glass', 'lime_stained_glass', 'pink_stained_glass', 'cyan_stained_glass', 'purple_stained_glass', 'blue_stained_glass', 'green_stained_glass', 'red_stained_glass', 'black_stained_glass'],
    'Terracotta': ['terracotta', 'white_terracotta', 'orange_terracotta', 'yellow_terracotta', 'lime_terracotta', 'cyan_terracotta', 'blue_terracotta', 'purple_terracotta', 'red_terracotta', 'brown_terracotta', 'green_terracotta', 'black_terracotta'],
    'Ore Blocks': ['iron_block', 'gold_block', 'diamond_block', 'emerald_block', 'lapis_block', 'redstone_block', 'coal_block', 'copper_block', 'netherite_block', 'amethyst_block'],
    'Nature': ['grass_block', 'dirt', 'sand', 'gravel', 'clay', 'mud', 'snow', 'ice', 'packed_ice', 'blue_ice'],
    'Nether': ['netherrack', 'soul_sand', 'soul_soil', 'blackstone', 'nether_bricks', 'red_nether_bricks', 'basalt', 'glowstone', 'shroomlight', 'magma_block'],
    'End': ['end_stone', 'purpur_block', 'purpur_pillar'],
    'Utility': ['crafting_table', 'furnace', 'chest', 'barrel', 'anvil', 'enchanting_table', 'bookshelf', 'torch', 'lantern', 'redstone_lamp', 'sea_lantern', 'glowstone'],
  };

  const [activeCategory, setActiveCategory] = useState('Stone');

  return (
    <div className="flex-1 bg-gray-900 flex flex-col overflow-hidden">
      {/* Blueprint Header */}
      <div className="p-4 border-b border-gray-800 bg-gray-800/30 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Grid className="text-blue-500" size={24} />
            <input
              value={blueprintName}
              onChange={(e) => setBlueprintName(e.target.value)}
              className="text-xl font-bold text-white bg-transparent border-b border-transparent hover:border-gray-600 focus:border-blue-500 outline-none px-1"
            />
            <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {getTotalBlocks()} blocks • Layer {activeLayer + 1}/{layers.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={undo} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg" title="Undo">
              <RotateCcw size={16} />
            </button>
            <button onClick={importBlueprint} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg" title="Import Blueprint">
              <Upload size={16} />
            </button>
            <button onClick={exportBlueprint} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg" title="Export Blueprint">
              <Download size={16} />
            </button>
            <button onClick={() => setShowMaterials(!showMaterials)} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-lg" title="Materials List">
              <Package size={16} />
            </button>
            {project && (
              <button onClick={handleAddToProject} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2" title="Add materials to project">
                <Plus size={16} /> Add to Project
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Block Picker Sidebar */}
        <div className={`${showBlockPicker ? 'w-64' : 'w-10'} border-r border-gray-700 bg-gray-800/50 flex flex-col shrink-0 transition-all`}>
          <button 
            onClick={() => setShowBlockPicker(!showBlockPicker)}
            className="p-2 border-b border-gray-700 hover:bg-gray-700 transition-all text-gray-400"
          >
            {showBlockPicker ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {showBlockPicker && (
            <div className="flex-1 overflow-y-auto p-2">
              {/* Custom block search */}
              <div className="mb-3">
                <AutocompleteInput
                  value=""
                  onChange={(value) => setSelectedBlock(value.toLowerCase().replace(/\s+/g, '_'))}
                  placeholder="Search blocks..."
                  className="bg-gray-700 text-sm"
                />
              </div>
              
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1 mb-3">
                {Object.keys(blockCategories).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Block grid */}
              <div className="grid grid-cols-4 gap-1">
                {blockCategories[activeCategory]?.map(block => (
                  <button
                    key={block}
                    onClick={() => { setSelectedBlock(block); setTool('place'); }}
                    className={`p-1.5 rounded flex flex-col items-center gap-0.5 transition-all ${
                      selectedBlock === block && tool === 'place'
                        ? 'bg-blue-600 ring-2 ring-blue-400' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    title={block.replace(/_/g, ' ')}
                  >
                    <BlockIcon blockName={block} size={28} />
                    <span className="text-[9px] text-gray-300 truncate w-full text-center leading-tight">
                      {block.replace(/_/g, ' ').split(' ').slice(0, 2).join(' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-2 border-b border-gray-800 bg-gray-800/20 flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setTool('place')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5 ${
                  tool === 'place' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Grid size={14} /> Place
              </button>
              <button
                onClick={() => setTool('erase')}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5 ${
                  tool === 'erase' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Eraser size={14} /> Erase
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600" />

            {/* Selected block preview */}
            {tool === 'place' && (
              <div className="flex items-center gap-2 bg-gray-700 px-3 py-1.5 rounded-lg">
                <BlockIcon blockName={selectedBlock} size={20} />
                <span className="text-sm text-gray-300">{selectedBlock.replace(/_/g, ' ')}</span>
              </div>
            )}

            <div className="h-6 w-px bg-gray-600" />

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(Math.max(0.25, zoom - 0.25))} className="p-1.5 hover:bg-gray-700 rounded" title="Zoom out">
                <ZoomOut size={16} className="text-gray-400" />
              </button>
              <span className="text-sm text-gray-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.25))} className="p-1.5 hover:bg-gray-700 rounded" title="Zoom in">
                <ZoomIn size={16} className="text-gray-400" />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-600" />

            {/* Layer controls */}
            <div className="flex items-center gap-1">
              <Layers size={16} className="text-gray-400" />
              <button onClick={() => setActiveLayer(Math.max(0, activeLayer - 1))} className="p-1 hover:bg-gray-700 rounded" disabled={activeLayer === 0}>
                <Minus size={14} className="text-gray-400" />
              </button>
              <span className="text-sm text-gray-300 w-16 text-center">L{activeLayer + 1}/{layers.length}</span>
              <button onClick={() => setActiveLayer(Math.min(layers.length - 1, activeLayer + 1))} className="p-1 hover:bg-gray-700 rounded" disabled={activeLayer === layers.length - 1}>
                <Plus size={14} className="text-gray-400" />
              </button>
              <button onClick={addLayer} className="p-1 hover:bg-gray-700 rounded text-green-400" title="Add layer" disabled={layers.length >= MAX_LAYERS}>
                <Plus size={14} />
              </button>
              <button onClick={removeLayer} className="p-1 hover:bg-gray-700 rounded text-red-400" title="Remove layer" disabled={layers.length <= 1}>
                <Minus size={14} />
              </button>
            </div>

            <div className="flex-1" />

            <button onClick={clearLayer} className="text-sm text-gray-400 hover:text-red-400 px-2 py-1 hover:bg-gray-700 rounded">
              Clear Layer
            </button>
            <button onClick={clearAll} className="text-sm text-gray-400 hover:text-red-400 px-2 py-1 hover:bg-gray-700 rounded">
              Clear All
            </button>
          </div>

          {/* Canvas */}
          <div ref={containerRef} className="flex-1 overflow-auto bg-gray-950 p-4">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridWidth}, ${CELL_SIZE * zoom}px)`,
                gridTemplateRows: `repeat(${gridHeight}, ${CELL_SIZE * zoom}px)`,
                gap: '1px',
                backgroundColor: '#1a1a2e',
                border: '2px solid #333',
                width: 'fit-content',
                cursor: tool === 'erase' ? 'crosshair' : 'pointer',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onContextMenu={(e) => e.preventDefault()}
            >
              {layers[activeLayer].map((row, y) =>
                row.map((cell, x) => (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: CELL_SIZE * zoom,
                      height: CELL_SIZE * zoom,
                      backgroundColor: cell ? undefined : '#111827',
                      imageRendering: 'pixelated',
                      position: 'relative',
                    }}
                    className="hover:ring-1 hover:ring-blue-400/50 transition-colors"
                  >
                    {cell && (
                      <BlockIcon 
                        blockName={cell} 
                        size={CELL_SIZE * zoom}
                        className="absolute inset-0"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Materials sidebar */}
        {showMaterials && (
          <div className="w-72 border-l border-gray-700 bg-gray-800/50 flex flex-col shrink-0">
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Package size={16} className="text-purple-400" />
                Materials ({getTotalBlocks()} blocks)
              </h3>
              <button onClick={() => setShowMaterials(false)} className="p-1 hover:bg-gray-700 rounded">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {getMaterials().length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-8">Place blocks on the grid to see materials</p>
              ) : (
                <div className="space-y-1">
                  {getMaterials().map(([name, qty]) => (
                    <div key={name} className="flex items-center justify-between bg-gray-700/50 rounded px-2 py-1.5">
                      <div className="flex items-center gap-2">
                        <BlockIcon blockName={name} size={20} />
                        <span className="text-sm text-gray-200 capitalize">{name.replace(/_/g, ' ')}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {project && getMaterials().length > 0 && (
              <div className="p-3 border-t border-gray-700">
                <button
                  onClick={handleAddToProject}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add All to Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
