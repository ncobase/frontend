import { Button, Icons } from '@ncobase/react';
import { useNavigate, useParams } from 'react-router';

import {
  AIInlineState,
  KeyValueGrid,
  ResultPanel,
  StatusBadge,
  formatCost,
  formatCount,
  formatDuration,
  formatTimestamp,
  safeJsonStringify
} from '../components/shared';
import { useAIRun } from '../service';

import { Page, Topbar } from '@/components/layout';

export const AIRunViewPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const runQuery = useAIRun(id);
  const run = runQuery.data;

  return (
    <Page
      sidebar
      title='AI Run Details'
      topbar={
        <Topbar
          title='AI Run Details'
          left={[
            <Button key='back' variant='outline-slate' size='sm' onClick={() => navigate(-1)}>
              <Icons name='IconArrowLeft' className='mr-1 h-4 w-4' />
              Back
            </Button>
          ]}
          right={[
            <Button
              key='refresh'
              variant='outline-slate'
              size='sm'
              onClick={() => runQuery.refetch()}
            >
              <Icons name='IconRefresh' className='mr-1 h-4 w-4' />
              Refresh
            </Button>
          ]}
        />
      }
    >
      <div className='space-y-6 p-6'>
        {runQuery.isLoading ? (
          <AIInlineState type='loading' title='Loading AI run...' />
        ) : runQuery.isError || !run ? (
          <AIInlineState
            type='error'
            title='Unable to load AI run'
            description='The run may not exist or may belong to another user.'
            onRetry={() => runQuery.refetch()}
          />
        ) : (
          <>
            <section className='rounded-lg border bg-white p-4'>
              <div className='mb-4 flex flex-wrap items-start justify-between gap-3'>
                <div>
                  <h2 className='font-mono text-sm font-semibold text-slate-900'>{run.id}</h2>
                  <p className='mt-1 text-sm text-slate-500'>{run.operation_id || '-'}</p>
                </div>
                <StatusBadge status={run.status} />
              </div>
              <KeyValueGrid
                items={[
                  { label: 'Mode', value: run.mode },
                  { label: 'Action', value: run.action },
                  { label: 'Provider', value: run.provider },
                  { label: 'Model', value: run.model },
                  { label: 'Fallback model', value: run.fallback_model },
                  { label: 'Duration', value: formatDuration(run.duration_ms) },
                  { label: 'Input tokens', value: formatCount(run.input_tokens) },
                  { label: 'Output tokens', value: formatCount(run.output_tokens) },
                  { label: 'Total tokens', value: formatCount(run.total_tokens) },
                  { label: 'Reasoning tokens', value: formatCount(run.reasoning_tokens) },
                  { label: 'Cache created tokens', value: formatCount(run.cache_created_tokens) },
                  { label: 'Cache read tokens', value: formatCount(run.cache_read_tokens) },
                  { label: 'Estimated cost', value: formatCost(run.estimated_cost, run.currency) },
                  { label: 'Space', value: run.space_id, mono: true },
                  { label: 'User', value: run.user_id, mono: true },
                  { label: 'Created', value: formatTimestamp(run.created_at) },
                  { label: 'Updated', value: formatTimestamp(run.updated_at) },
                  { label: 'Request hash', value: run.request_hash, mono: true },
                  { label: 'Response hash', value: run.response_hash, mono: true }
                ]}
              />
            </section>

            {run.error_message && (
              <section className='rounded-lg border border-red-200 bg-red-50 p-4'>
                <h3 className='text-sm font-semibold text-red-900'>
                  {run.error_code || 'provider_error'}
                </h3>
                <p className='mt-2 whitespace-pre-wrap break-words text-sm text-red-700'>
                  {run.error_message}
                </p>
              </section>
            )}

            <ResultPanel
              title='Metadata'
              content={safeJsonStringify(run.metadata || {})}
              onCopy={() => navigator.clipboard.writeText(safeJsonStringify(run.metadata || {}))}
            />
          </>
        )}
      </div>
    </Page>
  );
};
