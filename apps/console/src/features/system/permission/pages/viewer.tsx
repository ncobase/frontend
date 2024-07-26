import React from 'react';

import { useParams } from 'react-router-dom';

import { PermissionViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const PermissionViewerPage = ({ viewMode, record: initialRecord }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return <PermissionViewerForms record={record} />;
  }
  return <PermissionViewerForms record={record} />;
};
