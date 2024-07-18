import React from 'react';

import { EditorUserForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorUserPage = ({ viewMode, record, onSubmit, control, setValue, errors }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return (
      <EditorUserForms
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }
  return (
    <EditorUserForms
      record={record}
      onSubmit={onSubmit}
      control={control}
      setValue={setValue}
      errors={errors}
    />
  );
};
