// @ts-nocheck
import { useState } from 'react';

import { Badge, Button, Icons, Tooltip, Progress, Card, CardContent } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useExtensionStatus, useExtensions } from '../service';

import { Page, Topbar } from '@/components/layout';

export const ExtensionStatusPage = () => {
  const { t } = useTranslation();
  const { data: status, isLoading, refetch } = useExtensionStatus();
  const { data: extensions } = useExtensions();
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calculate status summary
  const statusSummary: any = status
    ? Object.values(status).reduce(
        (acc, ext) => {
          acc[ext?.status] = (acc[ext?.status] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    : {};

  const totalExtensions = Object.keys(status || {}).length;
  const activeExtensions = statusSummary?.active || 0;
  const healthPercentage = totalExtensions > 0 ? (activeExtensions / totalExtensions) * 100 : 0;

  // Get extension metadata from extensions data
  const getExtensionMetadata = (name: string) => {
    if (!extensions) return null;

    for (const [group, types] of Object.entries(extensions)) {
      for (const [type, exts] of Object.entries(types)) {
        const ext = exts.find(e => e.name === name);
        if (ext) {
          return { ...ext, group, type };
        }
      }
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'error':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getUptimeDisplay = (uptime?: number) => {
    if (!uptime) return 'N/A';

    const days = Math.floor(uptime / 24);
    const hours = Math.floor(uptime % 24);
    const minutes = Math.floor((uptime % 1) * 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <Page
      title={t('extensions.status.title', 'Extension Status')}
      topbar={
        <Topbar>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Icons name='IconActivity' className='w-4 h-4 text-slate-600' />
              <span className='text-sm text-slate-600'>
                {activeExtensions}/{totalExtensions} Active
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-slate-600'>Health</span>
              <Progress value={healthPercentage} className='w-20' />
              <span className='text-sm text-slate-600'>{Math.round(healthPercentage)}%</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Tooltip content={autoRefresh ? 'Disable auto-refresh' : 'Enable auto-refresh'}>
              <Button
                size='sm'
                variant={autoRefresh ? 'primary' : 'outline-slate'}
                icon={autoRefresh ? 'IconPlayerPause' : 'IconPlayerPlay'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              />
            </Tooltip>
            <Button
              size='sm'
              variant='outline-slate'
              icon='IconRefresh'
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        </Topbar>
      }
    >
      <div className='w-full'>
        {/* Status Summary Cards */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-2xl font-bold text-green-600'>{statusSummary.active || 0}</p>
                  <p className='text-sm text-slate-600'>Active</p>
                </div>
                <div className='w-10 h-10 rounded-full bg-green-100 flex items-center justify-center'>
                  <Icons name='IconCheck' className='w-5 h-5 text-green-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-2xl font-bold text-yellow-600'>
                    {statusSummary.inactive || 0}
                  </p>
                  <p className='text-sm text-slate-600'>Inactive</p>
                </div>
                <div className='w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center'>
                  <Icons name='IconClock' className='w-5 h-5 text-yellow-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-2xl font-bold text-red-600'>{statusSummary.error || 0}</p>
                  <p className='text-sm text-slate-600'>Error</p>
                </div>
                <div className='w-10 h-10 rounded-full bg-red-100 flex items-center justify-center'>
                  <Icons name='IconX' className='w-5 h-5 text-red-600' />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-2xl font-bold text-blue-600'>{totalExtensions}</p>
                  <p className='text-sm text-slate-600'>Total</p>
                </div>
                <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
                  <Icons name='IconPackage' className='w-5 h-5 text-blue-600' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Extension Status List */}
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg text-slate-600'>Loading extension status...</div>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden'>
            <div className='px-6 py-4 border-b border-slate-200'>
              <h2 className='text-lg font-semibold'>Extension Status Details</h2>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-slate-200'>
                <thead className='bg-slate-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                      Extension
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                      Group / Type
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                      Uptime
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
                      Error
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-slate-200'>
                  {Object.entries(status || {}).map(([name, extStatus]) => {
                    const metadata = getExtensionMetadata(name);
                    return (
                      <tr key={name} className='hover:bg-slate-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3'>
                              <Icons name='IconPackage' className='w-4 h-4 text-slate-600' />
                            </div>
                            <div>
                              <div className='font-medium text-slate-900'>{name}</div>
                              {metadata?.version && (
                                <div className='text-xs text-slate-500'>v{metadata.version}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <Badge variant={getStatusColor(extStatus?.status)}>
                            {extStatus.status}
                          </Badge>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex flex-col gap-1'>
                            {metadata && (
                              <>
                                <Badge variant='outline' className='text-xs w-fit'>
                                  {metadata.group}
                                </Badge>
                                <Badge variant='outline' className='text-xs w-fit'>
                                  {metadata.type}
                                </Badge>
                              </>
                            )}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-slate-600'>
                          {getUptimeDisplay(extStatus.uptime)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {extStatus.error ? (
                            <Tooltip content={extStatus.error}>
                              <div className='flex items-center text-red-600'>
                                <Icons name='IconAlertTriangle' className='w-4 h-4 mr-1' />
                                <span className='truncate max-w-32'>{extStatus.error}</span>
                              </div>
                            </Tooltip>
                          ) : (
                            <span className='text-slate-400'>-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {Object.keys(status || {}).length === 0 && !isLoading && (
          <div className='text-center py-12'>
            <Icons name='IconPackage' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-slate-600 mb-2'>No Extension Status Data</h3>
            <p className='text-slate-500'>
              Extension status information is not available at the moment.
            </p>
          </div>
        )}
      </div>
    </Page>
  );
};
