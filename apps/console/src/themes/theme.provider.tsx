import { useMemo } from 'react';

import { TooltipProvider } from '@ncobase/react';

import { ThemeContext } from './theme.context';

interface ThemeProviderProps {
  children?: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeValues = useMemo(() => ({ children }), [children]);

  return (
    <ThemeContext.Provider value={themeValues}>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeContext.Provider>
  );
};
