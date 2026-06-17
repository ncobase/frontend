import React, { useEffect, useState, useCallback } from 'react';

import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useListTaxonomies } from '../../taxonomy/service';
import { TopicMediaField } from '../components/media_manager';
import { useTopicMediaUpload } from '../hooks/useTopicMediaUpload';
import type { TopicMedia } from '../topic_media';

import { useSpaceContext } from '@/features/space/context';

interface CreateTopicFormProps {
  onSubmit: (_event?: React.BaseSyntheticEvent) => void;
  control: any;
  setValue: (_name: string, _value: any) => void;
  errors: any;
  topicMedia?: TopicMedia[];
  onTopicMediaChange?: (_topicMedia: TopicMedia[]) => void;
  disabled?: boolean;
}

export const CreateTopicForm = ({
  onSubmit,
  control,
  setValue,
  errors,
  topicMedia = [],
  onTopicMediaChange,
  disabled = false
}: CreateTopicFormProps) => {
  const { t } = useTranslation();
  const { space_id } = useSpaceContext();
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
      title: t('topic.section.basic_info', 'Basic Information'),
      subtitle: t('topic.section.basic_info_subtitle', 'Essential topic details'),
      icon: 'IconInfoCircle',
      collapsible: false,
      fields: [
        {
          title: t('topic.fields.name', 'Topic Name'),
          name: 'name',
          type: 'text',
          prependIcon: 'IconSignature',
          defaultValue: '',
          placeholder: t('topic.placeholders.name', 'Enter topic name'),
          rules: {
            required: t('forms.input_required'),
            minLength: { value: 2, message: t('forms.min_length', { count: 2 }) },
            maxLength: { value: 200, message: t('forms.max_length', { count: 200 }) }
          }
        },
        {
          title: t('topic.fields.title', 'Title'),
          name: 'title',
          type: 'text',
          prependIcon: 'IconTitleMultiple',
          defaultValue: '',
          placeholder: t('topic.placeholders.title', 'Enter topic title'),
          rules: {
            required: t('forms.input_required'),
            minLength: { value: 2, message: t('forms.min_length', { count: 2 }) },
            maxLength: { value: 300, message: t('forms.max_length', { count: 300 }) }
          }
        },
        {
          title: t('topic.fields.content_type', 'Content Type'),
          name: 'content_type',
          type: 'select',
          prependIcon: 'IconArticle',
          defaultValue: 'article',
          options: [
            { label: t('topic.content_type.article', 'Article'), value: 'article' },
            { label: t('topic.content_type.page', 'Page'), value: 'page' },
            { label: t('topic.content_type.video', 'Video'), value: 'video' },
            { label: t('topic.content_type.audio', 'Audio'), value: 'audio' }
          ],
          rules: { required: t('forms.select_required') }
        },
        {
          title: t('topic.fields.slug', 'Slug'),
          name: 'slug',
          type: 'text',
          prependIcon: 'IconRouteAltLeft',
          defaultValue: '',
          placeholder: t('topic.placeholders.slug', 'Enter URL slug'),
          description: t(
            'topic.slug_hint',
            'URL-friendly identifier (optional, auto-generated if empty)'
          )
        },
        {
          title: t('topic.fields.taxonomy', 'Taxonomy'),
          name: 'taxonomy_id',
          type: 'select',
          prependIcon: 'IconCategory2',
          defaultValue: '',
          placeholder: t('topic.placeholders.taxonomy', 'Select taxonomy'),
          options: taxonomyOptions,
          rules: { required: t('forms.select_required') }
        }
      ]
    },
    {
      id: 'content',
      title: t('topic.section.content', 'Content'),
      subtitle: t('topic.section.content_subtitle', 'Main topic content'),
      icon: 'IconFileText',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.content', 'Content'),
          name: 'content',
          type: 'editor',
          defaultValue: '',
          placeholder: t('topic.placeholders.content', 'Enter content'),
          className: 'col-span-full',
          rows: 10,
          description: t('topic.content_hint', 'Main content of the topic')
        }
      ]
    },
    {
      id: 'seo',
      title: t('topic.section.seo', 'SEO Metadata'),
      subtitle: t('topic.section.seo_subtitle', 'Search and discovery metadata'),
      icon: 'IconSearch',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.seo_title', 'SEO Title'),
          name: 'seo_title',
          type: 'text',
          defaultValue: '',
          placeholder: t('topic.placeholders.seo_title', 'Search result title'),
          description: t('topic.seo_title_hint', 'Recommended length: 25-70 characters'),
          rules: {
            maxLength: { value: 70, message: t('forms.max_length', { count: 70 }) }
          }
        },
        {
          title: t('topic.fields.seo_keywords', 'SEO Keywords'),
          name: 'seo_keywords',
          type: 'text',
          defaultValue: '',
          placeholder: t('topic.placeholders.seo_keywords', 'keyword one, keyword two'),
          description: t('topic.seo_keywords_hint', 'Comma-separated search keywords')
        },
        {
          title: t('topic.fields.seo_description', 'SEO Description'),
          name: 'seo_description',
          type: 'textarea',
          defaultValue: '',
          rows: 3,
          className: 'col-span-full',
          placeholder: t('topic.placeholders.seo_description', 'Search result description'),
          description: t('topic.seo_description_hint', 'Recommended length: 70-170 characters'),
          rules: {
            maxLength: { value: 170, message: t('forms.max_length', { count: 170 }) }
          }
        },
        {
          title: t('topic.fields.excerpt', 'Excerpt'),
          name: 'excerpt',
          type: 'textarea',
          defaultValue: '',
          rows: 3,
          className: 'col-span-full',
          placeholder: t('topic.placeholders.excerpt', 'Short editorial summary')
        }
      ]
    },
    {
      id: 'media',
      title: t('topic.section.media', 'Media'),
      subtitle: t('topic.section.media_subtitle', 'Images and attachments'),
      icon: 'IconPhoto',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.thumbnail', 'Thumbnail'),
          name: 'thumbnail',
          type: 'uploader',
          defaultValue: null,
          className: 'col-span-full',
          placeholderText: {
            main: t('topic.placeholders.thumbnail_main', 'Upload thumbnail'),
            sub: t('topic.placeholders.thumbnail_sub', 'or drag and drop'),
            hint: t('topic.placeholders.thumbnail_hint', 'PNG, JPG or WebP (max. 5MB)')
          },
          maxFiles: 1,
          maxSize: 5 * 1024 * 1024,
          accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
          uploadOnChange: true,
          returnType: 'url',
          useUploadHook: () => useTopicMediaUpload(),
          onUploadSuccess: handleThumbnailUploadSuccess,
          rules: {
            validate: {
              fileSize: value => {
                if (value instanceof File && value.size > 5 * 1024 * 1024) {
                  return t('forms.file_too_large', 'File size must be less than 5MB');
                }
                return true;
              },
              fileType: value => {
                if (value instanceof File && !value.type.startsWith('image/')) {
                  return t('forms.invalid_file_type', 'Only image files are allowed');
                }
                return true;
              }
            }
          }
        }
      ]
    },
    {
      id: 'publishing',
      title: t('topic.section.publishing', 'Publishing Options'),
      subtitle: t('topic.section.publishing_subtitle', 'Status and visibility settings'),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.status', 'Status'),
          name: 'status',
          type: 'select',
          prependIcon: 'IconStatusChange',
          defaultValue: 0,
          options: [
            { label: t('topic.status.draft', 'Draft'), value: 0 },
            { label: t('topic.status.published', 'Published'), value: 1 },
            { label: t('topic.status.archived', 'Archived'), value: 2 }
          ],
          rules: { required: t('forms.select_required') }
        },
        {
          title: t('topic.fields.released', 'Release Date'),
          name: 'released',
          type: 'datetime-local',
          prependIcon: 'IconCalendarMonth',
          defaultValue: new Date().toISOString().slice(0, 16),
          description: t('topic.released_hint', 'When this topic should be released')
        },
        {
          title: t('topic.fields.markdown', 'Use Markdown'),
          name: 'markdown',
          type: 'switch',
          defaultValue: true,
          description: t('topic.markdown_hint', 'Enable Markdown formatting for content')
        },
        {
          title: t('topic.fields.private', 'Private'),
          name: 'private',
          type: 'switch',
          defaultValue: false,
          description: t('topic.private_hint', 'Make this topic private (not publicly visible)')
        },
        {
          title: t('topic.fields.temp', 'Temporary'),
          name: 'temp',
          type: 'switch',
          defaultValue: false,
          description: t('topic.temp_hint', 'Mark as temporary content')
        },
        {
          title: t('topic.fields.space_id', 'Space'),
          name: 'space_id',
          type: 'hidden',
          defaultValue: space_id
        }
      ]
    }
  ];

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
            id={`create-topic-${section.id}`}
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
            onSubmit={onSubmit}
            control={control}
            errors={errors}
            fields={section.fields}
          />
          {section.id === 'media' && (
            <TopicMediaField value={topicMedia} onChange={onTopicMediaChange} disabled={disabled} />
          )}
        </Section>
      ))}
    </div>
  );
};
