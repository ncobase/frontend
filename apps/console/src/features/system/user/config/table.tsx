import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { User } from '../user';

import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '编号',
      accessorKey: 'id',
      parser: (value: string, _record: User) => (
        <Button variant='link' size='md' onClick={() => handleView({ id: value }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconHash'
    },
    {
      title: '用户名',
      accessorKey: 'username',
      icon: 'IconFlame'
    },
    {
      title: '电话',
      accessorKey: 'phone',
      icon: 'IconAffiliate'
    },
    {
      title: '状态',
      accessorKey: 'status',
      parser: (value: string, _record: User) => parseStatus(value),
      icon: 'IconFlagCog'
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
          onClick: (record: User) => handleView(record, 'edit')
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
          onClick: (record: User) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
