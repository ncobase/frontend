import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Permission } from '../permission';

import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '名称',
      code: 'name',
      parser: (value, record) => (
        <Button variant='link' size='md' onClick={() => handleView({ id: record?.id }, 'view')}>
          {value}
        </Button>
      )
    },
    {
      title: '操作',
      code: 'action',
      icon: 'IconAffiliate'
    },
    {
      title: '资源',
      code: 'subject',
      icon: 'IconAffiliate'
    },
    {
      title: '描述',
      code: 'description',
      icon: 'IconAffiliate'
    },
    {
      title: '是否默认',
      code: 'default',
      parser: (value: string, _record: Permission) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '是否禁用',
      code: 'disabled',
      parser: (value: string, _record: Permission) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建日期',
      code: 'created_at',
      parser: value => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'operation-column',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Permission) => handleView(record, 'edit')
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
          onClick: (record: Permission) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
