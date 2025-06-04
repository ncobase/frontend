import { useState, useEffect } from 'react';

import { Button, InputField, SelectField, Badge, Icons } from '@ncobase/react';
import { formatDateTime, formatRelativeTime } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { searchActivities } from '../apis';

export const ActivityViewer: React.FC = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    user_id: '',
    type: '',
    from_date: '',
    to_date: '',
    search: ''
  });

  useEffect(() => {
    loadActivities();
  }, [filters]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await searchActivities(filters);
      setActivities(data.items || []);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const activityTypes = [
    { label: t('activity.types.login'), value: 'login' },
    { label: t('activity.types.logout'), value: 'logout' },
    { label: t('activity.types.create'), value: 'create' },
    { label: t('activity.types.update'), value: 'update' },
    { label: t('activity.types.delete'), value: 'delete' },
    { label: t('activity.types.permission_change'), value: 'permission_change' },
    { label: t('activity.types.role_assignment'), value: 'role_assignment' },
    { label: t('activity.types.settings_change'), value: 'settings_change' }
  ];

  return (
    <div className='space-y-6'>
      {/* Filters */}
      <div className='bg-slate-50 p-4 rounded-lg'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <InputField
            placeholder={t('activity.filters.search_placeholder')}
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            prependIcon='IconSearch'
          />

          <SelectField
            placeholder={t('activity.filters.type_placeholder')}
            value={filters.type}
            onChange={value => setFilters(prev => ({ ...prev, type: value }))}
            options={activityTypes}
            allowClear
          />

          <InputField
            placeholder={t('activity.filters.user_placeholder')}
            value={filters.user_id}
            onChange={e => setFilters(prev => ({ ...prev, user_id: e.target.value }))}
          />

          <div className='flex space-x-2'>
            <Button
              variant='outline-slate'
              onClick={() =>
                setFilters({
                  user_id: '',
                  type: '',
                  from_date: '',
                  to_date: '',
                  search: ''
                })
              }
            >
              {t('actions.clear')}
            </Button>
            <Button onClick={loadActivities}>{t('actions.refresh')}</Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className='space-y-3'>
        {loading ? (
          <div className='text-center py-8 text-slate-500'>{t('common.loading')}</div>
        ) : activities.length === 0 ? (
          <div className='text-center py-8 text-slate-500'>{t('activity.no_activities')}</div>
        ) : (
          activities.map(activity => (
            <ActivityLogItem key={activity.id} activity={activity} t={t} />
          ))
        )}
      </div>
    </div>
  );
};

const ActivityLogItem = ({ activity, t }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getActivityIcon = (type: string) => {
    const iconMap = {
      login: 'IconLogin',
      logout: 'IconLogout',
      create: 'IconPlus',
      update: 'IconPencil',
      delete: 'IconTrash',
      permission_change: 'IconLock',
      role_assignment: 'IconUserCheck',
      settings_change: 'IconSettings'
    };
    return iconMap[type] || 'IconActivity';
  };

  const getActivityColor = (type: string) => {
    const colorMap = {
      login: 'text-green-500',
      logout: 'text-orange-500',
      create: 'text-blue-500',
      update: 'text-yellow-500',
      delete: 'text-red-500',
      permission_change: 'text-purple-500',
      role_assignment: 'text-indigo-500',
      settings_change: 'text-slate-500'
    };
    return colorMap[type] || 'text-slate-500';
  };

  return (
    <div className='border rounded-lg p-4 hover:bg-slate-50'>
      <div className='flex items-start justify-between'>
        <div className='flex items-start space-x-3'>
          <Icons
            name={getActivityIcon(activity.type)}
            className={`w-5 h-5 mt-0.5 ${getActivityColor(activity.type)}`}
          />
          <div className='flex-1'>
            <div className='flex items-center space-x-2'>
              <span className='font-medium'>{activity.user_id}</span>
              <Badge variant='outline-slate' size='xs'>
                {activity.type}
              </Badge>
              <span className='text-sm text-slate-500'>
                {formatRelativeTime(new Date(activity.timestamp))}
              </span>
            </div>
            <div className='text-slate-700 mt-1'>{activity.details}</div>
            {activity.metadata && (
              <Button
                variant='link'
                size='sm'
                onClick={() => setShowDetails(!showDetails)}
                className='p-0 h-auto text-xs'
              >
                {showDetails ? t('activity.hide_details') : t('activity.show_details')}
              </Button>
            )}
          </div>
        </div>
        <div className='text-xs text-slate-500'>
          {formatDateTime(activity.timestamp, 'dateTime')}
        </div>
      </div>

      {/* Metadata Details */}
      {showDetails && activity.metadata && (
        <div className='mt-3 p-3 bg-slate-100 rounded text-xs'>
          <pre className='whitespace-pre-wrap font-mono'>
            {JSON.stringify(activity.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
