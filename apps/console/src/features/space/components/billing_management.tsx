import { useState } from 'react';

import {
  Button,
  InputField,
  SelectField,
  DateField,
  Badge,
  Icons,
  useToastMessage,
  Modal,
  AlertDialog,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  TableView
} from '@ncobase/react';
import { formatDateTime, formatCurrency } from '@ncobase/utils';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  useQueryBillingSummary,
  useQuerySpaceBilling,
  useCreateSpaceBilling,
  useUpdateSpaceBilling,
  useDeleteSpaceBilling,
  useProcessPayment,
  useGenerateInvoice
} from '../service';

interface SpaceBillingManagementProps {
  space: any;
  onNavigateToSettings?: (space: any) => void;
}

export const SpaceBillingManagement: React.FC<SpaceBillingManagementProps> = ({
  space,
  onNavigateToSettings
}) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const [showForm, setShowForm] = useState(false);
  const [editingBilling, setEditingBilling] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, billing: null });
  const [paymentDialog, setPaymentDialog] = useState({ open: false, billing: null });
  const [invoiceDialog, setInvoiceDialog] = useState({ open: false, billing: null });

  const { data: summary, refetch: refetchSummary } = useQueryBillingSummary(space?.id);
  const { data: billings, isLoading, refetch } = useQuerySpaceBilling(space?.id);
  const createBillingMutation = useCreateSpaceBilling();
  const updateBillingMutation = useUpdateSpaceBilling();
  const deleteBillingMutation = useDeleteSpaceBilling();
  const processPaymentMutation = useProcessPayment();
  const generateInvoiceMutation = useGenerateInvoice();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const {
    control: paymentControl,
    handleSubmit: handlePaymentSubmit,
    reset: resetPayment,
    formState: { errors: paymentErrors }
  } = useForm();

  const billingList = billings?.items || [];

  // Billing table columns for TableView
  const billingColumns = [
    {
      title: t('space.billing.fields.invoice_number', 'Invoice'),
      dataIndex: 'invoice_number',
      icon: 'IconFileText',
      parser: (value, record) => (
        <div>
          <div className='font-medium'>{value || '-'}</div>
          {record.is_overdue && (
            <div className='text-xs text-red-600 mt-1'>{record.days_overdue} days overdue</div>
          )}
        </div>
      )
    },
    {
      title: t('space.billing.fields.amount', 'Amount'),
      dataIndex: 'amount',
      icon: 'IconCurrencyDollar',
      parser: (value, record) => (
        <div className='font-medium'>{formatCurrency(value, record.currency)}</div>
      )
    },
    {
      title: t('space.billing.fields.status', 'Status'),
      dataIndex: 'status',
      icon: 'IconStatusChange',
      parser: value => {
        const statusColors = {
          pending: 'warning',
          paid: 'success',
          overdue: 'danger',
          cancelled: 'secondary',
          refunded: 'primary'
        };
        return (
          <Badge variant={statusColors[value] || 'secondary'}>
            {t(`space.billing.status.${value}`)}
          </Badge>
        );
      }
    },
    {
      title: t('space.billing.fields.billing_period', 'Period'),
      dataIndex: 'billing_period',
      icon: 'IconCalendar',
      parser: value => t(`space.billing.periods.${value}`)
    },
    {
      title: t('space.billing.fields.due_date', 'Due Date'),
      dataIndex: 'due_date',
      icon: 'IconCalendarDue',
      parser: value => (value ? formatDateTime(value, 'date') : '-')
    },
    {
      title: t('common.actions', 'Actions'),
      dataIndex: 'operation-column',
      parser: (_, record) => (
        <div className='flex items-center space-x-1'>
          {record.status === 'pending' && (
            <Button
              variant='outline-success'
              size='xs'
              onClick={() => handlePayment(record)}
              title={t('space.billing.pay_now')}
            >
              <Icons name='IconCreditCard' size={12} />
            </Button>
          )}
          <Button
            variant='outline-primary'
            size='xs'
            onClick={() => handleInvoice(record)}
            title={t('space.billing.generate_invoice')}
          >
            <Icons name='IconFileText' size={12} />
          </Button>
          <Button
            variant='outline-primary'
            size='xs'
            onClick={() => handleEdit(record)}
            title={t('actions.edit')}
          >
            <Icons name='IconPencil' size={12} />
          </Button>
          <Button
            variant='outline-danger'
            size='xs'
            onClick={() => handleDelete(record)}
            title={t('actions.delete')}
          >
            <Icons name='IconTrash' size={12} />
          </Button>
        </div>
      )
    }
  ];

  const handleCreate = () => {
    setEditingBilling(null);
    reset({
      space_id: space.id,
      billing_period: 'monthly',
      currency: 'USD',
      status: 'pending',
      amount: 0
    });
    setShowForm(true);
  };

  const handleEdit = (billing: any) => {
    setEditingBilling(billing);
    reset(billing);
    setShowForm(true);
  };

  const handleDelete = (billing: any) => {
    setDeleteDialog({ open: true, billing });
  };

  const handlePayment = (billing: any) => {
    setPaymentDialog({ open: true, billing });
    resetPayment({
      billing_id: billing.id,
      amount: billing.amount,
      payment_method: 'credit_card'
    });
  };

  const handleInvoice = (billing: any) => {
    setInvoiceDialog({ open: true, billing });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.billing) return;

    try {
      await deleteBillingMutation.mutateAsync(deleteDialog.billing.id);
      toast.success(t('messages.success'), {
        description: t('space.billing.delete_success')
      });
      setDeleteDialog({ open: false, billing: null });
      refetch();
      refetchSummary();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.billing.delete_failed')
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingBilling) {
        await updateBillingMutation.mutateAsync({ id: editingBilling.id, ...data });
        toast.success(t('messages.success'), {
          description: t('space.billing.update_success')
        });
      } else {
        await createBillingMutation.mutateAsync(data);
        toast.success(t('messages.success'), {
          description: t('space.billing.create_success')
        });
      }

      setShowForm(false);
      reset();
      refetch();
      refetchSummary();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.billing.save_failed')
      });
    }
  };

  const onPaymentSubmit = async (data: any) => {
    try {
      await processPaymentMutation.mutateAsync(data);
      toast.success(t('messages.success'), {
        description: t('space.billing.payment_success')
      });
      setPaymentDialog({ open: false, billing: null });
      resetPayment();
      refetch();
      refetchSummary();
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.billing.payment_failed')
      });
    }
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceDialog.billing) return;

    try {
      const result = await generateInvoiceMutation.mutateAsync({
        spaceId: space.id,
        billingId: invoiceDialog.billing.id
      });
      toast.success(t('messages.success'), {
        description: t('space.billing.invoice_generated')
      });
      setInvoiceDialog({ open: false, billing: null });

      // Download or open the invoice
      if (result.download_url) {
        window.open(result.download_url, '_blank');
      }
    } catch (error) {
      toast.error(t('messages.error'), {
        description: error['message'] || t('space.billing.invoice_failed')
      });
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with navigation */}
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>{t('space.billing.title')}</h3>
          <p className='text-slate-600'>{t('space.billing.description')}</p>
        </div>
        <div className='flex items-center space-x-2'>
          {onNavigateToSettings && (
            <Button variant='outline-slate' onClick={() => onNavigateToSettings(space)}>
              <Icons name='IconArrowLeft' className='mr-2' />
              {t('actions.go_back')}
            </Button>
          )}
          <Button onClick={handleCreate}>
            <Icons name='IconPlus' className='mr-2' />
            {t('space.billing.add')}
          </Button>
        </div>
      </div>

      {/* Billing Summary */}
      {summary && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 px-2'>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-slate-600'>
                {t('space.billing.total_amount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {formatCurrency(summary.total_amount, summary.currency)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-slate-600'>
                {t('space.billing.paid_amount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-green-600'>
                {formatCurrency(summary.paid_amount, summary.currency)}
              </div>
              <div className='text-xs text-slate-500 mt-1'>
                {summary.paid_invoices || 0} invoices
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-slate-600'>
                {t('space.billing.pending_amount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-yellow-600'>
                {formatCurrency(summary.pending_amount, summary.currency)}
              </div>
              <div className='text-xs text-slate-500 mt-1'>
                {(summary.total_invoices || 0) - (summary.paid_invoices || 0)} pending
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-sm font-medium text-slate-600'>
                {t('space.billing.overdue_amount')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold text-red-600'>
                {formatCurrency(summary.overdue_amount, summary.currency)}
              </div>
              <div className='text-xs text-slate-500 mt-1'>
                {summary.overdue_invoices || 0} overdue
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Billing List */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <span>{t('space.billing.invoice_list', 'Invoice Management')}</span>
            <Badge variant='outline-primary'>
              {billingList.length} {t('space.billing.total', 'total')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          {isLoading ? (
            <div className='text-center py-8'>
              <Icons name='IconLoader' className='animate-spin mx-auto mb-4' />
              {t('common.loading')}
            </div>
          ) : billingList.length === 0 ? (
            <div className='text-center py-8 text-slate-500'>
              <Icons name='IconCreditCard' className='w-12 h-12 mx-auto mb-4 text-slate-300' />
              {t('space.billing.no_billings')}
              <div className='mt-4'>
                <Button onClick={handleCreate} variant='outline-primary'>
                  <Icons name='IconPlus' className='mr-2' />
                  {t('space.billing.create_first')}
                </Button>
              </div>
            </div>
          ) : (
            <TableView header={billingColumns} data={billingList} visibleControl={false} />
          )}
        </CardContent>
      </Card>

      {/* Billing Form Modal */}
      <Modal
        isOpen={showForm}
        onCancel={() => {
          setShowForm(false);
          reset();
        }}
        title={editingBilling ? t('space.billing.edit_title') : t('space.billing.create_title')}
        confirmText={editingBilling ? t('actions.update') : t('actions.create')}
        onConfirm={handleSubmit(onSubmit)}
        className='max-w-3xl'
      >
        <BillingForm control={control} errors={errors} t={t} />
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={paymentDialog.open}
        onCancel={() => {
          setPaymentDialog({ open: false, billing: null });
          resetPayment();
        }}
        title={t('space.billing.process_payment')}
        confirmText={t('space.billing.pay_now')}
        onConfirm={handlePaymentSubmit(onPaymentSubmit)}
      >
        <PaymentForm
          control={paymentControl}
          errors={paymentErrors}
          billing={paymentDialog.billing}
          t={t}
        />
      </Modal>

      {/* Invoice Modal */}
      <Modal
        isOpen={invoiceDialog.open}
        onCancel={() => setInvoiceDialog({ open: false, billing: null })}
        title={t('space.billing.generate_invoice')}
        confirmText={t('space.billing.generate')}
        onConfirm={handleGenerateInvoice}
      >
        <div className='space-y-4'>
          <p>{t('space.billing.invoice_confirm')}</p>
          {invoiceDialog.billing && (
            <div className='bg-slate-50 p-4 rounded-lg'>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='font-medium'>{t('space.billing.fields.invoice_number')}:</span>
                  <span className='ml-2'>{invoiceDialog.billing.invoice_number}</span>
                </div>
                <div>
                  <span className='font-medium'>{t('space.billing.fields.amount')}:</span>
                  <span className='ml-2'>
                    {formatCurrency(invoiceDialog.billing.amount, invoiceDialog.billing.currency)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <AlertDialog
        title={t('space.billing.delete_confirm_title')}
        description={t('space.billing.delete_confirm_description')}
        isOpen={deleteDialog.open}
        onChange={() => setDeleteDialog(prev => ({ ...prev, open: !prev.open }))}
        cancelText={t('actions.cancel')}
        confirmText={t('actions.delete')}
        onCancel={() => setDeleteDialog({ open: false, billing: null })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

// Billing Form Component
const BillingForm = ({ control, errors, t }) => (
  <div className='space-y-4'>
    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name='invoice_number'
        control={control}
        render={({ field }) => (
          <InputField
            label={t('space.billing.fields.invoice_number')}
            placeholder='INV-2025-001'
            {...field}
          />
        )}
      />

      <Controller
        name='billing_period'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.billing.fields.billing_period')}
            options={[
              { label: t('space.billing.periods.monthly'), value: 'monthly' },
              { label: t('space.billing.periods.yearly'), value: 'yearly' },
              { label: t('space.billing.periods.one_time'), value: 'one_time' },
              { label: t('space.billing.periods.usage_based'), value: 'usage_based' }
            ]}
            error={errors.billing_period?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='amount'
        control={control}
        rules={{
          required: t('forms.input_required'),
          min: { value: 0, message: 'Amount must be greater than 0' }
        }}
        render={({ field }) => (
          <InputField
            type='number'
            label={t('space.billing.fields.amount')}
            placeholder='0.00'
            error={errors.amount?.message}
            step='0.01'
            {...field}
          />
        )}
      />

      <Controller
        name='currency'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.billing.fields.currency')}
            options={[
              { label: 'USD', value: 'USD' },
              { label: 'EUR', value: 'EUR' },
              { label: 'GBP', value: 'GBP' },
              { label: 'JPY', value: 'JPY' },
              { label: 'CNY', value: 'CNY' }
            ]}
            error={errors.currency?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='status'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.billing.fields.status')}
            options={[
              { label: t('space.billing.status.pending'), value: 'pending' },
              { label: t('space.billing.status.paid'), value: 'paid' },
              { label: t('space.billing.status.overdue'), value: 'overdue' },
              { label: t('space.billing.status.cancelled'), value: 'cancelled' },
              { label: t('space.billing.status.refunded'), value: 'refunded' }
            ]}
            error={errors.status?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='due_date'
        control={control}
        render={({ field }) => <DateField label={t('space.billing.fields.due_date')} {...field} />}
      />
    </div>

    <Controller
      name='description'
      control={control}
      render={({ field }) => (
        <InputField
          label={t('space.billing.fields.description')}
          placeholder={t('space.billing.placeholders.description')}
          {...field}
        />
      )}
    />

    <Controller
      name='payment_method'
      control={control}
      render={({ field }) => (
        <SelectField
          label={t('space.billing.fields.payment_method')}
          options={[
            { label: 'Credit Card', value: 'credit_card' },
            { label: 'Bank Transfer', value: 'bank_transfer' },
            { label: 'PayPal', value: 'paypal' },
            { label: 'Stripe', value: 'stripe' },
            { label: 'Wire Transfer', value: 'wire_transfer' }
          ]}
          {...field}
        />
      )}
    />
  </div>
);

// Payment Form Component
const PaymentForm = ({ control, errors, billing, t }) => (
  <div className='space-y-4'>
    <div className='bg-slate-50 p-4 rounded-lg'>
      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <span className='font-medium'>{t('space.billing.fields.invoice_number')}:</span>
          <span className='ml-2'>{billing?.invoice_number || '-'}</span>
        </div>
        <div>
          <span className='font-medium'>{t('space.billing.fields.amount')}:</span>
          <span className='ml-2'>
            {formatCurrency(billing?.amount || 0, billing?.currency || 'USD')}
          </span>
        </div>
      </div>
    </div>

    <div className='grid grid-cols-2 gap-4'>
      <Controller
        name='payment_method'
        control={control}
        rules={{ required: t('forms.select_required') }}
        render={({ field }) => (
          <SelectField
            label={t('space.billing.fields.payment_method')}
            options={[
              { label: 'Credit Card', value: 'credit_card' },
              { label: 'Bank Transfer', value: 'bank_transfer' },
              { label: 'PayPal', value: 'paypal' },
              { label: 'Stripe', value: 'stripe' },
              { label: 'Wire Transfer', value: 'wire_transfer' }
            ]}
            error={errors.payment_method?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='amount'
        control={control}
        rules={{
          required: t('forms.input_required'),
          min: { value: 0.01, message: 'Amount must be greater than 0' }
        }}
        render={({ field }) => (
          <InputField
            type='number'
            label={t('space.billing.fields.amount')}
            placeholder='0.00'
            error={errors.amount?.message}
            step='0.01'
            {...field}
          />
        )}
      />
    </div>

    <Controller
      name='transaction_id'
      control={control}
      render={({ field }) => (
        <InputField
          label={t('space.billing.fields.transaction_id')}
          placeholder='TXN-123456789'
          description={t('space.billing.hints.transaction_id')}
          {...field}
        />
      )}
    />
  </div>
);
