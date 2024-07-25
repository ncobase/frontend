import React from 'react';

import { Button, Icons, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryUser } from '../../user/service';

import { parseStatus } from '@/helpers/status';
import { Menu } from '@/types';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '名称',
      code: 'name',
      parser: (value: string, record) => (
        <Button variant='link' onClick={() => handleView({ id: record?.id }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconFlame'
    },
    {
      title: '类型',
      code: 'type',
      icon: 'IconFlame'
    },
    {
      title: '路径',
      code: 'path',
      icon: 'IconRoute'
    },
    {
      title: '图标',
      code: 'icon',
      parser: value => <Icons name={value} size={16} />,
      icon: 'IconCategory'
    },
    {
      title: '状态',
      code: 'disabled',
      parser: value => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建人',
      code: 'created_by',
      parser: value => {
        const { data } = useQueryUser(value);
        return data?.username || '-';
      },
      icon: 'IconUser'
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
