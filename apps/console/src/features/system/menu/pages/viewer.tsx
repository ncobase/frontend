import React from 'react';

import { useParams } from 'react-router-dom';

import { MenuViewerForms } from '../forms/viewer';

import { useLayoutContext } from '@/layout';

export const MenuViewerPage = ({ viewMode, record: initialRecord }) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return <MenuViewerForms record={record} />;
  }

  return <MenuViewerForms record={record} />;
};
