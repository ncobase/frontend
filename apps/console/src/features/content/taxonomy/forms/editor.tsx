import React, { useEffect, useState, useCallback } from 'react';

import { Form, FormSection, Section } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useTaxonomyMediaUpload } from '../hooks/useTaxonomyMediaUpload';
import { useListTaxonomies, useQueryTaxonomy } from '../service';

export const EditorTaxonomyForm = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryTaxonomy(record);
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

  const handleCoverUploadSuccess = useCallback(
    (result: any) => {
      const coverUrl = result?.download_url || result?.path || result?.url;
      if (coverUrl) {
        setValue('cover', coverUrl);
      }
    },
    [setValue]
  );

  const handleThumbnailUploadSuccess = useCallback(
    (result: any) => {
      const thumbnailUrl = result?.download_url || result?.path || result?.url;
      if (thumbnailUrl) {
        setValue('thumbnail', thumbnailUrl);
      }
    },
    [setValue]
  );

  const formSections: FormSection[] = [
    {
      id: 'basic',
      title: t('taxonomy.section.basic_info', 'Basic Information'),
      subtitle: t('taxonomy.section.basic_info_subtitle', 'Essential taxonomy details'),
      icon: 'IconInfoCircle',
      collapsible: false,
      fields: [
        {
          title: t('taxonomy.fields.name', 'Name'),
          name: 'name',
          type: 'text',
          prependIcon: 'IconSignature',
          defaultValue: '',
          placeholder: t('taxonomy.placeholders.name', 'Enter taxonomy name'),
          rules: {
            required: t('forms.input_required'),
            minLength: { value: 2, message: t('forms.min_length', { count: 2 }) },
            maxLength: { value: 100, message: t('forms.max_length', { count: 100 }) }
          }
        },
        {
          title: t('taxonomy.fields.type', 'Type'),
          name: 'type',
          type: 'select',
          prependIcon: 'IconCategory2',
          defaultValue: 'category',
          options: [
            { label: t('taxonomy.types.category', 'Category'), value: 'category' },
            { label: t('taxonomy.types.tag', 'Tag'), value: 'tag' },
            { label: t('taxonomy.types.topic', 'Topic'), value: 'topic' },
            { label: t('taxonomy.types.section', 'Section'), value: 'section' },
            { label: t('taxonomy.types.department', 'Department'), value: 'department' },
            { label: t('taxonomy.types.custom', 'Custom'), value: 'custom' }
          ],
          rules: { required: t('forms.select_required') }
        },
        {
          title: t('taxonomy.fields.slug', 'Slug'),
          name: 'slug',
          type: 'text',
          prependIcon: 'IconRouteAltLeft',
          defaultValue: '',
          placeholder: t('taxonomy.placeholders.slug', 'Enter slug'),
          description: t('taxonomy.slug_hint', 'URL-friendly identifier')
        },
        {
          title: t('taxonomy.fields.parent', 'Parent'),
          name: 'parent_id',
          type: 'select',
          prependIcon: 'IconHierarchy2',
          defaultValue: '',
          placeholder: t('taxonomy.placeholders.parent', 'Select parent taxonomy'),
          options: parentOptions,
          description: t('taxonomy.parent_hint', 'Leave empty for root level taxonomy')
        }
      ]
    },
    {
      id: 'appearance',
      title: t('taxonomy.section.appearance', 'Appearance'),
      subtitle: t('taxonomy.section.appearance_subtitle', 'Visual representation'),
      icon: 'IconPalette',
      collapsible: true,
      fields: [
        {
          title: t('taxonomy.fields.color', 'Color'),
          name: 'color',
          type: 'color',
          defaultValue: '#3B82F6',
          description: t('taxonomy.color_hint', 'Theme color for this taxonomy')
        },
        {
          title: t('taxonomy.fields.icon', 'Icon'),
          name: 'icon',
          type: 'icon',
          defaultValue: 'IconFolder',
          description: t('taxonomy.icon_hint', 'Icon to represent this taxonomy')
        },
        {
          title: t('taxonomy.fields.cover', 'Cover Image'),
          name: 'cover',
          type: 'uploader',
          defaultValue: null,
          className: 'col-span-full',
          placeholderText: {
            main: t('taxonomy.placeholders.cover_main', 'Upload cover image'),
            sub: t('taxonomy.placeholders.cover_sub', 'or drag and drop'),
            hint: t('taxonomy.placeholders.cover_hint', 'PNG, JPG or WebP (max. 5MB)')
          },
          maxFiles: 1,
          maxSize: 5 * 1024 * 1024,
          accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
          uploadOnChange: true,
          returnType: 'url',
          useUploadHook: () => useTaxonomyMediaUpload(),
          onUploadSuccess: handleCoverUploadSuccess
        },
        {
          title: t('taxonomy.fields.thumbnail', 'Thumbnail'),
          name: 'thumbnail',
          type: 'uploader',
          defaultValue: null,
          className: 'col-span-full',
          placeholderText: {
            main: t('taxonomy.placeholders.thumbnail_main', 'Upload thumbnail'),
            sub: t('taxonomy.placeholders.thumbnail_sub', 'or drag and drop'),
            hint: t('taxonomy.placeholders.thumbnail_hint', 'PNG, JPG or WebP (max. 2MB)')
          },
          maxFiles: 1,
          maxSize: 2 * 1024 * 1024,
          accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
          uploadOnChange: true,
          returnType: 'url',
          useUploadHook: () => useTaxonomyMediaUpload(),
          onUploadSuccess: handleThumbnailUploadSuccess
        }
      ]
    },
    {
      id: 'seo',
      title: t('taxonomy.section.seo', 'SEO & Metadata'),
      subtitle: t('taxonomy.section.seo_subtitle', 'Search engine optimization'),
      icon: 'IconSearch',
      collapsible: true,
      fields: [
        {
          title: t('taxonomy.fields.url', 'URL'),
          name: 'url',
          type: 'text',
          prependIcon: 'IconWorldWww',
          defaultValue: '',
          placeholder: t('taxonomy.placeholders.url', 'Custom URL'),
          description: t('taxonomy.url_hint', 'Custom URL for this taxonomy (optional)')
        },
        {
          title: t('taxonomy.fields.keywords', 'Keywords'),
          name: 'keywords',
          type: 'text',
          prependIcon: 'IconTags',
          defaultValue: '',
          placeholder: t('taxonomy.placeholders.keywords', 'keyword1, keyword2, keyword3'),
          description: t('taxonomy.keywords_hint', 'SEO keywords (comma separated)')
        },
        {
          title: t('taxonomy.fields.description', 'Description'),
          name: 'description',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('taxonomy.placeholders.description', 'Enter description'),
          className: 'col-span-full',
          rows: 3,
          description: t('taxonomy.description_hint', 'Detailed description of this taxonomy')
        }
      ]
    },
    {
      id: 'settings',
      title: t('taxonomy.section.settings', 'Settings'),
      subtitle: t('taxonomy.section.settings_subtitle', 'Status and configuration'),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('taxonomy.fields.status', 'Status'),
          name: 'status',
          type: 'select',
          prependIcon: 'IconStatusChange',
          defaultValue: 0,
          options: [
            { label: t('taxonomy.status.enabled', 'Enabled'), value: 0 },
            { label: t('taxonomy.status.disabled', 'Disabled'), value: 1 }
          ],
          rules: { required: t('forms.select_required') }
        }
      ]
    },
    {
      id: 'system',
      title: t('taxonomy.section.system', 'System Information'),
      subtitle: t('taxonomy.section.system_subtitle', 'Read-only system data'),
      icon: 'IconDatabase',
      collapsible: true,
      fields: [
        {
          title: t('taxonomy.fields.id', 'ID'),
          name: 'id',
          type: 'text',
          defaultValue: '',
          disabled: true,
          className: 'font-mono text-sm'
        },
        {
          title: t('taxonomy.fields.created_at', 'Created At'),
          name: 'created_at',
          type: 'text',
          defaultValue: '',
          disabled: true
        },
        {
          title: t('taxonomy.fields.updated_at', 'Updated At'),
          name: 'updated_at',
          type: 'text',
          defaultValue: '',
          disabled: true
        },
        {
          title: t('taxonomy.fields.created_by', 'Created By'),
          name: 'created_by',
          type: 'text',
          defaultValue: '',
          disabled: true
        },
        {
          title: t('taxonomy.fields.extras', 'Extra Data'),
          name: 'extras',
          type: 'hidden',
          defaultValue: {}
        }
      ]
    }
  ];

  // Set form values when data is loaded
  useEffect(() => {
    if (!data || Object.keys(data).length === 0 || isLoading) return;

    setValue('id', data.id);
    setValue('name', data.name || '');
    setValue('type', data.type || 'category');
    setValue('slug', data.slug || '');
    setValue('parent_id', data.parent || '');
    setValue('cover', data.cover || null);
    setValue('thumbnail', data.thumbnail || null);
    setValue('color', data.color || '#3B82F6');
    setValue('icon', data.icon || 'IconFolder');
    setValue('url', data.url || '');
    setValue('keywords', data.keywords || '');
    setValue('description', data.description || '');
    setValue('status', data.status !== undefined ? data.status : 0);
    setValue('extras', data.extras || {});
    setValue('created_at', formatDateTime(data.created_at) || '');
    setValue('updated_at', formatDateTime(data.updated_at) || '');
    setValue('created_by', data.created_by || '');
  }, [setValue, data, isLoading]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        <span className='ml-3'>{t('common.loading', 'Loading...')}</span>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {formSections.map(section => (
        <Section
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          collapsible={section.collapsible}
          className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
        >
          <Form
            id={`edit-taxonomy-${section.id}`}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
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
