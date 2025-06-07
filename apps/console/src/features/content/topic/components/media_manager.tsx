import React, { useState } from 'react';

import { Button, Icons, Modal } from '@ncobase/react';

import { MediaGallery } from '../../media/components/gallery';
import { MediaUpload } from '../../media/components/upload';
import { TopicMedia } from '../service';

interface TopicMediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  topicId?: string;
  existingMedia?: TopicMedia[];
  onSave?: (_topicMedia: TopicMedia[]) => void;
}

export const TopicMediaManager: React.FC<TopicMediaManagerProps> = ({
  isOpen,
  onClose,
  topicId,
  existingMedia = [],
  onSave
}) => {
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [mediaByType, setMediaByType] = useState<Record<string, any[]>>({
    featured: existingMedia.filter(m => m.type === 'featured'),
    gallery: existingMedia.filter(m => m.type === 'gallery'),
    attachment: existingMedia.filter(m => m.type === 'attachment')
  });
  const [currentType, setCurrentType] = useState<string>('gallery');

  const handleMediaSelect = (media: any, type: string) => {
    setMediaByType(prev => ({
      ...prev,
      [type]: [
        ...prev[type],
        {
          media,
          type,
          topic_id: topicId,
          media_id: media.id,
          order: prev[type].length
        }
      ]
    }));
    setShowMediaGallery(false);
  };

  const handleRemoveMedia = (mediaId: string, type: string) => {
    setMediaByType(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.media?.id !== mediaId)
    }));
  };

  const handleSave = () => {
    const allMedia = Object.values(mediaByType).flat();
    onSave?.(allMedia);
    onClose();
  };

  const renderMediaSection = (type: string, title: string, maxItems?: number) => {
    const mediaList = mediaByType[type];
    const canAddMore = !maxItems || mediaList.length < maxItems;

    return (
      <div key={type} className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h4 className='font-medium text-gray-900'>{title}</h4>
          {canAddMore && (
            <div className='flex space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setCurrentType(type);
                  setShowMediaUpload(true);
                }}
              >
                <Icons name='IconUpload' size={16} className='mr-1' />
                Upload
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setCurrentType(type);
                  setShowMediaGallery(true);
                }}
              >
                <Icons name='IconPhoto' size={16} className='mr-1' />
                Gallery
              </Button>
            </div>
          )}
        </div>

        {mediaList.length > 0 ? (
          <div className={`grid gap-3 ${type === 'featured' ? 'grid-cols-2' : 'grid-cols-4'}`}>
            {mediaList.map((item, index) => (
              <div key={`${item.media?.id}-${index}`} className='relative group'>
                <div
                  className={`bg-gray-100 rounded-lg overflow-hidden ${type === 'featured' ? 'aspect-video' : 'aspect-square'}`}
                >
                  {item.media?.type === 'image' && item.media?.url ? (
                    <img
                      src={item.media.url}
                      alt={item.media.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center'>
                      <Icons
                        name={
                          item.media?.type === 'video'
                            ? 'IconMovie'
                            : item.media?.type === 'audio'
                              ? 'IconMusic'
                              : 'IconFile'
                        }
                        size={type === 'featured' ? 32 : 24}
                        className='text-gray-400'
                      />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveMedia(item.media?.id, type)}
                  className='absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                >
                  <Icons name='IconX' size={12} />
                </button>
                <p className='text-xs text-gray-600 mt-1 truncate'>{item.media?.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
            <Icons name='IconPhoto' size={32} className='mx-auto text-gray-400 mb-2' />
            <p className='text-sm text-gray-500'>No {title.toLowerCase()} added</p>
            {maxItems && (
              <p className='text-xs text-gray-400 mt-1'>
                Max {maxItems} item{maxItems !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {maxItems && mediaList.length >= maxItems && (
          <p className='text-xs text-orange-600'>
            Maximum {maxItems} {title.toLowerCase()} reached
          </p>
        )}
      </div>
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        title='Manage Topic Media'
        onCancel={onClose}
        confirmText='Save'
        onConfirm={handleSave}
        size='xl'
      >
        <div className='space-y-8'>
          {renderMediaSection('featured', 'Featured Image', 1)}
          {renderMediaSection('gallery', 'Gallery Images')}
          {renderMediaSection('attachment', 'Attachments')}
        </div>
      </Modal>

      <MediaGallery
        isOpen={showMediaGallery}
        onClose={() => setShowMediaGallery(false)}
        onSelect={media => handleMediaSelect(media, currentType)}
        multiSelect={currentType !== 'featured'}
      />

      <MediaUpload
        isOpen={showMediaUpload}
        onClose={() => setShowMediaUpload(false)}
        onSuccess={media => handleMediaSelect(media, currentType)}
      />
    </>
  );
};
