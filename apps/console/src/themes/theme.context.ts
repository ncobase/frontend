import { createContext, useContext } from 'react';

interface ThemeContextValue {
  children?: React.ReactNode;
}

export const ThemeContext = createContext<ThemeContextValue>({});

export const useTheme = () => useContext(ThemeContext);
