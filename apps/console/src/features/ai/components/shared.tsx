import { Button, Icons, Badge } from '@ncobase/react';
import { formatDateTime } from '@ncobase/utils';
import { Link } from 'react-router';

import type {
  AIActionDescriptor,
  AIActionResponse,
  AICompleteResponse,
  AIRun,
  AIRunStatus,
  AIUsageBucket
} from '../ai';

export const formatCount = (value?: number) =>
  new Intl.NumberFormat('en-US').format(Number(value || 0));

export const formatDuration = (value?: number) => {
  const duration = Number(value || 0);
  if (duration <= 0) return '-';
  if (duration < 1000) return `${duration} ms`;
  return `${(duration / 1000).toFixed(duration < 10000 ? 2 : 1)} s`;
};

export const formatCost = (value?: number, currency = 'USD') => {
  if (!value) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 6
  }).format(value);
};

export const formatTimestamp = (value?: number | string) => {
  if (!value) return '-';
  return formatDateTime(value) || '-';
};

export const safeJsonStringify = (value: any) => {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
};

export const copyText = async (text: string) => {
  if (!text) return false;
  await navigator.clipboard.writeText(text);
  return true;
};

export const statusBadgeVariant = (status?: AIRunStatus) => {
  switch (status) {
    case 'succeeded':
      return 'outline-success';
    case 'failed':
      return 'outline-danger';
    case 'running':
      return 'outline-warning';
    case 'canceled':
      return 'outline-secondary';
    default:
      return 'outline-slate';
  }
};

export const StatusBadge = ({ status }: { status?: AIRunStatus }) => (
  <Badge variant={statusBadgeVariant(status)} size='xs'>
    {status || '-'}
  </Badge>
);

