import { FormSection } from '@ncobase/react';
import { TFunction } from 'i18next';

export const createTopicFormSections = (
  t: TFunction,
  taxonomyOptions = [],
  data?: Record<string, any>
) => {
  const sections: FormSection[] = [
    {
      id: 'basic-info',
      title: t('topic.section.basic_info', 'Basic Information'),
      icon: 'IconInfoCircle',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.name', 'Topic Name'),
          name: 'name',
          type: 'text',
          prependIcon: 'IconSignature',
          defaultValue: data?.name || '',
          placeholder: t('topic.placeholders.name', 'Enter topic name'),
          rules: { required: t('forms.input_required') }
        },
        {
          title: t('topic.fields.title', 'Title'),
          name: 'title',
          type: 'text',
          prependIcon: 'IconTitleMultiple',
          defaultValue: data?.title || '',
          placeholder: t('topic.placeholders.title', 'Enter topic title'),
          rules: { required: t('forms.input_required') }
        },
        {
          title: t('topic.fields.slug', 'Slug'),
          name: 'slug',
          type: 'text',
          prependIcon: 'IconRouteAltLeft',
          defaultValue: data?.slug || '',
          placeholder: t('topic.placeholders.slug', 'Enter URL slug')
        },
        {
          title: t('topic.fields.taxonomy', 'Taxonomy'),
          name: 'taxonomy_id',
          type: 'select',
          prependIcon: 'IconCategory2',
          defaultValue: data?.taxonomy || '',
          placeholder: t('topic.placeholders.taxonomy', 'Select taxonomy'),
          options: taxonomyOptions,
          rules: { required: t('forms.input_required') }
        },
        {
          title: t('topic.fields.thumbnail', 'Thumbnail'),
          name: 'thumbnail',
          type: 'text',
          prependIcon: 'IconImage',
          defaultValue: data?.thumbnail || '',
          placeholder: t('topic.placeholders.thumbnail', 'Enter thumbnail URL')
        }
      ]
    },
    {
      id: 'content',
      title: t('topic.section.content', 'Content'),
      icon: 'IconFileText',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.content', 'Content'),
          name: 'content',
          type: 'editor',
          defaultValue: data?.content || '',
          placeholder: t('topic.placeholders.content', 'Enter content'),
          fullWidth: true,
          className: 'col-span-full'
        }
      ]
    },
    {
      id: 'publishing',
      title: t('topic.section.publishing', 'Publishing Options'),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('topic.fields.markdown', 'Use Markdown'),
          name: 'markdown',
          type: 'switch',
          defaultValue: data?.markdown !== undefined ? data.markdown : true,
          elementClassName: 'my-3'
        },
        {
          title: t('topic.fields.private', 'Is Private'),
          name: 'private',
          type: 'switch',
          defaultValue: data?.private !== undefined ? data.private : false,
          elementClassName: 'my-3'
        },
        {
          title: t('topic.fields.temp', 'Is Temporary'),
          name: 'temp',
          type: 'switch',
          defaultValue: data?.temp !== undefined ? data.temp : false,
          elementClassName: 'my-3'
        },
        {
          title: t('topic.fields.status', 'Status'),
          name: 'status',
          type: 'select',
          prependIcon: 'IconStatusChange',
          defaultValue: data?.status !== undefined ? data.status : 0,
          options: [
            { label: t('topic.status.draft', 'Draft'), value: 0 },
            { label: t('topic.status.published', 'Published'), value: 1 },
            { label: t('topic.status.archived', 'Archived'), value: 2 }
          ]
        },
        {
          title: t('topic.fields.released', 'Release Date'),
          name: 'released',
          type: 'datetime',
          prependIcon: 'IconCalendarMonth',
          defaultValue: data?.released || Date.now()
        }
      ]
    }
  ];

  return sections;
};

// Optional system section for edit forms
export const createSystemSection = (t: TFunction, data: Record<string, any>) => {
  return {
    id: 'system',
    title: t('topic.section.system', 'System Information'),
    icon: 'IconDatabase',
    collapsible: true,
    fields: [
      {
        title: t('topic.fields.created_at', 'Created At'),
        name: 'created_at',
        type: 'text',
        defaultValue: data?.created_at || '',
        disabled: true,
        className: 'col-span-1'
      },
      {
        title: t('topic.fields.updated_at', 'Updated At'),
        name: 'updated_at',
        type: 'text',
        defaultValue: data?.updated_at || '',
        disabled: true,
        className: 'col-span-1'
      },
      {
        title: t('topic.fields.id', 'ID'),
        name: 'id',
        type: 'hidden',
        defaultValue: data?.id || ''
      }
    ]
  };
};

// Utility functions
export const getStatusBadge = (status, t) => {
  switch (status) {
    case 0:
      return { variant: 'warning', label: t('topic.status.draft', 'Draft') };
    case 1:
      return { variant: 'success', label: t('topic.status.published', 'Published') };
    case 2:
      return { variant: 'danger', label: t('topic.status.archived', 'Archived') };
    default:
      return { variant: 'secondary', label: t('topic.status.unknown', 'Unknown') };
  }
};
