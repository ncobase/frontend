import React from 'react';

import { GroupViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const GroupViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <GroupViewerForms record={record} />;
  }
  return <GroupViewerForms record={record} />;
};
