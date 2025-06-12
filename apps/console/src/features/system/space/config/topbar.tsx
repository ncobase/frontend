import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Tooltip,
  Icons
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ScreenControl } from '@/components/elements';

export const topbarLeftSection = ({ handleView }) => {
  return [
    <div className='rounded-md flex items-center justify-between gap-x-2'>
      <Button
        variant='unstyle'
        size='ratio'
        onClick={() => handleView(null, 'create')}
        className='flex items-center'
      >
        <Icons name='IconPlus' />
      </Button>
    </div>
  ];
};

export const topbarRightSection = ({ handleImport, handleExport }) => {
  const { t } = useTranslation();
  return [
    <div className='flex items-center gap-2'>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button variant='outline' className='flex items-center'>
            <Icons name='IconSettings' className='mr-2' />
            {t('space.actions.manage', 'Manage')}
            <Icons name='IconChevronDown' className='ml-2' />
          </Button>
        </DropdownTrigger>
        <DropdownContent align='start' className='w-48'>
          <DropdownItem onClick={() => window.location.reload()}>
            <Icons name='IconRefresh' className='mr-2' />
            {t('space.actions.refresh', 'Refresh')}
          </DropdownItem>
          <DropdownItem onClick={handleImport}>
            <Icons name='IconUpload' className='mr-2' />
            {t('space.actions.import', 'Import')}
          </DropdownItem>
          <DropdownItem onClick={handleExport}>
            <Icons name='IconDownload' className='mr-2' />
            {t('space.actions.export', 'Export')}
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
      <ScreenControl />
    </div>
  ];
};

// Menu actions for each space row
export const getSpaceRowMenu = ({ record, handleView, handleDelete, handleToggleStatus }) => {
  const { t } = useTranslation();

  return [
    {
      label: t('space.actions.view_details', 'View Details'),
      icon: 'IconEye',
      onClick: () => handleView(record, 'view')
    },
    {
      label: t('space.actions.edit', 'Edit Space'),
      icon: 'IconPencil',
      onClick: () => handleView(record, 'edit')
    },
    {
      label: record.disabled
        ? t('space.actions.enable', 'Enable Space')
        : t('space.actions.disable', 'Disable Space'),
      icon: record.disabled ? 'IconCircleCheck' : 'IconCircleMinus',
      onClick: () => handleToggleStatus(record)
    },
    {
      label: t('space.actions.clone', 'Clone Space'),
      icon: 'IconCopy',
      onClick: () =>
        handleView({ ...record, id: undefined, name: `${record.name} (Copy)` }, 'create')
    },
    {
      label: t('space.actions.delete', 'Delete Space'),
      icon: 'IconTrash',
      variant: 'danger',
      onClick: () => handleDelete(record)
    }
  ];
};

// Quick action buttons for space rows
export const getSpaceQuickActions = ({ record, handleView, handleDelete, handleToggleStatus }) => {
  const { t } = useTranslation();

  return (
    <div className='flex space-x-1'>
      <Tooltip content=''>
        <Button variant='outline-slate' size='xs' onClick={() => handleView(record, 'view')}>
          <Icons name='IconEye' size={14} />
        </Button>
      </Tooltip>

      <Tooltip content={t('space.actions.edit', 'Edit Space')}>
        <Button variant='outline-primary' size='xs' onClick={() => handleView(record, 'edit')}>
          <Icons name='IconPencil' size={14} />
        </Button>
      </Tooltip>

      <Tooltip
        content={
          record.disabled
            ? t('space.actions.enable', 'Enable Space')
            : t('space.actions.disable', 'Disable Space')
        }
      >
        <Button
          variant={record.disabled ? 'outline-success' : 'outline-warning'}
          size='xs'
          onClick={() => handleToggleStatus(record)}
        >
          <Icons name={record.disabled ? 'IconCircleCheck' : 'IconCircleMinus'} size={14} />
        </Button>
      </Tooltip>

      <Tooltip content={t('space.actions.delete', 'Delete Space')}>
        <Button variant='outline-danger' size='xs' onClick={() => handleDelete(record)}>
          <Icons name='IconTrash' size={14} />
        </Button>
      </Tooltip>
    </div>
  );
};
