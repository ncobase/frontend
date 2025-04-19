import { Button, TableViewProps } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTaxonomy } from '../../taxonomy/service';
import { Topic } from '../topic';

import { useQueryUser } from '@/features/system/user/service';
import { parseStatus } from '@/lib/status';

export const tableColumns = ({ handleView, handleDelete }): TableViewProps['header'] => {
  const { t } = useTranslation();
  return [
    {
      title: '标题',
      accessorKey: 'title',
      parser: (value, record) => (
        <Button
          variant='link'
          size='md'
          onClick={() => handleView({ id: record?.slug || record?.id }, 'view')}
        >
          {value}
        </Button>
      ),
      icon: 'IconFlame'
    },
    {
      title: '别名',
      accessorKey: 'slug',
      icon: 'IconAffiliate'
    },
    {
      title: '所属类别',
      accessorKey: 'taxonomy_id',
      icon: 'IconBookmark',
      parser: value => {
        const { data } = useQueryTaxonomy(value);
        return data?.name || value || '-';
      }
    },
    {
      title: '是否发布',
      accessorKey: 'released',
      icon: 'IconRoute',
      parser: value => parseStatus(value, 'publishStatus')
    },
    {
      title: '状态',
      accessorKey: 'disabled',
      parser: value => parseStatus(!value),
      icon: 'IconFlagCog'
    },
    {
      title: '创建者',
      accessorKey: 'created_by',
      icon: 'IconUser',
      parser: value => {
        const { data } = useQueryUser(value);
        return data?.username || value || '-';
      }
    },
    {
      title: '创建日期',
      accessorKey: 'created_at',
      parser: value => formatDateTime(value),
      icon: 'IconCalendarMonth'
    },
    {
      title: 'operation-column',
      actions: [
        {
          title: t('actions.edit'),
          icon: 'IconPencil',
          onClick: (record: Topic) => handleView(record, 'edit')
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
          onClick: (record: Topic) => {
            handleDelete(record, 'delete');
          }
        }
      ]
    }
  ];
};
