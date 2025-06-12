import { FieldViewer, Section, Skeleton, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useQuerySpace } from '../service';

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

export const SpaceViewerForm = ({ record }) => {
  const { t } = useTranslation();
  const { data = {}, isLoading } = useQuerySpace(record);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const viewerSections: ViewerSection[] = [
    {
      id: 'basic',
      title: t('space.section.basic_info', 'Basic Information'),
      subtitle: t('space.section.basic_info_subtitle', 'Primary space details'),
      icon: 'IconInfoCircle',
      fields: [
        {
          id: 'id',
          title: t('space.fields.id', 'ID'),
          accessor: 'id'
        },
        {
          id: 'name',
          title: t('space.fields.name', 'Name'),
          accessor: 'name'
        },
        {
          id: 'slug',
          title: t('space.fields.slug', 'Slug'),
          accessor: 'slug',
          renderer: value => (
            <span className='font-mono text-sm bg-slate-100 px-2 py-1 rounded'>{value}</span>
          )
        },
        {
          id: 'type',
          title: t('space.fields.type', 'Type'),
          accessor: 'type',
          renderer: value => renderSpaceType(value, t)
        },
        {
          id: 'url',
          title: t('space.fields.url', 'URL'),
          accessor: 'url',
          renderer: value => renderUrl(value)
        },
        {
          id: 'status',
          title: t('space.fields.status', 'Status'),
          accessor: 'disabled',
          renderer: value => renderStatus(value, t)
        }
      ]
    },
    {
      id: 'branding',
      title: t('space.section.branding', 'Branding'),
      subtitle: t('space.section.branding_subtitle', 'Logo and visual identity'),
      icon: 'IconPalette',
      fields: [
        {
          id: 'logo',
          title: t('space.fields.logo', 'Logo'),
          accessor: 'logo',
          renderer: (value, data) => renderLogo(value, data?.logo_alt || data?.name),
          className: 'col-span-full'
        },
        {
          id: 'logo_alt',
          title: t('space.fields.logo_alt', 'Logo Alt Text'),
          accessor: 'logo_alt'
        },
        {
          id: 'title',
          title: t('space.fields.title', 'Site Title'),
          accessor: 'title'
        }
      ]
    },
    {
      id: 'seo',
      title: t('space.section.seo', 'SEO Information'),
      subtitle: t('space.section.seo_subtitle', 'Search engine optimization details'),
      icon: 'IconSearch',
      fields: [
        {
          id: 'description',
          title: t('space.fields.description', 'SEO Description'),
          accessor: 'description',
          className: 'col-span-full'
        },
        {
          id: 'keywords',
          title: t('space.fields.keywords', 'SEO Keywords'),
          accessor: 'keywords',
          renderer: value => renderKeywords(value),
          className: 'col-span-full'
        },
        {
          id: 'copyright',
          title: t('space.fields.copyright', 'Copyright'),
          accessor: 'copyright',
          className: 'col-span-full'
        }
      ]
    },
    {
      id: 'metadata',
      title: t('space.section.metadata', 'Metadata'),
      subtitle: t('space.section.metadata_subtitle', 'System information and timestamps'),
      icon: 'IconDatabase',
      fields: [
        {
          id: 'order',
          title: t('space.fields.order', 'Display Order'),
          accessor: 'order'
        },
        {
          id: 'expired_at',
          title: t('space.fields.expired_at', 'Expiration Date'),
          accessor: 'expired_at',
          renderer: value =>
            value ? formatDateTime(value, 'date') : t('space.no_expiration', 'No expiration')
        },
        {
          id: 'created_at',
          title: t('space.fields.created_at', 'Created'),
          accessor: 'created_at',
          renderer: value => formatDateTime(value)
        },
        {
          id: 'updated_at',
          title: t('space.fields.updated_at', 'Last Updated'),
          accessor: 'updated_at',
          renderer: value => formatDateTime(value)
        },
        {
          id: 'created_by',
          title: t('space.fields.created_by', 'Created By'),
          accessor: 'created_by'
        },
        {
          id: 'updated_by',
          title: t('space.fields.updated_by', 'Updated By'),
          accessor: 'updated_by'
        }
      ]
    }
  ];

  return (
    <div className='space-y-8'>
      {/* Status Banner */}
      <div
        className={`p-4 rounded-lg border ${
          data.disabled ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
        }`}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Badge variant={data.disabled ? 'danger' : 'success'}>
              {data.disabled ? t('space.status.disabled') : t('space.status.active')}
            </Badge>
            <span className='text-sm text-slate-600'>
              {data.disabled
                ? t('space.status.disabled_desc', 'This space is currently disabled')
                : t('space.status.active_desc', 'This space is active and accessible')}
            </span>
          </div>
          {data.expired_at && (
            <div className='text-sm text-slate-600'>
              {t('space.expires_at', 'Expires')}: {formatDateTime(data.expired_at, 'date')}
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      {viewerSections.map(section => (
        <Section
          key={section.id}
          title={section.title}
          subtitle={section.subtitle}
          icon={section.icon}
          className='mb-6 rounded-lg overflow-hidden transition-shadow hover:shadow-md'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
    </div>
  );
};

// Helper Components and Functions
const LoadingSkeleton = () => (
  <div className='space-y-6'>
    <div className='h-16 bg-slate-100 rounded-lg animate-pulse' />
    {[1, 2, 3].map(i => (
      <div key={i} className='space-y-4'>
        <Skeleton className='h-8 w-40' />
        <div className='grid grid-cols-2 gap-4'>
          <Skeleton className='h-20' />
          <Skeleton className='h-20' />
          <Skeleton className='h-20' />
          <Skeleton className='h-20' />
        </div>
      </div>
    ))}
  </div>
);

const renderSpaceType = (type: string, t: any) => {
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
      {t(`common.types.${type}`, type.charAt(0).toUpperCase() + type.slice(1))}
    </Badge>
  );
};

const renderStatus = (disabled: boolean, t: any) => {
  return (
    <Badge variant={disabled ? 'danger' : 'success'}>
      {disabled ? t('space.status.disabled') : t('space.status.active')}
    </Badge>
  );
};

const renderUrl = (url: string) => {
  if (!url) return '-';

  const fullUrl = url.startsWith('http') ? url : `https://${url}`;

  return (
    <a
      href={fullUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-500 hover:underline flex items-center'
    >
      {url}
      <svg className='w-3 h-3 ml-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
        />
      </svg>
    </a>
  );
};

const renderLogo = (logo: string, alt: string) => {
  if (!logo) return '-';

  return (
    <div className='flex items-center space-x-3'>
      <img
        src={logo}
        alt={alt || 'Space logo'}
        className='h-16 w-16 object-contain border rounded bg-white p-2'
        onError={e => {
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className='text-sm text-slate-600'>
        <div className='font-medium'>{alt || 'Logo'}</div>
        <div className='text-xs'>{logo}</div>
      </div>
    </div>
  );
};

const renderKeywords = (keywords: string) => {
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
