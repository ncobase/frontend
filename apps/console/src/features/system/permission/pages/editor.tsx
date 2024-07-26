import React from 'react';

import { useParams } from 'react-router-dom';

import { EditorPermissionForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorPermissionPage = ({
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
      <EditorPermissionForms
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }
  return (
    <EditorPermissionForms
      record={record}
      onSubmit={onSubmit}
      control={control}
      setValue={setValue}
      errors={errors}
    />
  );
};
