import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState<boolean>(false);

  const applyTheme = (newTheme: Theme) => {
    let shouldBeDark = false;
    
    if (newTheme === 'system') {
      shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      shouldBeDark = newTheme === 'dark';
    }
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Check localStorage first, then default to system
    const stored = localStorage.getItem('nexora-theme') as Theme;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored);
      applyTheme(stored);
    } else {
      setThemeState('system');
      applyTheme('system');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('nexora-theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return { theme, isDark, setTheme, toggleTheme };
}