import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const ProductEditorForm = ({
  onSubmit,
  control,
  errors
}: {
  onSubmit: () => void;
  control: any;
  errors: any;
}) => {
  const { t } = useTranslation();

  const fields: FieldConfigProps[] = [
    {
      title: t('payment.product.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconPackage',
      placeholder: t('payment.product.placeholders.name', 'Enter product name'),
      rules: {
        required: t('forms.input_required', 'This field is required'),
        minLength: { value: 2, message: t('forms.min_length', 'Minimum 2 characters') }
      }
    },
    {
      title: t('payment.product.fields.status', 'Status'),
      name: 'status',
      defaultValue: 'active',
      type: 'select',
      prependIcon: 'IconToggleLeft',
      options: [
        { label: t('payment.status.active', 'Active'), value: 'active' },
        { label: t('payment.status.inactive', 'Inactive'), value: 'inactive' },
        { label: t('payment.status.archived', 'Archived'), value: 'archived' }
      ]
    },
    {
      title: t('payment.product.fields.description', 'Description'),
      name: 'description',
      defaultValue: '',
      type: 'textarea',
      prependIcon: 'IconNotes',
      placeholder: t('payment.product.placeholders.description', 'Describe the product'),
      className: 'col-span-full'
    },
    {
      title: t('payment.product.fields.price', 'Price (cents)'),
      name: 'price',
      defaultValue: 0,
      type: 'number',
      prependIcon: 'IconCurrencyDollar',
      placeholder: '0',
      description: t(
        'payment.product.descriptions.price',
        'Amount in smallest currency unit (e.g. cents)'
      ),
      rules: {
        required: t('forms.input_required', 'This field is required'),
        min: { value: 0, message: t('forms.min_value', 'Must be 0 or greater') }
      }
    },
    {
      title: t('payment.product.fields.currency', 'Currency'),
      name: 'currency',
      defaultValue: 'USD',
      type: 'select',
      prependIcon: 'IconCoins',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
        { label: 'CNY', value: 'CNY' },
        { label: 'JPY', value: 'JPY' }
      ]
    },
    {
      title: t('payment.product.fields.type', 'Type'),
      name: 'type',
      defaultValue: 'one_time',
      type: 'select',
      prependIcon: 'IconRepeat',
      options: [
        { label: t('payment.product.type.one_time', 'One Time'), value: 'one_time' },
        { label: t('payment.product.type.recurring', 'Recurring'), value: 'recurring' }
      ]
    },
    {
      title: t('payment.product.fields.interval', 'Interval'),
      name: 'interval',
      defaultValue: 'month',
      type: 'select',
      prependIcon: 'IconCalendarRepeat',
      description: t(
        'payment.product.descriptions.interval',
        'Billing cycle for recurring products'
      ),
      options: [
        { label: t('payment.product.interval.month', 'Monthly'), value: 'month' },
        { label: t('payment.product.interval.year', 'Yearly'), value: 'year' }
      ]
    }
  ];

  return (
    <Form
      id='edit-product'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
