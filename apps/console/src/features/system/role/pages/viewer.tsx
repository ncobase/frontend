import React from 'react';

import { useParams } from 'react-router-dom';

import { RoleViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const RoleViewerPage = ({ viewMode, record: initialRecord }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return <RoleViewerForms record={record} />;
  }
  return <RoleViewerForms record={record} />;
};
