import type { ReactNode } from 'react';

import { Alert, AlertDescription, Button, Icons } from '@ncobase/react';
import { Navigate } from 'react-router';

import { useNCoreAvailability } from './hooks';

import { Page } from '@/components/layout';
import { Spinner } from '@/components/loading/spinner';
import { lazyNamed, renderRoutes } from '@/router';

const ExtensionCollectionsPage = lazyNamed(
  () => import('./pages/collections'),
  'ExtensionCollectionsPage'
);
const ExtensionHealthPage = lazyNamed(() => import('./pages/health'), 'ExtensionHealthPage');
const ExtensionMetricsPage = lazyNamed(() => import('./pages/metrics'), 'ExtensionMetricsPage');
const ExtensionOverviewPage = lazyNamed(() => import('./pages/overview'), 'ExtensionOverviewPage');

const NCoreUnavailablePage = ({
  reason,
  message,
  onRetry
}: {
  reason?: string;
  message?: string;
  onRetry: () => void;
}) => {
  const title =
    reason === 'forbidden' ? 'NCore management access denied' : 'NCore management unavailable';

  return (
    <Page title='NCore'>
      <Alert variant='destructive'>
        <Icons name='IconAlertTriangle' className='w-4 h-4' />
        <AlertDescription>
          <div className='space-y-3'>
            <div>
              <div className='font-medium'>{title}</div>
              <div className='text-sm'>
                {message || 'NCore management routes cannot be reached from this console.'}
              </div>
            </div>
            <Button size='sm' variant='outline' onClick={onRetry}>
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </Page>
  );
};

const NCoreAvailabilityGate = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, refetch } = useNCoreAvailability();

  if (isLoading) return <Spinner />;

  if (!data?.available) {
    return (
      <NCoreUnavailablePage
        reason={data?.reason}
        message={data?.message}
        onRetry={() => refetch()}
      />
    );
  }

  return <>{children}</>;
};

export const NCoreRoutes = () => {
  const routes = [
    { path: '/', element: <Navigate to='overview' replace /> },
    { path: '/overview', element: <ExtensionOverviewPage /> },
    { path: '/metrics', element: <ExtensionMetricsPage /> },
    { path: '/health', element: <ExtensionHealthPage /> },
    { path: '/collections', element: <ExtensionCollectionsPage /> }
  ];

  return <NCoreAvailabilityGate>{renderRoutes(routes)}</NCoreAvailabilityGate>;
};

export default NCoreRoutes;
