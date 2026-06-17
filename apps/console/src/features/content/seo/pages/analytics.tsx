import { useMemo, useState } from 'react';

import {
  Button,
  Icons,
  Card,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

import { summarizeTopicSEO } from '../local_analysis';

import { Page, Topbar } from '@/components/layout';
import { useListTopics } from '@/features/content/topic/service';

const SCORE_FILTER_DAYS: Record<string, number> = {
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '365d': 365
};

const isWithinRange = (value: string, days: number) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return date.getTime() >= threshold;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const SEOAnalyticsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('90d');
  const [contentType, setContentType] = useState('all');
  const topicsQuery = useListTopics({ limit: 100 });

  const summary = useMemo(() => {
    const days = SCORE_FILTER_DAYS[timeRange] || SCORE_FILTER_DAYS['90d'];
    const topics = topicsQuery.data?.items || [];
    const filteredTopics = topics.filter(topic => {
      const matchesType = contentType === 'all' || (topic.content_type || 'topic') === contentType;
      return matchesType && isWithinRange(topic.updated_at || topic.created_at || '', days);
    });

    return summarizeTopicSEO(filteredTopics);
  }, [contentType, timeRange, topicsQuery.data?.items]);

  return (
    <Page
      sidebar
      title={t('seo.analytics.title')}
      topbar={
        <Topbar
          title={t('seo.analytics.title')}
          left={[
            <span className='text-muted-foreground text-xs'>{t('seo.analytics.description')}</span>
          ]}
          right={[
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-auto outline-hidden py-1.5 gap-x-1.5 shadow-none border-none bg-slate-100 hover:bg-slate-100/80'>
                <Icons name='IconCalendar' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='30d'>{t('datetime.last_30_days')}</SelectItem>
                <SelectItem value='90d'>{t('datetime.last_90_days')}</SelectItem>
                <SelectItem value='180d'>{t('datetime.last_180_days')}</SelectItem>
                <SelectItem value='365d'>{t('datetime.last_365_days')}</SelectItem>
              </SelectContent>
            </Select>,
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className='w-auto outline-hidden py-1.5 gap-x-1.5 shadow-none border-none bg-slate-100 hover:bg-slate-100/80'>
                <Icons name='IconViewGrid' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>{t('common.all')}</SelectItem>
                <SelectItem value='topic'>{t('content.type.topic')}</SelectItem>
              </SelectContent>
            </Select>,
            <Button
              onClick={() => navigate('/content/seo/settings')}
              size='sm'
              prependIcon={<Icons name='IconSettings' />}
            >
              {t('actions.settings')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      {topicsQuery.isError && (
        <div className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-red-700'>
          <div className='flex items-start justify-between gap-3'>
            <div className='flex min-w-0 gap-2'>
              <Icons name='IconAlertCircle' className='mt-0.5 h-4 w-4 shrink-0' />
              <div>
                <p className='text-sm font-medium'>{t('messages.error')}</p>
                <p className='mt-1 text-xs opacity-80'>
                  {t('seo.analytics.load_failed', 'Unable to load topic SEO metadata.')}
                </p>
              </div>
            </div>
            <Button size='xs' variant='outline' onClick={() => topicsQuery.refetch()}>
              {t('actions.retry', 'Retry')}
            </Button>
          </div>
        </div>
      )}

      <Card className='p-6'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold'>{t('seo.analytics.score_trend')}</h3>
          <p className='mt-1 text-xs text-slate-500'>
            {t(
              'seo.analytics.snapshot_note',
              'This chart groups current topic SEO metadata scores by topic update date.'
            )}
          </p>
        </div>
        <div className='h-80'>
          {topicsQuery.isLoading ? (
            <div className='h-full animate-pulse rounded bg-slate-100' />
          ) : summary.score_by_date.length > 0 ? (
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={summary.score_by_date}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='score'
                  stroke='#2563eb'
                  strokeWidth={3}
                  name={t('seo.analytics.avg_score')}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-slate-500'>
              {t('seo.analytics.no_snapshot', 'No SEO metadata found for this range.')}
            </div>
          )}
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>{t('seo.analytics.issues_breakdown')}</h3>
          <div className='h-64'>
            {topicsQuery.isLoading ? (
              <div className='h-full animate-pulse rounded bg-slate-100' />
            ) : summary.issues_breakdown.length > 0 ? (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={summary.issues_breakdown}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='category' />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey='count' fill='#dc2626' />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex h-full items-center justify-center text-sm text-slate-500'>
                {t('seo.analytics.no_issues', 'No metadata issues found for this range.')}
              </div>
            )}
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>{t('seo.analytics.top_content')}</h3>
          <div className='space-y-3'>
            {topicsQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='h-12 animate-pulse rounded bg-slate-100' />
              ))
            ) : summary.top_content.length > 0 ? (
              summary.top_content.map(item => (
                <button
                  key={item.id}
                  type='button'
                  className='flex w-full items-center justify-between rounded-lg bg-gray-50 p-3 text-left hover:bg-gray-100'
                  onClick={() => navigate(`/content/topics/${item.id}`)}
                >
                  <div className='min-w-0 flex-1'>
                    <div className='truncate text-sm font-medium'>{item.title}</div>
                    <div className='text-xs text-gray-500'>
                      {t('seo.analytics.word_count', '{{count}} words', {
                        count: item.word_count
                      })}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className={`font-bold ${getScoreColor(item.score)}`}>{item.score}</div>
                    <div className='text-xs text-gray-500'>{t('seo.analytics.seo_score')}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className='rounded-lg border border-dashed py-10 text-center text-sm text-slate-500'>
                {t('seo.analytics.no_top_content', 'No scored content found.')}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='p-6 text-center'>
          <div className={`mb-2 text-3xl font-bold ${getScoreColor(summary.avg_score)}`}>
            {summary.avg_score}
          </div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.avg_score')}</div>
        </Card>

        <Card className='p-6 text-center'>
          <div className='mb-2 text-3xl font-bold text-green-600'>{summary.analyzed_content}</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.analyzed_pages')}</div>
        </Card>

        <Card className='p-6 text-center'>
          <div className='mb-2 text-3xl font-bold text-red-600'>{summary.issues_found}</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.total_issues')}</div>
        </Card>

        <Card className='p-6 text-center'>
          <div className='mb-2 text-3xl font-bold text-blue-600'>{summary.optimization_rate}%</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.optimization_rate')}</div>
        </Card>
      </div>
    </Page>
  );
};
