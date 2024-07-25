import React from 'react';

import { Button, Icons, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { parseStatus } from '@/helpers/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '编号',
      code: 'id',
      parser: value => (
        <Button variant='link' size='sm' onClick={() => handleView({ id: value }, 'view')}>
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
      title: '别名',
      code: 'slug',
      icon: 'IconAffiliate'
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
          onClick: (record: Comment) => handleView(record, 'edit')
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
          onClick: (record: Comment) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
