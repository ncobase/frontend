import React from 'react';

import { Page } from '@/layout';
import { Topbar } from '@/layout';

export const Hr = () => {
  const title = 'HR Page';

  const topbar = <Topbar>Custom topbar element</Topbar>;

  return <Page topbar={topbar}>{title}</Page>;
};
