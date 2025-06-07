import React, { useState } from 'react';

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

import { Page, Topbar } from '@/components/layout';

export const SEOAnalyticsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [contentType, setContentType] = useState('all');

  // Mock data - replace with real API calls
  const scoreData = [
    { date: '2024-01-01', score: 65 },
    { date: '2024-01-08', score: 68 },
    { date: '2024-01-15', score: 72 },
    { date: '2024-01-22', score: 75 },
    { date: '2024-01-29', score: 78 }
  ];

  const issuesData = [
    { category: 'Title Issues', count: 15, color: '#ef4444' },
    { category: 'Meta Description', count: 12, color: '#f97316' },
    { category: 'Missing Keywords', count: 8, color: '#eab308' },
    { category: 'Image Alt Text', count: 22, color: '#06b6d4' },
    { category: 'Heading Structure', count: 6, color: '#8b5cf6' }
  ];

  const topContent = [
    { title: 'Complete Guide to SEO', score: 95, traffic: 1250 },
    { title: 'React Performance Tips', score: 88, traffic: 980 },
    { title: 'Modern CSS Techniques', score: 82, traffic: 750 },
    { title: 'JavaScript Best Practices', score: 79, traffic: 650 },
    { title: 'Web Accessibility Guide', score: 76, traffic: 420 }
  ];

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
                <SelectItem value='taxonomy'>{t('content.type.taxonomy')}</SelectItem>
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
      {/* Score Trend */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4'>{t('seo.analytics.score_trend')}</h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='score'
                stroke='#3b82f6'
                strokeWidth={3}
                name={t('seo.analytics.avg_score')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Issues Breakdown */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>{t('seo.analytics.issues_breakdown')}</h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={issuesData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='category' angle={-45} textAnchor='end' height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey='count' fill='#ef4444' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Performing Content */}
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>{t('seo.analytics.top_content')}</h3>
          <div className='space-y-3'>
            {topContent.map((item, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
              >
                <div className='flex-1'>
                  <div className='font-medium text-sm'>{item.title}</div>
                  <div className='text-xs text-gray-500'>
                    {t('seo.analytics.traffic')}: {item.traffic}
                  </div>
                </div>
                <div className='text-right'>
                  <div
                    className={`font-bold ${
                      item.score >= 80
                        ? 'text-green-600'
                        : item.score >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {item.score}
                  </div>
                  <div className='text-xs text-gray-500'>{t('seo.analytics.seo_score')}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card className='p-6 text-center'>
          <div className='text-3xl font-bold text-blue-600 mb-2'>78.5</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.avg_score')}</div>
          <div className='text-xs text-green-600 mt-1'>↑ 5.2%</div>
        </Card>

        <Card className='p-6 text-center'>
          <div className='text-3xl font-bold text-green-600 mb-2'>156</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.analyzed_pages')}</div>
          <div className='text-xs text-green-600 mt-1'>↑ 12</div>
        </Card>

        <Card className='p-6 text-center'>
          <div className='text-3xl font-bold text-red-600 mb-2'>63</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.total_issues')}</div>
          <div className='text-xs text-red-600 mt-1'>↓ 8</div>
        </Card>

        <Card className='p-6 text-center'>
          <div className='text-3xl font-bold text-purple-600 mb-2'>92%</div>
          <div className='text-sm text-gray-600'>{t('seo.analytics.optimization_rate')}</div>
          <div className='text-xs text-green-600 mt-1'>↑ 3%</div>
        </Card>
      </div>
    </Page>
  );
};
