import { useState, useEffect } from 'react';

export const themes = {
  dark: {
    name: 'Dark',
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    bgTertiary: 'bg-gray-700',
    border: 'border-gray-700',
    borderSecondary: 'border-gray-600',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    textTertiary: 'text-gray-400',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
    buttonSecondary: 'bg-gray-700 hover:bg-gray-600',
    buttonSuccess: 'bg-green-600 hover:bg-green-700',
    buttonDanger: 'bg-red-600 hover:bg-red-700',
    gradient: 'from-gray-800 to-gray-900'
  },
  light: {
    name: 'Light',
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-gray-100',
    border: 'border-gray-300',
    borderSecondary: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textTertiary: 'text-gray-500',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
    buttonSecondary: 'bg-gray-200 hover:bg-gray-300',
    buttonSuccess: 'bg-green-600 hover:bg-green-700',
    buttonDanger: 'bg-red-600 hover:bg-red-700',
    gradient: 'from-gray-50 to-white'
  }
};

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('minecraft-planner-theme');
    return savedTheme && themes[savedTheme] ? savedTheme : 'dark';
  });

  const currentTheme = themes[theme];

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('minecraft-planner-theme', theme);
    
    // Update document class for CSS variables
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme === 'dark' ? '#111827' : '#f9fafb';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    currentTheme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark'
  };
}
