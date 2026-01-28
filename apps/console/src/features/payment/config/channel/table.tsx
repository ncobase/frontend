import { Badge, Button, TableViewProps } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { PaymentChannel } from '../../payment';

export const tableColumns = ({
  handleView,
  handleDelete
}: {
  handleView: (_record: PaymentChannel, _mode: string) => void;
  handleDelete: (_record: PaymentChannel) => void;
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('payment.channel.fields.name', 'Name'),
      dataIndex: 'name',
      parser: (value: string, record: PaymentChannel) => (
        <Button
          variant='link'
          size='xs'
          onClick={e => {
            e.stopPropagation();
            handleView(record, 'view');
          }}
        >
          {value}
        </Button>
      ),
      icon: 'IconCreditCard'
    },
    {
      title: t('payment.channel.fields.type', 'Type'),
      dataIndex: 'type',
      parser: (value: string) => (
        <Badge variant='outline' size='xs'>
          {value}
        </Badge>
      ),
      icon: 'IconBrandStripe'
    },
    {
      title: t('payment.channel.fields.status', 'Status'),
      dataIndex: 'status',
      parser: (value: string) => {
        const v: Record<string, 'success' | 'danger' | 'secondary'> = {
          active: 'success',
          error: 'danger',
          inactive: 'secondary'
        };
        return (
          <Badge variant={v[value] || 'secondary'} size='xs'>
            {t(`payment.status.${value}`, value)}
          </Badge>
        );
      },
      icon: 'IconStatusChange'
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      actions: [
        {
          title: t('actions.edit', 'Edit'),
          icon: 'IconPencil',
          onClick: (record: PaymentChannel) => handleView(record, 'edit')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: PaymentChannel) => handleDelete(record)
        }
      ]
    }
  ];
};
