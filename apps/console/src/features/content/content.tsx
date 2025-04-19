import { Card, Icons, Button } from '@ncobase/react';
import { useNavigate } from 'react-router';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { useListTaxonomies } from './taxonomy/service';
import { useListTopics } from './topic/service';

import { Page } from '@/components/layout';

// Stats card component
const StatsCard = ({ title, value, icon, color, onClick }) => (
  <Card className='h-full'>
    <div className='flex justify-between items-center p-4'>
      <div>
        <div className='text-sm text-gray-500 mb-1'>{title}</div>
        <div className='text-2xl font-semibold'>{value}</div>
      </div>
      <div
        className='w-10 h-10 rounded-lg flex items-center justify-center'
        style={{ backgroundColor: `${color}20` }}
      >
        <Icons name={icon} size={20} style={{ color }} />
      </div>
    </div>
    {onClick && (
      <div className='border-t px-4 py-2'>
        <Button
          variant='unstyle'
          size='sm'
          className='text-xs text-primary-500 flex items-center gap-1'
          onClick={onClick}
        >
          View Details <Icons name='IconChevronRight' size={14} />
        </Button>
      </div>
    )}
  </Card>
);

export const ContentPage = () => {
  const navigate = useNavigate();

  // Fetch taxonomies and topics
  const { data: taxonomiesData } = useListTaxonomies({ limit: 100, children: true });
  const { data: topicsData } = useListTopics({ limit: 100 });

  // Stats
  const taxonomyCount = taxonomiesData?.total || 0;
  const topicCount = topicsData?.total || 0;
  const publishedTopicCount = topicsData?.items?.filter(topic => topic.status === 1).length || 0;
  const draftTopicCount = topicsData?.items?.filter(topic => topic.status === 0).length || 0;

  // Chart data for topic status
  const topicStatusData = [
    { name: 'Published', value: publishedTopicCount, color: '#10B981' },
    { name: 'Draft', value: draftTopicCount, color: '#F59E0B' },
    {
      name: 'Archived',
      value: topicCount - publishedTopicCount - draftTopicCount,
      color: '#EF4444'
    }
  ];

  // Chart data for taxonomies
  const taxonomyData =
    taxonomiesData?.items?.reduce((acc, taxonomy) => {
      const typeIndex = acc.findIndex(item => item.name === taxonomy.type);
      if (typeIndex !== -1) {
        acc[typeIndex].value += 1;
      } else {
        acc.push({ name: taxonomy.type || 'Other', value: 1 });
      }
      return acc;
    }, []) || [];

  // Recent topics
  const recentTopics =
    topicsData?.items
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5) || [];

  // Recent taxonomies
  const recentTaxonomies =
    taxonomiesData?.items
      ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5) || [];

  return (
    <Page sidebar title='Content Management Dashboard'>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Content Management</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <StatsCard
          title='Total Taxonomies'
          value={taxonomyCount}
          icon='IconBookmark'
          color='#3B82F6'
          onClick={() => navigate('/content/taxonomy')}
        />
        <StatsCard
          title='Total Topics'
          value={topicCount}
          icon='IconFileText'
          color='#10B981'
          onClick={() => navigate('/content/topic')}
        />
        <StatsCard
          title='Published Topics'
          value={publishedTopicCount}
          icon='IconCheck'
          color='#8B5CF6'
          onClick={() => navigate('/content/topic')}
        />
        <StatsCard
          title='Draft Topics'
          value={draftTopicCount}
          icon='IconPencil'
          color='#F59E0B'
          onClick={() => navigate('/content/topic')}
        />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-2 gap-6 mt-6'>
        <Card className='p-4'>
          <h2 className='text-lg font-semibold mb-4'>Topics by Status</h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={topicStatusData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {topicStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className='p-4'>
          <h2 className='text-lg font-semibold mb-4'>Taxonomies by Type</h2>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={taxonomyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Items */}
      <div className='grid grid-cols-2 gap-6 mt-6'>
        <Card className='p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Recent Topics</h2>
            <Button variant='outline-primary' size='sm' onClick={() => navigate('/content/topic')}>
              View All
            </Button>
          </div>

          <div className='space-y-3'>
            {recentTopics.map(topic => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={topic.id}
                className='flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer'
                onClick={() => navigate(`/content/topic/view/${topic.id}`)}
              >
                <div
                  className='w-8 h-8 rounded-full flex items-center justify-center mr-3'
                  style={{ backgroundColor: topic.status === 1 ? '#10B98120' : '#F59E0B20' }}
                >
                  <Icons
                    name={topic.status === 1 ? 'IconCheck' : 'IconPencil'}
                    size={16}
                    style={{ color: topic.status === 1 ? '#10B981' : '#F59E0B' }}
                  />
                </div>
                <div className='flex-1'>
                  <div className='font-medium'>{topic.title}</div>
                  <div className='text-xs text-gray-500'>
                    {new Date(topic.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Icons name='IconChevronRight' size={16} className='text-gray-400' />
              </div>
            ))}

            {recentTopics.length === 0 && (
              <div className='text-center py-4 text-gray-500'>
                No topics found.{' '}
                <Button onClick={() => navigate('/content/topic/create')} variant='link'>
                  Create one?
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg font-semibold'>Recent Taxonomies</h2>
            <Button
              variant='outline-primary'
              size='sm'
              onClick={() => navigate('/content/taxonomy')}
            >
              View All
            </Button>
          </div>

          <div className='space-y-3'>
            {recentTaxonomies.map(taxonomy => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
              <div
                key={taxonomy.id}
                className='flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer'
                onClick={() => navigate(`/content/taxonomy/view/${taxonomy.id}`)}
              >
                <div
                  className='w-8 h-8 rounded-full flex items-center justify-center mr-3'
                  style={{
                    backgroundColor: taxonomy.color ? `${taxonomy.color}20` : '#3B82F620'
                  }}
                >
                  <Icons
                    name={taxonomy.icon || 'IconFolder'}
                    size={16}
                    style={{ color: taxonomy.color || '#3B82F6' }}
                  />
                </div>
                <div className='flex-1'>
                  <div className='font-medium'>{taxonomy.name}</div>
                  <div className='text-xs text-gray-500'>
                    {taxonomy.type} • {new Date(taxonomy.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Icons name='IconChevronRight' size={16} className='text-gray-400' />
              </div>
            ))}

            {recentTaxonomies.length === 0 && (
              <div className='text-center py-4 text-gray-500'>
                No taxonomies found.{' '}
                <Button onClick={() => navigate('/content/taxonomy/create')} variant='link'>
                  Create one?
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className='p-4 mt-6'>
        <h2 className='text-lg font-semibold mb-4'>Quick Actions</h2>
        <div className='grid md:grid-cols-2 grid-cols-4 gap-4'>
          <Button
            className='flex flex-col items-center p-4 h-auto'
            onClick={() => navigate('/content/topic/create')}
          >
            <Icons name='IconFilePlus' size={24} className='mb-2' />
            <span>New Topic</span>
          </Button>

          <Button
            className='flex flex-col items-center p-4 h-auto'
            onClick={() => navigate('/content/taxonomy/create')}
          >
            <Icons name='IconFolderPlus' size={24} className='mb-2' />
            <span>New Taxonomy</span>
          </Button>

          <Button
            variant='outline-primary'
            className='flex flex-col items-center p-4 h-auto'
            onClick={() => navigate('/content/topic')}
          >
            <Icons name='IconListSearch' size={24} className='mb-2' />
            <span>Browse Topics</span>
          </Button>

          <Button
            variant='outline-primary'
            className='flex flex-col items-center p-4 h-auto'
            onClick={() => navigate('/content/taxonomy')}
          >
            <Icons name='IconCategory' size={24} className='mb-2' />
            <span>Manage Taxonomies</span>
          </Button>
        </div>
      </Card>
    </Page>
  );
};
