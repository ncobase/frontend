import { useEffect } from 'react';

import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQuerySpace } from '../service';

import { useSpaceLogoUpload } from '@/hooks';

export const EditSpaceForm = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQuerySpace(record);

  const handleLogoUploadComplete = (uploadResult: any) => {
    setValue('logo', uploadResult.download_url || uploadResult.path);
  };

  const formSections: FormSection[] = [
    {
      id: 'basic',
      title: t('space.section.basic_info', 'Basic Information'),
      subtitle: t('space.section.basic_info_subtitle', 'Primary space details'),
      icon: 'IconInfoCircle',
      collapsible: false,
      fields: [
        {
          title: t('space.fields.name', 'Name'),
          name: 'name',
          type: 'text',
          prependIcon: 'IconSignature',
          defaultValue: '',
          placeholder: t('space.placeholders.name', 'Enter space name'),
          rules: {
            required: t('forms.input_required'),
            minLength: { value: 2, message: t('forms.min_length', { count: 2 }) },
            maxLength: { value: 100, message: t('forms.max_length', { count: 100 }) }
          }
        },
        {
          title: t('space.fields.slug', 'Slug'),
          name: 'slug',
          type: 'text',
          prependIcon: 'IconRouteAltLeft',
          defaultValue: '',
          placeholder: t('space.placeholders.slug', 'space-slug'),
          description: t(
            'space.slug_hint',
            'URL-friendly identifier, lowercase letters, numbers and hyphens only'
          ),
          rules: {
            required: t('forms.input_required'),
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: t('forms.slug_pattern')
            },
            minLength: { value: 3, message: t('forms.min_length', { count: 3 }) },
            maxLength: { value: 50, message: t('forms.max_length', { count: 50 }) }
          }
        },
        {
          title: t('space.fields.type', 'Type'),
          name: 'type',
          type: 'select',
          prependIcon: 'IconCategory2',
          defaultValue: 'private',
          placeholder: t('space.placeholders.type', 'Select space type'),
          options: [
            { label: t('common.types.private', 'Private'), value: 'private' },
            { label: t('common.types.public', 'Public'), value: 'public' },
            { label: t('common.types.internal', 'Internal'), value: 'internal' },
            { label: t('common.types.external', 'External'), value: 'external' },
            { label: t('common.types.other', 'Other'), value: 'other' }
          ],
          rules: { required: t('forms.select_required') }
        },
        {
          title: t('space.fields.url', 'Domain URL'),
          name: 'url',
          type: 'text',
          prependIcon: 'IconWorldWww',
          defaultValue: '',
          placeholder: t('space.placeholders.url', 'example.com'),
          description: t('space.url_hint', 'Domain or subdomain for this space'),
          rules: {
            pattern: {
              value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
              message: t('forms.url_pattern')
            }
          }
        }
      ]
    },
    {
      id: 'branding',
      title: t('space.section.branding', 'Branding'),
      subtitle: t('space.section.branding_subtitle', 'Logo and visual identity'),
      icon: 'IconPalette',
      collapsible: true,
      fields: [
        {
          title: t('space.fields.title', 'SEO Title'),
          name: 'title',
          type: 'text',
          prependIcon: 'IconTitleMultiple',
          defaultValue: '',
          placeholder: t('space.placeholders.title', 'Page title')
        },
        {
          title: t('space.fields.logo', 'Logo'),
          name: 'logo',
          type: 'uploader',
          defaultValue: null,
          className: 'col-span-full',
          placeholderText: {
            main: t('space.placeholders.logo_main', 'Upload logo'),
            sub: t('space.placeholders.logo_sub', 'or drag and drop'),
            hint: t('space.placeholders.logo_hint', 'PNG, JPG or SVG (max. 2MB)')
          },
          maxFiles: 1,
          maxSize: 2 * 1024 * 1024,
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp']
          },
          uploadOnChange: true,
          returnType: 'url',
          useUploadHook: () => useSpaceLogoUpload(),
          rules: {
            validate: {
              fileSize: value => {
                if (value instanceof File && value.size > 2 * 1024 * 1024) {
                  return t('forms.file_too_large', 'File size must be less than 2MB');
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
        },
        {
          title: t('space.fields.logo_alt', 'Logo Alt Text'),
          name: 'logo_alt',
          type: 'text',
          prependIcon: 'IconAccessibleIcon',
          defaultValue: '',
          placeholder: t('space.placeholders.logo_alt', 'Logo alternative text')
        }
      ]
    },
    // Include SEO and Settings sections (same as create form)
    {
      id: 'seo',
      title: t('space.section.seo', 'SEO Information'),
      subtitle: t('space.section.seo_subtitle', 'Search engine optimization details'),
      icon: 'IconSearch',
      collapsible: true,
      fields: [
        {
          title: t('space.fields.description', 'SEO Description'),
          name: 'description',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('space.placeholders.description', 'Short description for search engines'),
          className: 'col-span-full',
          rows: 3,
          rules: {
            maxLength: {
              value: 160,
              message: t('forms.max_length', { count: 160 })
            }
          }
        },
        {
          title: t('space.fields.keywords', 'SEO Keywords'),
          name: 'keywords',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('space.placeholders.keywords', 'keyword1, keyword2, keyword3'),
          className: 'col-span-full',
          rows: 2,
          description: t('space.fields.keywords_hint', 'Separate keywords with commas')
        },
        {
          title: t('space.fields.copyright', 'Copyright Text'),
          name: 'copyright',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('space.placeholders.copyright', '© 2025 Company Name'),
          className: 'col-span-full',
          rows: 2
        }
      ]
    },
    {
      id: 'settings',
      title: t('space.section.settings', 'Settings'),
      subtitle: t('space.section.settings_subtitle', 'Space status and configuration'),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('space.fields.order', 'Display Order'),
          name: 'order',
          type: 'number',
          prependIcon: 'IconHash',
          defaultValue: 0,
          placeholder: '0',
          description: t('space.order_hint', 'Order for displaying in lists')
        },
        {
          title: t('space.fields.expired_at', 'Expiration Date'),
          name: 'expired_at',
          type: 'date',
          prependIcon: 'IconCalendarMonth',
          defaultValue: '',
          description: t('space.fields.expired_at_hint', 'When space access will expire')
        },
        {
          title: t('space.fields.disabled', 'Disabled'),
          name: 'disabled',
          type: 'switch',
          defaultValue: false,
          description: t('space.fields.disabled_hint', 'Disable space access')
        }
      ]
    }
  ];

  // Set form values when data is loaded
  useEffect(() => {
    if (!data || isLoading) return;

    setValue('id', data.id);
    setValue('name', data.name || '');
    setValue('slug', data.slug || '');
    setValue('type', data.type || 'private');
    setValue('url', data.url || '');
    setValue('title', data.title || '');
    setValue('description', data.description || '');
    setValue('keywords', data.keywords || '');
    setValue('copyright', data.copyright || '');
    setValue('logo', data.logo || null); // This will be URL string or null
    setValue('logo_alt', data.logo_alt || '');
    setValue('order', data.order || 0);
    setValue(
      'expired_at',
      data.expired_at ? new Date(data.expired_at).toISOString().split('T')[0] : ''
    );
    setValue('disabled', data.disabled || false);
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
            id={`edit-space-${section.id}`}
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
