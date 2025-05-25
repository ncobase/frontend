import { Button, Icons, TableViewProps, Badge, Tooltip } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryUser } from '../../user/service';
import { MenuTree } from '../menu';

export const tableColumns = ({
  handleView,
  handleDelete,
  handleToggleStatus
}): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: t('menu.fields.name', 'Name'),
      accessorKey: 'name',
      parser: (value: string, record) => (
        <Button variant='link' onClick={() => handleView({ id: record?.id }, 'view')}>
          <div className='flex items-center space-x-2'>
            {record.icon && <Icons name={record.icon} size={16} />}
            <span className='font-medium'>{value}</span>
            {record.parent_id && (
              <Badge className='bg-slate-100 text-slate-600 text-xs'>Child</Badge>
            )}
          </div>
        </Button>
      ),
      icon: 'IconMenu2'
    },
    {
      title: t('menu.fields.type', 'Type'),
      accessorKey: 'type',
      parser: (value: string) => renderMenuType(value),
      icon: 'IconCategory'
    },
    {
      title: t('menu.fields.path', 'Path'),
      accessorKey: 'path',
      parser: (value: string) => (
        <span className='text-slate-600 font-mono text-xs bg-slate-50 px-2 py-1 rounded'>
          {value || '-'}
        </span>
      ),
      icon: 'IconRoute'
    },
    {
      title: t('menu.fields.parent', 'Parent'),
      accessorKey: 'parent_id',
      parser: (value: string, _record: MenuTree) =>
        value ? (
          <Badge className='bg-blue-100 text-blue-800'>Has Parent</Badge>
        ) : (
          <Badge className='bg-green-100 text-green-800'>Root Level</Badge>
        ),
      icon: 'IconHierarchy'
    },
    {
      title: t('menu.fields.order', 'Order'),
      accessorKey: 'order',
      parser: (value: number) => <Badge className='bg-gray-100 text-gray-700'>{value}</Badge>,
      icon: 'IconArrowsSort'
    },
    {
      title: t('menu.fields.status', 'Status'),
      accessorKey: 'disabled',
      parser: (disabled: boolean, record: MenuTree) => renderMenuStatus(disabled, record.hidden),
      icon: 'IconFlagCog'
    },
    {
      title: t('menu.fields.perms', 'Permissions'),
      accessorKey: 'perms',
      parser: (value: string) => (
        <Tooltip content={value || 'No permissions required'}>
          <span className='text-slate-600 text-xs'>
            {value ? value.substring(0, 20) + (value.length > 20 ? '...' : '') : '-'}
          </span>
        </Tooltip>
      ),
      icon: 'IconShield'
    },
    {
      title: t('menu.fields.created_by', 'Created By'),
      accessorKey: 'created_by',
      parser: value => {
        const { data } = useQueryUser(value);
        return data?.username || '-';
      },
      icon: 'IconUser'
    },
    {
      title: t('menu.fields.created_at', 'Created'),
      accessorKey: 'created_at',
      parser: value => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: t('common.actions', 'Actions'),
      accessorKey: 'operation-column',
      actions: [
        {
          title: t('actions.view', 'View'),
          icon: 'IconEye',
          onClick: (record: MenuTree) => handleView(record, 'view')
        },
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: MenuTree) => handleView(record, 'edit')
        },
        {
          title: record =>
            record.disabled ? t('actions.enable', 'Enable') : t('actions.disable', 'Disable'),
          icon: record => (record.disabled ? 'IconCircleCheck' : 'IconCircleMinus'),
          onClick: (record: MenuTree) =>
            handleToggleStatus?.(record, record.disabled ? 'enable' : 'disable')
        },
        {
          title: record => (record.hidden ? t('actions.show', 'Show') : t('actions.hide', 'Hide')),
          icon: record => (record.hidden ? 'IconEye' : 'IconEyeOff'),
          onClick: (record: MenuTree) =>
            handleToggleStatus?.(record, record.hidden ? 'show' : 'hide')
        },
        {
          title: t('actions.duplicate', 'Duplicate'),
          icon: 'IconCopy',
          onClick: (record: MenuTree) => {
            const duplicateRecord = {
              ...record,
              id: undefined,
              name: `${record.name} (Copy)`,
              slug: `${record.slug}-copy`
            };
            handleView(duplicateRecord, 'create');
          }
        },
        {
          title: t('actions.move', 'Move'),
          icon: 'IconArrowsMove',
          onClick: (record: MenuTree) => {
            console.log('Open move dialog for menu:', record.id);
          }
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: MenuTree) => handleDelete(record, 'delete')
        }
      ]
    }
  ];
};

// Menu type rendering helper
const renderMenuType = (type: string) => {
  if (!type) return '-';

  const typeColors = {
    header: 'bg-purple-100 text-purple-800',
    sidebar: 'bg-blue-100 text-blue-800',
    menu: 'bg-blue-100 text-blue-800',
    button: 'bg-green-100 text-green-800',
    submenu: 'bg-indigo-100 text-indigo-800',
    divider: 'bg-gray-100 text-gray-800',
    group: 'bg-pink-100 text-pink-800',
    account: 'bg-orange-100 text-orange-800',
    tenant: 'bg-cyan-100 text-cyan-800'
  };

  const typeIcons = {
    header: 'IconHeading',
    sidebar: 'IconSidebar',
    menu: 'IconMenu2',
    button: 'IconClick',
    submenu: 'IconChevronRight',
    divider: 'IconMinus',
    group: 'IconFolder',
    account: 'IconUser',
    tenant: 'IconBuilding'
  };

  const colorClass = typeColors[type] || 'bg-slate-100 text-slate-800';
  const iconName = typeIcons[type] || 'IconMenu2';

  return (
    <div className='flex items-center space-x-1'>
      <Icons name={iconName} className='w-3 h-3' />
      <Badge className={colorClass}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
    </div>
  );
};

// Menu status rendering helper
const renderMenuStatus = (disabled: boolean, hidden: boolean) => {
  if (disabled) {
    return <Badge className='bg-red-100 text-red-800'>Disabled</Badge>;
  }
  if (hidden) {
    return <Badge className='bg-yellow-100 text-yellow-800'>Hidden</Badge>;
  }
  return <Badge className='bg-green-100 text-green-800'>Active</Badge>;
};
