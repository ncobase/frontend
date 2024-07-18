import React from 'react';

import { DictionaryViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const DictionaryViewerPage = ({ viewMode, record }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return <DictionaryViewerForms record={record} />;
  }
  return <DictionaryViewerForms record={record} />;
};
