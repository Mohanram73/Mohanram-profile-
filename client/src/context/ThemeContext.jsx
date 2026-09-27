import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mohanram_theme');
    return saved ? saved === 'dark' : true; // Default dark mode
  });

  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('mohanram_accent') || '#14b8a6';
  });

  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('mohanram_primary') || '#0ea5e9';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('mohanram_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-accent', accentColor);
    document.documentElement.style.setProperty('--brand-primary', primaryColor);
    localStorage.setItem('mohanram_accent', accentColor);
    localStorage.setItem('mohanram_primary', primaryColor);
  }, [accentColor, primaryColor]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      accentColor,
      setAccentColor,
      primaryColor,
      setPrimaryColor
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
