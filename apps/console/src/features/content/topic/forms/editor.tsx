import { useEffect, useState } from 'react';

import { Form, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTopic } from '../service';

import { createTopicFormSections, createSystemSection } from './form';

import { MarkdownEditor } from '@/components/markdown/editor';
import { useListTaxonomies } from '@/features/content/taxonomy/service';

export const EditorTopicForm = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryTopic(record);
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

  // Set form values when data is loaded
  useEffect(() => {
    if (!data || Object.keys(data).length === 0 || isLoading) return;

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
  }, [setValue, data, isLoading]);

  if (isLoading) {
    return <div className='p-4 text-center'>Loading topic data...</div>;
  }

  // Create form sections
  const formSections = [
    ...createTopicFormSections(t, taxonomyOptions, data),
    createSystemSection(t, {
      created_at: formatDateTime(data.created_at),
      updated_at: formatDateTime(data.updated_at),
      id: data.id
    })
  ];

  // Custom render for markdown editor to ensure proper value binding
  const fields = section => {
    if (section.id === 'content') {
      return {
        ...section,
        fields: section.fields.map(field => {
          if (field.type === 'markdown') {
            return {
              ...field,
              component: ({ field: inputField }) => (
                <MarkdownEditor
                  {...inputField}
                  className='min-h-[300px] border rounded-md'
                  value={inputField.value || ''}
                />
              )
            };
          }
          return field;
        })
      };
    }
    return section;
  };

  const sections = formSections.map(fields);

  return (
    <div className='space-y-6 my-4'>
      {sections.map(section => (
        <Section
          key={section.id}
          title={section.title}
          icon={section.icon}
          collapsible={section.collapsible}
          className='mb-6'
        >
          <Form
            id={`edit-topic-${section.id}`}
            className='md:grid-cols-2'
            onSubmit={onSubmit}
            control={control}
            errors={errors}
            fields={section.fields}
          />
        </Section>
      ))}
    </div>
  );
};
