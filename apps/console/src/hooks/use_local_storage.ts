import { useCallback, useEffect, useState } from 'react';

import { locals } from '@ncobase/utils';

/**
 * Use local storage
 * @param key
 * @param initialValue
 * @returns {{ storedValue: T, setValue: (value: T) => void, clearValue: () => void, getValue: () => T }}
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): { storedValue: T; setValue: (_value: T) => void; clearValue: () => void; getValue: () => T } => {
  // Getter function that reads from localStorage
  const getValue = useCallback(() => {
    try {
      const item = locals.get(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(() => getValue());

  // Setter function that saves to localStorage
  const setValue = useCallback(
    (value: T) => {
      try {
        locals.set(key, JSON.stringify(value));
        setStoredValue(value);
        window.dispatchEvent(new Event(`localStorage.${key}`));
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  // Clear function that removes from localStorage
  const clearValue = useCallback(() => {
    try {
      locals.remove(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event(`localStorage.${key}`));
    } catch (error) {
      console.log(error);
    }
  }, [key, initialValue]);

  // Listen for changes to this localStorage key from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const value = getValue();
      setStoredValue(value);
    };

    window.addEventListener(`storage.${key}`, handleStorageChange);
    return () => {
      window.removeEventListener(`storage.${key}`, handleStorageChange);
    };
  }, [key, getValue]);

  return { storedValue, setValue, clearValue, getValue };
};
