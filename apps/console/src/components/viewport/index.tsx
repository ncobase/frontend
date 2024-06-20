import React, { FC, useEffect } from 'react';

import { isBrowser } from '@ncobase/utils';
import { useIsFetching } from '@tanstack/react-query';
import { useLocation, useNavigationType } from 'react-router-dom';

import { Spinner } from '../loading/spinner';

interface ViewportProps extends React.PropsWithChildren {}

const GlobalLoadingIndicator = () => {
  const isFetching = useIsFetching();
  return isFetching > 0 ? <Spinner /> : null;
};

const useScrollToTop = (): void => {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
};

const useFixViewport = (): void => {
  useEffect(() => {
    function updateCssViewportHeight(): void {
      const vh = window.innerHeight * 0.01 + 'px';
      document.documentElement.style.setProperty('--vh', vh);
      document.documentElement.style.setProperty('--windowHeight', vh);
    }

    if (isBrowser) {
      // updateCssViewportHeight();
      window.addEventListener('resize', updateCssViewportHeight);
    }
    return () => {
      if (isBrowser) {
        window.removeEventListener('resize', updateCssViewportHeight);
      }
    };
  }, []);
};

export const Viewport: FC<ViewportProps> = ({ children }) => {
  useScrollToTop();
  useFixViewport();
  GlobalLoadingIndicator();
  return <>{children}</>;
};
