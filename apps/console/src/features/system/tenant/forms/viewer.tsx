import { FieldViewer, Section, Skeleton, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQueryTenant } from '../service';

interface ViewerSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  fields: ViewerField[];
}

interface ViewerField {
  id: string;
  title: string;
  accessor: string;
  renderer?: (_value: any, _data?: any) => React.ReactNode;
  className?: string;
}

export const TenantViewerForm = ({ record }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQueryTenant(record);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const viewerSections: ViewerSection[] = [
    {
      id: 'basic',
      title: t('tenant.section.basic_info', 'Basic Information'),
      subtitle: t('tenant.section.basic_info_subtitle', 'Primary tenant details'),
      icon: 'IconInfoCircle',
      fields: [
        {
          id: 'id',
          title: t('tenant.fields.id', 'ID'),
          accessor: 'id'
        },
        {
          id: 'name',
          title: t('tenant.fields.name', 'Name'),
          accessor: 'name'
        },
        {
          id: 'type',
          title: t('tenant.fields.type', 'Type'),
          accessor: 'type',
          renderer: value => renderTenantType(value)
        },
        {
          id: 'slug',
          title: t('tenant.fields.slug', 'Slug'),
          accessor: 'slug'
        },
        {
          id: 'url',
          title: t('tenant.fields.url', 'URL'),
          accessor: 'url',
          renderer: value => renderUrl(value)
        },
        {
          id: 'disabled',
          title: t('tenant.fields.status', 'Status'),
          accessor: 'disabled',
          renderer: value => renderStatus(value)
        },
        {
          id: 'expired_at',
          title: t('tenant.fields.expired_at', 'Expiration Date'),
          accessor: 'expired_at',
          renderer: value =>
            formatDateTime(value) || t('tenant.no_expiration', 'No expiration date')
        }
      ]
    },
    {
      id: 'branding',
      title: t('tenant.section.branding', 'Branding'),
      subtitle: t('tenant.section.branding_subtitle', 'Logo and visual identity'),
      icon: 'IconPalette',
      fields: [
        {
          id: 'logo',
          title: t('tenant.fields.logo', 'Logo'),
          accessor: 'logo',
          renderer: (value, data) => renderLogo(value, data?.logo_alt || data?.name),
          className: 'col-span-full'
        },
        {
          id: 'logo_alt',
          title: t('tenant.fields.logo_alt', 'Logo Alt Text'),
          accessor: 'logo_alt'
        },
        {
          id: 'title',
          title: t('tenant.fields.title', 'Site Title'),
          accessor: 'title'
        }
      ]
    },
    {
      id: 'seo',
      title: t('tenant.section.seo', 'SEO Information'),
      subtitle: t('tenant.section.seo_subtitle', 'Search engine optimization details'),
      icon: 'IconSearch',
      fields: [
        {
          id: 'description',
          title: t('tenant.fields.description', 'SEO Description'),
          accessor: 'description',
          className: 'col-span-full'
        },
        {
          id: 'keywords',
          title: t('tenant.fields.keywords', 'SEO Keywords'),
          accessor: 'keywords',
          renderer: value => renderKeywords(value),
          className: 'col-span-full'
        },
        {
          id: 'copyright',
          title: t('tenant.fields.copyright', 'Copyright'),
          accessor: 'copyright',
          className: 'col-span-full'
        }
      ]
    },
    {
      id: 'system',
      title: t('tenant.section.system', 'System Information'),
      subtitle: t('tenant.section.system_subtitle', 'Technical and audit details'),
      icon: 'IconDatabase',
      fields: [
        {
          id: 'created_at',
          title: t('tenant.fields.created_at', 'Created'),
          accessor: 'created_at',
          renderer: value => formatDateTime(value)
        },
        {
          id: 'updated_at',
          title: t('tenant.fields.updated_at', 'Last Updated'),
          accessor: 'updated_at',
          renderer: value => formatDateTime(value)
        },
        {
          id: 'created_by',
          title: t('tenant.fields.created_by', 'Created By'),
          accessor: 'created_by'
        },
        {
          id: 'updated_by',
          title: t('tenant.fields.updated_by', 'Updated By'),
          accessor: 'updated_by'
        },
        {
          id: 'extras',
          title: t('tenant.fields.extras', 'Extra Metadata'),
          accessor: 'extras',
          renderer: value => renderJson(value),
          className: 'col-span-full'
        }
      ]
    }
  ];

  return (
    <>
      {viewerSections.map(section => (
        <Section key={section.id} title={section.title} icon={section.icon} className='mb-6'>
          <div className='grid grid-cols-2 gap-4'>
            {section.fields.map(field => (
              <FieldViewer key={field.id} title={field.title} className={field.className}>
                {field.renderer
                  ? field.renderer(data[field.accessor], data)
                  : data[field.accessor] || '-'}
              </FieldViewer>
            ))}
          </div>
        </Section>
      ))}
    </>
  );
};

const LoadingSkeleton = () => (
  <div className='space-y-4'>
    <Skeleton className='h-8 w-40 mb-4' />
    <div className='space-y-2'>
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-12 w-full' />
    </div>
  </div>
);

const renderTenantType = type => {
  if (!type) return '-';

  const typeColors = {
    private: 'bg-blue-100 text-blue-800',
    public: 'bg-green-100 text-green-800',
    internal: 'bg-purple-100 text-purple-800',
    external: 'bg-amber-100 text-amber-800',
    other: 'bg-slate-100 text-slate-800'
  };

  return (
    <Badge className={typeColors[type] || 'bg-slate-100'}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const renderStatus = disabled => {
  return disabled ? (
    <Badge variant='danger'>Disabled</Badge>
  ) : (
    <Badge variant='success'>Active</Badge>
  );
};

const renderUrl = url => {
  if (!url) return '-';

  return (
    <a
      href={url.startsWith('http') ? url : `https://${url}`}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-500 hover:underline'
    >
      {url}
    </a>
  );
};

const renderLogo = (logo, alt) => {
  if (!logo) return '-';

  return (
    <div className='mt-2'>
      <img
        src={logo}
        alt={alt || 'Tenant logo'}
        className='max-h-24 object-contain border p-2 rounded bg-white'
      />
    </div>
  );
};

const renderKeywords = keywords => {
  if (!keywords) return '-';

  return (
    <div className='flex flex-wrap gap-1'>
      {keywords.split(',').map((keyword, index) => (
        <Badge key={index} variant='outline-primary' className='bg-slate-50'>
          {keyword.trim()}
        </Badge>
      ))}
    </div>
  );
};

const renderJson = data => {
  if (!data) return '-';

  return (
    <pre className='bg-slate-50 p-2 rounded text-xs overflow-auto max-h-40'>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
};
