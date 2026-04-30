import { useCallback, useMemo, useRef, useState } from 'react';

import {
  Button,
  Icons,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import {
  ResourceAccessLevel,
  ResourceUploadOptions,
  ResourceUploadSubmission,
  ResourceUsage
} from '../resource';
import { formatBytes, normalizeResourceTags, RESOURCE_MAX_UPLOAD_BYTES } from '../upload_payload';

interface UploadFormProps {
  onUpload: (_submission: ResourceUploadSubmission) => void;
  onCancel?: () => void;
  uploading?: boolean;
  usage?: ResourceUsage | null;
}

const fileKey = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

const cleanPathPrefix = (value: string) =>
  value
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/{2,}/g, '/');

export const UploadForm = ({ onUpload, onCancel, uploading, usage }: UploadFormProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [accessLevel, setAccessLevel] = useState<ResourceAccessLevel>('private');
  const [pathPrefix, setPathPrefix] = useState('');
  const [tags, setTags] = useState('');
  const [createThumbnail, setCreateThumbnail] = useState(true);
  const [thumbnailSize, setThumbnailSize] = useState(300);

  const totalSize = useMemo(() => files.reduce((total, file) => total + file.size, 0), [files]);
  const availableBytes =
    usage && usage.quota > 0 ? Math.max(usage.quota - usage.usage, 0) : undefined;
  const quotaExceeded =
    usage?.quota_exceeded || (availableBytes !== undefined && totalSize > availableBytes);

  const rejectedFiles = useMemo(
    () =>
      files
        .map(file => {
          if (file.size <= 0) {
            return {
              file,
              reason: t('resource.upload.invalid_empty', 'Empty file cannot be uploaded')
            };
          }
          if (file.size > RESOURCE_MAX_UPLOAD_BYTES) {
            return {
              file,
              reason: t('resource.upload.invalid_large', 'File exceeds the upload limit')
            };
          }
          return null;
        })
        .filter(Boolean) as Array<{ file: File; reason: string }>,
    [files, t]
  );

  const canSubmit = files.length > 0 && rejectedFiles.length === 0 && !quotaExceeded && !uploading;

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    setFiles(current => {
      const seen = new Set(current.map(fileKey));
      const next = [...current];
      incoming.forEach(file => {
        const key = fileKey(file);
        if (!seen.has(key)) {
          seen.add(key);
          next.push(file);
        }
      });
      return next;
    });
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.length) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const removeFile = useCallback((target: File) => {
    setFiles(current => current.filter(file => fileKey(file) !== fileKey(target)));
  }, []);

  const clearFiles = useCallback(() => setFiles([]), []);

  const handleAccessLevelChange = useCallback((value: ResourceAccessLevel) => {
    setAccessLevel(value);
  }, []);

  const handlePublicSwitch = useCallback((checked: boolean) => {
    setAccessLevel(checked ? 'public' : 'private');
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const options: ResourceUploadOptions = {
      access_level: accessLevel,
      is_public: accessLevel === 'public',
      path_prefix: cleanPathPrefix(pathPrefix),
      tags: normalizeResourceTags(tags),
      processing_options: createThumbnail
        ? {
            create_thumbnail: true,
            max_width: thumbnailSize,
            max_height: thumbnailSize
          }
        : {
            create_thumbnail: false
          }
    };

    onUpload({ files, options });
  }, [accessLevel, canSubmit, createThumbnail, files, onUpload, pathPrefix, tags, thumbnailSize]);

  return (
    <div className='space-y-5'>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          uploading
            ? 'border-slate-200 bg-slate-50 cursor-not-allowed'
            : dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={uploading ? undefined : handleDrag}
        onDragLeave={uploading ? undefined : handleDrag}
        onDragOver={uploading ? undefined : handleDrag}
        onDrop={uploading ? undefined : handleDrop}
      >
        <Icons name='IconCloudUpload' className='w-10 h-10 mx-auto text-slate-400 mb-3' />
        <p className='text-sm text-slate-600 mb-1'>
          {t('resource.upload.drag_drop', 'Drag and drop files here')}
        </p>
        <p className='text-xs text-slate-400 mb-4'>
          {t('resource.upload.limit', 'Single file limit')}:{' '}
          {formatBytes(RESOURCE_MAX_UPLOAD_BYTES)}
        </p>
        <Button
          variant='outline-primary'
          disabled={uploading}
          startIcon={<Icons name='IconFolderOpen' />}
          onClick={() => inputRef.current?.click()}
        >
          {t('resource.upload.browse', 'Browse Files')}
        </Button>
        <input
          ref={inputRef}
          type='file'
          multiple
          className='hidden'
          onChange={e => {
            if (e.target.files?.length) {
              addFiles(e.target.files);
              e.target.value = '';
            }
          }}
          disabled={uploading}
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='block text-sm font-medium text-slate-700'>
            {t('resource.upload.access_level', 'Access level')}
          </label>
          <Select value={accessLevel} onValueChange={handleAccessLevelChange as any}>
            <SelectTrigger className='w-full bg-white border-slate-200'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white border-slate-200'>
              <SelectItem value='private'>{t('resource.access.private', 'Private')}</SelectItem>
              <SelectItem value='shared'>{t('resource.access.shared', 'Shared')}</SelectItem>
              <SelectItem value='public'>{t('resource.access.public', 'Public')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-slate-700'>
            {t('resource.upload.path_prefix', 'Path prefix')}
          </label>
          <input
            value={pathPrefix}
            onChange={e => setPathPrefix(e.target.value)}
            placeholder='documents/project'
            className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            disabled={uploading}
          />
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-slate-700'>
            {t('resource.upload.tags', 'Tags')}
          </label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder='invoice, archive'
            className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
            disabled={uploading}
          />
        </div>

        <div className='space-y-3 rounded-lg border border-slate-200 p-3'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-700'>
                {t('resource.upload.public_flag', 'Public access')}
              </p>
              <p className='text-xs text-slate-400'>
                {accessLevel === 'public'
                  ? t('resource.upload.public_enabled', 'Downloads can be exposed publicly')
                  : t('resource.upload.public_disabled', 'Restricted to authorized access')}
              </p>
            </div>
            <Switch checked={accessLevel === 'public'} onCheckedChange={handlePublicSwitch} />
          </div>

          <div className='flex items-center justify-between gap-3'>
            <div>
              <p className='text-sm font-medium text-slate-700'>
                {t('resource.upload.thumbnail', 'Image thumbnails')}
              </p>
              <p className='text-xs text-slate-400'>
                {t('resource.upload.thumbnail_size', 'Max edge')}: {thumbnailSize}px
              </p>
            </div>
            <Switch checked={createThumbnail} onCheckedChange={setCreateThumbnail} />
          </div>
          {createThumbnail && (
            <input
              type='number'
              min={64}
              max={2048}
              step={16}
              value={thumbnailSize}
              onChange={e => setThumbnailSize(Number(e.target.value) || 300)}
              className='w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
              disabled={uploading}
            />
          )}
        </div>
      </div>

      <div className='rounded-lg border border-slate-200'>
        <div className='flex items-center justify-between border-b border-slate-200 px-4 py-3'>
          <div>
            <p className='text-sm font-medium text-slate-700'>
              {t('resource.upload.queue', 'Upload queue')}
            </p>
            <p className='text-xs text-slate-400'>
              {files.length} {t('resource.upload.files_selected', 'files selected')} ·{' '}
              {formatBytes(totalSize)}
            </p>
          </div>
          {files.length > 0 && (
            <Button
              size='sm'
              variant='outline-slate'
              onClick={clearFiles}
              disabled={uploading}
              startIcon={<Icons name='IconTrash' />}
            >
              {t('actions.clear', 'Clear')}
            </Button>
          )}
        </div>

        {files.length === 0 ? (
          <div className='px-4 py-8 text-center text-sm text-slate-400'>
            {t('resource.upload.no_files', 'No files selected')}
          </div>
        ) : (
          <div className='max-h-56 overflow-auto divide-y divide-slate-100'>
            {files.map(file => {
              const rejection = rejectedFiles.find(item => fileKey(item.file) === fileKey(file));
              return (
                <div key={fileKey(file)} className='flex items-center gap-3 px-4 py-3'>
                  <Icons
                    name={rejection ? 'IconAlertTriangle' : 'IconFile'}
                    className={rejection ? 'text-red-500' : 'text-slate-400'}
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium text-slate-700'>{file.name}</p>
                    <p className={`text-xs ${rejection ? 'text-red-500' : 'text-slate-400'}`}>
                      {rejection?.reason || formatBytes(file.size)}
                    </p>
                  </div>
                  <Button
                    size='icon'
                    variant='ghost'
                    onClick={() => removeFile(file)}
                    disabled={uploading}
                    aria-label={t('actions.remove', 'Remove')}
                  >
                    <Icons name='IconX' />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {usage && (
        <div className='rounded-lg border border-slate-200 px-4 py-3'>
          <div className='mb-2 flex items-center justify-between text-xs text-slate-500'>
            <span>{t('resource.quota.storage', 'Storage')}</span>
            <span>
              {usage.formatted_usage || formatBytes(usage.usage)} /{' '}
              {usage.formatted_quota || formatBytes(usage.quota)}
            </span>
          </div>
          <div className='h-2 rounded-full bg-slate-100'>
            <div
              className={`h-2 rounded-full ${
                quotaExceeded
                  ? 'bg-red-500'
                  : usage.usage_percent >= 80
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(usage.usage_percent || 0, 100)}%` }}
            />
          </div>
          {availableBytes !== undefined && (
            <p className={`mt-2 text-xs ${quotaExceeded ? 'text-red-500' : 'text-slate-400'}`}>
              {quotaExceeded
                ? t('resource.upload.quota_exceeded', 'Selected files exceed available storage')
                : `${t('resource.upload.available', 'Available')}: ${formatBytes(availableBytes)}`}
            </p>
          )}
        </div>
      )}

      <div className='flex items-center justify-end gap-2'>
        {onCancel && (
          <Button variant='outline-slate' onClick={onCancel} disabled={uploading}>
            {t('actions.cancel', 'Cancel')}
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          isLoading={uploading}
          startIcon={<Icons name='IconUpload' />}
        >
          {files.length > 1
            ? t('resource.upload.upload_many', 'Upload files')
            : t('resource.upload.upload_one', 'Upload file')}
        </Button>
      </div>
    </div>
  );
};
