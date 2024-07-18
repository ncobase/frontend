import React from 'react';

import { TopicViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const TopicViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <TopicViewerForms record={record} />;
  }
  return <TopicViewerForms record={record} />;
};
