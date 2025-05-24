import { useEffect, useState } from 'react';

import { FieldConfigProps, Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTaxonomy, useListTaxonomies } from '../service';

export const EditorTaxonomyForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryTaxonomy(record);
  const [parentOptions, setParentOptions] = useState([]);

  // Fetch taxonomies for parent dropdown
  const { data: taxonomiesData } = useListTaxonomies({
    limit: 100,
    type: 'all',
    children: false
  });

  useEffect(() => {
    if (taxonomiesData?.items) {
      const options = taxonomiesData.items
        .filter(tax => tax.id !== record) // Exclude current record from parent options
        .map(tax => ({
          label: tax.name,
          value: tax.id
        }));
      setParentOptions(options);
    }
  }, [taxonomiesData, record]);

  const fields: FieldConfigProps[] = [
    {
      title: 'ID',
      name: 'id',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: 'Name',
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter taxonomy name',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Type',
      name: 'type',
      defaultValue: 'category',
      type: 'select',
      options: [
        { label: 'Category', value: 'category' },
        { label: 'Tag', value: 'tag' },
        { label: 'Topic', value: 'topic' },
        { label: 'Section', value: 'section' },
        { label: 'Department', value: 'department' },
        { label: 'Custom', value: 'custom' }
      ]
    },
    {
      title: 'Slug',
      name: 'slug',
      defaultValue: '',
      placeholder: 'Enter slug',
      type: 'text'
    },
    {
      title: 'Parent',
      name: 'parent_id',
      defaultValue: '',
      type: 'select',
      options: parentOptions
    },
    {
      title: 'Cover Image',
      name: 'cover',
      defaultValue: '',
      placeholder: 'Enter cover image URL',
      type: 'text'
    },
    {
      title: 'Thumbnail',
      name: 'thumbnail',
      defaultValue: '',
      placeholder: 'Enter thumbnail URL',
      type: 'text'
    },
    {
      title: 'Color',
      name: 'color',
      defaultValue: '#3B82F6',
      type: 'color'
    },
    {
      title: 'Icon',
      name: 'icon',
      defaultValue: 'IconFolder',
      type: 'icon'
    },
    {
      title: 'URL',
      name: 'url',
      defaultValue: '',
      placeholder: 'Custom URL (optional)',
      type: 'text'
    },
    {
      title: 'Keywords',
      name: 'keywords',
      defaultValue: '',
      placeholder: 'SEO keywords (comma separated)',
      type: 'text'
    },
    {
      title: 'Description',
      name: 'description',
      defaultValue: '',
      placeholder: 'Enter description',
      type: 'textarea',
      className: 'col-span-full'
    },
    {
      title: 'Status',
      name: 'status',
      defaultValue: 0,
      type: 'select',
      options: [
        { label: 'Enabled', value: 0 },
        { label: 'Disabled', value: 1 }
      ]
    },
    {
      title: 'Created At',
      name: 'created_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: 'Updated At',
      name: 'updated_at',
      defaultValue: '',
      type: 'text',
      disabled: true
    },
    {
      title: 'Extras',
      name: 'extras',
      defaultValue: {},
      type: 'hidden'
    }
  ];

  useEffect(() => {
    if (!data) return;

    // Set form values from API data
    setValue('id', data?.id);
    setValue('name', data?.name);
    setValue('type', data?.type);
    setValue('slug', data?.slug);
    setValue('parent_id', data?.parent);
    setValue('cover', data?.cover);
    setValue('thumbnail', data?.thumbnail);
    setValue('color', data?.color);
    setValue('icon', data?.icon);
    setValue('url', data?.url);
    setValue('keywords', data?.keywords);
    setValue('description', data?.description);
    setValue('status', data?.status);
    setValue('extras', data?.extras);
    setValue('created_at', formatDateTime(data?.created_at));
    setValue('updated_at', formatDateTime(data?.updated_at));
  }, [setValue, data]);

  return (
    <Form
      id='edit-taxonomy'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
