import React from 'react';

export interface CommonViewProps<T extends object> {
  type?: string; // 'create' | 'view' | 'edit';
  createComponent?: React.ReactNode;
  viewComponent?: (_record: T | null) => React.ReactNode;
  editComponent?: (_record: T | null) => React.ReactNode;
}

export const isCreateType = (type: string): type is 'create' => type === 'create';
export const isEditType = (type: string): type is 'edit' => type === 'edit';
export const isViewType = (type: string): type is 'view' => type === 'view';

interface CommonViewComponentProps<T extends object> {
  record: T | null;
  type: string | undefined;
  createComponent: React.ReactNode;
  viewComponent: ((_record: T | null) => React.ReactNode) | undefined;
  editComponent: ((_record: T | null) => React.ReactNode) | undefined;
}

export const CommonViewComponent = <T extends object>({
  record,
  type,
  createComponent,
  viewComponent,
  editComponent
}: CommonViewComponentProps<T>): React.ReactElement | null => {
  if (!type) return null;

  const components: Record<string, React.ReactNode> = {
    create: createComponent,
    view: viewComponent?.(record),
    edit: editComponent?.(record)
  };

  return (components[type] as React.ReactElement) || null;
};
