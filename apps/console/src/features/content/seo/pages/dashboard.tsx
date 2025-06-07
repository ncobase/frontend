import React, { useState } from 'react';

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

import { Page, Topbar } from '@/components/layout';

export const SEODashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - replace with real API calls
  const seoStats = {
    total_content: 156,
    analyzed_content: 142,
    issues_found: 28,
    avg_score: 78
  };

  const recentAnalyses = [
    {
      id: '1',
      title: 'How to Build a CMS',
      content_type: 'topic',
      score: 85,
      issues: 2,
      analyzed_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'React Best Practices',
      content_type: 'topic',
      score: 72,
      issues: 5,
      analyzed_at: '2024-01-15T09:15:00Z'
    }
  ];

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
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='space-y-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>{t('seo.dashboard.total_content')}</p>
                <p className='text-2xl font-bold text-gray-900'>{seoStats.total_content}</p>
              </div>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <Icons name='IconFileText' size={24} className='text-blue-600' />
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>{t('seo.dashboard.analyzed_content')}</p>
                <p className='text-2xl font-bold text-gray-900'>{seoStats.analyzed_content}</p>
              </div>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Icons name='IconSearchCheck' size={24} className='text-green-600' />
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>{t('seo.dashboard.issues_found')}</p>
                <p className='text-2xl font-bold text-red-600'>{seoStats.issues_found}</p>
              </div>
              <div className='w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center'>
                <Icons name='IconAlertTriangle' size={24} className='text-red-600' />
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>{t('seo.dashboard.avg_score')}</p>
                <p className={`text-2xl font-bold ${getScoreColor(seoStats.avg_score)}`}>
                  {seoStats.avg_score}
                </p>
              </div>
              <div className='w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center'>
                <Icons name='IconTarget' size={24} className='text-yellow-600' />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold'>{t('seo.dashboard.recent_analyses')}</h3>
            <Button variant='outline' size='sm' onClick={() => navigate('/content/seo/analytics')}>
              {t('seo.dashboard.view_all')}
            </Button>
          </div>
          <TableView header={columns} data={recentAnalyses} />
        </Card>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Card className='p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <Icons name='IconRocketLaunch' size={32} className='text-blue-600' />
              </div>
              <h3 className='font-semibold mb-2'>{t('seo.dashboard.bulk_audit')}</h3>
              <p className='text-sm text-gray-600 mb-4'>{t('seo.dashboard.bulk_audit_desc')}</p>
              <Button size='sm' className='w-full'>
                {t('seo.dashboard.start_audit')}
              </Button>
            </div>
          </Card>

          <Card className='p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <Icons name='IconTrendingUp' size={32} className='text-green-600' />
              </div>
              <h3 className='font-semibold mb-2'>{t('seo.dashboard.performance_report')}</h3>
              <p className='text-sm text-gray-600 mb-4'>
                {t('seo.dashboard.performance_report_desc')}
              </p>
              <Button size='sm' variant='outline' className='w-full'>
                {t('seo.dashboard.view_report')}
              </Button>
            </div>
          </Card>

          <Card className='p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4'>
                <Icons name='IconSettings' size={32} className='text-purple-600' />
              </div>
              <h3 className='font-semibold mb-2'>{t('seo.dashboard.settings')}</h3>
              <p className='text-sm text-gray-600 mb-4'>{t('seo.dashboard.settings_desc')}</p>
              <Button
                size='sm'
                variant='outline'
                className='w-full'
                onClick={() => navigate('/content/seo/settings')}
              >
                {t('seo.dashboard.configure')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
