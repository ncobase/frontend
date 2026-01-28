import React, { useState } from 'react';

import { Icons, Modal, Badge } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';

import { useListChannels } from '../../channel/service';
import { Distribution } from '../distribution.d';

interface DistributionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  topicId?: string;
  existingDistributions?: Distribution[];
  onSave?: (_distributions: Partial<Distribution>[]) => void;
}

export const DistributionManager: React.FC<DistributionManagerProps> = ({
  isOpen,
  onClose,
  topicId,
  existingDistributions = [],
  onSave
}) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    existingDistributions.map(d => d.channel_id).filter(Boolean) as string[]
  );
  const [scheduleSettings] = useState<Record<string, any>>({});

  const toast = useToastMessage();
  const { data: channelsData } = useListChannels({ limit: 100, status: 0 });

  const channels = channelsData?.items || [];

  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: 'Draft', variant: 'secondary' },
      1: { label: 'Scheduled', variant: 'warning' },
      2: { label: 'Published', variant: 'success' },
      3: { label: 'Failed', variant: 'danger' },
      4: { label: 'Cancelled', variant: 'secondary' }
    };

    const config = statusMap[status] || statusMap[0];
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId) ? prev.filter(id => id !== channelId) : [...prev, channelId]
    );
  };

  const handleSave = () => {
    const distributions = selectedChannels.map(channelId => ({
      topic_id: topicId,
      channel_id: channelId,
      status: scheduleSettings[channelId]?.scheduled_at ? 1 : 0,
      scheduled_at: scheduleSettings[channelId]?.scheduled_at,
      meta_data: scheduleSettings[channelId]?.meta_data || {}
    }));

    onSave?.(distributions as Partial<Distribution>[]);
    toast.success('Distribution settings saved');
    onClose();
  };

  const getExistingDistribution = (channelId: string) => {
    return existingDistributions.find(d => d.channel_id === channelId);
  };

  return (
    <Modal
      isOpen={isOpen}
      title='Manage Distribution'
      onCancel={onClose}
      confirmText='Save'
      onConfirm={handleSave}
      size='xl'
    >
      <div className='space-y-6'>
        <div>
          <h3 className='text-lg font-medium mb-4'>Select Channels</h3>
          <div className='space-y-3'>
            {channels.map(channel => {
              const isSelected = selectedChannels.includes(channel.id!);
              const existing = getExistingDistribution(channel.id!);

              return (
                <div
                  key={channel.id}
                  className='flex items-center justify-between p-4 border rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <input
                      type='checkbox'
                      checked={isSelected}
                      onChange={() => handleChannelToggle(channel.id!)}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                    <div className='flex items-center space-x-2'>
                      <Icons name={channel.icon || 'IconBroadcast'} size={20} />
                      <span className='font-medium'>{channel.name}</span>
                      <span className='text-sm text-gray-500'>({channel.type})</span>
                    </div>
                  </div>

                  <div className='flex items-center space-x-2'>
                    {existing && getStatusBadge(existing.status!)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedChannels.length > 0 && (
          <div>
            <h3 className='text-lg font-medium mb-4'>Distribution Summary</h3>
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-sm text-gray-600 mb-2'>
                This topic will be distributed to {selectedChannels.length} channel
                {selectedChannels.length !== 1 ? 's' : ''}:
              </p>
              <div className='flex flex-wrap gap-2'>
                {selectedChannels.map(channelId => {
                  const channel = channels.find(c => c.id === channelId);
                  return (
                    <Badge key={channelId} variant='primary'>
                      {channel?.name}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
