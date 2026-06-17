import { useMemo, useState } from 'react';

import { Button, Icons } from '@ncobase/react';

import type { AIRunQuery } from '../ai';
import { AIInlineState, RunSummaryRow } from '../components/shared';
import { useAIRuns } from '../service';

import { Page, Topbar } from '@/components/layout';

const defaultFilters: AIRunQuery = { page_size: 20 };

export const AIRunsPage = () => {
  const [draft, setDraft] = useState<AIRunQuery>(defaultFilters);
  const [query, setQuery] = useState<AIRunQuery>(defaultFilters);
  const stableQuery = useMemo(() => query, [query]);
  const runsQuery = useAIRuns(stableQuery);

  const updateDraft = (key: keyof AIRunQuery, value: any) => {
    setDraft(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setQuery({ ...draft, cursor: '' });
  };

  const resetFilters = () => {
    setDraft(defaultFilters);
    setQuery(defaultFilters);
  };

  const goCursor = (cursor?: string, direction: 'forward' | 'backward' = 'forward') => {
    if (!cursor) return;
    setDraft(prev => ({ ...prev, cursor, direction }));
    setQuery(prev => ({ ...prev, cursor, direction }));
  };

  return (
    <Page
      sidebar
      title='AI Runs'
      topbar={
        <Topbar
          title='AI Runs'
          right={[
            <Button
              key='refresh'
              variant='outline-slate'
              size='sm'
              onClick={() => runsQuery.refetch()}
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
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6'>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Status</span>
              <select
                value={draft.status || ''}
                onChange={event => updateDraft('status', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              >
                <option value=''>Any</option>
                <option value='running'>Running</option>
                <option value='succeeded'>Succeeded</option>
                <option value='failed'>Failed</option>
                <option value='canceled'>Canceled</option>
              </select>
            </label>
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
              <span className='font-medium text-slate-700'>Action</span>
              <input
                value={draft.action || ''}
                onChange={event => updateDraft('action', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
                placeholder='content.summary'
              />
            </label>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Provider</span>
              <input
                value={draft.provider || ''}
                onChange={event => updateDraft('provider', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
                placeholder='openai'
              />
            </label>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Model</span>
              <input
                value={draft.model || ''}
                onChange={event => updateDraft('model', event.target.value)}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
                placeholder='gpt-4o-mini'
              />
            </label>
            <label className='space-y-1 text-sm'>
              <span className='font-medium text-slate-700'>Page size</span>
              <input
                type='number'
                min={1}
                max={100}
                value={draft.page_size || 20}
                onChange={event => updateDraft('page_size', Number(event.target.value))}
                className='w-full rounded-md border border-slate-200 px-3 py-2'
              />
            </label>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <Button size='sm' onClick={applyFilters}>
              <Icons name='IconSearch' className='mr-1 h-4 w-4' />
              Apply
            </Button>
            <Button size='sm' variant='outline-slate' onClick={resetFilters}>
              <Icons name='IconX' className='mr-1 h-4 w-4' />
              Reset
            </Button>
          </div>
        </section>

        <section className='rounded-lg border bg-white'>
          {runsQuery.isLoading ? (
            <div className='p-4'>
              <AIInlineState type='loading' title='Loading AI runs...' />
            </div>
          ) : runsQuery.isError ? (
            <div className='p-4'>
              <AIInlineState
                type='error'
                title='Unable to load AI runs'
                description='Check AI permissions and retry.'
                onRetry={() => runsQuery.refetch()}
              />
            </div>
          ) : (runsQuery.data?.items || []).length === 0 ? (
            <div className='p-4'>
              <AIInlineState type='empty' title='No runs match the current filters' />
            </div>
          ) : (
            <>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-slate-200 text-sm'>
                  <thead className='bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500'>
                    <tr>
                      <th className='px-4 py-3 font-medium'>Run</th>
                      <th className='px-4 py-3 font-medium'>Status</th>
                      <th className='px-4 py-3 font-medium'>Mode</th>
                      <th className='px-4 py-3 font-medium'>Action</th>
                      <th className='px-4 py-3 font-medium'>Provider</th>
                      <th className='px-4 py-3 font-medium'>Tokens</th>
                      <th className='px-4 py-3 font-medium'>Duration</th>
                      <th className='px-4 py-3 font-medium'>Created</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-slate-100'>
                    {(runsQuery.data?.items || []).map(run => (
                      <RunSummaryRow key={run.id} run={run} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className='flex items-center justify-between gap-3 border-t px-4 py-3 text-sm'>
                <span className='text-slate-500'>Total {runsQuery.data?.total || 0}</span>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    variant='outline-slate'
                    disabled={!runsQuery.data?.has_prev}
                    onClick={() => goCursor(runsQuery.data?.prev_cursor, 'backward')}
                  >
                    Previous
                  </Button>
                  <Button
                    size='sm'
                    variant='outline-slate'
                    disabled={!runsQuery.data?.has_next}
                    onClick={() => goCursor(runsQuery.data?.next_cursor, 'forward')}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </Page>
  );
};
