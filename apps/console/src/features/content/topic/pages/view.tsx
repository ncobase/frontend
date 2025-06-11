import { Card, Button, Icons, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useParams, useNavigate } from 'react-router';

import { useQueryTopic } from '../service';

import { ErrorPage } from '@/components/errors';
import { Page, Topbar } from '@/components/layout';

export const TopicViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: topic, isLoading, error } = useQueryTopic(id!);

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

  if (error || !topic) {
    return (
      <Page sidebar>
        <ErrorPage code={404} />
      </Page>
    );
  }

  const getStatusBadge = (status: number) => {
    const variants = {
      0: { variant: 'warning', label: t('topic.status.draft'), icon: 'IconEdit' },
      1: { variant: 'success', label: t('topic.status.published'), icon: 'IconCheck' },
      2: { variant: 'danger', label: t('topic.status.archived'), icon: 'IconArchive' }
    };
    const { variant, label, icon } = variants[status] || variants[0];

    return (
      <Badge variant={variant} className='flex items-center gap-1 px-3 py-1'>
        <Icons name={icon} size={14} />
        {label}
      </Badge>
    );
  };

  return (
    <Page
      sidebar
      title={topic.title}
      topbar={
        <Topbar
          left={[
            <Button
              variant='ghost'
              size='sm'
              onClick={() => navigate('/content/topics')}
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
              onClick={() => navigate(`/content/topics/${topic.id}/edit`)}
            >
              <Icons name='IconEdit' size={18} className='mr-2' />
              {t('actions.edit')}
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
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
                <Icons name='IconFileText' size={32} className='text-white' />
              </div>
              <div>
                <div className='flex items-center gap-3'>
                  <h1 className='text-2xl font-bold text-gray-900'>{topic.title}</h1>
                  {getStatusBadge(topic.status)}
                  {topic.private && <Badge variant='secondary'>{t('topic.labels.private')}</Badge>}
                </div>
                <p className='text-gray-500 mt-1 flex items-center gap-2'>
                  <Icons name='IconSignature' size={16} />
                  {topic.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Content */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>{t('topic.fields.content')}</h3>
            </div>
            <div className='p-6'>
              {topic.content ? (
                <div className='prose max-w-none'>
                  {topic.markdown ? (
                    <ReactMarkdown>{topic.content}</ReactMarkdown>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: topic.content }} />
                  )}
                </div>
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  <Icons name='IconFileText' size={32} className='mx-auto mb-2' />
                  <p>{t('topic.content.empty')}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Thumbnail */}
          {topic.thumbnail && (
            <Card className='overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-100'>
                <h3 className='text-lg font-semibold'>{t('topic.fields.thumbnail')}</h3>
              </div>
              <div className='p-6'>
                <div className='flex justify-center'>
                  <img
                    src={topic.thumbnail}
                    alt={topic.title}
                    className='max-h-64 rounded-md shadow-sm object-contain'
                  />
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-8'>
          {/* Topic Information */}
          <Card className='overflow-hidden'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='text-lg font-semibold'>{t('topic.section.information')}</h3>
            </div>
            <div className='p-6'>
              <div className='space-y-4'>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('topic.fields.id')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900 font-mono'>{topic.id}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('topic.fields.slug')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>{topic.slug || '-'}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('topic.fields.taxonomy')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>
                    {topic.taxonomy?.name || topic.taxonomy_id || '-'}
                  </p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('topic.fields.created_at')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>{formatDateTime(topic.created_at)}</p>
                </div>
                <div>
                  <label className='text-sm font-medium text-gray-500'>
                    {t('topic.fields.updated_at')}
                  </label>
                  <p className='mt-1 text-sm text-gray-900'>{formatDateTime(topic.updated_at)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
