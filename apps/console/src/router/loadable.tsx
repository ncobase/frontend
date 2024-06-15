import React from 'react';

import { Icons } from '@ncobase/react';
import { ExplicitAny } from '@ncobase/types';

export const SuspenseFallback = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
    >
      <Icons name='IconLoader3' size={38} stroke={1} className='animate-spin stroke-primary-600' />
    </div>
  );
};

export const loadComp = (Com: React.LazyExoticComponent<ExplicitAny>) => {
  return class LoadComp extends React.Component<ExplicitAny, ExplicitAny> {
    override render() {
      return (
        <React.Suspense fallback={<SuspenseFallback />}>
          <Com {...this.props} />
        </React.Suspense>
      );
    }
  };
};
