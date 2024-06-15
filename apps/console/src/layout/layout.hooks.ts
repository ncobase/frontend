import { useEffect } from 'react';

import { useLayoutContext } from './layout.context';

export const useFocusMode = (enabled = true) => {
  const { setIsFocusMode = () => {} } = useLayoutContext();

  useEffect(() => {
    setIsFocusMode(enabled);
    return () => setIsFocusMode(false);
  }, [setIsFocusMode, enabled]);
};

export const useVmode = (vmode: 'default' | 'modal' | 'side' | 'fullscreen') => {
  const { setVmode = () => {} } = useLayoutContext();
  useEffect(() => {
    setVmode(vmode);
    return () => setVmode('default');
  }, [setVmode, vmode]);
};
