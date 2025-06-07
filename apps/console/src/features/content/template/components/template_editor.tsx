import React, { useState, useCallback } from 'react';

import { Button, Icons, Card, Form, Section } from '@ncobase/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ContentTemplate, TemplateField } from '../template';

import { TemplateFieldEditor } from './template_field_editor';

interface TemplateEditorProps {
  template?: ContentTemplate;
  onSave: (_data: Partial<ContentTemplate>) => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'basic' | 'fields' | 'preview'>('basic');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty }
  } = useForm<ContentTemplate>({
    defaultValues: template || {
      name: '',
      description: '',
      type: 'topic',
      category: '',
      template_data: {},
      fields: [],
      is_public: false,
      usage_count: 0,
      tags: []
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'fields'
  });

  const watchedData = watch();

  const handleSaveTemplate = handleSubmit(data => {
    // Ensure field orders are set correctly
    const updatedFields = data.fields.map((field, index) => ({
      ...field,
      order: index + 1,
      id: field.id || `field_${Date.now()}_${index}`
    }));

    onSave({
      ...data,
      fields: updatedFields
    });
  });

  const addField = useCallback(() => {
    const newField: TemplateField = {
      id: `field_${Date.now()}`,
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type: 'text',
      required: false,
      order: fields.length + 1,
      options: []
    };
    append(newField);
  }, [fields.length, append]);

  const updateField = useCallback(
    (index: number, updatedField: Partial<TemplateField>) => {
      update(index, { ...fields[index], ...updatedField });
    },
    [fields, update]
  );

  const removeField = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const duplicateField = useCallback(
    (index: number) => {
      const fieldToDuplicate = fields[index];
      const duplicatedField: TemplateField = {
        ...fieldToDuplicate,
        id: `field_${Date.now()}`,
        name: `${fieldToDuplicate.name}_copy`,
        label: `${fieldToDuplicate.label} Copy`,
        order: fields.length + 1
      };
      append(duplicatedField);
    },
    [fields, append]
  );

  const basicFields = [
    {
      title: t('template.fields.name'),
      name: 'name',
      type: 'text',
      placeholder: t('template.placeholders.name'),
      rules: { required: t('forms.field_required') }
    },
    {
      title: t('template.fields.description'),
      name: 'description',
      type: 'textarea',
      rows: 3,
      placeholder: t('template.placeholders.description')
    },
    {
      title: t('template.fields.type'),
      name: 'type',
      type: 'select',
      options: [
        { label: t('template.types.topic'), value: 'topic' },
        { label: t('template.types.taxonomy'), value: 'taxonomy' },
        { label: t('template.types.page'), value: 'page' },
        { label: t('template.types.email'), value: 'email' },
        { label: t('template.types.custom'), value: 'custom' }
      ],
      rules: { required: t('forms.field_required') }
    },
    {
      title: t('template.fields.category'),
      name: 'category',
      type: 'select',
      options: [
        { label: t('template.categories.blog'), value: 'blog' },
        { label: t('template.categories.news'), value: 'news' },
        { label: t('template.categories.marketing'), value: 'marketing' },
        { label: t('template.categories.documentation'), value: 'documentation' },
        { label: t('template.categories.ecommerce'), value: 'ecommerce' },
        { label: t('template.categories.portfolio'), value: 'portfolio' }
      ]
    },
    {
      title: t('template.fields.tags'),
      name: 'tags',
      type: 'tags',
      placeholder: t('template.add_tag')
    },
    {
      title: t('template.fields.is_public'),
      name: 'is_public',
      type: 'switch',
      description: t('template.public_template_desc')
    }
  ];

  const tabs = [
    { key: 'basic', label: t('template.tabs.basic'), icon: 'IconInfo' },
    { key: 'fields', label: t('template.tabs.fields'), icon: 'IconLayout' },
    { key: 'preview', label: t('template.tabs.preview'), icon: 'IconEye' }
  ];

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>
          {template ? t('template.edit.title') : t('template.create.title')}
        </h3>
        <div className='flex items-center space-x-2'>
          <Button variant='outline' onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
          <Button onClick={handleSaveTemplate} disabled={!isDirty}>
            <Icons name='IconCheck' size={16} className='mr-1' />
            {template ? t('actions.update') : t('actions.create')}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg'>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Icons name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'basic' && (
          <Section title={t('template.basic_information')} icon='IconInfo'>
            <Form control={control} errors={errors} fields={basicFields} className='space-y-4' />
          </Section>
        )}

        {activeTab === 'fields' && (
          <Section title={t('template.field_editor.title')} icon='IconLayout'>
            <div className='space-y-4'>
              {/* Add Field Button */}
              <div className='flex justify-between items-center'>
                <h4 className='font-medium'>{t('template.fields.title')}</h4>
                <Button onClick={addField} size='sm'>
                  <Icons name='IconPlus' size={16} className='mr-1' />
                  {t('template.field_editor.add_field')}
                </Button>
              </div>

              {/* Fields List */}
              <div className='space-y-4'>
                {fields.map((field, index) => (
                  <Card key={field.id} className='p-4'>
                    <TemplateFieldEditor
                      field={field}
                      index={index}
                      onUpdate={updatedField => updateField(index, updatedField)}
                      onRemove={() => removeField(index)}
                      onDuplicate={() => duplicateField(index)}
                    />
                  </Card>
                ))}

                {fields.length === 0 && (
                  <Card className='p-8 text-center'>
                    <Icons name='IconLayout' size={32} className='mx-auto text-gray-400 mb-3' />
                    <h4 className='font-medium text-gray-900 mb-1'>{t('template.no_fields')}</h4>
                    <p className='text-sm text-gray-500 mb-4'>{t('template.no_fields_desc')}</p>
                    <Button onClick={addField} size='sm'>
                      <Icons name='IconPlus' size={16} className='mr-1' />
                      {t('template.field_editor.add_field')}
                    </Button>
                  </Card>
                )}
              </div>
            </div>
          </Section>
        )}

        {activeTab === 'preview' && (
          <Section title={t('template.preview.title')} icon='IconEye'>
            <div className='bg-gray-50 rounded-lg p-6'>
              <h4 className='font-medium mb-4'>{t('template.preview.live_preview')}</h4>
              {/* Template Preview would go here */}
              <div className='bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center'>
                <Icons name='IconEye' size={32} className='mx-auto text-gray-400 mb-3' />
                <p className='text-gray-500'>{t('template.preview.coming_soon')}</p>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
};
