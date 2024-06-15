import React from 'react';

import { Button, ShellSubmenu } from '@ncobase/react';
import { cn, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSidebarMenus } from './page.context';
import { isGroup, pathSplit } from './page.helper';

import { useListMenus } from '@/features/system/menu/service';

export const Submenu = ({ ...rest }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [firstPart, secondPart] = pathSplit(pathname);
  const sidebarMenu =
    useSidebarMenus()?.find(menu => menu.slug === `${firstPart}-${secondPart}`) || {};
  // TODO: 当前页面刷新时，没有菜单数据
  const visibleSubmenus =
    useListMenus({
      type: 'submenu',
      parent: sidebarMenu?.id
    })?.menus?.filter(menu => !menu.hidden || !menu.disabled) ?? [];

  return (
    <ShellSubmenu className='p-5 overflow-auto text-slate-600 font-normal' {...rest}>
      {visibleSubmenus.map(link =>
        isGroup(link) ? (
          <div
            className='text-slate-600 border-b pb-2 mb-2 border-dashed border-slate-200 first:mt-0 mt-4'
            key={link.id}
          >
            <span className='font-medium'>{t(link.label)}</span>
            <Button
              variant='unstyle'
              size='ratio'
              className='float-right text-primary-600 p-1'
              // onClick={() => console.log('add events')}
              // appendIcon={<Icons name='IconPlus' />}
            />
          </div>
        ) : (
          <Button
            key={link.id || link.label}
            variant='link'
            className={cn(
              'justify-start my-1 text-wrap text-left text-slate-500 hover:text-slate-600 hover:bg-slate-50',
              isPathMatching(link.path, pathname, 3) &&
                'text-primary-500 bg-primary-50/65 hover:bg-primary-50/65 hover:text-primary-500'
            )}
            onClick={() => navigate(link.path)}
          >
            <span>{t(link.label)}</span>
          </Button>
        )
      )}
    </ShellSubmenu>
  );
};
