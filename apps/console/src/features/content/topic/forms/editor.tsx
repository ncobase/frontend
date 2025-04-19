import { useEffect, useState } from 'react';

import { Form } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTopic } from '../service';

import { FieldConfigProps } from '@/components/form';
import { MarkdownEditor } from '@/components/markdown/editor';
import { useListTaxonomies } from '@/features/content/taxonomy/service';

export const EditorTopicForms = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {} } = useQueryTopic(record);
  const [taxonomyOptions, setTaxonomyOptions] = useState([]);

  // Fetch taxonomies for dropdown
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
      setTaxonomyOptions(options);
    }
  }, [taxonomiesData]);

  const fields: FieldConfigProps[] = [
    // Basic Info Section
    {
      title: 'Topic Name',
      name: 'name',
      defaultValue: '',
      placeholder: 'Enter topic name',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Title',
      name: 'title',
      defaultValue: '',
      placeholder: 'Enter topic title',
      type: 'text',
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Slug',
      name: 'slug',
      defaultValue: '',
      placeholder: 'Enter URL slug',
      type: 'text'
    },
    {
      title: 'Taxonomy',
      name: 'taxonomy_id',
      defaultValue: '',
      type: 'select',
      options: taxonomyOptions,
      rules: { required: t('forms.input_required') }
    },
    {
      title: 'Thumbnail',
      name: 'thumbnail',
      defaultValue: '',
      placeholder: 'Enter thumbnail URL',
      type: 'text'
    },

    // Content Section
    {
      title: 'Content',
      name: 'content',
      defaultValue: '',
      placeholder: 'Enter content',
      type: 'markdown',
      fullWidth: true,
      component: ({ field }) => (
        <MarkdownEditor {...field} className='min-h-[300px] border rounded-md' />
      )
    },

    // Publishing Options Section
    {
      title: 'Use Markdown',
      name: 'markdown',
      defaultValue: true,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: 'Is Private',
      name: 'private',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: 'Is Temporary',
      name: 'temp',
      defaultValue: false,
      type: 'switch',
      elementClassName: 'my-3'
    },
    {
      title: 'Status',
      name: 'status',
      defaultValue: 0,
      type: 'select',
      options: [
        { label: 'Draft', value: 0 },
        { label: 'Published', value: 1 },
        { label: 'Archived', value: 2 }
      ]
    },
    {
      title: 'Release Date',
      name: 'released',
      defaultValue: Date.now(),
      type: 'datetime'
    },

    // System Information
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

    // Hidden fields
    {
      title: 'ID',
      name: 'id',
      defaultValue: '',
      type: 'hidden'
    }
  ];

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) return;

    // Set values from fetched data
    setValue('id', data.id);
    setValue('name', data.name);
    setValue('title', data.title);
    setValue('slug', data.slug);
    setValue('content', data.content);
    setValue('thumbnail', data.thumbnail);
    setValue('taxonomy_id', data.taxonomy);
    setValue('markdown', data.markdown);
    setValue('private', data.private);
    setValue('temp', data.temp);
    setValue('status', data.status);
    setValue('released', data.released);
    setValue('created_at', formatDateTime(data.created_at));
    setValue('updated_at', formatDateTime(data.updated_at));
  }, [setValue, data]);

  return (
    <Form
      id='edit-topic'
      className='my-4 md:grid-cols-2'
      onSubmit={onSubmit}
      control={control}
      errors={errors}
      fields={fields}
    />
  );
};
