import { useState, useEffect } from 'react';

/**
 * Get current time, updates every second
 * @returns {Object} An object containing the current time
 * @property {Date} currentTime - The current time
 */
export const useCurrentTime = (): { currentTime: Date } => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        setCurrentTime(new Date());
      } catch (error) {
        console.error('Error updating current time:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { currentTime };
};
