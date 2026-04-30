import { ResourceUploadOptions } from './resource';

export const RESOURCE_MAX_UPLOAD_BYTES = 5368709120;

export const formatBytes = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
};

export const normalizeResourceTags = (tags?: string | string[]) => {
  const source = Array.isArray(tags) ? tags.join(',') : tags || '';

  return source
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);
};

export const normalizeAllowedResourceTypes = (allowedTypes?: string[]) => {
  const normalized = (allowedTypes || [])
    .map(type =>
      String(type || '')
        .trim()
        .toLowerCase()
    )
    .filter(Boolean);

  return normalized.length > 0 ? Array.from(new Set(normalized)) : ['*'];
};

const getExtension = (filename?: string) => {
  const value = String(filename || '')
    .trim()
    .toLowerCase();
  const index = value.lastIndexOf('.');
  return index >= 0 ? value.slice(index) : '';
};

const matchesMime = (contentType: string, allowedType: string) => {
  if (!contentType) return false;
  if (allowedType === contentType) return true;
  if (!allowedType.endsWith('/*')) return false;
  return contentType.startsWith(`${allowedType.slice(0, -1)}`);
};

export const isResourceFileTypeAllowed = (
  file: Pick<File, 'name' | 'type'>,
  allowedTypes?: string[]
) => {
  const normalized = normalizeAllowedResourceTypes(allowedTypes);
  if (normalized.includes('*') || normalized.includes('*/*')) return true;

  const contentType = String(file.type || '').toLowerCase();
  const extension = getExtension(file.name);

  return normalized.some(type => {
    if (!type) return false;
    if (type.startsWith('.')) return type === extension;
    if (type.includes('/')) return matchesMime(contentType, type);
    return `.${type}` === extension;
  });
};

export const fileInputAcceptValue = (allowedTypes?: string[]) => {
  const normalized = normalizeAllowedResourceTypes(allowedTypes);
  if (normalized.includes('*') || normalized.includes('*/*')) return undefined;
  return normalized.join(',');
};

export const summarizeAllowedResourceTypes = (allowedTypes?: string[]) => {
  const normalized = normalizeAllowedResourceTypes(allowedTypes);
  if (normalized.includes('*') || normalized.includes('*/*')) return 'All file types';
  return normalized.join(', ');
};

const appendIfPresent = (data: FormData, key: string, value: unknown) => {
  if (value === undefined || value === null || value === '') return;
  data.append(key, String(value));
};

export const buildResourceUploadFormData = (
  files: File[],
  options: ResourceUploadOptions,
  fileField: 'file' | 'files'
) => {
  const data = new FormData();

  files.forEach(file => data.append(fileField, file));

  appendIfPresent(data, 'access_level', options.access_level);
  appendIfPresent(data, 'is_public', options.is_public ? 'true' : 'false');
  appendIfPresent(data, 'path_prefix', options.path_prefix?.trim());
  appendIfPresent(data, 'expires_at', options.expires_at);

  const tags = normalizeResourceTags(options.tags);
  if (tags.length > 0) {
    data.append('tags', tags.join(','));
  }

  if (options.processing_options) {
    data.append('processing_options', JSON.stringify(options.processing_options));
  }

  return data;
};
