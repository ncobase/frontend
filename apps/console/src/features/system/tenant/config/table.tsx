import React from 'react';

import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { parseStatus } from '@/helpers/status';
import { Tenant } from '@/types';

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
      icon: 'IconSignature'
    },
    {
      title: '类型',
      code: 'type',
      parser: (value: string) => value || '-',
      icon: 'IconCategory2'
    },
    {
      title: '别名',
      code: 'slug',
      icon: 'IconRouteAltLeft'
    },
    {
      title: '官网',
      code: 'url',
      parser: (value: string) => value || '-',
      icon: 'IconWorldWww'
    },
    {
      title: '状态',
      code: 'disabled',
      parser: (value: string) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '到期时间',
      code: 'expired_at',
      parser: (value: string) => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: '更新时间',
      code: 'updated_at',
      parser: (value: string) => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'Actions',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Tenant) => handleDialogView(record, 'edit')
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
