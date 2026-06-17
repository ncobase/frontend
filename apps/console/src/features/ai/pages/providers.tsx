import { Button, Icons, Badge } from '@ncobase/react';

import { AIInlineState, KeyValueGrid, formatTimestamp } from '../components/shared';
import { useAIHealth, useAIModels, useAIStatus } from '../service';

import { Page, Topbar } from '@/components/layout';
import { usePermissions } from '@/features/account/permissions';

export const AIProvidersPage = () => {
  const { canAccess } = usePermissions();
  const canManage = canAccess({ permissions: ['manage:ai', 'admin:ai'], any: true });
  const statusQuery = useAIStatus();
  const modelsQuery = useAIModels(undefined, !!statusQuery.data?.ready);
  const healthQuery = useAIHealth(canManage && !!statusQuery.data?.ready);

  const refresh = () => {
    statusQuery.refetch();
    modelsQuery.refetch();
    if (canManage) healthQuery.refetch();
  };

  const healthByName = new Map((healthQuery.data || []).map(item => [item.name, item]));

  return (
    <Page
      sidebar
      title='AI Providers'
      topbar={
        <Topbar
          title='AI Providers'
          right={[
            <Button key='refresh' variant='outline-slate' size='sm' onClick={refresh}>
              <Icons name='IconRefresh' className='mr-1 h-4 w-4' />
              Refresh
            </Button>
          ]}
        />
      }
    >
      <div className='space-y-6 p-6'>
        {statusQuery.isLoading ? (
          <AIInlineState type='loading' title='Loading providers...' />
        ) : statusQuery.isError ? (
          <AIInlineState
            type='error'
            title='Unable to load provider configuration'
            description='Check AI read permissions and retry.'
            onRetry={() => statusQuery.refetch()}
          />
        ) : (
          <>
            <section className='rounded-lg border bg-white p-4'>
              <KeyValueGrid
                items={[
                  { label: 'Enabled', value: statusQuery.data?.enabled ? 'Yes' : 'No' },
                  { label: 'Ready', value: statusQuery.data?.ready ? 'Yes' : 'No' },
                  { label: 'Primary model', value: statusQuery.data?.primary },
                  { label: 'Embedding model', value: statusQuery.data?.embedding_model },
                  {
                    label: 'Fallbacks',
                    value: statusQuery.data?.fallbacks?.length
                      ? statusQuery.data.fallbacks.join(', ')
                      : '-'
                  },
                  {
                    label: 'Allowed provider types',
                    value: statusQuery.data?.policy?.allowed_provider_types?.join(', ')
                  }
                ]}
              />
            </section>

            <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
              {(statusQuery.data?.providers || []).map(provider => {
                const health = healthByName.get(provider.name);
                const models = modelsQuery.data?.[provider.name] || [];
                return (
                  <section key={provider.name} className='rounded-lg border bg-white'>
                    <div className='flex flex-wrap items-start justify-between gap-3 border-b px-4 py-3'>
                      <div>
                        <h2 className='text-base font-semibold text-slate-900'>{provider.name}</h2>
                        <p className='text-sm text-slate-500'>{provider.type}</p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        <Badge variant={provider.enabled ? 'outline-success' : 'outline-slate'}>
                          {provider.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                        <Badge
                          variant={provider.configured ? 'outline-success' : 'outline-warning'}
                        >
                          {provider.configured ? 'Configured' : 'Missing secrets'}
                        </Badge>
                        {canManage && health && (
                          <Badge variant={health.healthy ? 'outline-success' : 'outline-danger'}>
                            {health.healthy ? 'Healthy' : 'Unhealthy'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className='space-y-4 p-4'>
                      <KeyValueGrid
                        items={[
                          { label: 'Base URL', value: provider.base_url },
                          { label: 'API mode', value: provider.api_mode },
                          {
                            label: 'Auth support',
                            value: provider.supports_authentication ? 'Yes' : 'No'
                          },
                          {
                            label: 'Health checked',
                            value: health ? formatTimestamp(health.checked_at) : '-'
                          }
                        ]}
                      />

                      {health?.error && (
                        <div className='rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
                          {health.error}
                        </div>
                      )}

                      <div>
                        <h3 className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
                          Server-side secrets
                        </h3>
                        {(provider.secrets || []).length === 0 ? (
                          <p className='text-sm text-slate-500'>
                            No secret environment variable is required.
                          </p>
                        ) : (
                          <div className='space-y-2'>
                            {(provider.secrets || []).map(secret => (
                              <div
                                key={`${secret.name}:${secret.env}`}
                                className='flex items-center justify-between gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm'
                              >
                                <span>
                                  <span className='font-medium text-slate-800'>{secret.name}</span>
                                  <span className='ml-2 font-mono text-xs text-slate-500'>
                                    {secret.env}
                                  </span>
                                </span>
                                <Badge
                                  variant={secret.present ? 'outline-success' : 'outline-danger'}
                                  size='xs'
                                >
                                  {secret.present ? 'Present' : 'Missing'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
                          Models
                        </h3>
                        {!statusQuery.data?.ready ? (
                          <p className='text-sm text-slate-500'>
                            Models are available after the runtime is ready.
                          </p>
                        ) : modelsQuery.isLoading ? (
                          <p className='text-sm text-slate-500'>Loading models...</p>
                        ) : models.length === 0 ? (
                          <p className='text-sm text-slate-500'>
                            No models returned by the provider.
                          </p>
                        ) : (
                          <div className='flex flex-wrap gap-2'>
                            {models.slice(0, 20).map(model => (
                              <Badge key={model} variant='outline-slate' size='xs'>
                                {model}
                              </Badge>
                            ))}
                            {models.length > 20 && (
                              <Badge variant='outline-slate' size='xs'>
                                +{models.length - 20}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Page>
  );
};
