import { useState } from 'react';

import { Button, InputField, Modal } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { PaymentOrder } from '../payment';

interface RefundDialogProps {
  isOpen: boolean;
  order: PaymentOrder | null;
  onClose: () => void;
  onConfirm: (_orderId: string, _amount?: number, _reason?: string) => void;
}

export const RefundDialog = ({ isOpen, order, onClose, onConfirm }: RefundDialogProps) => {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onCancel={onClose}
      title={t('payment.refund.title', 'Refund Order')}
      className='max-w-md'
    >
      <div className='space-y-4 p-4'>
        <div>
          <p className='text-sm text-slate-500'>
            {t('payment.refund.order_no', 'Order')}: {order.order_no}
          </p>
          <p className='text-sm text-slate-500'>
            {t('payment.refund.amount', 'Amount')}:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: order.currency || 'USD'
            }).format(order.amount / 100)}
          </p>
        </div>
        <div>
          <label className='text-sm font-medium text-slate-700'>
            {t('payment.refund.reason', 'Reason')}
          </label>
          <InputField
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder={t('payment.refund.reason_placeholder', 'Enter refund reason')}
            className='mt-1'
          />
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant='outline-slate' onClick={onClose}>
            {t('actions.cancel', 'Cancel')}
          </Button>
          <Button variant='danger' onClick={() => onConfirm(order.id, undefined, reason)}>
            {t('payment.refund.confirm', 'Confirm Refund')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
