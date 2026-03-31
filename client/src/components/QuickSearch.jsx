import { useState, useEffect } from 'react';
import { Search, Filter, Tag, X, Zap } from 'lucide-react';
import { minecraftBlocks } from '../data/minecraftBlocks';
import { getBlockIcon } from '../data/minecraftBlocks';

export default function QuickSearch({ onAddMaterial, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  
  const categories = ['all', ...Array.from(new Set(minecraftBlocks.map(block => block.category)))];
  
  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    // Save recent searches to localStorage
    if (recentSearches.length > 0) {
      localStorage.setItem('recentSearches', JSON.stringify(recentSearches.slice(0, 10)));
    }
  }, [recentSearches]);
  
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    
    const filtered = minecraftBlocks.filter(block => {
      const matchesQuery = block.name.toLowerCase().includes(query.toLowerCase()) ||
                         block.displayName.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || block.category === selectedCategory;
      return matchesQuery && matchesCategory;
    }).slice(0, 20);
    
    setSuggestions(filtered);
  }, [query, selectedCategory]);
  
  const handleSearch = (block) => {
    // Add to recent searches
    const newRecent = [block.name, ...recentSearches.filter(name => name !== block.name)].slice(0, 10);
    setRecentSearches(newRecent);
    
    // Add material with default quantity
    onAddMaterial({
      name: block.displayName,
      quantity: 1,
      category: block.category
    });
    
    setQuery('');
    setSuggestions([]);
  };
  
  const handleQuickAdd = (name) => {
    const block = minecraftBlocks.find(b => b.name === name);
    if (block) {
      handleSearch(block);
    }
  };
  
  const popularBlocks = minecraftBlocks.filter(block => 
    ['oak_planks', 'stone', 'cobblestone', 'oak_log', 'stick', 'coal', 'iron_ingot', 'diamond'].includes(block.name)
  );
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="text-yellow-500" size={24} />
              <h3 className="text-xl font-bold text-white">Quick Add Materials</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-all"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for any block or item..."
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                autoFocus
              />
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={16} className="text-gray-400" />
              <span className="text-gray-400 text-sm">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {category === 'all' ? 'All' : category.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
          
          {/* Popular Blocks */}
          {query.length < 2 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Popular Items</h4>
              <div className="grid grid-cols-4 gap-2">
                {popularBlocks.map(block => (
                  <button
                    key={block.name}
                    onClick={() => handleQuickAdd(block.name)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-all transform hover:scale-105"
                    title={block.displayName}
                  >
                    <div className="text-2xl mb-1">{getBlockIcon(block.name)}</div>
                    <div className="text-xs text-gray-300 truncate">{block.displayName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Recent Searches */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Recent Searches</h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(name => (
                  <button
                    key={name}
                    onClick={() => handleQuickAdd(name)}
                    className="bg-gray-700 hover:bg-gray-600 rounded-lg px-3 py-1 text-sm text-gray-300 transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Search Results */}
          {suggestions.length > 0 && (
            <div>
              <h4 className="text-white font-semibold mb-3">Search Results</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {suggestions.map(block => (
                  <button
                    key={block.name}
                    onClick={() => handleSearch(block)}
                    className="w-full bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{getBlockIcon(block.name)}</span>
                        <div>
                          <div className="text-white font-medium">{block.displayName}</div>
                          <div className="text-gray-400 text-sm">{block.category.replace(/_/g, ' ')}</div>
                        </div>
                      </div>
                      <div className="text-blue-400">
                        <Search size={16} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* No Results */}
          {query.length >= 2 && suggestions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No blocks found matching "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
