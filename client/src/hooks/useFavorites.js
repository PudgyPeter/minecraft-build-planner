import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'minecraft-planner-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, [favorites]);

  const addFavorite = (material) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.name === material.name);
      if (exists) return prev;
      
      return [...prev, {
        name: material.name,
        category: material.category,
        addedAt: new Date().toISOString(),
        timesUsed: 0
      }];
    });
  };

  const removeFavorite = (materialName) => {
    setFavorites(prev => prev.filter(fav => fav.name !== materialName));
  };

  const isFavorite = (materialName) => {
    return favorites.some(fav => fav.name === materialName);
  };

  const incrementUsage = (materialName) => {
    setFavorites(prev => prev.map(fav => 
      fav.name === materialName 
        ? { ...fav, timesUsed: (fav.timesUsed || 0) + 1 }
        : fav
    ));
  };

  const getSortedFavorites = () => {
    return [...favorites].sort((a, b) => (b.timesUsed || 0) - (a.timesUsed || 0));
  };

  const getRecentFavorites = (limit = 5) => {
    return [...favorites]
      .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      .slice(0, limit);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    incrementUsage,
    getSortedFavorites,
    getRecentFavorites
  };
}
