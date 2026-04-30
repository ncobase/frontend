import React from 'react';

import { ExplicitAny } from '@ncobase/types';

import { Spinner } from '@/components/loading/spinner';

export const lazyNamed = <TModule, TName extends keyof TModule>(
  loader: () => Promise<TModule>,
  exportName: TName
) =>
  React.lazy(async () => {
    const module = await loader();
    return {
      default: module[exportName] as React.ComponentType<ExplicitAny>
    };
  });

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
