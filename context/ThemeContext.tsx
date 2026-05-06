'use client'

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Define the shape of our context
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Create the context with a default undefined value (or a dummy default)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props for the ThemeProvider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');
  const STORAGE_KEY = 'nahwi-theme';

  // Initialize theme from localStorage or system preference after mount
  useEffect(() => {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setTheme(storedTheme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  // Effect to apply/remove 'dark' class on the html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]); // Re-run effect when theme changes

  // Function to toggle between themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
