import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';

export const ResourceEditorForm = ({
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
      title: t('resource.fields.name', 'Name'),
      name: 'name',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconFile',
      placeholder: t('resource.placeholders.name', 'File display name'),
      rules: { required: t('forms.input_required', 'This field is required') }
    },
    {
      title: t('resource.fields.original_name', 'Original Name'),
      name: 'original_name',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconFileDescription',
      placeholder: t('resource.placeholders.original_name', 'Original filename'),
      disabled: true
    },
    {
      title: t('resource.fields.access_level', 'Access Level'),
      name: 'access_level',
      defaultValue: 'private',
      type: 'select',
      prependIcon: 'IconLock',
      description: t('resource.descriptions.access_level', 'Controls who can view this file'),
      options: [
        { label: t('resource.access.public', 'Public'), value: 'public' },
        { label: t('resource.access.private', 'Private'), value: 'private' },
        { label: t('resource.access.shared', 'Shared'), value: 'shared' }
      ]
    },
    {
      title: t('resource.fields.is_public', 'Public Access'),
      name: 'is_public',
      defaultValue: false,
      type: 'switch',
      prependIcon: 'IconWorld',
      description: t('resource.descriptions.is_public', 'Allow access without authentication')
    },
    {
      title: t('resource.fields.tags', 'Tags'),
      name: 'tags',
      defaultValue: '',
      type: 'text',
      prependIcon: 'IconTags',
      placeholder: t('resource.placeholders.tags', 'Comma-separated tags'),
      description: t('resource.descriptions.tags', 'Add tags to organize and find files'),
      className: 'col-span-full'
    }
  ];

  return (
    <Form
      id='edit-resource'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
