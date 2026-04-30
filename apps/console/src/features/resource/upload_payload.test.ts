import { describe, expect, it } from 'vitest';

import { buildResourceUploadFormData, normalizeResourceTags } from './upload_payload';

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
