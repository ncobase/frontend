import React from 'react';

import { Spinner } from '@/components/loading/spinner';
import { ExplicitAny } from '@/types';

export const loadComp = (Com: React.LazyExoticComponent<ExplicitAny>) => {
  return class LoadComp extends React.Component<ExplicitAny, ExplicitAny> {
    override render() {
      return (
        <React.Suspense fallback={<Spinner />}>
          <Com {...this.props} />
        </React.Suspense>
      );
    }
  };
};
