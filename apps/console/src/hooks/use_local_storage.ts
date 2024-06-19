import { useCallback, useEffect, useState } from 'react';

/**
 * Use local storage
 * @param key
 * @param initialValue
 * @returns {{ storedValue: T, setValue: (value: T) => void, clearValue: () => void, getValue: () => T }}
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): { storedValue: T; setValue: (value: T) => void; clearValue: () => void; getValue: () => T } => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        setStoredValue(value);
        window.dispatchEvent(new Event(`localStorage.${key}`));
      } catch (error) {
        console.log(error);
      }
    },
    [key]
  );

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event(`localStorage.${key}`));
    } catch (error) {
      console.log(error);
    }
  }, [key, initialValue]);

  const getValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  };

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
