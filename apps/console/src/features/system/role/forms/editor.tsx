import { useEffect } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryRole } from '../service';

export const EditorRoleForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryRole(record);

  const fields: FieldConfigProps[] = [
    {
      title: t('role.fields.id', 'ID'),
      name: 'id',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('role.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter role name',
      type: 'text',
      rules: {
        required: t('forms.input_required'),
        minLength: {
          value: 2,
          message: 'Name must be at least 2 characters'
        }
      }
    },
    {
      title: t('role.fields.slug', 'Slug'),
      name: 'slug',
      defaultValue: '',
      placeholder: 'role-identifier',
      type: 'text',
      rules: {
        pattern: {
          value: /^[a-z0-9-_]+$/,
          message: 'Slug can only contain lowercase letters, numbers, hyphens and underscores'
        }
      }
    },
    {
      title: t('role.fields.parent', 'Parent Role'),
      name: 'parent',
      defaultValue: '',
      placeholder: 'Select parent role',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('Search parent role');
      }
    },
    {
      title: t('role.fields.group', 'Group'),
      name: 'group',
      defaultValue: '',
      placeholder: 'Select group',
      type: 'text',
      appendIcon: 'IconSearch',
      appendIconClick: () => {
        console.log('Search group');
      }
    },
    {
      title: t('role.fields.space', 'Space'),
      name: 'space',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('role.fields.disabled', 'Disabled'),
      name: 'disabled',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3',
      description: 'Disable this role to prevent users from being assigned to it'
    },
    {
      title: t('role.fields.description', 'Description'),
      name: 'description',
      defaultValue: '',
      placeholder: 'Describe the role and its responsibilities',
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
      title: t('role.fields.created_at', 'Created At'),
      name: 'created_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: t('role.fields.updated_at', 'Updated At'),
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
    setValue('slug', data?.slug);
    setValue('parent', data?.parent);
    setValue('group', data?.group);
    setValue('space', data?.space);
    setValue('disabled', data?.disabled);
    setValue('description', data?.description);
    setValue('created_at', formatDateTime(data?.created_at));
    setValue('updated_at', formatDateTime(data?.updated_at));
  }, [setValue, data, isLoading]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading role data...</div>;
  }

  return (
    <Form
      id='edit-role'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
