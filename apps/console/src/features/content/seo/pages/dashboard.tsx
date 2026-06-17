import { useMemo, useState } from 'react';

import {
  Button,
  Icons,
  Card,
  Badge,
  TableView,
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { summarizeTopicSEO } from '../local_analysis';

import { Page, Topbar } from '@/components/layout';
import { useListTopics } from '@/features/content/topic/service';

const SCORE_FILTER_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90
};

const isWithinRange = (value: string, days: number) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
  return date.getTime() >= threshold;
};

const iconColorClasses = {
  blue: { background: 'bg-blue-100', foreground: 'text-blue-600' },
  green: { background: 'bg-green-100', foreground: 'text-green-600' },
  red: { background: 'bg-red-100', foreground: 'text-red-600' },
  yellow: { background: 'bg-yellow-100', foreground: 'text-yellow-600' }
};

export const SEODashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const topicsQuery = useListTopics({ limit: 100 });

  const summary = useMemo(() => {
    const days = SCORE_FILTER_DAYS[timeRange] || SCORE_FILTER_DAYS['30d'];
    const topics = topicsQuery.data?.items || [];
    return summarizeTopicSEO(
      topics.filter(topic => isWithinRange(topic.updated_at || topic.created_at || '', days))
    );
  }, [timeRange, topicsQuery.data?.items]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const columns = [
    {
      title: t('seo.dashboard.content'),
      dataIndex: 'title',
      parser: (_: any, item: any) => (
        <div>
          <div className='font-medium'>{item.title}</div>
          <div className='text-sm text-gray-500 capitalize'>{item.content_type}</div>
        </div>
      )
    },
    {
      title: t('seo.dashboard.score'),
      dataIndex: 'score',
      parser: (score: number) => (
        <div className='flex items-center gap-2'>
          <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
          <Badge variant={getScoreVariant(score)} className='text-xs'>
            {score >= 80
              ? t('seo.dashboard.excellent')
              : score >= 60
                ? t('seo.dashboard.good')
                : t('seo.dashboard.needs_work')}
          </Badge>
        </div>
      )
    },
    {
      title: t('seo.dashboard.issues'),
      dataIndex: 'issues',
      parser: (issues: number) => (
        <span className={`font-medium ${issues > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {issues}
        </span>
      )
    },
    {
      title: t('seo.dashboard.analyzed'),
      dataIndex: 'analyzed_at',
      parser: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: t('common.actions'),
      filter: false,
      parser: (_: any, item: any) => (
        <div className='flex gap-1'>
          <Button
            variant='text'
            size='xs'
            onClick={() => navigate(`/content/seo/audit/${item.content_type}/${item.id}`)}
          >
            <Icons name='IconSearchCheck' size={14} className='mr-1' />
            {t('seo.audit.view')}
          </Button>
        </div>
      )
    }
  ];

  return (
    <Page
      sidebar
      title={t('seo.dashboard.title')}
      topbar={
        <Topbar
          title={t('seo.dashboard.title')}
          left={[
            <span className='text-muted-foreground text-xs'>{t('seo.dashboard.description')}</span>
          ]}
          right={[
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-auto outline-hidden py-1.5 gap-x-1.5 shadow-none border-none bg-slate-100 hover:bg-slate-100/80'>
                <Icons name='IconCalendar' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='7d'>{t('datetime.last_7_days')}</SelectItem>
                <SelectItem value='30d'>{t('datetime.last_30_days')}</SelectItem>
                <SelectItem value='90d'>{t('datetime.last_90_days')}</SelectItem>
              </SelectContent>
            </Select>,
            <Button
              onClick={() => navigate('/content/seo/analytics')}
              size='sm'
              prependIcon={<Icons name='IconChartBubble' />}
            >
              {t('seo.analytics.view')}
            </Button>,
            <Button
              onClick={() => navigate('/content/seo/settings')}
              size='sm'
              variant='outline'
              prependIcon={<Icons name='IconSettings' />}
            >
              {t('seo.dashboard.configure')}
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='space-y-6'>
        {topicsQuery.isError && (
          <div className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-red-700'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex min-w-0 gap-2'>
                <Icons name='IconAlertCircle' className='mt-0.5 h-4 w-4 shrink-0' />
                <div>
                  <p className='text-sm font-medium'>{t('messages.error')}</p>
                  <p className='mt-1 text-xs opacity-80'>
                    {t('seo.dashboard.load_failed', 'Unable to load topic SEO metadata.')}
                  </p>
                </div>
              </div>
              <Button size='xs' variant='outline' onClick={() => topicsQuery.refetch()}>
                {t('actions.retry', 'Retry')}
              </Button>
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {[
            {
              label: t('seo.dashboard.total_content'),
              value: summary.total_content,
              icon: 'IconFileText',
              color: iconColorClasses.blue,
              valueClass: 'text-gray-900'
            },
            {
              label: t('seo.dashboard.analyzed_content'),
              value: summary.analyzed_content,
              icon: 'IconSearchCheck',
              color: iconColorClasses.green,
              valueClass: 'text-gray-900'
            },
            {
              label: t('seo.dashboard.issues_found'),
              value: summary.issues_found,
              icon: 'IconAlertTriangle',
              color: iconColorClasses.red,
              valueClass: 'text-red-600'
            },
            {
              label: t('seo.dashboard.avg_score'),
              value: summary.avg_score,
              icon: 'IconTarget',
              color: iconColorClasses.yellow,
              valueClass: getScoreColor(summary.avg_score)
            }
          ].map(card => (
            <Card className='p-6' key={card.label}>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-600'>{card.label}</p>
                  {topicsQuery.isLoading ? (
                    <div className='mt-2 h-7 w-16 animate-pulse rounded bg-slate-100' />
                  ) : (
                    <p className={`text-2xl font-bold ${card.valueClass}`}>{card.value}</p>
                  )}
                </div>
                <div
                  className={`w-12 h-12 ${card.color.background} rounded-lg flex items-center justify-center`}
                >
                  <Icons name={card.icon} size={24} className={card.color.foreground} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold'>{t('seo.dashboard.recent_analyses')}</h3>
              <p className='mt-1 text-xs text-slate-500'>
                {t(
                  'seo.dashboard.metadata_snapshot',
                  'Calculated from current topic SEO title, description, keywords, and content fields.'
                )}
              </p>
            </div>
            <Button variant='outline' size='sm' onClick={() => navigate('/content/seo/analytics')}>
              {t('seo.dashboard.view_all')}
            </Button>
          </div>
          {topicsQuery.isLoading ? (
            <div className='space-y-3'>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className='h-10 animate-pulse rounded bg-slate-100' />
              ))}
            </div>
          ) : summary.recent_analyses.length > 0 ? (
            <TableView header={columns} data={summary.recent_analyses} />
          ) : (
            <div className='rounded-lg border border-dashed py-10 text-center text-slate-500'>
              <Icons name='IconSearchCheck' size={32} className='mx-auto mb-2 opacity-60' />
              <p className='text-sm'>{t('seo.dashboard.no_content', 'No topic metadata found.')}</p>
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
};
