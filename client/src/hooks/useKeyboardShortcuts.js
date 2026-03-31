import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
      const modifiers = {
        ctrl: ctrlKey || metaKey, // Treat Cmd as Ctrl on Mac
        shift: shiftKey,
        alt: altKey
      };

      // Check each shortcut
      for (const [shortcutName, shortcutConfig] of Object.entries(shortcuts)) {
        if (!shortcutConfig.enabled) continue;

        const { key: shortcutKey, ctrl: needCtrl = false, shift: needShift = false, alt: needAlt = false, preventDefault = true } = shortcutConfig;

        // Check if all modifiers match
        const modifiersMatch = 
          (needCtrl === modifiers.ctrl) &&
          (needShift === modifiers.shift) &&
          (needAlt === modifiers.alt);

        // Check if key matches (case-insensitive for letters)
        const keyMatch = key.toLowerCase() === shortcutKey.toLowerCase();

        if (modifiersMatch && keyMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          shortcutConfig.action(event);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts({ onCreateProject, onSearch, onSave, onToggleTheme }) {
  const shortcuts = {
    newProject: {
      key: 'n',
      ctrl: true,
      action: onCreateProject,
      enabled: !!onCreateProject
    },
    search: {
      key: 'f',
      ctrl: true,
      action: onSearch,
      enabled: !!onSearch
    },
    save: {
      key: 's',
      ctrl: true,
      action: onSave,
      enabled: !!onSave
    },
    toggleTheme: {
      key: 'd',
      ctrl: true,
      action: onToggleTheme,
      enabled: !!onToggleTheme
    }
  };

  useKeyboardShortcuts(shortcuts);
  return shortcuts;
}
