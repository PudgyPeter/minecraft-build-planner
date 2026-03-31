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
  
  // Fallback to emoji if image fails
  return (
    <span 
      className={className}
      style={{ fontSize: `${size}px`, lineHeight: 1 }}
    >
      📦
    </span>
  );
}
