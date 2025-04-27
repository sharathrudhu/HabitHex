import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type ThemeMode = 'light' | 'dark' | 'system' | 'morning' | 'afternoon' | 'evening' | 'night';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isActive: boolean;
  toggleActive: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeValue] = useLocalStorage<ThemeMode>('theme', 'system');
  const [isActive, setIsActive] = useState(true);

  const toggleActive = () => {
    setIsActive(prev => !prev);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeValue(newTheme);
  };

  // Auto-change theme based on time of day if system theme is selected
  useEffect(() => {
    if (theme === 'system') {
      const updateThemeByTime = () => {
        const hour = new Date().getHours();
        const root = window.document.documentElement;
        
        // Remove all theme classes
        root.classList.remove('dark', 'light', 'morning', 'afternoon', 'evening', 'night');
        
        if (hour >= 5 && hour < 10) {
          root.classList.add('morning');
        } else if (hour >= 10 && hour < 17) {
          root.classList.add('afternoon');
        } else if (hour >= 17 && hour < 21) {
          root.classList.add('evening');
        } else {
          root.classList.add('night');
        }
      };
      
      updateThemeByTime();
      const intervalId = setInterval(updateThemeByTime, 60 * 1000); // Check every minute
      
      return () => clearInterval(intervalId);
    } else {
      const root = window.document.documentElement;
      
      // Remove all theme classes
      root.classList.remove('dark', 'light', 'morning', 'afternoon', 'evening', 'night');
      
      // Add the selected theme
      root.classList.add(theme);
      
      // If it's a dark mode variant, also add the dark class for Tailwind
      if (['dark', 'night', 'evening'].includes(theme)) {
        root.classList.add('dark');
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isActive, toggleActive }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};