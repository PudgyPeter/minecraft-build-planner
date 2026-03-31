import React, { useState, useEffect } from 'react';
import { getBlockDisplay } from '../data/blockImages';

export default function BlockIcon({ blockName, size = 24, className = '' }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const display = getBlockDisplay(blockName);
  
  // Debug logging
  console.log('BlockIcon:', { blockName, displayType: display.type, hasUrl: !!display.url });
  
  useEffect(() => {
    // Reset error state when blockName changes
    setImageError(false);
    setImageLoaded(false);
  }, [blockName]);
  
  // CSS-based block fallback for common materials
  const getBlockStyle = (name) => {
    if (name.includes('stone') || name.includes('cobblestone')) {
      return 'bg-gray-500';
    } else if (name.includes('diorite')) {
      return 'bg-gray-400';
    } else if (name.includes('andesite')) {
      return 'bg-gray-600';
    } else if (name.includes('granite')) {
      return 'bg-pink-300';
    } else if (name.includes('oak') || name.includes('wood') || name.includes('log')) {
      return 'bg-amber-700';
    } else if (name.includes('plank')) {
      return 'bg-amber-600';
    } else if (name.includes('quartz')) {
      return 'bg-white';
    } else if (name.includes('sand')) {
      return 'bg-yellow-200';
    } else if (name.includes('dirt')) {
      return 'bg-amber-900';
    } else if (name.includes('grass')) {
      return 'bg-green-500';
    } else {
      return 'bg-gray-700';
    }
  };
  
  if (display.type === 'emoji') {
    return (
      <span 
        className={className}
        style={{ fontSize: `${size}px`, lineHeight: 1 }}
      >
        {display.emoji}
      </span>
    );
  }
  
  if (display.type === 'image' && !imageError) {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        {!imageLoaded && (
          <div 
            className="absolute inset-0 bg-gray-600 rounded flex items-center justify-center"
            style={{ fontSize: `${size * 0.6}px` }}
          >
            ⏳
          </div>
        )}
        <img
          src={display.url}
          alt={blockName}
          width={size}
          height={size}
          className={`rounded transition-opacity duration-200 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    );
  }
  
  // Enhanced fallback with CSS-based blocks
  return (
    <div 
      className={`${className} rounded border-2 border-gray-600 flex items-center justify-center text-white text-xs font-bold`}
      style={{ 
        width: size, 
        height: size,
        backgroundColor: getBlockStyle(blockName),
        fontSize: `${Math.max(8, size / 3)}px`,
        imageRendering: 'pixelated'
      }}
      title={blockName}
    >
      {blockName.split('_').map(word => word[0]?.toUpperCase()).join('').slice(0, 2)}
    </div>
  );
}
