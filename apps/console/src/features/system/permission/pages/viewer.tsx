import React from 'react';

import { PermissionViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const PermissionViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <PermissionViewerForms record={record} />;
  }
  return <PermissionViewerForms record={record} />;
};
