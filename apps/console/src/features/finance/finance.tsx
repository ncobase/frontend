import React from 'react';

import { Page } from '@/layout';
import { Topbar } from '@/layout';

export const Finance = () => {
  const title = 'Finance Page';

  const topbar = <Topbar>Custom topbar element</Topbar>;

  return <Page topbar={topbar}>{title}</Page>;
};
