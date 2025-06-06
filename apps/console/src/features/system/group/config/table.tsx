import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryUser } from '../../user/service';
import { Group } from '../group';

import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '名称',
      dataIndex: 'name',
      parser: (value: string, record) => (
        <Button variant='link' onClick={() => handleView({ id: record?.id }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconFlame'
    },
    {
      title: '别名',
      dataIndex: 'slug',
      icon: 'IconAffiliate'
    },
    {
      title: '负责人',
      dataIndex: 'leader.user_id',
      icon: 'IconUser',
      parser: value => {
        if (!value) return '-';
        const { data } = useQueryUser(value);
        return data?.username;
      }
    },
    {
      title: '是否禁用',
      dataIndex: 'disabled',
      parser: (value: string, _record: Group) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建人',
      dataIndex: 'created_by',
      icon: 'IconUser',
      parser: value => {
        if (!value) return '-';
        const { data } = useQueryUser(value);
        return data?.username;
      }
    },
    {
      title: '创建日期',
      dataIndex: 'created_at',
      parser: value => formatDateTime(value),
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
