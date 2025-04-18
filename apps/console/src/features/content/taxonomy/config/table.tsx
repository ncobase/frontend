import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Taxonomy } from '../taxonomy';

import { useQueryUser } from '@/features/system/user/service';
import { parseStatus } from '@/lib/status';

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
      title: '别名',
      code: 'slug',
      icon: 'IconAffiliate'
    },
    {
      title: '类型',
      code: 'type',
      icon: 'IconTag'
    },
    {
      title: '关键词',
      code: 'keywords',
      icon: 'IconRoadSign'
    },
    {
      title: '描述',
      code: 'description',
      icon: 'IconFileDescription'
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
        return data?.username || value || '-';
      },
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
          onClick: (record: Taxonomy) => handleView(record, 'edit')
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
          onClick: (record: Taxonomy) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
