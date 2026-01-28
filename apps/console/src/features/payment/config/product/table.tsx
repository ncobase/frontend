import { Badge, Button, TableViewProps } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { PaymentProduct } from '../../payment';

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(
    price / 100
  );

export const tableColumns = ({
  handleView,
  handleDelete
}: {
  handleView: (record: PaymentProduct, mode: string) => void;
  handleDelete: (record: PaymentProduct) => void;
}): TableViewProps['header'] => {
  const { t } = useTranslation();

  return [
    {
      title: t('payment.product.fields.name', 'Name'),
      dataIndex: 'name',
      parser: (value: string, record: PaymentProduct) => (
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
      icon: 'IconPackage'
    },
    {
      title: t('payment.product.fields.price', 'Price'),
      dataIndex: 'price',
      parser: (value: number, record: PaymentProduct) => (
        <span className='font-medium'>
          {formatPrice(value, record.currency)}
          {record.type === 'recurring' && record.interval && (
            <span className='text-slate-400 text-xs'>/{record.interval}</span>
          )}
        </span>
      ),
      icon: 'IconCurrencyDollar'
    },
    {
      title: t('payment.product.fields.type', 'Type'),
      dataIndex: 'type',
      parser: (value: string) => (
        <Badge variant='outline' size='xs'>
          {value === 'recurring'
            ? t('payment.product.type.recurring', 'Recurring')
            : t('payment.product.type.one_time', 'One Time')}
        </Badge>
      ),
      icon: 'IconRepeat'
    },
    {
      title: t('payment.product.fields.status', 'Status'),
      dataIndex: 'status',
      parser: (value: string) => {
        const v: Record<string, 'success' | 'warning' | 'secondary'> = {
          active: 'success',
          inactive: 'warning',
          archived: 'secondary'
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
          onClick: (record: PaymentProduct) => handleView(record, 'edit')
        },
        {
          title: t('actions.delete', 'Delete'),
          icon: 'IconTrash',
          onClick: (record: PaymentProduct) => handleDelete(record)
        }
      ]
    }
  ];
};
