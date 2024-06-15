import React, { createContext, useContext } from 'react';

export interface LayoutContextValue {
  vmode?: 'default' | 'modal' | 'side' | 'fullscreen';
  setVmode?: (vmode: 'default' | 'modal' | 'side' | 'fullscreen') => void;
  isFocusMode: boolean;
  setIsFocusMode: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}

const defaultValue: LayoutContextValue = {
  vmode: 'default',
  setVmode: undefined,
  isFocusMode: false,
  setIsFocusMode: undefined
};

export const LayoutContext = createContext<LayoutContextValue>(defaultValue);

export const useLayoutContext = () => useContext(LayoutContext);
