import React from 'react';

import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTenant } from '../../tenant/service';
import { useQueryUser } from '../../user/service';

import { parseStatus } from '@/helpers/status';
import { Group } from '@/types';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '编号',
      code: 'id',
      parser: (value: string) => (
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
      title: '负责人',
      code: 'leader.user_id',
      icon: 'IconUser',
      parser: (value: string) => {
        const { data } = useQueryUser(value);

        return data?.username;
      }
    },
    {
      code: 'tenant_id',
      title: '所属租户',
      parser: (value: string) => {
        const { data } = useQueryTenant(value);
        return data?.name;
      },
      icon: 'IconAffiliate'
    },
    {
      title: '是否禁用',
      code: 'disabled',
      parser: (value: string, _record: Group) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建人',
      code: 'created_by',
      icon: 'IconUser',
      parser: (value: string) => {
        const { data } = useQueryUser(value);
        return data?.username;
      }
    },
    {
      title: '创建日期',
      code: 'created_at',
      parser: (value: string) => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'operation-column',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Group) => handleView(record, 'edit')
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
          onClick: (record: Group) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
