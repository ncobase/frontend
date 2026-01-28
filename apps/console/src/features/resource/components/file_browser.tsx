import { useState } from 'react';

import { Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { ResourceFile } from '../resource';

interface FileBrowserProps {
  files: ResourceFile[];
  onFileClick: (file: ResourceFile) => void;
  onFileDelete?: (file: ResourceFile) => void;
}

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

const categoryIcon: Record<string, string> = {
  image: 'IconPhoto',
  document: 'IconFileText',
  video: 'IconVideo',
  audio: 'IconMusic',
  archive: 'IconFileZip',
  other: 'IconFile'
};

export const FileBrowser = ({ files, onFileClick, onFileDelete }: FileBrowserProps) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (viewMode === 'list') {
    return (
      <div>
        <div className='flex justify-end mb-2'>
          <button
            onClick={() => setViewMode('grid')}
            className='p-1 text-slate-400 hover:text-slate-600'
          >
            <Icons name='IconLayoutGrid' className='w-4 h-4' />
          </button>
        </div>
        <div className='divide-y'>
          {files.map(file => (
            <div
              key={file.id}
              className='flex items-center gap-3 py-2 px-2 hover:bg-slate-50 cursor-pointer'
              onClick={() => onFileClick(file)}
            >
              <Icons
                name={categoryIcon[file.category || 'other'] || 'IconFile'}
                className='w-5 h-5 text-slate-400'
              />
              <span className='flex-1 text-sm truncate'>{file.original_name || file.name}</span>
              <span className='text-xs text-slate-400'>{formatFileSize(file.size)}</span>
              {onFileDelete && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onFileDelete(file);
                  }}
                  className='p-1 text-slate-400 hover:text-red-500'
                >
                  <Icons name='IconTrash' className='w-4 h-4' />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-end mb-2'>
        <button
          onClick={() => setViewMode('list')}
          className='p-1 text-slate-400 hover:text-slate-600'
        >
          <Icons name='IconList' className='w-4 h-4' />
        </button>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
        {files.map(file => (
          <div
            key={file.id}
            className='border rounded-lg p-3 hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all'
            onClick={() => onFileClick(file)}
          >
            <div className='flex items-center justify-center h-16 mb-2'>
              {file.category === 'image' && file.thumbnail_url ? (
                <img
                  src={file.thumbnail_url}
                  alt={file.name}
                  className='max-h-16 max-w-full object-contain rounded'
                />
              ) : (
                <Icons
                  name={categoryIcon[file.category || 'other'] || 'IconFile'}
                  className='w-10 h-10 text-slate-300'
                />
              )}
            </div>
            <p className='text-xs text-slate-700 truncate text-center'>
              {file.original_name || file.name}
            </p>
            <p className='text-xs text-slate-400 text-center'>{formatFileSize(file.size)}</p>
          </div>
        ))}
      </div>
      {files.length === 0 && (
        <div className='text-center text-slate-400 py-12'>
          {t('resource.empty', 'No files found')}
        </div>
      )}
    </div>
  );
};
