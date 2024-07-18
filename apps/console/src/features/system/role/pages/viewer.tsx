import React from 'react';

import { RoleViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const RoleViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <RoleViewerForms record={record} />;
  }
  return <RoleViewerForms record={record} />;
};
