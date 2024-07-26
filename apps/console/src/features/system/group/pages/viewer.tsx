import React from 'react';

import { useParams } from 'react-router-dom';

import { GroupViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const GroupViewerPage = ({ viewMode, record: initialRecord }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return <GroupViewerForms record={record} />;
  }
  return <GroupViewerForms record={record} />;
};
