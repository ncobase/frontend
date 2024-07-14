import React from 'react';

import { MenuViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const MenuViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <MenuViewerForms record={record} />;
  }
  return <MenuViewerForms record={record} />;
};
