import { Card, Icons, Button, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useListChannels } from './channel/service';
import { QuickActions } from './components/QuickActions';
import { useListDistributions } from './distribution/service';
import { useListMedia } from './media/service';
import { useListTaxonomies } from './taxonomy/service';
import { useListTopics } from './topic/service';

import { Page } from '@/components/layout';

export const ContentPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch data for dashboard
  const { data: taxonomiesData } = useListTaxonomies({ limit: 100, children: true });
  const { data: topicsData } = useListTopics({ limit: 100 });
  const { data: mediaData } = useListMedia({ limit: 100 });
  const { data: channelsData } = useListChannels({ limit: 100 });
  const { data: distributionsData } = useListDistributions({ limit: 100 });

  // Calculate stats
  const taxonomyCount = taxonomiesData?.total || 0;
  const topicCount = topicsData?.total || 0;
  const mediaCount = mediaData?.total || 0;
  const channelCount = channelsData?.total || 0;
  const distributionCount = distributionsData?.total || 0;
  const publishedTopicCount = topicsData?.items?.filter(topic => topic.status === 1).length || 0;
  const draftTopicCount = topicsData?.items?.filter(topic => topic.status === 0).length || 0;
  const activeChannelCount =
    channelsData?.items?.filter(channel => channel.status === 0).length || 0;

  // Recent items
  const recentTopics =
    topicsData?.items
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5) || [];

  const recentDistributions =
    distributionsData?.items
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5) || [];

  const getStatusBadge = (status: number, type: 'topic' | 'distribution') => {
    if (type === 'topic') {
      const variants = {
        0: { variant: 'warning', label: t('topic.status.draft'), icon: 'IconEdit' },
        1: { variant: 'success', label: t('topic.status.published'), icon: 'IconCheck' },
        2: { variant: 'danger', label: t('topic.status.archived'), icon: 'IconArchive' }
      };
      const config = variants[status] || variants[0];
      return (
        <Badge variant={config.variant} className='flex items-center gap-1 text-xs'>
          <Icons name={config.icon} size={10} />
          {config.label}
        </Badge>
      );
    } else {
      const variants = {
        0: { variant: 'secondary', label: t('distribution.status.draft'), icon: 'IconEdit' },
        1: { variant: 'warning', label: t('distribution.status.scheduled'), icon: 'IconClock' },
        2: { variant: 'success', label: t('distribution.status.published'), icon: 'IconCheck' },
        3: { variant: 'danger', label: t('distribution.status.failed'), icon: 'IconAlertCircle' },
        4: { variant: 'secondary', label: t('distribution.status.cancelled'), icon: 'IconX' }
      };
      const config = variants[status] || variants[0];
      return (
        <Badge variant={config.variant} className='flex items-center gap-1 text-xs'>
          <Icons name={config.icon} size={10} />
          {config.label}
        </Badge>
      );
    }
  };

  return (
    <Page sidebar title={t('content.dashboard.title')}>
      <div className='space-y-8'>
        {/* Header */}
        <div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>{t('content.dashboard.title')}</h1>
          <p className='text-gray-600'>{t('content.dashboard.description')}</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <Card className='p-6 hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-gray-500 mb-1 text-sm'>{t('content.stats.total_topics')}</div>
                <div className='text-2xl font-semibold'>{taxonomyCount}</div>
              </div>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-green-100'>
                <Icons name='IconBookmark' size={20} className='text-green-600' />
              </div>
            </div>
            <div className='border-t border-slate-200/65 px-0 py-2 mt-4'>
              <Button
                variant='unstyle'
                size='sm'
                className='text-primary-500 flex items-center gap-1 hover:text-primary-600'
                onClick={() => navigate('/content/taxonomies')}
              >
                {t('actions.view_details')} <Icons name='IconChevronRight' size={14} />
              </Button>
            </div>
          </Card>

          <Card className='p-6 hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-gray-500 mb-1 text-sm'>{t('content.stats.media_files')}</div>
                <div className='text-2xl font-semibold'>{mediaCount}</div>
              </div>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100'>
                <Icons name='IconPhoto' size={20} className='text-purple-600' />
              </div>
            </div>
            <div className='border-t border-slate-200/65 px-0 py-2 mt-4'>
              <Button
                variant='unstyle'
                size='sm'
                className='text-primary-500 flex items-center gap-1 hover:text-primary-600'
                onClick={() => navigate('/content/media')}
              >
                {t('actions.view_details')} <Icons name='IconChevronRight' size={14} />
              </Button>
            </div>
          </Card>

          <Card className='p-6 hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-gray-500 mb-1 text-sm'>{t('content.stats.channels')}</div>
                <div className='text-2xl font-semibold'>{channelCount}</div>
                <div className='text-xs text-gray-400 mt-1'>
                  {activeChannelCount} {t('content.stats.active')}
                </div>
              </div>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-orange-100'>
                <Icons name='IconBroadcast' size={20} className='text-orange-600' />
              </div>
            </div>
            <div className='border-t border-slate-200/65 px-0 py-2 mt-4'>
              <Button
                variant='unstyle'
                size='sm'
                className='text-primary-500 flex items-center gap-1 hover:text-primary-600'
                onClick={() => navigate('/content/channels')}
              >
                {t('actions.view_details')} <Icons name='IconChevronRight' size={14} />
              </Button>
            </div>
          </Card>

          <Card className='p-6 hover:shadow-md transition-shadow'>
            <div className='flex justify-between items-center'>
              <div>
                <div className='text-gray-500 mb-1 text-sm'>{t('content.stats.distributions')}</div>
                <div className='text-2xl font-semibold'>{distributionCount}</div>
              </div>
              <div className='w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100'>
                <Icons name='IconSend' size={20} className='text-indigo-600' />
              </div>
            </div>
            <div className='border-t border-slate-200/65 px-0 py-2 mt-4'>
              <Button
                variant='unstyle'
                size='sm'
                className='text-primary-500 flex items-center gap-1 hover:text-primary-600'
                onClick={() => navigate('/content/distributions')}
              >
                {t('actions.view_details')} <Icons name='IconChevronRight' size={14} />
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Items */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent Topics */}
          <Card className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>{t('content.recent.topics')}</h2>
              <Button
                variant='outline-primary'
                size='sm'
                onClick={() => navigate('/content/topics')}
              >
                {t('actions.view_all')}
              </Button>
            </div>

            <div className='space-y-3'>
              {recentTopics.map(topic => (
                <div
                  key={topic.id}
                  className='flex items-center p-3 border border-slate-300/65 rounded-md hover:bg-gray-50 cursor-pointer transition-colors'
                  onClick={() => navigate(`/content/topics/${topic.id}`)} // Updated route
                >
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <div className='font-medium text-gray-900 truncate'>{topic.title}</div>
                      {getStatusBadge(topic.status, 'topic')}
                    </div>
                    <div className='text-sm text-gray-500 truncate'>{topic.name}</div>
                    <div className='text-xs text-gray-400 mt-1'>
                      {new Date(topic.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Icons name='IconChevronRight' size={16} className='text-gray-400 ml-2' />
                </div>
              ))}

              {recentTopics.length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  <Icons name='IconFileText' size={32} className='mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>{t('content.recent.no_topics')}</p>
                  <Button
                    onClick={() => navigate('/content/topics/create')}
                    variant='link'
                    className='text-sm mt-2'
                  >
                    {t('content.topics.create_first')}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Distributions */}
          <Card className='p-4'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>{t('content.recent.distributions')}</h2>
              <Button
                variant='outline-primary'
                size='sm'
                onClick={() => navigate('/content/distributions')}
              >
                {t('actions.view_all')}
              </Button>
            </div>

            <div className='space-y-3'>
              {recentDistributions.map(distribution => (
                <div
                  key={distribution.id}
                  className='flex items-center p-3 border border-slate-300/65 rounded-md hover:bg-gray-50 cursor-pointer transition-colors'
                  onClick={() => navigate(`/content/distributions/${distribution.id}`)} // Updated route
                >
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <div className='font-medium text-gray-900 truncate'>
                        {distribution.topic?.title || t('distribution.unknown_topic')}
                      </div>
                      {getStatusBadge(distribution.status, 'distribution')}
                    </div>
                    <div className='text-sm text-gray-500 truncate'>
                      <Icons name='IconBroadcast' size={12} className='inline mr-1' />
                      {distribution.channel?.name || t('distribution.unknown_channel')}
                    </div>
                    <div className='text-xs text-gray-400 mt-1'>
                      {distribution.scheduled_at
                        ? `${t('distribution.scheduled')}: ${new Date(distribution.scheduled_at).toLocaleDateString()}`
                        : new Date(distribution.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Icons name='IconChevronRight' size={16} className='text-gray-400 ml-2' />
                </div>
              ))}

              {recentDistributions.length === 0 && (
                <div className='text-center py-8 text-gray-500'>
                  <Icons name='IconBroadcast' size={32} className='mx-auto mb-2 opacity-50' />
                  <p className='text-sm'>{t('content.recent.no_distributions')}</p>
                  <Button
                    onClick={() => navigate('/content/distributions/create')}
                    variant='link'
                    className='text-sm mt-2'
                  >
                    {t('content.distributions.create_first')}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
