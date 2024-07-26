import React from 'react';

import { useParams } from 'react-router-dom';

import { DictionaryViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const DictionaryViewerPage = ({ viewMode, record: initialRecord }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }
  if (mode === 'modal') {
    return <DictionaryViewerForms record={record} />;
  }
  return <DictionaryViewerForms record={record} />;
};
