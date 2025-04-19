import { Button, Icons, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryUser } from '../../user/service';
import { Menu } from '../menu';

import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '名称',
      accessorKey: 'name',
      parser: (value: string, record) => (
        <Button variant='link' onClick={() => handleView({ id: record?.id }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconFlame'
    },
    {
      title: '类型',
      accessorKey: 'type',
      icon: 'IconFlame'
    },
    {
      title: '路径',
      accessorKey: 'path',
      icon: 'IconRoute'
    },
    {
      title: '图标',
      accessorKey: 'icon',
      parser: value => <Icons name={value} size={16} />,
      icon: 'IconCategory'
    },
    {
      title: '状态',
      accessorKey: 'disabled',
      parser: value => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建人',
      accessorKey: 'created_by',
      parser: value => {
        const { data } = useQueryUser(value);
        return data?.username || '-';
      },
      icon: 'IconUser'
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
          onClick: (record: Menu) => handleView(record, 'edit')
        },
        {
          title: t('actions.disable'),
          icon: 'IconCircleMinus',
          onClick: () => console.log('disable events')
        },
        {
          title: t('actions.delete'),
          icon: 'IconTrash',
          onClick: (record: Menu) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
