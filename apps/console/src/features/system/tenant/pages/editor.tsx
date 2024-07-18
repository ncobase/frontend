import React from 'react';

import { EditorTenantForms } from '../forms/editor';

import { useLayoutContext } from '@/layout';

export const EditorTenantPage = ({ viewMode, record, onSubmit, control, setValue, errors }) => {
  const { vmode } = useLayoutContext();
  if (!record) {
    return null;
  }
  const mode = viewMode || vmode || 'flatten';
  if (mode === 'modal') {
    return (
      <EditorTenantForms
        record={record}
        onSubmit={onSubmit}
        control={control}
        setValue={setValue}
        errors={errors}
      />
    );
  }
  return (
    <EditorTenantForms
      record={record}
      onSubmit={onSubmit}
      control={control}
      setValue={setValue}
      errors={errors}
    />
  );
};
