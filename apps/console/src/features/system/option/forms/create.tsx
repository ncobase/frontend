import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';
import { useSpaceContext } from '@/features/space/context';

export const CreateOptionForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { space_id } = useSpaceContext();

  const fields: FieldConfigProps[] = [
    {
      title: t('option.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter unique option name (e.g., app.max_users)',
      type: 'text',
      help: 'Option name must be unique and use dots for namespacing',
      rules: {
        required: t('forms.input_required'),
        pattern: {
          value: /^[a-zA-Z0-9._-]+$/,
          message: 'Name can only contain letters, numbers, dots, hyphens and underscores'
        },
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
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
      help: 'For object/array types, use valid JSON format',
      rules: {
        required: t('forms.input_required'),
        validate: {
          validFormat: value => {
            const type = control._formValues?.type;
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
      help: 'Load this option automatically when system starts'
    },
    {
      title: 'Space ID',
      name: 'space_id',
      defaultValue: space_id,
      type: 'hidden'
    }
  ];

  return (
    <Form
      id='create-option'
      className='my-4 md:grid-cols-2 gap-6'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
