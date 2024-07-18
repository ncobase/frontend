import React from 'react';

import { EditorRoleForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorRolePage = ({ viewMode, record, onSubmit, control, setValue, errors }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return (
      <EditorRoleForms
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }
  return (
    <EditorRoleForms
      record={record}
      onSubmit={onSubmit}
      control={control}
      setValue={setValue}
      errors={errors}
    />
  );
};
