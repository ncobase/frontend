import React from 'react';

import { useParams } from 'react-router-dom';

import { CommonProps } from '.';

import { ExplicitAny } from '@/types';

export interface FlattenViewProps<T extends object> extends CommonProps<T> {
  type?: string; // 'create' | 'view' | 'edit';
  createComponent?: React.ReactNode;
  viewComponent?: (record: T | null) => React.ReactNode;
  editComponent?: (record: T | null) => React.ReactNode;
  record?: T | null;
  onConfirm?: () => void;
}

const ViewComponent = <T extends object>({
  record,
  type,
  createComponent,
  viewComponent,
  editComponent
}: FlattenViewProps<T>) => {
  const components = {
    create: createComponent,
    view: viewComponent?.(record as ExplicitAny),
    edit: editComponent?.(record as ExplicitAny)
  };

  return components[type] || null;
};

export const FlattenView = <T extends object>({
  createComponent,
  viewComponent,
  editComponent,
  record
}: FlattenViewProps<T>) => {
  const { mode } = useParams<{ mode: string }>();

  return (
    <ViewComponent
      record={record}
      type={mode}
      createComponent={createComponent}
      viewComponent={viewComponent}
      editComponent={editComponent}
    />
  );
};
