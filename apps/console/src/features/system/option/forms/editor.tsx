import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryOption } from '../service';

export const EditorOptionForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryOption(record);

  const fields: FieldConfigProps[] = [
    {
      title: t('option.fields.id', 'ID'),
      name: 'id',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('option.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter option name',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        pattern: {
          value: /^[a-zA-Z0-9._-]+$/,
          message: 'Name can only contain letters, numbers, dots, hyphens and underscores'
        }
      }
    },
    {
      title: t('option.fields.type', 'Type'),
      name: 'type',
      defaultValue: 'string',
      type: 'select',
      option: [
        { label: t('option.types.string', 'String'), value: 'string' },
        { label: t('option.types.number', 'Number'), value: 'number' },
        { label: t('option.types.boolean', 'Boolean'), value: 'boolean' },
        { label: t('option.types.object', 'Object'), value: 'object' },
        { label: t('option.types.array', 'Array'), value: 'array' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: t('option.fields.value', 'Value'),
      name: 'value',
      defaultValue: '',
      placeholder: 'Enter option value',
      type: 'textarea',
      className: 'col-span-full',
      rules: { required: t('forms.input_required') }
    },
    {
      title: t('option.fields.autoload', 'Autoload'),
      name: 'autoload',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: t('option.fields.tenant', 'Tenant'),
      name: 'tenant_id',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('option.fields.created_at', 'Created At'),
      name: 'created_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('option.fields.updated_at', 'Updated At'),
      name: 'updated_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    }
  ];

  useEffect(() => {
    if (!data || isLoading) return;

    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('type', data?.type);
    setValue('value', data?.value);
    setValue('autoload', data?.autoload);
    setValue('tenant_id', data?.tenant_id);
    setValue('created_at', formatDateTime(data?.created_at));
    setValue('updated_at', formatDateTime(data?.updated_at));
  }, [setValue, data, isLoading]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading option data...</div>;
  }

  return (
    <Form
      id='edit-option'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
