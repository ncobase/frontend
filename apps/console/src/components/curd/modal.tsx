import { memo, useState } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { Modal, ModalProps } from '../modal/modal';

import { ExplicitAny } from '@/types';

export interface ModalViewProps<T extends object> extends ModalProps<T> {
  type?: string; // 'create' | 'view' | 'edit';
  createComponent?: React.ReactNode;
  viewComponent?: (record: object | T | null) => React.ReactNode;
  editComponent?: (record: object | T | null) => React.ReactNode;
}

const isCreateType = (type: string): type is 'create' => type === 'create';
const isEditType = (type: string): type is 'edit' => type === 'edit';

const ViewComponent = memo<{
  record: ExplicitAny;
  type: ModalViewProps<any>['type'];
  createComponent: ModalViewProps<any>['createComponent'];
  viewComponent: ModalViewProps<any>['viewComponent'];
  editComponent: ModalViewProps<any>['editComponent'];
}>(({ record, type, createComponent, viewComponent, editComponent }) => {
  const components = {
    create: createComponent,
    view: viewComponent?.(record as ExplicitAny),
    edit: editComponent?.(record as ExplicitAny)
  };

  return components[type] || null;
});

export const ModalView = memo(
  <T extends object>({
    type,
    createComponent,
    viewComponent,
    editComponent,
    isMaximized: defaultIsMaximized = false,
    ...rest
  }: ModalViewProps<T>) => {
    const { t } = useTranslation();

    const getTitle = () => {
      const titles = {
        create: t('actions.create'),
        view: t('actions.view'),
        edit: t('actions.edit')
      };
      return titles[type] || '';
    };

    const getConfirmText = () => {
      const confirmTexts = {
        create: t('actions.create'),
        edit: t('actions.update')
      };
      return isCreateType(type) || isEditType(type) ? confirmTexts[type] : null;
    };

    const [isMaximized, setIsMaximized] = useState(defaultIsMaximized);
    const maximizedClasses =
      '!w-[100lvw] !h-[100lvh] !max-w-[100lvw] !max-h-[100lvh] !shadow-none !rounded-none -translate-y-[50%] data-[state=open]:slide-in-from-top-[50%]';
    const handleMaximize = () => {
      setIsMaximized(prevStatus => !prevStatus);
    };

    return (
      <Modal
        title={getTitle()}
        confirmText={getConfirmText()}
        cancelText={t('actions.cancel')}
        isOpen={!!type}
        className={isMaximized && maximizedClasses}
        toolbar={
          <Button
            variant='unstyle'
            size='ratio'
            className='rounded-full p-1 text-default-11 hover:bg-default-1/10 focus:outline-none hover:shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:[&>svg]:stroke-danger-400'
            onClick={handleMaximize}
          >
            <Icons name={isMaximized ? 'IconWindowMinimize' : 'IconWindowMaximize'} size={16} />
          </Button>
        }
        {...rest}
      >
        <ViewComponent
          record={rest.record}
          type={type}
          createComponent={createComponent}
          viewComponent={viewComponent}
          editComponent={editComponent}
        />
      </Modal>
    );
  }
);
