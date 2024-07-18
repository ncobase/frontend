import React from 'react';

import { EditorDictionaryForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorDictionaryPage = ({ viewMode, record, onSubmit, control, setValue, errors }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return (
      <EditorDictionaryForms
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }
  return (
    <EditorDictionaryForms
      record={record}
      onSubmit={onSubmit}
      control={control}
      setValue={setValue}
      errors={errors}
    />
  );
};
