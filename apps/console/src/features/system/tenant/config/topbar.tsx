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
            {t('tenant.actions.manage', 'Manage')}
            <Icons name='IconChevronDown' className='ml-2' />
          </Button>
        </DropdownTrigger>
        <DropdownContent align='start' className='w-48'>
          <DropdownItem onClick={() => window.location.reload()}>
            <Icons name='IconRefresh' className='mr-2' />
            {t('tenant.actions.refresh', 'Refresh')}
          </DropdownItem>
          <DropdownItem onClick={handleImport}>
            <Icons name='IconUpload' className='mr-2' />
            {t('tenant.actions.import', 'Import')}
          </DropdownItem>
          <DropdownItem onClick={handleExport}>
            <Icons name='IconDownload' className='mr-2' />
            {t('tenant.actions.export', 'Export')}
          </DropdownItem>
        </DropdownContent>
      </Dropdown>
      <DropdownControl />
      <LayoutControl />
      <ScreenControl />
    </div>
  ];
};

// Menu actions for each tenant row
export const getTenantRowMenu = ({ record, handleView, handleDelete, handleToggleStatus }) => {
  const { t } = useTranslation();

  return [
    {
      label: t('tenant.actions.view_details', 'View Details'),
      icon: 'IconEye',
      onClick: () => handleView(record, 'view')
    },
    {
      label: t('tenant.actions.edit', 'Edit Tenant'),
      icon: 'IconPencil',
      onClick: () => handleView(record, 'edit')
    },
    {
      label: record.disabled
        ? t('tenant.actions.enable', 'Enable Tenant')
        : t('tenant.actions.disable', 'Disable Tenant'),
      icon: record.disabled ? 'IconCircleCheck' : 'IconCircleMinus',
      onClick: () => handleToggleStatus(record)
    },
    {
      label: t('tenant.actions.clone', 'Clone Tenant'),
      icon: 'IconCopy',
      onClick: () =>
        handleView({ ...record, id: undefined, name: `${record.name} (Copy)` }, 'create')
    },
    {
      label: t('tenant.actions.delete', 'Delete Tenant'),
      icon: 'IconTrash',
      variant: 'danger',
      onClick: () => handleDelete(record)
    }
  ];
};

// Quick action buttons for tenant rows
export const getTenantQuickActions = ({ record, handleView, handleDelete, handleToggleStatus }) => {
  const { t } = useTranslation();

  return (
    <div className='flex space-x-1'>
      <Tooltip content=''>
        <Button variant='outline-slate' size='xs' onClick={() => handleView(record, 'view')}>
          <Icons name='IconEye' size={14} />
        </Button>
      </Tooltip>

      <Tooltip content={t('tenant.actions.edit', 'Edit Tenant')}>
        <Button variant='outline-primary' size='xs' onClick={() => handleView(record, 'edit')}>
          <Icons name='IconPencil' size={14} />
        </Button>
      </Tooltip>

      <Tooltip
        content={
          record.disabled
            ? t('tenant.actions.enable', 'Enable Tenant')
            : t('tenant.actions.disable', 'Disable Tenant')
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

      <Tooltip content={t('tenant.actions.delete', 'Delete Tenant')}>
        <Button variant='outline-danger' size='xs' onClick={() => handleDelete(record)}>
          <Icons name='IconTrash' size={14} />
        </Button>
      </Tooltip>
    </div>
  );
};
