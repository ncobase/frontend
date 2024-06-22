import React from 'react';

import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { parseStatus } from '@/helpers/status';
import { Role } from '@/types';

export const tableColumns = (handleDialogView: Function): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '编号',
      code: 'id',
      parser: (value: string) => (
        <Button variant='link' size='sm' onClick={() => handleDialogView({ id: value }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconHash'
    },
    {
      title: '名称',
      code: 'name',
      icon: 'IconFlame'
    },
    {
      title: '标识',
      code: 'slug',
      icon: 'IconProgress'
    },
    {
      code: 'group',
      title: '所属部门',
      icon: 'IconProgress'
    },
    {
      code: 'tenant',
      title: '所属租户',
      icon: 'IconProgress'
    },
    {
      title: '是否禁用',
      code: 'disabled',
      parser: (value: string, _record: Role) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '描述',
      code: 'description',
      icon: 'IconProgress'
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
          onClick: (record: Role) => handleDialogView(record, 'edit')
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
