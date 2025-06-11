import React from 'react';

import { Card, Button, Icons, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router';

import { useQueryUser } from '../../../system/user/service';
import { useQueryTaxonomy } from '../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';

export const TaxonomyViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: taxonomy, isLoading, error } = useQueryTaxonomy(id!);
  const { data: parentData } = useQueryTaxonomy(taxonomy?.parent);
  const { data: creatorData } = useQueryUser(taxonomy?.created_by);

  if (isLoading) {
    return (
      <Page sidebar>
        <div className='min-h-screen flex items-center justify-center'>
          <div className='text-center'>
            <Icons name='IconLoader2' className='animate-spin mx-auto mb-4' size={40} />
            <p className='text-gray-600'>{t('common.loading')}</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !taxonomy) {
    return (
      <Page sidebar>
        <ErrorPage statusCode={404} />
      </Page>
    );
  }

  const getStatusBadge = (status: number) => {
    return status === 0 ? (
      <Badge variant='success' className='flex items-center gap-1 px-3 py-1'>
        <Icons name='IconCheck' size={14} />
        {t('common.enabled')}
      </Badge>
    ) : (
      <Badge variant='secondary' className='flex items-center gap-1 px-3 py-1'>
        <Icons name='IconX' size={14} />
        {t('common.disabled')}
      </Badge>
    );
  };

  return (
    <Page
      sidebar
      title={taxonomy.name}
      topbar={
        <Topbar
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/taxonomies')}
              className='flex items-center gap-2'
            >
              <Icons name='IconArrowLeft' size={16} />
              {t('actions.back')}
            </Button>
          ]}
          right={[
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/content/taxonomies/${taxonomy.slug}/edit`)}
            >
              <Icons name='IconEdit' size={18} className='mr-2' />
              {t('actions.edit')}
            </Button>,
            <Button
              variant='outline'
              size='sm'
              onClick={() => navigate(`/content/topics?taxonomy=${taxonomy.slug}`)}
            >
              <Icons name='IconFileText' size={18} className='mr-2' />
              {t('content.taxonomies.view_topics')}
            </Button>,
            <Button
              variant='primary'
              size='sm'
              onClick={() =>
                navigate('/content/topics/create', {
                  state: { taxonomyId: taxonomy.id }
                })
              }
            >
              <Icons name='IconPlus' size={18} className='mr-2' />
              {t('content.topics.create')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {/* Header */}
      <div className='bg-white rounded-xl p-6 mb-8'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-4'>
              <div
                className='w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg'
                style={{ backgroundColor: taxonomy.color || '#3B82F6' }}
              >
                <Icons name={taxonomy.icon || 'IconFolder'} size={32} className='text-white' />
              </div>
              <div>
                <div className='flex items-center gap-3'>
                  <h1 className='text-2xl font-bold text-gray-900'>{taxonomy.name}</h1>
                  {getStatusBadge(taxonomy.status)}
                  <Badge variant='primary' className='capitalize'>
                    {taxonomy.type}
                  </Badge>
                </div>
                <p className='text-gray-500 mt-1 flex items-center gap-2'>
                  <Icons name='IconLink' size={16} />
                  {taxonomy.slug}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Basic Information */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>{t('taxonomy.section.basic_info')}</h3>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 gap-8'>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('taxonomy.fields.name')}
                  </label>
                  <p className='text-gray-900'>{taxonomy.name}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('taxonomy.fields.type')}
                  </label>
                  <Badge variant='primary' className='capitalize'>
                    {taxonomy.type}
                  </Badge>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('taxonomy.fields.slug')}
                  </label>
                  <p className='text-gray-900 font-mono text-sm'>{taxonomy.slug || '-'}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('taxonomy.fields.parent')}
                  </label>
                  <p className='text-gray-900'>
                    {parentData?.name || taxonomy.parent || t('taxonomy.parent.none')}
                  </p>
                </div>
                {taxonomy.description && (
                  <div className='col-span-2'>
                    <label className='text-sm font-medium text-gray-500 block mb-2'>
                      {t('taxonomy.fields.description')}
                    </label>
                    <p className='text-gray-900 whitespace-pre-wrap'>{taxonomy.description}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Appearance */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>{t('taxonomy.section.appearance')}</h3>
            </div>
            <div className='p-6'>
              <div className='grid grid-cols-2 gap-8'>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('taxonomy.fields.color')}
                  </label>
                  <div className='flex items-center space-x-3'>
                    <div
                      className='w-8 h-8 rounded-md border border-gray-300'
                      style={{ backgroundColor: taxonomy.color || '#3B82F6' }}
                    />
                    <span className='text-sm text-gray-900 font-mono'>
                      {taxonomy.color || '#3B82F6'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500 block mb-2'>
                    {t('taxonomy.fields.icon')}
                  </label>
                  <div className='flex items-center space-x-3'>
                    <div className='w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center'>
                      <Icons name={taxonomy.icon || 'IconFolder'} size={16} />
                    </div>
                    <span className='text-sm text-gray-900 font-mono'>
                      {taxonomy.icon || 'IconFolder'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Media Preview */}
              {(taxonomy.cover || taxonomy.thumbnail) && (
                <div className='grid grid-cols-2 gap-8 mt-8'>
                  {taxonomy.cover && (
                    <div>
                      <label className='text-sm font-medium text-gray-500 block mb-2'>
                        {t('taxonomy.fields.cover')}
                      </label>
                      <img
                        src={taxonomy.cover}
                        alt={`Cover for ${taxonomy.name}`}
                        className='w-full h-32 object-cover rounded-lg border border-gray-300'
                      />
                    </div>
                  )}
                  {taxonomy.thumbnail && (
                    <div>
                      <label className='text-sm font-medium text-gray-500 block mb-2'>
                        {t('taxonomy.fields.thumbnail')}
                      </label>
                      <img
                        src={taxonomy.thumbnail}
                        alt={`Thumbnail for ${taxonomy.name}`}
                        className='w-full h-32 object-cover rounded-lg border border-gray-300'
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-8'>
          {/* System Information */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>{t('taxonomy.section.system')}</h3>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('taxonomy.fields.id')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900 font-mono'>{taxonomy.id}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('taxonomy.fields.created_by')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {creatorData?.username || taxonomy.created_by || '-'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('taxonomy.fields.created_at')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {formatDateTime(taxonomy.created_at)}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('taxonomy.fields.updated_at')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {formatDateTime(taxonomy.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
