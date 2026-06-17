import { useMemo } from 'react';

import { Button, Icons, Badge } from '@ncobase/react';
import { Link } from 'react-router';

import {
  AIInlineState,
  MetricCard,
  RunSummaryRow,
  formatCost,
  formatCount,
  groupActionsByDomain
} from '../components/shared';
import { useAIActions, useAIRuns, useAIStatus, useAIUsage } from '../service';

import { Page, Topbar } from '@/components/layout';

export const AIOverviewPage = () => {
  const recentRunParams = useMemo(() => ({ page_size: 5 }), []);
  const statusQuery = useAIStatus();
  const usageQuery = useAIUsage();
  const actionsQuery = useAIActions();
  const recentRunsQuery = useAIRuns(recentRunParams);

  const status = statusQuery.data;
  const usage = usageQuery.data;
  const groupedActions = groupActionsByDomain(actionsQuery.data);

  const refresh = () => {
    statusQuery.refetch();
    usageQuery.refetch();
    actionsQuery.refetch();
    recentRunsQuery.refetch();
  };

  return (
    <Page
      sidebar
      title='AI Operations'
      topbar={
        <Topbar
          title='AI Operations'
          right={[
            <Button
              key='refresh'
              variant='outline-slate'
              size='sm'
              onClick={refresh}
              isLoading={
                statusQuery.isFetching ||
                usageQuery.isFetching ||
                actionsQuery.isFetching ||
                recentRunsQuery.isFetching
              }
            >
              <Icons name='IconRefresh' className='mr-1 h-4 w-4' />
              Refresh
            </Button>
          ]}
        />
      }
    >
      <div className='space-y-6 p-6'>
        {statusQuery.isLoading ? (
          <AIInlineState type='loading' title='Loading AI runtime status...' />
        ) : statusQuery.isError ? (
          <AIInlineState
            type='error'
            title='Unable to load AI runtime status'
            description='Check AI read permissions and retry.'
            onRetry={() => statusQuery.refetch()}
          />
        ) : !status?.ready ? (
          <AIInlineState
            type='disabled'
            title='AI runtime is not ready'
            description={
              status?.message ||
              'AI is disabled or no enabled provider has all required server-side environment variables.'
            }
          />
        ) : (
          <section className='rounded-lg border bg-white p-4'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline-success'>Ready</Badge>
                  <span className='text-sm text-slate-500'>
                    Primary model: {status.primary || '-'}
                  </span>
                </div>
                <p className='mt-2 max-w-3xl text-sm text-slate-600'>
                  AI requests are routed through the backend gateway. Secrets remain on the server,
                  prompts are governed by runtime policy, and every call creates an auditable run.
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Link to='/ai/playground'>
                  <Button size='sm'>
                    <Icons name='IconPlayerPlay' className='mr-1 h-4 w-4' />
                    Playground
                  </Button>
                </Link>
                <Link to='/ai/actions'>
                  <Button variant='outline-slate' size='sm'>
                    <Icons name='IconSparkles' className='mr-1 h-4 w-4' />
                    Actions
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
          <MetricCard
            icon='IconActivity'
            label='Total runs'
            value={formatCount(usage?.total_runs || status?.stats?.total_requests)}
          />
          <MetricCard
            icon='IconCircleCheck'
            label='Succeeded'
            value={formatCount(usage?.succeeded_runs || status?.stats?.success_requests)}
          />
          <MetricCard
            icon='IconCircleX'
            label='Failed'
            value={formatCount(usage?.failed_runs || status?.stats?.failed_requests)}
          />
          <MetricCard
            icon='IconCoins'
            label='Estimated cost'
            value={formatCost(usage?.estimated_cost, usage?.currency)}
          />
        </div>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]'>
          <section className='rounded-lg border bg-white'>
            <div className='flex items-center justify-between border-b px-4 py-3'>
              <h2 className='text-sm font-semibold text-slate-900'>Recent runs</h2>
              <Link className='text-sm text-blue-600 hover:text-blue-800' to='/ai/runs'>
                View all
              </Link>
            </div>
            {recentRunsQuery.isLoading ? (
              <div className='p-4 text-sm text-slate-500'>Loading...</div>
            ) : recentRunsQuery.isError ? (
              <div className='p-4 text-sm text-red-600'>Unable to load recent runs.</div>
            ) : (recentRunsQuery.data?.items || []).length === 0 ? (
              <div className='p-4 text-sm text-slate-500'>No AI runs have been recorded.</div>
            ) : (
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
                    {(recentRunsQuery.data?.items || []).map(run => (
                      <RunSummaryRow key={run.id} run={run} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className='rounded-lg border bg-white'>
            <div className='border-b px-4 py-3'>
              <h2 className='text-sm font-semibold text-slate-900'>Available actions</h2>
            </div>
            {actionsQuery.isLoading ? (
              <div className='p-4 text-sm text-slate-500'>Loading...</div>
            ) : Object.keys(groupedActions).length === 0 ? (
              <div className='p-4 text-sm text-slate-500'>No actions are enabled by policy.</div>
            ) : (
              <div className='divide-y divide-slate-100'>
                {Object.entries(groupedActions).map(([domain, actions]) => (
                  <div key={domain} className='p-4'>
                    <div className='mb-2 flex items-center justify-between gap-2'>
                      <span className='text-sm font-medium capitalize text-slate-900'>
                        {domain}
                      </span>
                      <Badge variant='outline-slate' size='xs'>
                        {actions.length}
                      </Badge>
                    </div>
                    <div className='space-y-2'>
                      {actions.slice(0, 4).map(action => (
                        <div key={action.key} className='text-sm'>
                          <p className='font-medium text-slate-800'>{action.name}</p>
                          <p className='line-clamp-2 text-xs text-slate-500'>
                            {action.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Page>
  );
};
