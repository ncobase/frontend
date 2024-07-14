import React from 'react';

import { EditorMenuForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorMenuPage = ({ viewMode, record, onSubmit, control, setValue, errors }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
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
