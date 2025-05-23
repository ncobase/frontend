import { useState, useEffect } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TableView
} from '@ncobase/react';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

import { Page, Topbar } from '@/components/layout';

const useMockData = (delay = 1500, shouldError = false) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (shouldError) {
        setError(new Error(t('example.loading.states.unknownError')));
        setLoading(false);
      } else {
        const mockData = Array(10)
          .fill(0)
          .map((_, index) => ({
            id: index + 1,
            name: `${t('example.project')} ${index + 1}`,
            status: [t('example.active'), t('example.completed'), t('example.paused')][
              Math.floor(Math.random() * 3)
            ],
            progress: Math.floor(Math.random() * 100),
            updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          }));

        setData(mockData);
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, shouldError]);

  return { data, loading, error };
};

const LoadingState = ({ message = t('example.loading.states.loading'), type = 'spinner' }) => {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      {type === 'spinner' && (
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4'></div>
      )}

      {type === 'skeleton' && (
        <div className='space-y-2 w-full max-w-md'>
          <div className='h-4 bg-slate-200 rounded-sm w-3/4 animate-pulse'></div>
          <div className='h-4 bg-slate-200 rounded-sm animate-pulse'></div>
          <div className='h-4 bg-slate-200 rounded-sm w-5/6 animate-pulse'></div>
        </div>
      )}

      {type === 'progress' && (
        <div className='w-full max-w-md mb-4'>
          <div className='w-full bg-slate-200 rounded-full h-2.5'>
            <div className='bg-primary-500 h-2.5 rounded-full w-[45%] animate-[progress_2s_ease-in-out_infinite]'></div>
          </div>
        </div>
      )}

      <p className='text-slate-600'>{message}</p>
    </div>
  );
};

const ErrorState = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
        <Icons name='IconExclamationMark' className='text-red-500' size={24} />
      </div>
      <p className='text-slate-800 font-medium mb-2'>{t('example.loading.states.error')}</p>
      <p className='text-slate-600 mb-4'>
        {error.message || t('example.loading.states.unknownError')}
      </p>
      {onRetry && (
        <Button variant='primary' onClick={onRetry}>
          <Icons name='IconRefresh' className='mr-2' />
          {t('example.loading.reload')}
        </Button>
      )}
    </div>
  );
};

const EmptyState = ({
  message = t('example.loading.states.empty'),
  actionText = t('example.loading.states.createProject'),
  onAction
}) => {
  return (
    <div className='flex flex-col items-center justify-center py-12'>
      <div className='w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4'>
        <Icons name='IconInbox' className='text-slate-400' size={24} />
      </div>
      <p className='text-slate-600 mb-4'>{message}</p>
      {onAction && (
        <Button variant='primary' onClick={onAction}>
          <Icons name='IconPlus' className='mr-2' />
          {actionText}
        </Button>
      )}
    </div>
  );
};

const TableSkeleton = ({ rowCount = 5, columnCount = 4 }) => {
  return (
    <div className='animate-pulse'>
      <div className='grid grid-cols-4 gap-4 p-4 border-b border-slate-200'>
        {Array(columnCount)
          .fill(0)
          .map((_, i) => (
            <div key={`header-${i}`} className='h-6 bg-slate-200 rounded-sm'></div>
          ))}
      </div>

      {Array(rowCount)
        .fill(0)
        .map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className='grid grid-cols-4 gap-4 p-4 border-b border-slate-100'
          >
            {Array(columnCount)
              .fill(0)
              .map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`h-6 bg-slate-200 rounded-sm ${colIndex === 0 ? 'w-1/2' : 'w-3/4'}`}
                ></div>
              ))}
          </div>
        ))}
    </div>
  );
};

const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className='bg-white rounded-lg shadow-xs border border-slate-200 p-4 animate-pulse'
          >
            <div className='h-6 bg-slate-200 rounded-sm w-3/4 mb-4'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-slate-200 rounded-sm'></div>
              <div className='h-4 bg-slate-200 rounded-sm w-5/6'></div>
              <div className='h-4 bg-slate-200 rounded-sm w-4/6'></div>
            </div>
            <div className='mt-4 pt-4 border-t border-slate-100 flex justify-end'>
              <div className='h-8 bg-slate-200 rounded-sm w-24'></div>
            </div>
          </div>
        ))}
    </div>
  );
};

