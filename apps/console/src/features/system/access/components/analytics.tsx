import { useState, useEffect } from 'react';

import { Icons, Badge } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { getActivityAnalytics } from '../apis';

export const ActivityAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState({
    total_activities: 0,
    activities_by_type: [],
    activities_by_user: [],
    recent_trends: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getActivityAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white border border-slate-200/60 rounded-lg p-4'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconActivity' className='w-5 h-5 text-blue-500' />
            <span className='font-medium'>{t('activity.analytics.total')}</span>
          </div>
          <div className='text-2xl font-bold mt-2'>{analytics.total_activities}</div>
        </div>

        <div className='bg-white border border-slate-200/60 rounded-lg p-4'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconUsers' className='w-5 h-5 text-green-500' />
            <span className='font-medium'>{t('activity.analytics.active_users')}</span>
          </div>
          <div className='text-2xl font-bold mt-2'>{analytics.activities_by_user.length}</div>
        </div>

        <div className='bg-white border border-slate-200/60 rounded-lg p-4'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconTrendingUp' className='w-5 h-5 text-purple-500' />
            <span className='font-medium'>{t('activity.analytics.today')}</span>
          </div>
          <div className='text-2xl font-bold mt-2'>
            {analytics.recent_trends.find(t => t.date === new Date().toISOString().split('T')[0])
              ?.count || 0}
          </div>
        </div>

        <div className='bg-white border border-slate-200/60 rounded-lg p-4'>
          <div className='flex items-center space-x-2'>
            <Icons name='IconClock' className='w-5 h-5 text-orange-500' />
            <span className='font-medium'>{t('activity.analytics.avg_daily')}</span>
          </div>
          <div className='text-2xl font-bold mt-2'>
            {Math.round(analytics.total_activities / 30)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Activity Types Chart */}
        <div className='bg-white border border-slate-200/60 rounded-lg p-4'>
          <h3 className='font-medium mb-4'>{t('activity.analytics.by_type')}</h3>
          <div className='space-y-2'>
            {analytics.activities_by_type.map(item => (
              <div key={item.type} className='flex items-center justify-between'>
                <span className='text-sm'>{item.type}</span>
                <div className='flex items-center space-x-2'>
                  <div className='w-24 bg-slate-200 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full'
                      style={{
                        width: `${(item.count / analytics.total_activities) * 100}%`
                      }}
                    />
                  </div>
                  <span className='text-sm font-medium'>{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Users */}
        <div className='bg-white border border-slate-200/60 rounded-lg p-4'>
          <h3 className='font-medium mb-4'>{t('activity.analytics.top_users')}</h3>
          <div className='space-y-3'>
            {analytics.activities_by_user.slice(0, 5).map((user, index) => (
              <div key={user.user_id} className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <div className='w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs'>
                    {index + 1}
                  </div>
                  <span className='text-sm'>{user.user_id}</span>
                </div>
                <Badge variant='outline-primary' size='xs'>
                  {user.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
