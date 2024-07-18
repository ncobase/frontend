import React from 'react';

import { CommentViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const CommentViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <CommentViewerForms record={record} />;
  }
  return <CommentViewerForms record={record} />;
};