export const MetricCard = ({
  icon,
  label,
  value,
  hint
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) => (
  <div className='rounded-lg border bg-white p-4'>
    <div className='flex items-start gap-3'>
      <div className='rounded-md bg-slate-100 p-2'>
        <Icons name={icon} className='h-5 w-5 text-slate-700' />
      </div>
      <div className='min-w-0'>
        <p className='text-xs font-medium uppercase tracking-wide text-slate-500'>{label}</p>
        <p className='mt-1 break-words text-xl font-semibold text-slate-950'>{value}</p>
        {hint && <p className='mt-1 text-xs text-slate-500'>{hint}</p>}
      </div>
    </div>
  </div>
);

export const AIInlineState = ({
  type,
  title,
  description,
  onRetry
}: {
  type: 'loading' | 'error' | 'empty' | 'disabled';
  title: string;
  description?: string;
  onRetry?: () => void;
}) => {
  const icon =
    type === 'loading'
      ? 'IconLoader2'
      : type === 'error'
        ? 'IconAlertCircle'
        : type === 'disabled'
          ? 'IconShieldOff'
          : 'IconInbox';
  const color =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-800'
      : type === 'disabled'
        ? 'border-amber-200 bg-amber-50 text-amber-800'
        : 'border-slate-200 bg-white text-slate-700';

  return (
    <div className={`rounded-lg border p-5 ${color}`}>
      <div className='flex items-start gap-3'>
        <Icons
          name={icon}
          className={`mt-0.5 h-5 w-5 ${type === 'loading' ? 'animate-spin' : ''}`}
        />
        <div className='min-w-0 flex-1 space-y-2'>
          <p className='font-medium'>{title}</p>
          {description && <p className='text-sm opacity-80'>{description}</p>}
          {onRetry && (
            <Button size='sm' variant='outline-slate' onClick={onRetry}>
              <Icons name='IconRefresh' className='mr-1 h-4 w-4' />
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const KeyValueGrid = ({
  items
}: {
  items: Array<{ label: string; value?: string | number | null; mono?: boolean }>;
}) => (
  <dl className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
    {items.map(item => (
      <div key={item.label} className='space-y-1'>
        <dt className='text-xs font-medium text-slate-500'>{item.label}</dt>
        <dd className={`break-all text-sm text-slate-900 ${item.mono ? 'font-mono text-xs' : ''}`}>
          {item.value === undefined || item.value === null || item.value === '' ? '-' : item.value}
        </dd>
      </div>
    ))}
  </dl>
);

export const RunLink = ({ runId }: { runId?: string }) => {
  if (!runId) return <span>-</span>;
  return (
    <Link className='font-mono text-xs text-blue-600 hover:text-blue-800' to={`/ai/runs/${runId}`}>
      {runId}
    </Link>
  );
};

export const ResultPanel = ({
  title,
  content,
  json,
  runId,
  meta,
  onCopy
}: {
  title: string;
  content?: string;
  json?: Record<string, any>;
  runId?: string;
  meta?: Array<{ label: string; value?: string | number }>;
  onCopy?: () => void;
}) => {
  const display = json ? safeJsonStringify(json) : content || '';

  return (
    <section className='rounded-lg border bg-white'>
      <div className='flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3'>
        <div>
          <h3 className='text-sm font-semibold text-slate-900'>{title}</h3>
          {runId && (
            <p className='mt-1 text-xs text-slate-500'>
              Run <RunLink runId={runId} />
            </p>
          )}
        </div>
        {onCopy && display && (
          <Button size='sm' variant='outline-slate' onClick={onCopy}>
            <Icons name='IconCopy' className='mr-1 h-4 w-4' />
            Copy
          </Button>
        )}
      </div>
      {meta && meta.length > 0 && (
        <div className='grid grid-cols-2 gap-3 border-b px-4 py-3 text-xs text-slate-600 md:grid-cols-4'>
          {meta.map(item => (
            <div key={item.label}>
              <span className='block text-slate-400'>{item.label}</span>
              <span className='font-medium text-slate-800'>{item.value || '-'}</span>
            </div>
          ))}
        </div>
      )}
      {display ? (
        <pre className='max-h-[520px] overflow-auto whitespace-pre-wrap break-words bg-slate-950 p-4 text-sm leading-6 text-slate-100'>
          {display}
        </pre>
      ) : (
        <div className='p-6 text-sm text-slate-500'>No output yet.</div>
      )}
    </section>
  );
};

export const groupActionsByDomain = (actions?: AIActionDescriptor[]) =>
  (actions || []).reduce<Record<string, AIActionDescriptor[]>>((acc, action) => {
    acc[action.domain] = acc[action.domain] || [];
    acc[action.domain].push(action);
    return acc;
  }, {});

export const UsageBucketTable = ({
  title,
  buckets,
  currency
}: {
  title: string;
  buckets?: Record<string, AIUsageBucket>;
  currency?: string;
}) => {
  const rows = Object.entries(buckets || {}).sort((a, b) => b[1].runs - a[1].runs);

  return (
    <section className='rounded-lg border bg-white'>
      <div className='border-b px-4 py-3'>
        <h3 className='text-sm font-semibold text-slate-900'>{title}</h3>
      </div>
      {rows.length === 0 ? (
        <div className='p-4 text-sm text-slate-500'>No usage data.</div>
      ) : (
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-slate-200 text-sm'>
            <thead className='bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500'>
              <tr>
                <th className='px-4 py-3 font-medium'>Name</th>
                <th className='px-4 py-3 font-medium'>Runs</th>
                <th className='px-4 py-3 font-medium'>Succeeded</th>
                <th className='px-4 py-3 font-medium'>Failed</th>
                <th className='px-4 py-3 font-medium'>Tokens</th>
                <th className='px-4 py-3 font-medium'>Cost</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 bg-white'>
              {rows.map(([key, value]) => (
                <tr key={key}>
                  <td className='px-4 py-3 font-medium text-slate-900'>{key || 'unknown'}</td>
                  <td className='px-4 py-3 text-slate-700'>{formatCount(value.runs)}</td>
                  <td className='px-4 py-3 text-slate-700'>{formatCount(value.succeeded_runs)}</td>
                  <td className='px-4 py-3 text-slate-700'>{formatCount(value.failed_runs)}</td>
                  <td className='px-4 py-3 text-slate-700'>{formatCount(value.total_tokens)}</td>
                  <td className='px-4 py-3 text-slate-700'>
                    {formatCost(value.estimated_cost, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export const RunSummaryRow = ({ run }: { run: AIRun }) => (
  <tr className='hover:bg-slate-50'>
    <td className='px-4 py-3'>
      <RunLink runId={run.id} />
      {run.operation_id && (
        <p className='mt-1 font-mono text-[11px] text-slate-400'>{run.operation_id}</p>
      )}
    </td>
    <td className='px-4 py-3'>
      <StatusBadge status={run.status} />
    </td>
    <td className='px-4 py-3 text-slate-700'>{run.mode}</td>
    <td className='px-4 py-3 text-slate-700'>{run.action || '-'}</td>
    <td className='px-4 py-3 text-slate-700'>
      {run.provider || '-'}
      {run.model && <span className='block text-xs text-slate-500'>{run.model}</span>}
    </td>
    <td className='px-4 py-3 text-slate-700'>{formatCount(run.total_tokens)}</td>
    <td className='px-4 py-3 text-slate-700'>{formatDuration(run.duration_ms)}</td>
    <td className='px-4 py-3 text-slate-700'>{formatTimestamp(run.created_at)}</td>
  </tr>
);

export const actionResponseMeta = (result?: AIActionResponse | AICompleteResponse | null) => {
  if (!result) return [];
  return [
    { label: 'Provider', value: result.provider },
    { label: 'Model', value: result.model },
    { label: 'Tokens', value: formatCount(result.total_tokens) }
  ];
};
