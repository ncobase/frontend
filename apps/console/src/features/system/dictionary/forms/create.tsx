import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useTenantContext } from '../../tenant/context';

import { FieldConfigProps } from '@/components/form';

export const CreateDictionaryForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { tenant_id } = useTenantContext();

  const fields: FieldConfigProps[] = [
    {
      title: t('dictionary.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter dictionary name',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: {
          value: 2,
          message: 'Dictionary name must be at least 2 characters'
        }
      }
    },
    {
      title: t('dictionary.fields.slug', 'Slug'),
      name: 'slug',
      defaultValue: '',
      placeholder: 'dictionary-key',
      type: 'text',
      rules: {
        pattern: {
          value: /^[a-z0-9-_]+$/,
          message: 'Slug can only contain lowercase letters, numbers, hyphens and underscores'
        }
      }
    },
    {
      title: t('dictionary.fields.type', 'Type'),
      name: 'type',
      defaultValue: 'config',
      type: 'select',
      options: [
        { label: t('dictionary.types.config', 'Configuration'), value: 'config' },
        { label: t('dictionary.types.enum', 'Enumeration'), value: 'enum' },
        { label: t('dictionary.types.constant', 'Constant'), value: 'constant' },
        { label: t('dictionary.types.template', 'Template'), value: 'template' },
        { label: t('dictionary.types.other', 'Other'), value: 'other' }
      ],
      rules: { required: t('forms.select_required') }
    },
    {
      title: t('dictionary.fields.value', 'Value'),
      name: 'value',
      defaultValue: '',
      placeholder: 'Enter value (can be JSON, string, number, etc.)',
      type: 'textarea',
      className: 'col-span-full',
      rules: { required: t('forms.input_required') }
    },
    {
      title: t('dictionary.fields.description', 'Description'),
      name: 'description',
      defaultValue: '',
      placeholder: 'Describe the purpose and usage of this dictionary entry',
      type: 'textarea',
      className: 'col-span-full',
      rules: {
        maxLength: {
          value: 500,
          message: 'Description cannot exceed 500 characters'
        }
      }
    },
    {
      title: 'Tenant ID',
      name: 'tenant',
      defaultValue: tenant_id,
      type: 'hidden'
    }
  ];

  return (
    <Form
      id='create-dictionary'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
