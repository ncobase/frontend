import { useMemo } from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { type Option } from '../option';
import { useListOption } from '../service';

type CategoryDefinition = {
  key: string;
  icon: string;
  prefixes: string[];
};

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    key: 'general',
    icon: 'IconSettings',
    prefixes: ['system.name', 'system.description', 'system.version', 'system.defaults']
  },
  {
    key: 'security',
    icon: 'IconShield',
    prefixes: ['system.security', 'auth.token', 'auth.session']
  },
  {
    key: 'email',
    icon: 'IconMail',
    prefixes: ['system.email_policy', 'system.notifications']
  },
  {
    key: 'ui',
    icon: 'IconPalette',
    prefixes: ['system.theme', 'system.frontend', 'dashboard.']
  },
  {
    key: 'resource',
    icon: 'IconDatabase',
    prefixes: ['resource.', 'system.storage_policy']
  },
  {
    key: 'ai',
    icon: 'IconSparkles',
    prefixes: ['ai.']
  },
  {
    key: 'performance',
    icon: 'IconGauge',
    prefixes: ['performance.', 'cache.', 'queue.']
  },
  {
    key: 'integrations',
    icon: 'IconPlug',
    prefixes: ['integration.', 'proxy.', 'tbp.']
  },
  {
    key: 'backup',
    icon: 'IconArchive',
    prefixes: ['backup.']
  }
];

const resolveCategory = (option: Option) => {
  if (option.category) {
    return option.category;
  }

  const name = option.name || '';
  const matched = CATEGORY_DEFINITIONS.find(category =>
    category.prefixes.some(prefix => name === prefix || name.startsWith(prefix))
  );
  return matched?.key || 'uncategorized';
};

const getErrorMessage = (error: unknown) => {
  if (!error) {
    return '';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const OptionCategory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const optionQuery = useListOption({ limit: 10000 });

  const categoryStats = useMemo(() => {
    const stats = new Map<string, { total: number; autoload: number; secret: number }>();
    for (const definition of CATEGORY_DEFINITIONS) {
      stats.set(definition.key, { total: 0, autoload: 0, secret: 0 });
    }
    stats.set('uncategorized', { total: 0, autoload: 0, secret: 0 });

    for (const option of optionQuery.data?.items ?? []) {
      const category = resolveCategory(option);
      const current = stats.get(category) || { total: 0, autoload: 0, secret: 0 };
      current.total += 1;
      if (option.autoload) {
        current.autoload += 1;
      }
      if (option.is_secret) {
        current.secret += 1;
      }
      stats.set(category, current);
    }

    return stats;
  }, [optionQuery.data?.items]);

  const categories = useMemo(
    () => [...CATEGORY_DEFINITIONS, { key: 'uncategorized', icon: 'IconDots', prefixes: [] }],
    []
  );

  const openCategory = (category: string) => {
    navigate(`/system/options?category=${encodeURIComponent(category)}`);
  };

  if (optionQuery.isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {categories.slice(0, 6).map(category => (
          <div key={category.key} className='rounded-lg border p-4'>
            <div className='h-5 w-32 animate-pulse rounded bg-slate-100' />
            <div className='mt-4 h-4 w-20 animate-pulse rounded bg-slate-100' />
            <div className='mt-4 h-8 w-full animate-pulse rounded bg-slate-100' />
          </div>
        ))}
      </div>
    );
  }

  if (optionQuery.isError) {
    return (
      <div className='rounded-lg border border-red-100 bg-red-50 p-4 text-red-700'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 gap-2'>
            <Icons name='IconAlertTriangle' className='mt-0.5 h-4 w-4 shrink-0' />
            <div className='min-w-0'>
              <p className='text-sm font-medium'>
                {t('options.categories.load_failed', 'Categories failed to load')}
              </p>
              <p className='mt-1 break-words text-xs opacity-80'>
                {getErrorMessage(optionQuery.error)}
              </p>
            </div>
          </div>
          <Button variant='outline-primary' onClick={() => void optionQuery.refetch()}>
            {t('actions.retry', 'Retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {categories.map(category => {
        const stats = categoryStats.get(category.key) || { total: 0, autoload: 0, secret: 0 };
        return (
          <div
            key={category.key}
            className='rounded-lg border bg-white p-4 transition-shadow hover:shadow-md'
          >
            <div className='mb-3 flex items-center justify-between gap-3'>
              <div className='flex min-w-0 items-center gap-3'>
                <Icons name={category.icon} className='h-5 w-5 shrink-0 text-slate-500' />
                <span className='truncate font-medium'>
                  {t(`options.categories.${category.key}`, category.key)}
                </span>
              </div>
              <span className='rounded bg-slate-100 px-2 py-1 text-xs text-slate-600'>
                {stats.total}
              </span>
            </div>

            <div className='mb-4 grid grid-cols-2 gap-3 text-sm text-slate-600'>
              <div>
                <p className='text-xs text-slate-400'>
                  {t('options.fields.autoload', 'Auto Load')}
                </p>
                <p className='font-medium text-slate-800'>{stats.autoload}</p>
              </div>
              <div>
                <p className='text-xs text-slate-400'>{t('options.fields.is_secret', 'Secret')}</p>
                <p className='font-medium text-slate-800'>{stats.secret}</p>
              </div>
            </div>

            <Button
              variant='outline-primary'
              className='w-full'
              startIcon={<Icons name='IconAdjustments' />}
              onClick={() => openCategory(category.key)}
            >
              {t('options.categories.manage')}
            </Button>
          </div>
        );
      })}
    </div>
  );
};
