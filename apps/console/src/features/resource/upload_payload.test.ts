import { describe, expect, it } from 'vitest';

import {
  buildResourceUploadFormData,
  fileInputAcceptValue,
  isResourceFileTypeAllowed,
  normalizeAllowedResourceTypes,
  normalizeResourceTags,
  RESOURCE_MAX_UPLOAD_BYTES,
  summarizeAllowedResourceTypes
} from './upload_payload';

const createFile = (name: string, content = 'content') =>
  new File([content], name, { type: 'text/plain', lastModified: 1 });

describe('resource upload payload', () => {
  it('normalizes comma separated tags', () => {
    expect(normalizeResourceTags(' invoice, archive ,, finance ')).toEqual([
      'invoice',
      'archive',
      'finance'
    ]);
  });

  it('uses the backend default max upload size', () => {
    expect(RESOURCE_MAX_UPLOAD_BYTES).toBe(5368709120);
  });

  it('normalizes allowed type lists and file input accept values', () => {
    expect(normalizeAllowedResourceTypes([])).toEqual(['*']);
    expect(normalizeAllowedResourceTypes([' IMAGE/* ', '.PDF', 'image/*'])).toEqual([
      'image/*',
      '.pdf'
    ]);
    expect(fileInputAcceptValue(['*'])).toBeUndefined();
    expect(fileInputAcceptValue(['image/*', '.pdf'])).toBe('image/*,.pdf');
    expect(summarizeAllowedResourceTypes(['*'])).toBe('All file types');
  });

  it('matches exact MIME, wildcard MIME, and extension upload allow rules', () => {
    const image = new File(['image'], 'avatar.PNG', { type: 'image/png' });
    const pdf = new File(['pdf'], 'document.pdf', { type: 'application/pdf' });
    const archive = new File(['zip'], 'archive.zip', { type: 'application/zip' });

    expect(isResourceFileTypeAllowed(image, ['image/*'])).toBe(true);
    expect(isResourceFileTypeAllowed(pdf, ['application/pdf'])).toBe(true);
    expect(isResourceFileTypeAllowed(pdf, ['.pdf'])).toBe(true);
    expect(isResourceFileTypeAllowed(archive, ['image/*', '.pdf'])).toBe(false);
  });

  it('uses the single file field and appends upload metadata', () => {
    const file = createFile('invoice.txt');
    const data = buildResourceUploadFormData(
      [file],
      {
        access_level: 'public',
        is_public: true,
        path_prefix: 'documents/invoices',
        tags: ['invoice', 'finance'],
        processing_options: {
          create_thumbnail: true,
          max_width: 300,
          max_height: 300
        }
      },
      'file'
    );

    expect(data.getAll('file')).toEqual([file]);
    expect(data.getAll('files')).toHaveLength(0);
    expect(data.get('access_level')).toBe('public');
    expect(data.get('is_public')).toBe('true');
    expect(data.get('path_prefix')).toBe('documents/invoices');
    expect(data.get('tags')).toBe('invoice,finance');
    expect(JSON.parse(data.get('processing_options') as string)).toEqual({
      create_thumbnail: true,
      max_width: 300,
      max_height: 300
    });
  });

  it('uses repeated files fields for batch uploads', () => {
    const files = [createFile('one.txt'), createFile('two.txt')];
    const data = buildResourceUploadFormData(
      files,
      {
        access_level: 'private',
        is_public: false
      },
      'files'
    );

    expect(data.getAll('files')).toEqual(files);
    expect(data.getAll('file')).toHaveLength(0);
    expect(data.get('access_level')).toBe('private');
    expect(data.get('is_public')).toBe('false');
  });
});
