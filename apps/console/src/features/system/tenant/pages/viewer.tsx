import React from 'react';

import { TenantViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const TenantViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <TenantViewerForms record={record} />;
  }
  return <TenantViewerForms record={record} />;
};
