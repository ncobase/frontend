import { useState, useMemo, useCallback } from 'react';

import {
  Button,
  Badge,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Modal,
  TableView,
  Tooltip,
  Alert,
  AlertDescription
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import { MetricCard, EmptyState } from '../components/shared';
import type { LatestMetricsResponse } from '../extension.d';
import {
  useHistoricalMetrics,
  useLatestMetrics,
  useStorageStats,
  useExtensionMetrics,
  useAutoRefresh
} from '../hooks';
import {
  formatValue,
  formatTimestamp,
  getTimeRangeOptions,
  getTimeRange,
  COLORS,
  debounce
} from '../utils';

import { Page, Topbar } from '@/components/layout';
import { Search } from '@/components/search/search';

// Collection interface
interface MetricCollection {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'extension' | 'performance' | 'events' | 'cache';
  metricCount: number;
  lastUpdated: string;
  size: string;
  dataPoints: number;
  avgValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  status: 'active' | 'inactive' | 'error';
  icon: string;
  color: string;
}

// Mock enhanced collections data with real API structure
const createMockCollections = (extensionMetrics: any): MetricCollection[] => [
  {
    id: 'system_performance',
    name: 'System Performance',
    description: 'CPU, memory, and runtime metrics',
    category: 'system',
    metricCount: 156,
    lastUpdated: new Date().toISOString(),
    size: '2.4MB',
    dataPoints: 1250,
    avgValue: 75.5,
    trend: 'stable',
    trendPercentage: 2.1,
    status: 'active',
    icon: 'IconCpu',
    color: COLORS.primary
  },
  {
    id: 'extension_lifecycle',
    name: 'Extension Lifecycle',
    description: 'Load times, initialization, and status changes',
    category: 'extension',
    metricCount: extensionMetrics ? Object.keys(extensionMetrics.extensions).length * 5 : 89,
    lastUpdated: new Date().toISOString(),
    size: '1.8MB',
    dataPoints: 890,
    avgValue: 92.3,
    trend: 'up',
    trendPercentage: 5.2,
    status: 'active',
    icon: 'IconPackage',
    color: COLORS.success
  },
  {
    id: 'service_calls',
    name: 'Service Calls',
    description: 'API calls, responses, and error rates',
    category: 'performance',
    metricCount: 234,
    lastUpdated: new Date().toISOString(),
    size: '3.1MB',
    dataPoints: 2340,
    avgValue: 87.8,
    trend: 'down',
    trendPercentage: 1.8,
    status: 'active',
    icon: 'IconActivity',
    color: COLORS.warning
  },
  {
    id: 'event_messaging',
    name: 'Event Messaging',
    description: 'Published, received, and failed events',
    category: 'events',
    metricCount: 178,
    lastUpdated: new Date().toISOString(),
    size: '2.8MB',
    dataPoints: 1780,
    avgValue: 94.1,
    trend: 'up',
    trendPercentage: 3.7,
    status: 'active',
    icon: 'IconBell',
    color: COLORS.purple
  },
  {
    id: 'cache_performance',
    name: 'Cache Performance',
    description: 'Hit rates, misses, and storage efficiency',
    category: 'cache',
    metricCount: 45,
    lastUpdated: new Date().toISOString(),
    size: '0.8MB',
    dataPoints: 450,
    avgValue: 81.2,
    trend: 'stable',
    trendPercentage: 0.5,
    status: 'active',
    icon: 'IconDatabase',
    color: COLORS.cyan
  },
  {
    id: 'error_tracking',
    name: 'Error Tracking',
    description: 'Circuit breakers, failures, and recovery',
    category: 'system',
    metricCount: 67,
    lastUpdated: new Date().toISOString(),
    size: '1.2MB',
    dataPoints: 670,
    avgValue: 98.5,
    trend: 'up',
    trendPercentage: 1.2,
    status: 'active',
    icon: 'IconAlertTriangle',
    color: COLORS.danger
  }
];

export const ExtensionCollectionsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Get initial state from navigation
  const initialCollection = location.state?.selectedCollection;

  // Auto-refresh control
  const autoRefresh = useAutoRefresh(true);

  // Data hooks
  const { data: extensionMetrics } = useExtensionMetrics(autoRefresh.enabled);
  const { data: _storageStats } = useStorageStats();
  const historicalMutation = useHistoricalMetrics();

  // Mock collections data
  const collections = useMemo(() => createMockCollections(extensionMetrics), [extensionMetrics]);

  // Local state
  const [selectedCollection, setSelectedCollection] = useState<MetricCollection | null>(
    initialCollection ? collections.find(c => c.id === initialCollection) || null : null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'updated' | 'metrics'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get latest metrics for selected collection
  const { data: latestMetrics } = useLatestMetrics(
    selectedCollection?.name?.toLowerCase() || '',
    100,
    !!selectedCollection
  );

  // Query parameters state
  const [queryParams, setQueryParams] = useState({
    metricType: '',
    aggregation: 'avg' as const,
    interval: '5m'
  });

  // Debounced search
  const debouncedSearch = useMemo(() => debounce((value: string) => setSearchTerm(value), 300), []);

  // Filter and sort collections
  const filteredCollections = useMemo(() => {
    const filtered = collections.filter(collection => {
      const matchesSearch =
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || collection.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Sort collections
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = parseFloat(a.size) - parseFloat(b.size);
          break;
        case 'updated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        case 'metrics':
          comparison = a.metricCount - b.metricCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [collections, searchTerm, categoryFilter, sortBy, sortOrder]);

  // Collection statistics
  const collectionStats = useMemo(() => {
    const totalMetrics = collections.reduce((sum, col) => sum + col.metricCount, 0);
    const totalSize = collections.reduce((sum, col) => sum + parseFloat(col.size), 0);
    const activeCollections = collections.filter(col => col.status === 'active').length;
    const avgPerformance =
      collections.reduce((sum, col) => sum + col.avgValue, 0) / collections.length;

    return {
      totalCollections: collections.length,
      totalMetrics,
      totalSize: totalSize.toFixed(1),
      activeCollections,
      avgPerformance: avgPerformance.toFixed(1)
    };
  }, [collections]);

  // Category distribution for charts
  const categoryDistribution = useMemo(() => {
    const distribution = collections.reduce(
      (acc, col) => {
        acc[col.category] = (acc[col.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(distribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color:
        COLORS[Object.keys(COLORS)[Object.keys(distribution).indexOf(name)] as keyof typeof COLORS]
    }));
  }, [collections]);

  // Performance trend data
  const performanceTrendData = useMemo(() => {
    return collections.map(col => ({
      name: col.name.split(' ')[0], // Short name for chart
      performance: col.avgValue,
      metrics: col.metricCount,
      size: parseFloat(col.size)
    }));
  }, [collections]);

  // Event handlers
  const handleCollectionSelect = (collection: MetricCollection) => {
    setSelectedCollection(collection);
    navigate('/system/extensions/collections', {
      state: { selectedCollection: collection.id }
    });
  };

  const handleQueryHistorical = useCallback(() => {
    if (!selectedCollection) return;

    const { start, end } = getTimeRange(timeRange);
    historicalMutation.mutate({
      extension: selectedCollection.name.toLowerCase(),
      metric_type: queryParams.metricType || undefined,
      start: start.toISOString(),
      end: end.toISOString(),
      aggregation: queryParams.aggregation,
      interval: queryParams.interval
    });
    setShowQueryModal(false);
  }, [selectedCollection, timeRange, queryParams, historicalMutation]);

  const handleExportData = useCallback(() => {
    if (!selectedCollection || !latestMetrics) return;

    const exportData = {
      collection: selectedCollection,
      metrics: latestMetrics.snapshots,
      exportedAt: new Date().toISOString(),
      timeRange
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCollection.name.toLowerCase().replace(/\s+/g, '_')}_metrics.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  }, [selectedCollection, latestMetrics, timeRange]);

  const getUniqueCategories = () => [...new Set(collections.map(col => col.category))];

  return (
    <Page
      title={t('extensions.collections.title', 'Metrics Collections')}
      topbar={
        <Topbar
          left={[
            <div className='flex items-center gap-4'>
              <Search
                placeholder='Search collections...'
                fieldClassName='border-slate-200/60 focus:border-primary-600 py-1.5 w-64'
                onSearch={debouncedSearch}
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-32 py-1.5'>
                  <SelectValue placeholder='Category' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  {getUniqueCategories().map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className='w-24 py-1.5'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='name'>Name</SelectItem>
                  <SelectItem value='size'>Size</SelectItem>
                  <SelectItem value='updated'>Updated</SelectItem>
                  <SelectItem value='metrics'>Metrics</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size='sm'
                variant='outline-slate'
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
              >
                <Icons name={sortOrder === 'asc' ? 'IconSortAscending' : 'IconSortDescending'} />
              </Button>
            </div>
          ]}
          right={[
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='text-xs'>
                {filteredCollections.length} collections
              </Badge>
              <Button
                size='sm'
                variant='outline-slate'
                onClick={() => setViewMode(prev => (prev === 'grid' ? 'table' : 'grid'))}
              >
                <Icons name={viewMode === 'grid' ? 'IconList' : 'IconGrid3x3'} />
              </Button>
              {selectedCollection && (
                <>
                  <Button
                    size='sm'
                    variant='outline-slate'
                    onClick={() => setShowQueryModal(true)}
                    icon='IconSearch'
                  >
                    Query
                  </Button>
                  <Button
                    size='sm'
                    variant='outline-slate'
                    onClick={() => setShowExportModal(true)}
                    icon='IconDownload'
                  >
                    Export
                  </Button>
                </>
              )}
              <Button
                size='sm'
                variant='outline-slate'
                onClick={() => autoRefresh.toggle()}
                icon='IconRefresh'
              >
                Refresh
              </Button>
            </div>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='w-full space-y-6'>
        {/* Overview Statistics */}
        <div className='grid md:grid-cols-5 gap-4'>
          <MetricCard
            title='Total Collections'
            value={collectionStats.totalCollections}
            icon='IconFolders'
            color={COLORS.primary}
            subtitle='Available collections'
          />
          <MetricCard
            title='Total Metrics'
            value={collectionStats.totalMetrics}
            icon='IconActivity'
            color={COLORS.success}
            subtitle='Across all collections'
          />
          <MetricCard
            title='Storage Size'
            value={collectionStats.totalSize}
            unit='MB'
            icon='IconServer'
            color={COLORS.warning}
            subtitle='Total data size'
          />
          <MetricCard
            title='Active Collections'
            value={collectionStats.activeCollections}
            icon='IconCheck'
            color={COLORS.emerald}
            subtitle='Currently collecting'
          />
          <MetricCard
            title='Avg Performance'
            value={collectionStats.avgPerformance}
            unit='%'
            icon='IconTarget'
            color={COLORS.purple}
            subtitle='Collection health'
          />
        </div>

        {/* Main Content */}
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Collections List */}
          <div className='lg:col-span-2 space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-slate-900'>Collections</h3>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-slate-600'>
                  Showing {filteredCollections.length} of {collections.length}
                </span>
              </div>
            </div>

            {/* Collections Grid/Table View */}
            {viewMode === 'grid' ? (
              <div className='grid gap-4 md:grid-cols-2'>
                {filteredCollections.map(collection => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    isSelected={selectedCollection?.id === collection.id}
                    onSelect={() => handleCollectionSelect(collection)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className='p-0'>
                  <TableView
                    pageSize={10}
                    visibleControl
                    header={[
                      {
                        title: 'Collection',
                        dataIndex: 'name',
                        parser: (_, record) => (
                          <div className='flex items-center gap-3'>
                            <div
                              className='w-8 h-8 rounded-lg flex items-center justify-center'
                              style={{ backgroundColor: `${record.color}15` }}
                            >
                              <Icons
                                name={record.icon}
                                className='w-4 h-4'
                                style={{ color: record.color }}
                              />
                            </div>
                            <div>
                              <div className='font-medium'>{record.name}</div>
                              <div className='text-sm text-slate-500'>{record.description}</div>
                            </div>
                          </div>
                        )
                      },
                      {
                        title: 'Category',
                        dataIndex: 'category',
                        parser: value => (
                          <Badge variant='outline'>
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </Badge>
                        )
                      },
                      {
                        title: 'Metrics',
                        dataIndex: 'metricCount',
                        parser: value => <span className='font-medium'>{formatValue(value)}</span>
                      },
                      {
                        title: 'Size',
                        dataIndex: 'size'
                      },
                      {
                        title: 'Performance',
                        dataIndex: 'avgValue',
                        parser: value => (
                          <Badge
                            variant={value >= 90 ? 'success' : value >= 70 ? 'warning' : 'danger'}
                          >
                            {value.toFixed(1)}%
                          </Badge>
                        )
                      },
                      {
                        title: 'Trend',
                        dataIndex: 'trend',
                        parser: (_, record) => (
                          <div className='flex items-center gap-1'>
                            <Icons
                              name={getTrendIcon(record.trend)}
                              className={`w-4 h-4 ${getTrendColor(record.trend)}`}
                            />
                            <span className={`text-sm ${getTrendColor(record.trend)}`}>
                              {record.trendPercentage.toFixed(1)}%
                            </span>
                          </div>
                        )
                      },
                      {
                        title: 'Actions',
                        dataIndex: 'actions',
                        parser: (_, record) => (
                          <Button
                            size='sm'
                            variant='outline-slate'
                            onClick={() => handleCollectionSelect(record)}
                          >
                            View
                          </Button>
                        )
                      }
                    ]}
                    data={filteredCollections}
                  />
                </CardContent>
              </Card>
            )}

            {filteredCollections.length === 0 && (
              <EmptyState
                icon='IconPackage'
                title='No Collections Found'
                description={
                  searchTerm || categoryFilter
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No metric collections are available.'
                }
                action={
                  searchTerm || categoryFilter
                    ? {
                        label: 'Clear Filters',
                        onClick: () => {
                          setSearchTerm('');
                          setCategoryFilter('');
                        }
                      }
                    : undefined
                }
              />
            )}
          </div>

          {/* Sidebar - Analytics */}
          <div className='space-y-4'>
            {/* Selected Collection Details */}
            {selectedCollection ? (
              <SelectedCollectionPanel
                collection={selectedCollection}
                latestMetrics={latestMetrics}
                onQuery={() => setShowQueryModal(true)}
                onExport={() => setShowExportModal(true)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className='text-base'>Select a Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-slate-600 text-sm'>
                    Choose a collection from the list to view detailed metrics and analytics.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-48'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx='50%'
                        cy='50%'
                        outerRadius={60}
                        dataKey='value'
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='h-48'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart data={performanceTrendData.slice(0, 6)}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey='performance' fill={COLORS.primary} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <QueryModal
          isOpen={showQueryModal}
          onClose={() => setShowQueryModal(false)}
          collection={selectedCollection}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          onQuery={handleQueryHistorical}
          isLoading={historicalMutation.isPending}
        />

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          collection={selectedCollection}
          onExport={handleExportData}
          latestMetrics={latestMetrics}
        />
      </div>
    </Page>
  );
};

// Collection Card Component
interface CollectionCardProps {
  collection: MetricCollection;
  isSelected: boolean;
  onSelect: () => void;
}

const CollectionCard = ({ collection, isSelected, onSelect }: CollectionCardProps) => (
  <Card
    className={`cursor-pointer border transition-all duration-200 hover:shadow-md ${
      isSelected
        ? 'border-primary-500 bg-primary-50/30 shadow-sm'
        : 'border-slate-200/60 hover:border-primary-200'
    }`}
    onClick={onSelect}
  >
    <CardHeader className='pb-3'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div
            className='w-10 h-10 rounded-lg flex items-center justify-center'
            style={{ backgroundColor: `${collection.color}15` }}
          >
            <Icons name={collection.icon} className='w-5 h-5' style={{ color: collection.color }} />
          </div>
          <div>
            <CardTitle className='text-base font-medium'>{collection.name}</CardTitle>
            <Badge variant='outline' className='text-xs mt-1'>
              {collection.category}
            </Badge>
          </div>
        </div>
        <Badge variant={collection.status === 'active' ? 'success' : 'warning'}>
          {collection.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className='space-y-3'>
      <p className='text-sm text-slate-600 line-clamp-2'>{collection.description}</p>

      <div className='grid grid-cols-2 gap-3 text-sm'>
        <div className='flex justify-between'>
          <span className='text-slate-600'>Metrics:</span>
          <span className='font-medium'>{formatValue(collection.metricCount)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-slate-600'>Size:</span>
          <span className='font-medium'>{collection.size}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-slate-600'>Points:</span>
          <span className='font-medium'>{formatValue(collection.dataPoints)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-slate-600'>Avg:</span>
          <span className='font-medium'>{collection.avgValue.toFixed(1)}%</span>
        </div>
      </div>

      <div className='flex items-center justify-between pt-2 border-t border-slate-200/60'>
        <div className='flex items-center gap-1'>
          <Icons
            name={getTrendIcon(collection.trend)}
            className={`w-4 h-4 ${getTrendColor(collection.trend)}`}
          />
          <span className={`text-sm ${getTrendColor(collection.trend)}`}>
            {collection.trendPercentage.toFixed(1)}%
          </span>
        </div>
        <span className='text-xs text-slate-500'>
          {formatTimestamp(collection.lastUpdated, 'short')}
        </span>
      </div>
    </CardContent>
  </Card>
);

// Selected Collection Panel Component
interface SelectedCollectionPanelProps {
  collection: MetricCollection;
  latestMetrics?: LatestMetricsResponse;
  onQuery: () => void;
  onExport: () => void;
}

const SelectedCollectionPanel = ({
  collection,
  latestMetrics,
  onQuery,
  onExport
}: SelectedCollectionPanelProps) => (
  <Card>
    <CardHeader>
      <div className='flex items-center justify-between'>
        <CardTitle className='text-base'>{collection.name}</CardTitle>
        <div className='flex gap-2'>
          <Tooltip content='Query historical data'>
            <Button size='sm' variant='outline-slate' onClick={onQuery} className='p-2'>
              <Icons name='IconSearch' className='w-3 h-3' />
            </Button>
          </Tooltip>
          <Tooltip content='Export data'>
            <Button size='sm' variant='outline-slate' onClick={onExport} className='p-2'>
              <Icons name='IconDownload' className='w-3 h-3' />
            </Button>
          </Tooltip>
        </div>
      </div>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div className='space-y-2'>
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600'>Category:</span>
          <Badge variant='outline'>{collection.category}</Badge>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600'>Total Metrics:</span>
          <span className='font-medium'>{formatValue(collection.metricCount)}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600'>Data Points:</span>
          <span className='font-medium'>{formatValue(collection.dataPoints)}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600'>Storage Size:</span>
          <span className='font-medium'>{collection.size}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-slate-600'>Performance:</span>
          <Badge
            variant={
              collection.avgValue >= 90
                ? 'success'
                : collection.avgValue >= 70
                  ? 'warning'
                  : 'danger'
            }
          >
            {collection.avgValue.toFixed(1)}%
          </Badge>
        </div>
      </div>

      {latestMetrics && (
        <div className='border-t border-slate-200/60 pt-3'>
          <h4 className='text-sm font-medium text-slate-700 mb-2'>Latest Activity</h4>
          <div className='space-y-1 text-xs'>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Recent Snapshots:</span>
              <span className='font-medium'>{latestMetrics.count}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Metric Types:</span>
              <span className='font-medium'>
                {new Set(latestMetrics.snapshots?.map(s => s.metric_type) || []).size}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-slate-600'>Last Update:</span>
              <span className='font-medium'>
                {latestMetrics.snapshots?.[0]
                  ? formatTimestamp(latestMetrics.snapshots[0].timestamp, 'time')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className='border-t border-slate-200/60 pt-3'>
        <div className='flex items-center gap-2 text-sm'>
          <Icons
            name={getTrendIcon(collection.trend)}
            className={`w-4 h-4 ${getTrendColor(collection.trend)}`}
          />
          <span className={getTrendColor(collection.trend)}>
            {collection.trend === 'up'
              ? 'Trending up'
              : collection.trend === 'down'
                ? 'Trending down'
                : 'Stable'}
          </span>
          <span className='text-slate-600'>({collection.trendPercentage.toFixed(1)}%)</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Query Modal Component
interface QueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MetricCollection | null;
  timeRange: string;
  setTimeRange: (_value: string) => void;
  queryParams: any;
  setQueryParams: (_params: any) => void;
  onQuery: () => void;
  isLoading: boolean;
}

const QueryModal = ({
  isOpen,
  onClose,
  collection,
  timeRange,
  setTimeRange,
  queryParams,
  setQueryParams,
  onQuery,
  isLoading
}: QueryModalProps) => (
  <Modal
    isOpen={isOpen}
    onChange={onClose}
    title={`Query Metrics: ${collection?.name || ''}`}
    size='lg'
    footer={
      <div className='flex gap-2'>
        <Button variant='outline-slate' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={onQuery} loading={isLoading} disabled={!collection}>
          Execute Query
        </Button>
      </div>
    }
  >
    <div className='space-y-4'>
      <Alert>
        <Icons name='IconInfoCircle' className='w-4 h-4' />
        <AlertDescription>
          Query historical metrics for detailed analysis and trend identification.
        </AlertDescription>
      </Alert>

      <div className='grid md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Time Range</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getTimeRangeOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            Metric Type (Optional)
          </label>
          <Select
            value={queryParams.metricType}
            onValueChange={value => setQueryParams(prev => ({ ...prev, metricType: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder='All metric types' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              <SelectItem value='init_time'>Init Time</SelectItem>
              <SelectItem value='service_call'>Service Call</SelectItem>
              <SelectItem value='event_published'>Event Published</SelectItem>
              <SelectItem value='event_received'>Event Received</SelectItem>
              <SelectItem value='memory_usage'>Memory Usage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Aggregation</label>
          <Select
            value={queryParams.aggregation}
            onValueChange={value => setQueryParams(prev => ({ ...prev, aggregation: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='avg'>Average</SelectItem>
              <SelectItem value='sum'>Sum</SelectItem>
              <SelectItem value='max'>Maximum</SelectItem>
              <SelectItem value='min'>Minimum</SelectItem>
              <SelectItem value='count'>Count</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Interval</label>
          <Select
            value={queryParams.interval}
            onValueChange={value => setQueryParams(prev => ({ ...prev, interval: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='1m'>1 Minute</SelectItem>
              <SelectItem value='5m'>5 Minutes</SelectItem>
              <SelectItem value='15m'>15 Minutes</SelectItem>
              <SelectItem value='1h'>1 Hour</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {collection && (
        <div className='bg-slate-50 rounded-lg p-3'>
          <h4 className='text-sm font-medium text-slate-700 mb-2'>Query Preview</h4>
          <div className='text-xs text-slate-600 space-y-1'>
            <div>
              Collection: <span className='font-medium'>{collection.name}</span>
            </div>
            <div>
              Time Range: <span className='font-medium'>{timeRange}</span>
            </div>
            <div>
              Aggregation: <span className='font-medium'>{queryParams.aggregation}</span>
            </div>
            <div>
              Interval: <span className='font-medium'>{queryParams.interval}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  </Modal>
);

// Export Modal Component
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: MetricCollection | null;
  onExport: () => void;
  latestMetrics?: LatestMetricsResponse;
}

const ExportModal = ({
  isOpen,
  onClose,
  collection,
  onExport,
  latestMetrics
}: ExportModalProps) => (
  <Modal
    isOpen={isOpen}
    onChange={onClose}
    title={`Export Data: ${collection?.name || ''}`}
    footer={
      <div className='flex gap-2'>
        <Button variant='outline-slate' onClick={onClose}>
          Cancel
        </Button>
        <Button variant='primary' onClick={onExport} disabled={!collection || !latestMetrics}>
          Export JSON
        </Button>
      </div>
    }
  >
    <div className='space-y-4'>
      <Alert>
        <Icons name='IconDownload' className='w-4 h-4' />
        <AlertDescription>
          Export collection data as JSON format for external analysis.
        </AlertDescription>
      </Alert>

      {collection && latestMetrics && (
        <div className='space-y-3'>
          <h4 className='text-sm font-medium text-slate-700'>Export Summary</h4>
          <div className='grid md:grid-cols-2 gap-4 text-sm'>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Collection:</span>
                <span className='font-medium'>{collection.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Category:</span>
                <span className='font-medium'>{collection.category}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Data Points:</span>
                <span className='font-medium'>{formatValue(collection.dataPoints)}</span>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Snapshots:</span>
                <span className='font-medium'>{latestMetrics.count}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>Metric Types:</span>
                <span className='font-medium'>
                  {new Set(latestMetrics.snapshots?.map(s => s.metric_type) || []).size}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-slate-600'>File Size:</span>
                <span className='font-medium'>~{collection.size}</span>
              </div>
            </div>
          </div>

          <div className='bg-slate-50 rounded-lg p-3'>
            <h5 className='text-sm font-medium text-slate-700 mb-2'>Export Contents</h5>
            <div className='text-xs text-slate-600 space-y-1'>
              <div>• Collection metadata and configuration</div>
              <div>• Latest {latestMetrics.count} metric snapshots</div>
              <div>• Timestamps and labels</div>
              <div>• Export metadata (date, format, etc.)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  </Modal>
);

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'IconTrendingUp';
    case 'down':
      return 'IconTrendingDown';
    default:
      return 'IconMinus';
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case 'up':
      return 'text-green-600';
    case 'down':
      return 'text-red-600';
    default:
      return 'text-slate-600';
  }
};

export default ExtensionCollectionsPage;
