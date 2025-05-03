import { Form, FormSection, Section } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

export const CreateTenantForm = ({ onSubmit, control, errors }) => {
  const { t } = useTranslation();

  const formSections: FormSection[] = [
    {
      id: 'section1',
      title: t('tenant.section.basic_info', 'Basic Information'),
      subtitle: t('tenant.section.basic_info_subtitle', 'Primary tenant details'),
      icon: 'IconInfoCircle',
      collapsible: true,
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
            minLength: {
              value: 2,
              message: t('forms.min_length', { count: 2 })
            },
            maxLength: {
              value: 50,
              message: t('forms.max_length', { count: 50 })
            }
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
          title: t('tenant.fields.slug', 'Slug'),
          name: 'slug',
          type: 'text',
          prependIcon: 'IconRouteAltLeft',
          defaultValue: '',
          placeholder: t('tenant.placeholders.slug', 'tenant-slug'),
          rules: {
            pattern: {
              value: /^[a-z0-9-]+$/,
              message: t('forms.slug_pattern')
            }
          }
        },
        {
          title: t('tenant.fields.url', 'Domain URL'),
          name: 'url',
          type: 'text',
          prependIcon: 'IconWorldWww',
          defaultValue: '',
          placeholder: t('tenant.placeholders.url', 'example.com'),
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
      id: 'section2',
      title: t('tenant.section.branding', 'Branding'),
      subtitle: t('tenant.section.branding_subtitle', 'Logo and visual identity'),
      icon: 'IconPalette',
      collapsible: true,
      fields: [
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
          maxSize: 2 * 1024 * 1024
        },
        {
          title: t('tenant.fields.logo_alt', 'Logo Alt Text'),
          name: 'logo_alt',
          type: 'text',
          prependIcon: 'IconAccessibleIcon',
          defaultValue: '',
          placeholder: t('tenant.placeholders.logo_alt', 'Logo alternative text')
        },
        {
          title: t('tenant.fields.title', 'SEO Title'),
          name: 'title',
          type: 'text',
          prependIcon: 'IconTitleMultiple',
          defaultValue: '',
          placeholder: t('tenant.placeholders.title', 'Page title')
        }
      ]
    },
    {
      id: 'section3',
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
          placeholder: t('tenant.placeholders.keywords', 'keywords,separated,by,commas'),
          className: 'col-span-full',
          description: t('tenant.fields.keywords_hint', 'Separate keywords with commas')
        },
        {
          title: t('tenant.fields.copyright', 'Copyright Text'),
          name: 'copyright',
          type: 'textarea',
          defaultValue: '',
          placeholder: t('tenant.placeholders.copyright', '© 2025 Company Name'),
          className: 'col-span-full'
        }
      ]
    },
    {
      id: 'section4',
      title: t('tenant.section.settings', 'Settings'),
      subtitle: t('tenant.section.settings_subtitle', 'Tenant status and configuration'),
      icon: 'IconSettings',
      collapsible: true,
      fields: [
        {
          title: t('tenant.fields.disabled', 'Disabled'),
          name: 'disabled',
          type: 'switch',
          defaultValue: false,
          description: t('tenant.fields.disabled_hint', 'Disable tenant access')
        },
        {
          title: t('tenant.fields.expired_at', 'Expiration Date'),
          name: 'expired_at',
          type: 'date',
          prependIcon: 'IconCalendarMonth',
          defaultValue: '',
          description: t('tenant.fields.expired_at_hint', 'When tenant access will expire')
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
          icon={section.icon}
          collapsible={section.collapsible}
          className='mb-6'
        >
          <Form
            id={`create-tenant-${section.id}`}
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
