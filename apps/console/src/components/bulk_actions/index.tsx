import React from 'react';

import { Button, Icons, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

interface BulkActionsProps {
  selectedItems: any[];
  onClearSelection: () => void;
  onBulkDelete: (_ids: string[]) => void;
  onBulkEdit?: (_ids: string[]) => void;
  onBulkExport?: (_ids: string[]) => void;
  customActions?: Array<{
    label: string;
    icon: string;
    onClick: (_ids: string[]) => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  }>;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedItems,
  onClearSelection,
  onBulkDelete,
  onBulkEdit,
  onBulkExport,
  customActions = []
}) => {
  const { t } = useTranslation();

  if (selectedItems.length === 0) {
    return null;
  }

  const selectedIds = selectedItems.map(item => item.id).filter(Boolean);

  return (
    <div className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50'>
      <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 min-w-[400px]'>
        <div className='flex items-center justify-between gap-4'>
          {/* Selection Info */}
          <div className='flex items-center gap-3'>
            <Badge variant='primary' className='px-3 py-1'>
              {selectedItems.length}
            </Badge>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
              {t('common.items_selected', { count: selectedItems.length })}
            </span>
          </div>

          {/* Actions */}
          <div className='flex items-center gap-2'>
            {/* Edit Action */}
            {onBulkEdit && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => onBulkEdit(selectedIds)}
                className='flex items-center gap-1 dark:border-gray-600 dark:text-gray-200'
              >
                <Icons name='IconEdit' size={14} />
                {t('actions.edit')}
              </Button>
            )}

            {/* Export Action */}
            {onBulkExport && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => onBulkExport(selectedIds)}
                className='flex items-center gap-1 dark:border-gray-600 dark:text-gray-200'
              >
                <Icons name='IconDownload' size={14} />
                {t('actions.export')}
              </Button>
            )}

            {/* Custom Actions */}
            {customActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant === 'danger' ? 'danger' : 'outline'}
                size='sm'
                onClick={() => action.onClick(selectedIds)}
                className='flex items-center gap-1 dark:border-gray-600 dark:text-gray-200'
              >
                <Icons name={action.icon} size={14} />
                {action.label}
              </Button>
            ))}

            {/* Delete Action */}
            <Button
              variant='danger'
              size='sm'
              onClick={() => onBulkDelete(selectedIds)}
              className='flex items-center gap-1'
            >
              <Icons name='IconTrash' size={14} />
              {t('actions.delete')}
            </Button>

            {/* Clear Selection */}
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearSelection}
              className='flex items-center gap-1 ml-2 dark:text-gray-200 dark:hover:bg-gray-700'
            >
              <Icons name='IconX' size={14} />
              {t('actions.clear')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
