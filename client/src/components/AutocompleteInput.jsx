import { useState, useRef, useEffect } from 'react';
import { getBlockIcon } from '../data/minecraftBlocks';

export default function AutocompleteInput({ 
  value, 
  onChange, 
  placeholder, 
  className = '',
  showIcon = true 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  // Dynamic import to avoid circular dependency
  const getSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    try {
      const { searchBlocks } = await import('../data/minecraftBlocks.js');
      const results = searchBlocks(query);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getSuggestions(value);
    }, 150);

    return () => clearTimeout(timer);
  }, [value]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (suggestion) => {
    onChange(suggestion.displayName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => value && setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 focus:border-blue-500 outline-none ${className}`}
        />
        {showIcon && value && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <span className="text-lg">
              {getBlockIcon(value.toLowerCase().replace(/\s+/g, '_'))}
            </span>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.name}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-3 py-2 cursor-pointer flex items-center gap-2 transition-colors ${
                index === highlightedIndex 
                  ? 'bg-gray-700' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{getBlockIcon(suggestion.name)}</span>
              <div className="flex-1">
                <div className="text-white text-sm">{suggestion.displayName}</div>
                <div className="text-gray-400 text-xs">{suggestion.category}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
