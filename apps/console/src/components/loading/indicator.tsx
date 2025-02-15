import { useEffect, useState } from 'react';

import { useIsFetching } from '@tanstack/react-query';

import { Spinner } from './spinner';

export const LoadingIndicator: React.FC = () => {
  const isFetching = useIsFetching();
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout;
    if (isFetching > 0) {
      timeout = setTimeout(() => {
        setShowSpinner(true);
      }, 100);
    } else {
      clearTimeout(timeout);
      setShowSpinner(false);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isFetching]);

  return showSpinner ? <Spinner /> : null;
};
