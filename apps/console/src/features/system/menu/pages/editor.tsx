import React from 'react';

import { useParams } from 'react-router-dom';

import { EditorMenuForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorMenuPage = ({
  viewMode,
  record: initialRecord,
  onSubmit,
  control,
  setValue,
  errors
}) => {
  const { vmode } = useLayoutContext();
  const { slug } = useParams<{ slug: string }>();
  const record = initialRecord || slug;
  const mode = viewMode || vmode || 'flatten';

  if (!record) {
    return null;
  }

  if (mode === 'modal') {
    return (
      <EditorMenuForms
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }
  return (
    <EditorMenuForms
      record={record}
      onSubmit={onSubmit}
      control={control}
      setValue={setValue}
      errors={errors}
    />
  );
};
