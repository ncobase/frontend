import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const ChannelEditorForm = ({
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
      title: t('payment.channel.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconTag',
      placeholder: t('payment.channel.placeholders.name', 'Enter channel name'),
      rules: {
        required: t('forms.input_required', 'This field is required'),
        minLength: { value: 2, message: t('forms.min_length', 'Minimum 2 characters') }
      }
    },
    {
      title: t('payment.channel.fields.type', 'Type'),
      name: 'type',
      defaultValue: 'stripe',
      type: 'select',
      prependIcon: 'IconCreditCard',
      options: [
        { label: 'Stripe', value: 'stripe' },
        { label: 'Alipay', value: 'alipay' },
        { label: 'WeChat Pay', value: 'wechat' },
        { label: 'PayPal', value: 'paypal' }
      ],
      rules: { required: t('forms.select_required', 'This field is required') }
    },
    {
      title: t('payment.channel.fields.status', 'Status'),
      name: 'status',
      defaultValue: 'active',
      type: 'select',
      prependIcon: 'IconToggleLeft',
      options: [
        { label: t('payment.status.active', 'Active'), value: 'active' },
        { label: t('payment.status.inactive', 'Inactive'), value: 'inactive' }
      ]
    },
    {
      title: t('payment.channel.fields.description', 'Description'),
      name: 'description',
      defaultValue: '',
      type: 'textarea',
      prependIcon: 'IconNotes',
      placeholder: t('payment.channel.placeholders.description', 'Channel description'),
      className: 'col-span-full'
    },
    {
      title: t('payment.channel.fields.app_id', 'App ID'),
      name: 'app_id',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconFingerprint',
      placeholder: t('payment.channel.placeholders.app_id', 'Application ID'),
      description: t('payment.channel.descriptions.app_id', 'Public application identifier')
    },
    {
      title: t('payment.channel.fields.api_key', 'API Key'),
      name: 'api_key',
      defaultValue: '',
      type: 'password',
      prependIcon: 'IconKey',
      placeholder: t('payment.channel.placeholders.api_key', 'API key or secret key'),
      description: t('payment.channel.descriptions.api_key', 'Secret key for API authentication')
    },
    {
      title: t('payment.channel.fields.webhook_url', 'Webhook URL'),
      name: 'webhook_url',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconWebhook',
      placeholder: 'https://example.com/webhooks/payment',
      description: t(
        'payment.channel.descriptions.webhook_url',
        'URL for receiving payment notifications'
      ),
      className: 'col-span-full'
    },
    {
      title: t('payment.channel.fields.webhook_secret', 'Webhook Secret'),
      name: 'webhook_secret',
      defaultValue: '',
      type: 'password',
      prependIcon: 'IconShieldLock',
      placeholder: t('payment.channel.placeholders.webhook_secret', 'Webhook signing secret'),
      description: t(
        'payment.channel.descriptions.webhook_secret',
        'Used to verify webhook signatures'
      )
    },
    {
      title: t('payment.channel.fields.sandbox', 'Sandbox Mode'),
      name: 'sandbox',
      defaultValue: true,
      type: 'switch',
      prependIcon: 'IconTestPipe',
      description: t(
        'payment.channel.descriptions.sandbox',
        'Enable for testing, disable for production'
      )
    }
  ];

  return (
    <Form
      id='edit-channel'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
