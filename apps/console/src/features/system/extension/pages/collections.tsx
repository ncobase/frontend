import { useState, useMemo } from 'react';

import {
  Button,
  Badge,
  Icons,
  Alert,
  AlertDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

import { useMetricsCollections, useCollectionData, useQueryMetrics } from '../service';

import { Page, Topbar } from '@/components/layout';
import { Search } from '@/components/search/search';

export const ExtensionCollectionsPage = () => {
  const { t } = useTranslation();
  const { data: collections, isLoading, error, refetch } = useMetricsCollections();

  const queryMetricsMutation = useQueryMetrics();

  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [metricType, setMetricType] = useState('');
  const [timeRange, setTimeRange] = useState('1h');
  const [activeTab, setActiveTab] = useState('overview');

  // Use collection data hook for selected collection
  const { data: collectionData, isLoading: collectionLoading } = useCollectionData(
    selectedCollection,
    !!selectedCollection
  );

  // Filter collections based on search
  const filteredCollections = useMemo(() => {
    if (!collections?.collections) return [];

    return collections.collections.filter(collection =>
      collection.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections?.collections, searchTerm]);

  // Get metric types from selected collection
  const metricTypes = useMemo(() => {
    if (!collectionData?.metrics) return [];

    const types = [...new Set(collectionData.metrics.map(metric => metric.type))];
    return types;
  }, [collectionData?.metrics]);

  // Filter metrics by type
  const filteredMetrics = useMemo(() => {
    if (!collectionData?.metrics) return [];

    return collectionData.metrics.filter(metric => {
      const matchesType = !metricType || metric.type === metricType;
      return matchesType;
    });
  }, [collectionData?.metrics, metricType]);

  // Prepare chart data for metrics timeline
  const timelineData = useMemo(() => {
    if (!filteredMetrics.length) return [];

    return filteredMetrics
      .map(metric => ({
        name: metric.name,
        value: typeof metric.value === 'number' ? metric.value : 0,
        timestamp: new Date(metric.timestamp).getTime(),
        type: metric.type,
        unit: metric.unit || ''
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [filteredMetrics]);

  // Handle collection selection
  const handleCollectionSelect = (collection: string) => {
    if (collection === 'all') {
      setSelectedCollection('');
    } else {
      setSelectedCollection(collection);
      setMetricType(''); // Reset metric type filter
    }
  };

  // Handle metric type filter
  const handleMetricTypeSelect = (type: string) => {
    if (type === 'all') {
      setMetricType('');
    } else {
      setMetricType(type);
    }
  };

  // Query historical data
  const handleQueryHistorical = () => {
    if (!selectedCollection) return;

    const now = new Date();
    const start = new Date(now.getTime() - getTimeRangeMs(timeRange));

    queryMetricsMutation.mutate({
      collection: selectedCollection,
      start: start.toISOString(),
      end: now.toISOString()
    });
  };

  if (error) {
    return (
      <Page title={t('extensions.collections.title', 'Metrics Collections')}>
        <Alert variant='destructive'>
          <Icons name='IconAlertTriangle' className='w-4 h-4' />
          <AlertDescription>
            Failed to load collections. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </Page>
    );
  }

  // handle collection switch
  const handleCollectionSwitch = (collection: string) => {
    if (collection === selectedCollection) return;
    setActiveTab('details');
    setSelectedCollection(collection);
  };

  return (
    <Page
      title={t('extensions.collections.title', 'Metrics Collections')}
      topbar={
        <Topbar>
          <div className='flex items-center gap-4'>
            <Search
              placeholder='Search collections...'
              value={searchTerm}
              fieldClassName='border-slate-200/60 focus:border-primary-600 py-2'
              onSearch={setSearchTerm}
            />
            <Select value={selectedCollection} onValueChange={handleCollectionSelect}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Select Collection' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Collections</SelectItem>
                {filteredCollections.map(collection => (
                  <SelectItem key={collection} value={collection}>
                    {collection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCollection && metricTypes.length > 0 && (
              <Select value={metricType} onValueChange={handleMetricTypeSelect}>
                <SelectTrigger className='w-32'>
                  <SelectValue placeholder='All Types' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Types</SelectItem>
                  {metricTypes.map((type: any) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className='w-24'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1h'>1H</SelectItem>
                <SelectItem value='6h'>6H</SelectItem>
                <SelectItem value='24h'>24H</SelectItem>
                <SelectItem value='7d'>7D</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <div className='text-sm text-slate-600'>
              {collections?.collections?.length || 0} collections
            </div>
            <Button
              onClick={() => refetch()}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={isLoading}
              size='sm'
            >
              Refresh
            </Button>
            {selectedCollection && (
              <Button
                onClick={handleQueryHistorical}
                variant='primary'
                icon='IconSearch'
                loading={queryMetricsMutation.isPending}
                size='sm'
              >
                Query Historical
              </Button>
            )}
          </div>
        </Topbar>
      }
    >
      <div className='w-full space-y-6'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg text-slate-600'>Loading collections...</div>
          </div>
        ) : (
          <Tabs
            defaultValue='overview'
            className='w-full'
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className='grid w-full grid-cols-3 gap-2 p-1 bg-slate-50 rounded-xl'>
              <TabsTrigger
                value='overview'
                className='rounded-lg data-[state=active]:bg-white shadow-none! border-none!'
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value='details'
                className='rounded-lg data-[state=active]:bg-white shadow-none! border-none!'
              >
                Collection Details
              </TabsTrigger>
              <TabsTrigger
                value='timeline'
                className='rounded-lg data-[state=active]:bg-white shadow-none! border-none!'
              >
                Timeline View
              </TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-6'>
              {/* Collections Overview */}
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {filteredCollections.map(collection => {
                  const details = collections?.details?.[collection];
                  return (
                    <Card
                      key={collection}
                      className={`cursor-pointer border border-slate-200/60 hover:border-primary-100 hover:shadow-sm transition-all duration-200 ${
                        selectedCollection === collection
                          ? 'border-primary-500 bg-primary-50/30'
                          : ''
                      }`}
                      onClick={() => handleCollectionSwitch(collection)}
                    >
                      <CardHeader className='pb-3'>
                        <div className='flex items-start justify-between'>
                          <CardTitle className='text-base font-medium'>{collection}</CardTitle>
                          <Badge variant='outline' className='text-xs'>
                            {details?.metric_count || 0} metrics
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className='space-y-3'>
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-slate-600'>Last Updated:</span>
                          <span className='font-medium'>
                            {details?.last_updated
                              ? new Date(details.last_updated).toLocaleString()
                              : 'N/A'}
                          </span>
                        </div>
                        {selectedCollection === collection && (
                          <div className='pt-2 border-t border-slate-200/60'>
                            <div className='flex items-center gap-1 text-xs text-primary-600'>
                              <Icons name='IconCheck' className='w-3 h-3' />
                              <span>Selected</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredCollections.length === 0 && (
                <div className='text-center py-12'>
                  <Icons name='IconPackage' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-slate-600 mb-2'>No Collections Found</h3>
                  <p className='text-slate-500'>
                    {searchTerm
                      ? 'Try adjusting your search terms.'
                      : 'No metric collections are available.'}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value='details' className='space-y-6'>
              {!selectedCollection ? (
                <div className='text-center py-12'>
                  <Icons name='IconSearch' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-slate-600 mb-2'>Select a Collection</h3>
                  <p className='text-slate-500'>
                    Choose a collection from the overview to view its details.
                  </p>
                </div>
              ) : (
                <CollectionDetailsView
                  collection={selectedCollection}
                  data={collectionData}
                  isLoading={collectionLoading}
                  filteredMetrics={filteredMetrics}
                  metricTypes={metricTypes as string[]}
                />
              )}
            </TabsContent>

            <TabsContent value='timeline' className='space-y-6'>
              {!selectedCollection ? (
                <div className='text-center py-12'>
                  <Icons name='IconSearch' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
                  <h3 className='text-lg font-medium text-slate-600 mb-2'>Select a Collection</h3>
                  <p className='text-slate-500'>Choose a collection to view its timeline.</p>
                </div>
              ) : (
                <TimelineView
                  collection={selectedCollection}
                  timelineData={timelineData}
                  queryResult={queryMetricsMutation.data}
                  isQuerying={queryMetricsMutation.isPending}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Page>
  );
};

// Collection Details Component
const CollectionDetailsView = ({
  collection,
  data,
  isLoading,
  filteredMetrics,
  metricTypes
}: {
  collection: string;
  data: any;
  isLoading: boolean;
  filteredMetrics: any[];
  metricTypes: string[];
}) => {
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-32'>
        <div className='text-lg text-slate-600'>Loading collection data...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='text-center py-12'>
        <Icons name='IconAlertTriangle' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
        <h3 className='text-lg font-medium text-slate-600 mb-2'>No Data Available</h3>
        <p className='text-slate-500'>Unable to load data for collection: {collection}</p>
      </div>
    );
  }

  // Group metrics by type for better visualization
  const metricsByType = filteredMetrics.reduce(
    (acc, metric) => {
      if (!acc[metric.type]) acc[metric.type] = [];
      acc[metric.type].push(metric);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className='space-y-6'>
      {/* Collection Info */}
      <Card>
        <CardHeader>
          <CardTitle>Collection: {collection}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-2xl font-bold text-blue-600'>{data.metrics?.length || 0}</div>
              <div className='text-slate-600'>Total Metrics</div>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600'>{metricTypes.length}</div>
              <div className='text-slate-600'>Metric Types</div>
            </div>
            <div className='text-center p-4 bg-slate-50 rounded-lg'>
              <div className='text-2xl font-bold text-orange-600'>
                {data.last_updated ? new Date(data.last_updated).toLocaleDateString() : 'N/A'}
              </div>
              <div className='text-slate-600'>Last Updated</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics by Type */}
      {Object.entries(metricsByType).map(([type, metrics]) => (
        <Card key={type}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='capitalize'>{type} Metrics</CardTitle>
              <Badge variant='outline'>{(metrics as any)?.length} items</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-slate-200/60'>
                <thead className='bg-slate-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Name
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Value
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Unit
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Labels
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-slate-200/60'>
                  {((metrics as any) || []).map((metric, index) => (
                    <tr key={`${metric.name}-${index}`} className='hover:bg-slate-50'>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <div className='font-medium'>{metric.name}</div>
                        {metric.help && <div className='text-sm text-slate-500'>{metric.help}</div>}
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <span className='font-mono text-sm'>{formatMetricValue(metric.value)}</span>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap text-slate-600'>
                        {metric.unit || '-'}
                      </td>
                      <td className='px-4 py-4'>
                        {metric.labels && Object.keys(metric.labels).length > 0 ? (
                          <div className='flex flex-wrap gap-1'>
                            {Object.entries(metric.labels).map(([key, value]) => (
                              <Badge key={key} variant='outline' className='text-xs'>
                                {key}={value as string}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className='text-slate-400'>-</span>
                        )}
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap text-slate-600'>
                        {new Date(metric.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredMetrics.length === 0 && (
        <div className='text-center py-12'>
          <Icons name='IconPackage' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
          <h3 className='text-lg font-medium text-slate-600 mb-2'>No Metrics Found</h3>
          <p className='text-slate-500'>No metrics match the current filters.</p>
        </div>
      )}
    </div>
  );
};

// Timeline View Component
const TimelineView = ({
  collection,
  timelineData,
  queryResult,
  isQuerying
}: {
  collection: string;
  timelineData: any[];
  queryResult: any;
  isQuerying: boolean;
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Prepare data for charts
  const chartData = useMemo(() => {
    const data = queryResult?.data || timelineData;
    if (!data.length) return [];

    // Group by time intervals (e.g., by minute or hour)
    const grouped = data.reduce(
      (acc, item) => {
        const time = new Date(item.timestamp || Date.now());
        const timeKey = time.toISOString().slice(0, 16); // Group by minute

        if (!acc[timeKey]) {
          acc[timeKey] = {
            time: timeKey,
            timestamp: time.getTime(),
            metrics: {}
          };
        }

        acc[timeKey].metrics[item.name] = item.value;
        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(grouped).sort((a: any, b: any) => a.timestamp - b.timestamp);
  }, [timelineData, queryResult]);

  // Get unique metric names for legend
  const metricNames = useMemo(() => {
    const names = new Set<string>();
    chartData.forEach((item: any) => {
      Object.keys(item.metrics).forEach(name => names.add(name));
    });
    return Array.from(names);
  }, [chartData]);

  // Color palette for different metrics
  const colors = [
    '#4285F4',
    '#34A853',
    '#EA4335',
    '#FBBC05',
    '#9C27B0',
    '#00ACC1',
    '#FF7043',
    '#8BC34A'
  ];

  return (
    <div className='space-y-6'>
      {/* Timeline Controls */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Timeline: {collection}</CardTitle>
            <div className='flex items-center gap-2'>
              <Select
                value={chartType}
                onValueChange={(value: 'line' | 'bar') => setChartType(value)}
              >
                <SelectTrigger className='w-24'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='line'>Line</SelectItem>
                  <SelectItem value='bar'>Bar</SelectItem>
                </SelectContent>
              </Select>
              {isQuerying && (
                <Badge variant='outline' className='animate-pulse'>
                  Querying...
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className='text-center py-12'>
              <Icons name='IconTrendingUp' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-slate-600 mb-2'>No Timeline Data</h3>
              <p className='text-slate-500'>
                {isQuerying
                  ? 'Loading historical data...'
                  : 'No timeline data available for this collection.'}
              </p>
            </div>
          ) : (
            <div className='h-80'>
              <ResponsiveContainer width='100%' height='100%'>
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='time'
                      tickFormatter={time => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={time => new Date(time).toLocaleString()}
                      formatter={(value, name) => [formatMetricValue(value), name]}
                    />
                    <Legend />
                    {metricNames.slice(0, 8).map((name, index) => (
                      <Line
                        key={name}
                        type='monotone'
                        dataKey={`metrics.${name}`}
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={false}
                        connectNulls={false}
                        name={name}
                      />
                    ))}
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='time'
                      tickFormatter={time => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={time => new Date(time).toLocaleString()}
                      formatter={(value, name) => [formatMetricValue(value), name]}
                    />
                    <Legend />
                    {metricNames.slice(0, 4).map((name, index) => (
                      <Bar
                        key={name}
                        dataKey={`metrics.${name}`}
                        fill={colors[index % colors.length]}
                        name={name}
                        radius={[2, 2, 0, 0]}
                      />
                    ))}
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Results Summary */}
      {queryResult && (
        <Card>
          <CardHeader>
            <CardTitle>Query Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid md:grid-cols-4 gap-4'>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>{queryResult.count || 0}</div>
                <div className='text-slate-600'>Total Records</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {queryResult.start ? new Date(queryResult.start).toLocaleDateString() : 'N/A'}
                </div>
                <div className='text-slate-600'>Start Date</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-orange-600'>
                  {queryResult.end ? new Date(queryResult.end).toLocaleDateString() : 'N/A'}
                </div>
                <div className='text-slate-600'>End Date</div>
              </div>
              <div className='text-center p-4 bg-slate-50 rounded-lg'>
                <div className='text-2xl font-bold text-purple-600'>
                  {queryResult.collection || collection}
                </div>
                <div className='text-slate-600'>Collection</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Metrics Table */}
      {timelineData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-slate-200/60'>
                <thead className='bg-slate-50'>
                  <tr>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Metric Name
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Value
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Type
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Unit
                    </th>
                    <th className='px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase'>
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-slate-200/60'>
                  {timelineData.slice(0, 10).map((metric, index) => (
                    <tr key={index} className='hover:bg-slate-50'>
                      <td className='px-4 py-4 whitespace-nowrap font-medium'>{metric.name}</td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <span className='font-mono text-sm'>{formatMetricValue(metric.value)}</span>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap'>
                        <Badge variant='outline' className='text-xs'>
                          {metric.type}
                        </Badge>
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap text-slate-600'>
                        {metric.unit || '-'}
                      </td>
                      <td className='px-4 py-4 whitespace-nowrap text-slate-600'>
                        {new Date(metric.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper functions
const formatMetricValue = (value: any): string => {
  if (typeof value === 'number') {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(2) + 'K';
    } else if (value % 1 === 0) {
      return value.toString();
    } else {
      return value.toFixed(2);
    }
  }
  return String(value);
};

const getTimeRangeMs = (range: string): number => {
  switch (range) {
    case '1h':
      return 60 * 60 * 1000;
    case '6h':
      return 6 * 60 * 60 * 1000;
    case '24h':
      return 24 * 60 * 60 * 1000;
    case '7d':
      return 7 * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
};
