import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Role } from '@/features/system/role/role';
import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '编号',
      dataIndex: 'id',
      parser: value => (
        <Button variant='link' size='sm' onClick={() => handleView({ id: value }, 'view')}>
          {value}
        </Button>
      ),
      icon: 'IconHash'
    },
    {
      title: '名称',
      dataIndex: 'name',
      icon: 'IconFlame'
    },
    {
      title: '标识',
      dataIndex: 'slug',
      icon: 'IconAffiliate'
    },
    {
      dataIndex: 'group',
      title: '所属部门',
      icon: 'IconAffiliate'
    },
    {
      dataIndex: 'tenant',
      title: '所属租户',
      icon: 'IconAffiliate'
    },
    {
      title: '是否禁用',
      dataIndex: 'disabled',
      parser: (value: string, _record: Role) => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '描述',
      dataIndex: 'description',
      icon: 'IconAffiliate'
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
          onClick: (record: Role) => handleView(record, 'edit')
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
