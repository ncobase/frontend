import React from 'react';

import { ExplicitAny } from '@ncobase/types';

import { Spinner } from '@/components/spinner';

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
