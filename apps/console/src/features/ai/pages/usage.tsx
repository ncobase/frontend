import { useState } from 'react';

import { Button, Icons } from '@ncobase/react';

import type { AIUsageQuery } from '../ai';
import {
  AIInlineState,
  MetricCard,
  UsageBucketTable,
  formatCost,
  formatCount,
  formatDuration
} from '../components/shared';
import { useAIUsage } from '../service';

import { Page, Topbar } from '@/components/layout';

const toEpochMillis = (value?: string) => (value ? new Date(value).getTime() : undefined);

export const AIUsagePage = () => {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [query, setQuery] = useState<AIUsageQuery | undefined>();
  const usageQuery = useAIUsage(query);
  const usage = usageQuery.data;

  const updateDraft = (key: string, value: string) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const apply = () => {
    setQuery({
      action: draft.action,
      mode: draft.mode,
      status: draft.status,
      provider: draft.provider,
      model: draft.model,
      start_date: toEpochMillis(draft.start_date),
      end_date: toEpochMillis(draft.end_date)
    });
  };

  const reset = () => {
    setDraft({});
    setQuery(undefined);
  };

  return (
    <Page
      sidebar
      title='AI Usage'
      topbar={
        <Topbar
          title='AI Usage'
          right={[
            <Button
              key='refresh'
              variant='outline-slate'
              size='sm'
              onClick={() => usageQuery.refetch()}
            >
              <Icons name='IconRefresh' className='mr-1 h-4 w-4' />
              Refresh
            </Button>
          ]}
        />
      }
    >
      <div className='space-y-6 p-6'>
        <section className='rounded-lg border bg-white p-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-7'>
            {[
              ['action', 'Action', 'content.summary'],
              ['provider', 'Provider', 'openai'],
              ['model', 'Model', 'gpt-4o-mini']
            ].map(([key, label, placeholder]) => (
              <label key={key} className='space-y-1 text-sm'>
                <span className='font-medium text-slate-700'>{label}</span>
                <input
                  value={draft[key] || ''}
                  onChange={event => updateDraft(key, event.target.value)}
                  placeholder={placeholder}
                  className='w-full rounded-md border border-slate-200 px-3 py-2'
                />
              </label>
            ))}
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Mode</span>
              <select
                value={draft.mode || ''}
                onChange={event => updateDraft('mode', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              >
                <option value=''>Any</option>
                <option value='complete'>Complete</option>
                <option value='stream'>Stream</option>
                <option value='action'>Action</option>
                <option value='embed'>Embed</option>
              </select>
            </label>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Status</span>
              <select
                value={draft.status || ''}
                onChange={event => updateDraft('status', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              >
                <option value=''>Any</option>
                <option value='succeeded'>Succeeded</option>
                <option value='failed'>Failed</option>
                <option value='running'>Running</option>
              </select>
            </label>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Start</span>
              <input
                type='datetime-local'
                value={draft.start_date || ''}
                onChange={event => updateDraft('start_date', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              />
            </label>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>End</span>
              <input
                type='datetime-local'
                value={draft.end_date || ''}
                onChange={event => updateDraft('end_date', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              />
            </label>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <Button size='sm' onClick={apply}>
              <Icons name='IconSearch' className='mr-1 h-4 w-4' />
              Apply
            </Button>
            <Button size='sm' variant='outline-slate' onClick={reset}>
              <Icons name='IconX' className='mr-1 h-4 w-4' />
              Reset
            </Button>
          </div>
        </section>

        {usageQuery.isLoading ? (
          <AIInlineState type='loading' title='Loading AI usage...' />
        ) : usageQuery.isError ? (
          <AIInlineState
            type='error'
            title='Unable to load AI usage'
            description='Check AI permissions and retry.'
            onRetry={() => usageQuery.refetch()}
          />
        ) : (
          <>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
              <MetricCard icon='IconActivity' label='Runs' value={formatCount(usage?.total_runs)} />
              <MetricCard
                icon='IconCircleCheck'
                label='Succeeded'
                value={formatCount(usage?.succeeded_runs)}
              />
              <MetricCard
                icon='IconCoins'
                label='Estimated cost'
                value={formatCost(usage?.estimated_cost, usage?.currency)}
              />
              <MetricCard
                icon='IconClock'
                label='Total duration'
                value={formatDuration(usage?.duration_ms)}
              />
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
              <MetricCard
                icon='IconBrackets'
                label='Input tokens'
                value={formatCount(usage?.input_tokens)}
              />
              <MetricCard
                icon='IconMessage2'
                label='Output tokens'
                value={formatCount(usage?.output_tokens)}
              />
              <MetricCard
                icon='IconCpu'
                label='Reasoning tokens'
                value={formatCount(usage?.reasoning_tokens)}
              />
              <MetricCard
                icon='IconDatabase'
                label='Cache tokens'
                value={formatCount(
                  (usage?.cache_created_tokens || 0) + (usage?.cache_read_tokens || 0)
                )}
              />
            </div>

            <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
              <UsageBucketTable
                title='By provider'
                buckets={usage?.by_provider}
                currency={usage?.currency}
              />
              <UsageBucketTable
                title='By action'
                buckets={usage?.by_action}
                currency={usage?.currency}
              />
              <UsageBucketTable
                title='By mode'
                buckets={usage?.by_mode}
                currency={usage?.currency}
              />
            </div>
          </>
        )}
      </div>
    </Page>
  );
};
