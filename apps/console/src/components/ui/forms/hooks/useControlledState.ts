import { useState, useEffect } from 'react';

/**
 * A hook for managing state that can be controlled or uncontrolled
 * @param controlledValue The value from props
 * @param defaultValue The default value
 * @returns [state, setState]
 */
export function useControlledState<T>(controlledValue: T | undefined, defaultValue: T) {
  const [internalValue, setInternalValue] = useState<T>(
    controlledValue === undefined ? defaultValue : controlledValue
  );

  useEffect(() => {
    if (controlledValue !== undefined && controlledValue !== internalValue) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  return [internalValue, setInternalValue] as const;
}
