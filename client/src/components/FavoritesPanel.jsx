import { useState } from 'react';
import { Star, Plus, X, TrendingUp, Clock } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { getBlockIcon } from '../data/minecraftBlocks';

export default function FavoritesPanel({ onAddMaterial, onSearch }) {
  const { favorites, addFavorite, removeFavorite, isFavorite, getSortedFavorites, getRecentFavorites } = useFavorites();
  const [view, setView] = useState('recent'); // 'recent' or 'popular'

  const sortedFavorites = getSortedFavorites();
  const recentFavorites = getRecentFavorites();
  const displayFavorites = view === 'recent' ? recentFavorites : sortedFavorites;

  const handleAddFavoriteMaterial = (favorite) => {
    onAddMaterial({
      name: favorite.name,
      quantity: 1,
      category: favorite.category
    });
    // Increment usage
    const fav = favorites.find(f => f.name === favorite.name);
    if (fav) {
      fav.timesUsed = (fav.timesUsed || 0) + 1;
    }
  };

  const handleSearchFavorite = (favoriteName) => {
    onSearch(favoriteName);
  };

  if (favorites.length === 0) {
    return (
      <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-yellow-500" size={20} />
          <h3 className="text-white font-semibold">Favorite Materials</h3>
        </div>
        <div className="text-gray-400 text-center py-4">
          <Star size={32} className="mx-auto mb-2 opacity-50" />
          <p>No favorite materials yet</p>
          <p className="text-sm mt-1">Star materials to quick-add them later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Star className="text-yellow-500" size={20} />
          Favorite Materials
        </h3>
        <span className="text-sm text-gray-400">{favorites.length} saved</span>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('recent')}
          className={`flex-1 px-3 py-2 rounded text-sm transition ${
            view === 'recent' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Clock size={14} className="inline mr-1" />
          Recent
        </button>
        <button
          onClick={() => setView('popular')}
          className={`flex-1 px-3 py-2 rounded text-sm transition ${
            view === 'popular' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <TrendingUp size={14} className="inline mr-1" />
          Popular
        </button>
      </div>

      {/* Favorites List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {displayFavorites.map((favorite) => (
          <div
            key={favorite.name}
            className="flex items-center gap-3 bg-gray-900 p-2 rounded-lg hover:bg-gray-700 transition group"
          >
            <span className="text-lg">{getBlockIcon(favorite.name.toLowerCase().replace(/\s+/g, '_'))}</span>
            
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{favorite.name}</div>
              <div className="text-gray-400 text-xs">{favorite.category}</div>
              {favorite.timesUsed > 0 && (
                <div className="text-blue-400 text-xs">Used {favorite.timesUsed}x</div>
              )}
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleAddFavoriteMaterial(favorite)}
                className="p-1 bg-green-600 hover:bg-green-700 text-white rounded transition"
                title="Add to project"
              >
                <Plus size={12} />
              </button>
              
              <button
                onClick={() => handleSearchFavorite(favorite.name)}
                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
                title="Search this material"
              >
                <Clock size={12} />
              </button>
              
              <button
                onClick={() => removeFavorite(favorite.name)}
                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
                title="Remove from favorites"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          Click the star icon on materials to add them here
        </div>
      </div>
    </div>
  );
}
