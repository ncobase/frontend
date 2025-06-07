import React from 'react';

import { Card, Icons } from '@ncobase/react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface AnalyticsProps {
  data: {
    topics: any[];
    taxonomies: any[];
    media: any[];
    distributions: any[];
  };
}

export const Analytics: React.FC<AnalyticsProps> = ({ data }) => {
  // Process analytics data
  const topicStatusData = [
    {
      name: 'Published',
      value: data.topics?.filter(t => t.status === 1).length || 0,
      color: '#10B981'
    },
    {
      name: 'Draft',
      value: data.topics?.filter(t => t.status === 0).length || 0,
      color: '#F59E0B'
    },
    {
      name: 'Archived',
      value: data.topics?.filter(t => t.status === 2).length || 0,
      color: '#EF4444'
    }
  ];

  const mediaTypeData = [
    { name: 'Images', value: data.media?.filter(m => m.type === 'image').length || 0 },
    { name: 'Videos', value: data.media?.filter(m => m.type === 'video').length || 0 },
    { name: 'Audio', value: data.media?.filter(m => m.type === 'audio').length || 0 },
    { name: 'Files', value: data.media?.filter(m => m.type === 'file').length || 0 }
  ];

  // Generate activity data (mock for demo)
  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    topics: Math.floor(Math.random() * 10),
    media: Math.floor(Math.random() * 15)
  }));

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Topic Status Distribution */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconFileText' className='mr-2' />
          Topic Status Distribution
        </h3>
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

      {/* Media Types */}
      <Card className='p-6'>
        <h3 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconPhoto' className='mr-2' />
          Media Types
        </h3>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={mediaTypeData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='value' fill='#3B82F6' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Content Activity */}
      <Card className='p-6 lg:col-span-2'>
        <h3 className='text-lg font-semibold mb-4 flex items-center'>
          <Icons name='IconTrendingUp' className='mr-2' />
          Weekly Activity
        </h3>
        <div className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={activityData}>
              <XAxis dataKey='day' />
              <YAxis />
              <Tooltip />
              <Line type='monotone' dataKey='topics' stroke='#10B981' name='Topics' />
              <Line type='monotone' dataKey='media' stroke='#3B82F6' name='Media' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
