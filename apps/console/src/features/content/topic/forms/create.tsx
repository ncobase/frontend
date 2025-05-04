import { useEffect, useState } from 'react';

import { Editor, Form, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { createTopicFormSections } from './form';

import { useListTaxonomies } from '@/features/content/taxonomy/service';
import { useTenantContext } from '@/features/system/tenant/context';

export const CreateTopicForm = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();
  const { tenant_id } = useTenantContext();
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

  // Create form sections
  const formSections = createTopicFormSections(t, taxonomyOptions);

  // Add the tenant ID as a hidden field to the publishing section
  formSections[2].fields.push({
    title: 'Tenant ID',
    name: 'tenant_id',
    defaultValue: tenant_id,
    type: 'hidden'
  });

  const fields = section => {
    if (section.id === 'content') {
      return {
        ...section,
        fields: section.fields.map(field => {
          if (field.type === 'editor') {
            return {
              ...field,
              component: ({ field: inputField }) => (
                <Editor
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
            id={`create-topic-${section.id}`}
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
