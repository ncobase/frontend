import { useEffect, useState } from 'react';

import { Form } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { FieldConfigProps } from '@/components/form';
import { useListTaxonomies } from '@/features/content/taxonomy/service';
import { useTenantContext } from '@/features/system/tenant/context';

export const CreateTaxonomyForms = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { tenant_id } = useTenantContext();
  const [parentOptions, setParentOptions] = useState([]);

  // Fetch taxonomies for parent dropdown
  const { data: taxonomiesData } = useListTaxonomies({
    limit: 100,
    type: 'all',
    children: false
  });

  useEffect(() => {
    if (taxonomiesData?.items) {
      const options = taxonomiesData.items.map(tax => ({
        label: tax.name,
        value: tax.id
      }));
      // Add a "None" option
      // options.unshift({ label: 'None (Root Level)', value: '' });
      setParentOptions(options);
    }
  }, [taxonomiesData]);

  const fields: FieldConfigProps[] = [
    // Basic Information Section
    {
      title: 'Name',
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter taxonomy name',
      type: 'section',
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
      ],
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Slug',
      name: 'slug',
      defaultValue: '',
      placeholder: 'Enter slug (leave empty to auto-generate)',
      type: 'text'
    },
    {
      title: 'Parent',
      name: 'parent_id',
      defaultValue: '',
      type: 'select',
      options: parentOptions
    },

    // Appearance Section
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

    // SEO & Metadata Section
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
      type: 'textarea'
    },

    // Status Section
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

    // Hidden Fields
    {
      title: 'Tenant ID',
      name: 'tenant_id',
      defaultValue: tenant_id,
      type: 'hidden'
    },
    {
      title: 'Extras',
      name: 'extras',
      defaultValue: {},
      type: 'hidden'
    }
  ];

  return (
    <Form
      id='create-taxonomy'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