export const LoadingStatesExample = () => {
  const { t } = useTranslation();
  const [loadingDelay, setLoadingDelay] = useState(1500);
  const [shouldError, setShouldError] = useState(false);
  const [_resetKey, setResetKey] = useState(0);
  const [loadingType, setLoadingType] = useState('table');

  const { data, loading, error } = useMockData(loadingDelay, shouldError);

  const handleRetry = () => {
    setResetKey(prev => prev + 1);
    setShouldError(false);
  };

  const triggerError = () => {
    setShouldError(true);
    setResetKey(prev => prev + 1);
  };

  const topbarElement = {
    title: t('example.loading.title'),
    right: [
      <div className='flex items-center gap-x-2'>
        <span>{t('example.loading.loadingDelay')}:</span>
        <Select
          value={loadingDelay.toString()}
          onValueChange={value => setLoadingDelay(parseInt(value))}
        >
          <SelectTrigger className='w-[120px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='500'>0.5 {t('second')}</SelectItem>
            <SelectItem value='1500'>1.5 {t('second')}</SelectItem>
            <SelectItem value='3000'>3 {t('second')}</SelectItem>
            <SelectItem value='5000'>5 {t('second')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ]
  };

  const topbar = <Topbar {...topbarElement} />;

  return (
    <Page sidebar topbar={topbar}>
      <div className='p-4 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-lg font-normal'>{t('example.loading.heading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <p>{t('example.loading.description')}</p>

              <div className='flex flex-wrap gap-2'>
                <Button
                  variant={loadingType === 'table' ? 'primary' : 'outline-slate'}
                  onClick={() => setLoadingType('table')}
                >
                  {t('example.loading.loadingTypes.table')}
                </Button>
                <Button
                  variant={loadingType === 'cards' ? 'primary' : 'outline-slate'}
                  onClick={() => setLoadingType('cards')}
                >
                  {t('example.loading.loadingTypes.cards')}
                </Button>
                <Button
                  variant={loadingType === 'custom' ? 'primary' : 'outline-slate'}
                  onClick={() => setLoadingType('custom')}
                >
                  {t('example.loading.loadingTypes.custom')}
                </Button>
                <Button variant='outline-danger' onClick={triggerError}>
                  <Icons name='IconAlertTriangle' className='mr-2' />
                  {t('example.loading.simulateError')}
                </Button>
                <Button
                  variant='outline-primary'
                  onClick={() => {
                    setResetKey(prev => prev + 1);
                  }}
                >
                  <Icons name='IconRefresh' className='mr-2' />
                  {t('example.loading.reload')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {loadingType === 'table' && (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-normal'>
                {t('example.loading.tableLoading')}
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              {loading && <TableSkeleton rowCount={5} columnCount={4} />}

              {!loading && error && <ErrorState error={error} onRetry={handleRetry} />}

              {!loading && !error && data.length === 0 && (
                <EmptyState
                  message={t('example.loading.states.noProjects')}
                  actionText={t('example.loading.states.createProject')}
                  onAction={() => console.log('create project')}
                />
              )}

              {!loading && !error && data.length > 0 && (
                <TableView
                  data={data}
                  header={[
                    { title: 'ID', accessorKey: 'id' },
                    { title: t('example.name'), accessorKey: 'name' },
                    {
                      title: t('example.status'),
                      accessorKey: 'status',
                      parser: value => {
                        const colorMap = {
                          [t('example.active')]: 'bg-green-100 text-green-800',
                          [t('example.completed')]: 'bg-blue-100 text-blue-800',
                          [t('example.paused')]: 'bg-yellow-100 text-yellow-800'
                        };
                        return (
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full ${colorMap[value] || ''}`}
                          >
                            {value}
                          </span>
                        );
                      }
                    },
                    {
                      title: t('example.progress'),
                      accessorKey: 'progress',
                      parser: value => (
                        <div className='w-full bg-slate-200 rounded-full h-2.5'>
                          <div
                            className='bg-blue-600 h-2.5 rounded-full'
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      )
                    },
                    {
                      title: t('example.i18n.operations'),
                      accessorKey: 'operation-column',
                      actions: [
                        {
                          title: t('actions.view'),
                          icon: 'IconEye',
                          onClick: () => console.log('view')
                        },
                        {
                          title: t('actions.edit'),
                          icon: 'IconPencil',
                          onClick: () => console.log('edit')
                        },
                        {
                          title: t('actions.delete'),
                          icon: 'IconTrash',
                          onClick: () => console.log('delete')
                        }
                      ]
                    }
                  ]}
                />
              )}
            </CardContent>
          </Card>
        )}

        {loadingType === 'cards' && (
          <div>
            {loading && <CardSkeleton count={8} />}

            {!loading && error && (
              <Card>
                <CardContent>
                  <ErrorState error={error} onRetry={handleRetry} />
                </CardContent>
              </Card>
            )}

            {!loading && !error && data.length === 0 && (
              <Card>
                <CardContent>
                  <EmptyState
                    message={t('example.loading.states.noProjects')}
                    actionText={t('example.loading.states.createProject')}
                    onAction={() => console.log('create project')}
                  />
                </CardContent>
              </Card>
            )}

            {!loading && !error && data.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {data.map(item => (
                  <Card key={item.id} className='flex flex-col'>
                    <CardHeader>
                      <CardTitle className='text-lg font-normal flex justify-between items-center'>
                        <span>{item.name}</span>
                        <span
                          className={`
                          px-2 py-0.5 rounded-full
                          ${item.status === t('example.active') ? 'bg-green-100 text-green-800' : ''}
                          ${item.status === t('example.completed') ? 'bg-blue-100 text-blue-800' : ''}
                          ${item.status === t('example.paused') ? 'bg-yellow-100 text-yellow-800' : ''}
                        `}
                        >
                          {item.status}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='flex-1'>
                      <div className='space-y-4'>
                        <div>
                          <div className='text-slate-500 mb-1'>{t('example.progress')}</div>
                          <div className='w-full bg-slate-200 rounded-full h-2.5'>
                            <div
                              className='bg-blue-600 h-2.5 rounded-full'
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <div className='text-right text-slate-500 mt-1'>{item.progress}%</div>
                        </div>

                        <div>
                          <div className='text-slate-500'>{t('example.lastUpdated')}</div>
                          <div>{item.updatedAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                    <div className='p-4 mt-auto border-t border-slate-100 flex justify-end space-x-2'>
                      <Button variant='outline-slate' size='sm'>
                        <Icons name='IconEye' size={14} />
                      </Button>
                      <Button variant='outline-primary' size='sm'>
                        <Icons name='IconPencil' size={14} />
                      </Button>
                      <Button variant='outline-danger' size='sm'>
                        <Icons name='IconTrash' size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {loadingType === 'custom' && (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-normal'>
                {t('example.loading.customLoading')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        {t('example.loading.loadingTypes.spinner')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LoadingState
                        type='spinner'
                        message={t('example.loading.states.loadingMessage')}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        {t('example.loading.loadingTypes.progress')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LoadingState
                        type='progress'
                        message={t('example.loading.states.processingData')}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        {t('example.loading.loadingTypes.skeleton')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LoadingState
                        type='skeleton'
                        message={t('example.loading.states.preparingContent')}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className='border-t border-slate-200 pt-4'>
                  {loading && (
                    <div className='text-center py-12'>
                      <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2'></div>
                      <div className='text-primary-600 font-medium'>
                        {t('example.loading.states.loadingMessage')}
                      </div>
                      <div className='text-slate-500'>
                        {t('example.loading.states.estimatedTime', {
                          seconds: Math.ceil(loadingDelay / 1000)
                        })}
                      </div>
                      <div className='w-64 mt-4 mx-auto bg-slate-200 rounded-full h-1'>
                        <div className='bg-primary-500 h-1 rounded-full animate-[progress_2s_ease-in-out_infinite]'></div>
                      </div>
                    </div>
                  )}

                  {!loading && error && <ErrorState error={error} onRetry={handleRetry} />}

                  {!loading && !error && data.length === 0 && (
                    <EmptyState
                      message={t('example.loading.states.noProjects')}
                      actionText={t('example.loading.states.createProject')}
                      onAction={() => console.log('create project')}
                    />
                  )}

                  {!loading && !error && data.length > 0 && (
                    <div className='text-center py-8'>
                      <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <Icons name='IconCheck' className='text-green-500' size={24} />
                      </div>
                      <h3 className='text-lg font-medium text-green-600 mb-2'>
                        {t('example.loading.states.loadSuccess')}
                      </h3>
                      <p className='text-slate-600'>
                        {t('example.loading.states.loadedItems', { count: data.length })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Page>
  );
};
