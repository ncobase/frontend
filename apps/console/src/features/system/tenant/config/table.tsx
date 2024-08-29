import React from 'react';

import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { parseStatus } from '@/helpers/status';
import { Tenant } from '@/types';

export const tableColumns = ({ handleView }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '名称',
      code: 'name',
      parser: (value, record) => (
        <Button variant='link' size='md' onClick={() => handleView({ id: record?.id }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconSignature'
    },
    {
      title: '类型',
      code: 'type',
      parser: value => value || '-',
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
      parser: value => value || '-',
      icon: 'IconWorldWww'
    },
    {
      title: '状态',
      code: 'disabled',
      parser: value => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '到期时间',
      code: 'expired_at',
      parser: value => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: '更新时间',
      code: 'updated_at',
      parser: value => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'operation-column',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Tenant) => handleView(record, 'edit')
        },
        {
          title: t('actions.disable'),
          icon: 'IconCircleMinus',
          onClick: () => console.log('disable events')
        }
      ]
    }
  ];
};
