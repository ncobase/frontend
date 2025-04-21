import React from 'react';

import { FeatureBuilder } from './builder';
import { FeatureBuilderProvider } from './context';

import { Page } from '@/components/layout';

export const FeatureBuilderPage: React.FC = () => {
  return (
    <Page sidebar title='Feature Builder'>
      <FeatureBuilderProvider>
        <FeatureBuilder />
      </FeatureBuilderProvider>
    </Page>
  );
};
