import React, { useState, useEffect } from 'react';
import { getBlockDisplay } from '../data/blockImages';
import './MinecraftTexture.css';

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
    if (name.includes('cobblestone')) {
      return 'texture-cobblestone';
    } else if (name.includes('stone')) {
      return 'texture-stone';
    } else if (name.includes('polished_diorite')) {
      return 'texture-polished-diorite';
    } else if (name.includes('diorite')) {
      return 'texture-diorite';
    } else if (name.includes('polished_andesite')) {
      return 'texture-polished-andesite';
    } else if (name.includes('andesite')) {
      return 'texture-andesite';
    } else if (name.includes('polished_granite')) {
      return 'texture-polished-granite';
    } else if (name.includes('granite')) {
      return 'texture-granite';
    } else if (name.includes('oak_log')) {
      return 'texture-oak';
    } else if (name.includes('oak') && name.includes('plank')) {
      return 'texture-oak-planks';
    } else if (name.includes('oak') || name.includes('wood') || name.includes('log')) {
      return 'texture-oak';
    } else if (name.includes('plank')) {
      return 'texture-oak-planks';
    } else if (name.includes('quartz')) {
      return 'texture-quartz';
    } else if (name.includes('sand')) {
      return 'texture-sand';
    } else if (name.includes('dirt')) {
      return 'texture-dirt';
    } else if (name.includes('grass')) {
      return 'texture-grass';
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
      className={`${className} rounded border border-gray-700 ${getBlockStyle(blockName)}`}
      style={{ 
        width: size, 
        height: size,
        imageRendering: 'pixelated',
        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)'
      }}
      title={blockName}
    />
  );
}
