import { Menu } from '@ncobase/types';

export const isDividerLink = (link: Menu) =>
  (link.name?.includes('divide') || link.slug?.includes('divide')) && link.path === '-';

export const isGroup = (link: Menu) => link.slug?.includes('group') && link.path === '-';

export const pathSplit = (path: string) => path.split('/').filter(part => part !== '') || [];
