import { useEffect } from 'react';

import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useQueryTenant } from '../service';

import { useTenantLogoUpload } from '@/hooks';

export const EditTenantForm = ({ record, onSubmit, control, setValue, errors }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryTenant(record);

  const handleLogoUploadComplete = (uploadResult: any) => {
    setValue('logo', uploadResult.download_url || uploadResult.path);
  };

  const formSections: FormSection[] = [
    {
      id: 'basic',
      title: t('tenant.section.basic_info', 'Basic Information'),
      subtitle: t('tenant.section.basic_info_subtitle', 'Primary tenant details'),
      icon: 'IconInfoCircle',
      collapsible: false,
      fields: [
        {
          title: t('tenant.fields.name', 'Name'),
          name: 'name',
          type: 'text',
          prependIcon: 'IconSignature',
          defaultValue: '',
          placeholder: t('tenant.placeholders.name', 'Enter tenant name'),
          rules: {
            required: t('forms.input_required'),
            minLength: { value: 2, message: t('forms.min_length', { count: 2 }) },
            maxLength: { value: 100, message: t('forms.max_length', { count: 100 }) }
          }
        },
        {
          title: t('tenant.fields.slug', 'Slug'),
          name: 'slug',
          type: 'text',
          prependIcon: 'IconRouteAltLeft',
          defaultValue: '',
          placeholder: t('tenant.placeholders.slug', 'tenant-slug'),
          description: t(
            'tenant.slug_hint',
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
          title: t('tenant.fields.type', 'Type'),
          name: 'type',
          type: 'select',
          prependIcon: 'IconCategory2',
          defaultValue: 'private',
          placeholder: t('tenant.placeholders.type', 'Select tenant type'),
          options: [
            { label: t('tenant.types.private', 'Private'), value: 'private' },
            { label: t('tenant.types.public', 'Public'), value: 'public' },
            { label: t('tenant.types.internal', 'Internal'), value: 'internal' },
            { label: t('tenant.types.external', 'External'), value: 'external' },
            { label: t('tenant.types.other', 'Other'), value: 'other' }
          ],
          rules: { required: t('forms.select_required') }
        },
        {
          title: t('tenant.fields.url', 'Domain URL'),
          name: 'url',
          type: 'text',
          prependIcon: 'IconWorldWww',
          defaultValue: '',
          placeholder: t('tenant.placeholders.url', 'example.com'),
          description: t('tenant.url_hint', 'Domain or subdomain for this tenant'),
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
      title: t('tenant.section.branding', 'Branding'),
      subtitle: t('tenant.section.branding_subtitle', 'Logo and visual identity'),
      icon: 'IconPalette',
      collapsible: true,
      fields: [
        {
          title: t('tenant.fields.title', 'SEO Title'),
          name: 'title',
          type: 'text',
          prependIcon: 'IconTitleMultiple',
          defaultValue: '',
          placeholder: t('tenant.placeholders.title', 'Page title')
        },
        {
          title: t('tenant.fields.logo', 'Logo'),
          name: 'logo',
          type: 'uploader',
          defaultValue: null,
          className: 'col-span-full',
          placeholderText: {
            main: t('tenant.placeholders.logo_main', 'Upload logo'),
            sub: t('tenant.placeholders.logo_sub', 'or drag and drop'),
            hint: t('tenant.placeholders.logo_hint', 'PNG, JPG or SVG (max. 2MB)')
          },
          maxFiles: 1,
          maxSize: 2 * 1024 * 1024,
          accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp']
          },
          uploadOnChange: true,
          returnType: 'url',
          useUploadHook: () => useTenantLogoUpload(),
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
          title: t('tenant.fields.logo_alt', 'Logo Alt Text'),
          name: 'logo_alt',
          type: 'text',
          prependIcon: 'IconAccessibleIcon',
          defaultValue: '',
          placeholder: t('tenant.placeholders.logo_alt', 'Logo alternative text')
        }
      ]
    },
    // Include SEO and Settings sections (same as create form)
    {
      id: 'seo',
      title: t('tenant.section.seo', 'SEO Information'),
      subtitle: t('tenant.section.seo_subtitle', 'Search engine optimization details'),
      icon: 'IconSearch',
      collapsible: true,
      fields: [
        {
          title: t('tenant.fields.description', 'SEO Description'),
          name: 'description',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('tenant.placeholders.description', 'Short description for search engines'),
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
          title: t('tenant.fields.keywords', 'SEO Keywords'),
          name: 'keywords',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('tenant.placeholders.keywords', 'keyword1, keyword2, keyword3'),
          className: 'col-span-full',
          rows: 2,
          description: t('tenant.fields.keywords_hint', 'Separate keywords with commas')
        },
        {
          title: t('tenant.fields.copyright', 'Copyright Text'),
          name: 'copyright',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('tenant.placeholders.copyright', '© 2025 Company Name'),
          className: 'col-span-full',
          rows: 2
        }
      ]
    },
    {
      id: 'settings',
      title: t('tenant.section.settings', 'Settings'),
      subtitle: t('tenant.section.settings_subtitle', 'Tenant status and configuration'),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('tenant.fields.order', 'Display Order'),
          name: 'order',
          type: 'number',
          prependIcon: 'IconHash',
          defaultValue: 0,
          placeholder: '0',
          description: t('tenant.order_hint', 'Order for displaying in lists')
        },
        {
          title: t('tenant.fields.expired_at', 'Expiration Date'),
          name: 'expired_at',
          type: 'date',
          prependIcon: 'IconCalendarMonth',
          defaultValue: '',
          description: t('tenant.fields.expired_at_hint', 'When tenant access will expire')
        },
        {
          title: t('tenant.fields.disabled', 'Disabled'),
          name: 'disabled',
          type: 'switch',
          defaultValue: false,
          description: t('tenant.fields.disabled_hint', 'Disable tenant access')
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
          className='mb-6'
        >
          <Form
            id={`edit-tenant-${section.id}`}
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
