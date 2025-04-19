import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Role } from '../role';

import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '名称',
      accessorKey: 'name',
      parser: (value, record) => (
        <Button variant='link' size='md' onClick={() => handleView({ id: record.id }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconFlame'
    },
    {
      title: '标识',
      accessorKey: 'slug',
      icon: 'IconAffiliate'
    },
    {
      accessorKey: 'group',
      title: '所属部门',
      icon: 'IconAffiliate'
    },
    {
      accessorKey: 'tenant',
      title: '所属租户',
      icon: 'IconAffiliate'
    },
    {
      title: '是否禁用',
      accessorKey: 'disabled',
      parser: (value: string, _record: Role) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '描述',
      accessorKey: 'description',
      icon: 'IconAffiliate'
    },
    {
      title: '创建日期',
      accessorKey: 'created_at',
      parser: value => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'operation-column',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Role) => handleView(record, 'edit')
        },
        {
          title: t('actions.duplicate'),
          icon: 'IconCopy',
          onClick: () => console.log('duplicate events')
        },
        {
          title: t('actions.shared'),
          icon: 'IconShare2',
          onClick: () => console.log('share events')
        },
        {
          title: t('actions.disable'),
          icon: 'IconCircleMinus',
          onClick: () => console.log('disable events')
        },
        {
          title: t('actions.delete'),
          icon: 'IconTrash',
          onClick: (record: Role) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
