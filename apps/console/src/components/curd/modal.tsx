import React, { memo } from 'react';

import { ExplicitAny } from '@ncobase/types';
import { useTranslation } from 'react-i18next';

import { Modal, ModalProps } from '../modal/modal';

export interface ModalViewProps<T extends object> extends ModalProps<T> {
  dialogType?: 'create' | 'view' | 'edit';
  createComponent?: React.ReactNode;
  viewComponent?: (record: object | T | null) => React.ReactNode;
  editComponent?: (record: object | T | null) => React.ReactNode;
}

const isCreateType = (type: string): type is 'create' => type === 'create';
const isEditType = (type: string): type is 'edit' => type === 'edit';

const ViewComponent = memo<{
  record: ExplicitAny;
  dialogType: ModalViewProps<any>['dialogType'];
  createComponent: ModalViewProps<any>['createComponent'];
  viewComponent: ModalViewProps<any>['viewComponent'];
  editComponent: ModalViewProps<any>['editComponent'];
}>(({ record, dialogType, createComponent, viewComponent, editComponent }) => {
  const components = {
    create: createComponent,
    view: viewComponent?.(record as ExplicitAny),
    edit: editComponent?.(record as ExplicitAny)
  };

  return components[dialogType] || null;
});

export const ModalView = memo(
  <T extends object>({
    dialogType,
    createComponent,
    viewComponent,
    editComponent,
    ...rest
  }: ModalViewProps<T>) => {
    const { t } = useTranslation();
    const getTitle = () => {
      const titles = {
        create: t('actions.create'),
        view: t('actions.view'),
        edit: t('actions.edit')
      };
      return titles[dialogType] || '';
    };

    const getConfirmText = () => {
      const confirmTexts = {
        create: t('actions.create'),
        edit: t('actions.update')
      };
      return isCreateType(dialogType) || isEditType(dialogType) ? confirmTexts[dialogType] : null;
    };

    return (
      <Modal
        title={getTitle()}
        confirmText={getConfirmText()}
        cancelText={t('actions.cancel')}
        isOpen={!!dialogType}
        {...rest}
      >
        <ViewComponent
          record={rest.record}
          dialogType={dialogType}
          createComponent={createComponent}
          viewComponent={viewComponent}
          editComponent={editComponent}
        />
      </Modal>
    );
  }
);
