import { download } from './apis';
import { ResourceFile } from './resource';

export const getResourceFileName = (file: ResourceFile) =>
  file.original_name || file.name || `${file.id || 'resource'}`;

export const saveBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

export const downloadResourceFile = async (file: ResourceFile) => {
  const blob = await download(file.id);
  saveBlob(blob, getResourceFileName(file));
};
