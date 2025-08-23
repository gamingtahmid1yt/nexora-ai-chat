import { useState, useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('nexora-theme');
    if (stored) {
      const dark = stored === 'dark';
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
    } else {
      // Default to dark theme for Nexora AI
      const dark = true;
      setIsDark(dark);
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('nexora-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('nexora-theme', newTheme ? 'dark' : 'light');
  };

  return { isDark, toggleTheme };
}