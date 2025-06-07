import React, { useState } from 'react';

import { Button, Icons, Modal } from '@ncobase/react';

import { Media } from '../media';
import { useListMedia } from '../service';

interface MediaGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (_media: Media) => void;
  selectedMedia?: Media[];
  multiSelect?: boolean;
  filter?: {
    type?: string;
    search?: string;
  };
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  isOpen,
  onClose,
  onSelect,
  selectedMedia = [],
  multiSelect = false,
  filter
}) => {
  const [searchTerm, setSearchTerm] = useState(filter?.search || '');
  const [typeFilter, setTypeFilter] = useState(filter?.type || 'all');

  const { data: mediaData, isLoading } = useListMedia({
    search: searchTerm,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    limit: 50
  });

  const mediaItems = mediaData?.items || [];

  const handleSelect = (media: Media) => {
    onSelect?.(media);
    if (!multiSelect) {
      onClose();
    }
  };

  const isSelected = (media: Media) => {
    return selectedMedia.some(selected => selected.id === media.id);
  };

  const renderMediaItem = (media: Media) => {
    const isSelectedItem = isSelected(media);

    return (
      <div
        key={media.id}
        className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
          isSelectedItem
            ? 'border-blue-500 ring-2 ring-blue-200'
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleSelect(media)}
      >
        <div className='aspect-square bg-gray-100 flex items-center justify-center'>
          {media.type === 'image' && media.url ? (
            <img
              src={media.url}
              alt={media.alt || media.title}
              className='w-full h-full object-cover'
            />
          ) : (
            <Icons
              name={
                media.type === 'video'
                  ? 'IconMovie'
                  : media.type === 'audio'
                    ? 'IconMusic'
                    : 'IconFile'
              }
              size={32}
              className='text-gray-400'
            />
          )}
        </div>

        {/* Overlay */}
        <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all' />

        {/* Selection indicator */}
        {isSelectedItem && (
          <div className='absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
            <Icons name='IconCheck' size={16} className='text-white' />
          </div>
        )}

        {/* Media info */}
        <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2'>
          <p className='text-white text-xs font-medium truncate'>{media.title}</p>
          <p className='text-gray-300 text-xs'>
            {media.size && `${(media.size / 1024).toFixed(1)} KB`}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      title='Media Gallery'
      onCancel={onClose}
      size='xl'
      className='max-h-[80vh]'
    >
      <div className='space-y-6'>
        {/* Search and filters */}
        <div className='flex gap-4'>
          <div className='flex-1'>
            <input
              type='text'
              placeholder='Search media...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className='px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='all'>All Types</option>
            <option value='image'>Images</option>
            <option value='video'>Videos</option>
            <option value='audio'>Audio</option>
            <option value='file'>Files</option>
          </select>
        </div>

        {/* Media grid */}
        <div className='max-h-96 overflow-y-auto'>
          {isLoading ? (
            <div className='flex items-center justify-center h-32'>
              <Icons name='IconLoader2' className='animate-spin' size={32} />
            </div>
          ) : mediaItems.length > 0 ? (
            <div className='grid grid-cols-6 gap-4'>{mediaItems.map(renderMediaItem)}</div>
          ) : (
            <div className='text-center py-8'>
              <Icons name='IconPhoto' size={48} className='mx-auto text-gray-400 mb-4' />
              <p className='text-gray-500'>No media found</p>
            </div>
          )}
        </div>

        {/* Selected count */}
        {multiSelect && selectedMedia.length > 0 && (
          <div className='flex items-center justify-between pt-4 border-t'>
            <span className='text-sm text-gray-600'>
              {selectedMedia.length} item{selectedMedia.length !== 1 ? 's' : ''} selected
            </span>
            <Button onClick={onClose}>Use Selected</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
