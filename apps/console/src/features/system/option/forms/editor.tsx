import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { Option } from '../option.d';
import { useQueryOption } from '../service';

export const EditorOptionForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} as Option, isLoading } = useQueryOption(record);

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
      help: 'Option name must be unique across the system',
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
      rows: 4,
      help: 'Value will be validated based on the selected type',
      rules: {
        required: t('forms.input_required'),
        validate: {
          validFormat: value => {
            const type = control._formValues?.type || data?.type;
            if (['object', 'array'].includes(type)) {
              try {
                JSON.parse(value);
                return true;
              } catch {
                return 'Must be valid JSON for object/array types';
              }
            }
            if (type === 'number' && isNaN(Number(value))) {
              return 'Must be a valid number';
            }
            if (
              type === 'boolean' &&
              !['true', 'false', '1', '0', 'yes', 'no'].includes(value.toLowerCase())
            ) {
              return 'Must be a valid boolean value (true/false, 1/0, yes/no)';
            }
            return true;
          }
        }
      }
    },
    {
      title: t('option.fields.autoload', 'Auto Load'),
      name: 'autoload',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3',
      help: 'Enable to load this option on system startup'
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
    return (
      <div className='p-8 text-center'>
        <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent'></div>
        <p className='mt-2 text-gray-600'>Loading option data...</p>
      </div>
    );
  }

  return (
    <Form
      id='edit-option'
      className='my-4 md:grid-cols-2 gap-6'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
