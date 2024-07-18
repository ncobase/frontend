import React from 'react';

import { UserViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const UserViewerUser = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <UserViewerForms record={record} />;
  }
  return <UserViewerForms record={record} />;
};
