import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

interface BatchOperationsProps {
  selectedCount: number;
  onDelete: () => void;
  onDownload?: () => void;
  onClearSelection: () => void;
}

export const BatchOperations = ({
  selectedCount,
  onDelete,
  onDownload,
  onClearSelection
}: BatchOperationsProps) => {
  const { t } = useTranslation();

  if (selectedCount === 0) return null;

  return (
    <div className='flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2'>
      <span className='text-sm text-blue-700'>
        {t('resource.batch.selected', '{{count}} selected', { count: selectedCount })}
      </span>
      <div className='flex items-center gap-2 ml-auto'>
        {onDownload && (
          <Button variant='outline-slate' size='sm' onClick={onDownload}>
            <Icons name='IconDownload' className='w-4 h-4 mr-1' />
            {t('resource.batch.download', 'Download')}
          </Button>
        )}
        <Button variant='danger' size='sm' onClick={onDelete}>
          <Icons name='IconTrash' className='w-4 h-4 mr-1' />
          {t('resource.batch.delete', 'Delete')}
        </Button>
        <Button variant='outline-slate' size='sm' onClick={onClearSelection}>
          {t('resource.batch.clear', 'Clear')}
        </Button>
      </div>
    </div>
  );
};
