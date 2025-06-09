import React from 'react';

import { Icons } from '@ncobase/react';
import { useNavigate } from 'react-router';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'New Topic',
      description: 'Create a new content topic',
      icon: 'IconFilePlus',
      color: 'bg-blue-500',
      onClick: () => navigate('/content/topics/create')
    },
    {
      title: 'New Taxonomy',
      description: 'Create a new category or tag',
      icon: 'IconFolderPlus',
      color: 'bg-green-500',
      onClick: () => navigate('/content/taxonomies/create')
    },
    {
      title: 'Upload Media',
      description: 'Upload images, videos, or files',
      icon: 'IconCloudUpload',
      color: 'bg-purple-500',
      onClick: () => navigate('/content/media')
    },
    {
      title: 'New Channel',
      description: 'Add a distribution channel',
      icon: 'IconBroadcast',
      color: 'bg-orange-500',
      onClick: () => navigate('/content/channels/create')
    }
  ];

  return (
    <div className='px-6'>
      <h2 className='text-lg font-semibold mb-6'>Quick Actions</h2>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className='flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group'
          >
            <div
              className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
            >
              <Icons name={action.icon} size={24} className='text-white' />
            </div>
            <h3 className='font-medium text-gray-900 mb-1'>{action.title}</h3>
            <p className='text-xs text-gray-500 text-center'>{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
