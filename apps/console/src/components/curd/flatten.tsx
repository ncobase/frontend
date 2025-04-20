import { useParams } from 'react-router';

import { CommonViewComponent, CommonViewProps } from './common';

export interface FlattenViewProps<T extends object> extends CommonViewProps<T> {
  record?: T | null;
  onConfirm?: () => void;
}

export const FlattenView = <T extends object>({
  createComponent,
  viewComponent,
  editComponent,
  record,
  type: providedType
}: FlattenViewProps<T>) => {
  const { mode } = useParams<{ mode: string }>();
  const type = providedType || mode;

  if (!type) return null;

  return (
    <CommonViewComponent<T>
      record={record || null}
      type={type}
      createComponent={createComponent}
      viewComponent={viewComponent}
      editComponent={editComponent}
    />
  );
};
