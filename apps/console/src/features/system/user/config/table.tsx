import React from 'react';

import { Button, TableViewProps } from '@ncobase/react';
import { User } from '@ncobase/types';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { parseStatus } from '@/helpers/status';

export const tableColumns = (handleDialogView: Function): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '编号',
      code: 'id',
      parser: (value: string, _record: User) => (
        <Button variant='link' size='sm' onClick={() => handleDialogView({ id: value }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconHash'
    },
    {
      title: '用户名',
      code: 'username',
      icon: 'IconFlame'
    },
    {
      title: '电话',
      code: 'phone',
      icon: 'IconProgress'
    },
    {
      title: '状态',
      code: 'status',
      parser: (value: string, _record: User) => parseStatus(value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建日期',
      code: 'created_at',
      parser: (value: string) => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'Actions',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: User) => handleDialogView(record, 'edit')
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
          onClick: () => console.log('delete events')
        }
      ]
    }
  ];
};
