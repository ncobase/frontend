import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, ShellSubmenu } from '@ncobase/react';
import { Menu } from '@ncobase/types';
import { cn, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMenus } from './page.context';
import { findMenuByParentId, getMenuByUrl, isGroup, pathSplit } from './page.helper';

const SubmenuComponent = ({ ...rest }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [menus] = useMenus();
  const currentHeaderMenu = useMemo(() => getMenuByUrl(menus, pathname), [menus, pathname]);

  const [submenus, setSubmenus] = useState([]);
  const sidebarMenusData = useMemo(
    () => findMenuByParentId(menus, currentHeaderMenu?.id || '', 'sidebar') || [],
    [menus, currentHeaderMenu]
  );
  const [firstPart, secondPart] = pathSplit(pathname);

  const currentSidebarMenu = useMemo(
    () => sidebarMenusData?.find(menu => menu.slug === `${firstPart}-${secondPart}`) || {},
    [sidebarMenusData, firstPart, secondPart]
  );

  useEffect(() => {
    if (currentSidebarMenu) {
      const filteredMenus = currentSidebarMenu?.children?.filter(
        menu => !menu.hidden && !menu.disabled
      );
      setSubmenus(filteredMenus);
    }
  }, [currentSidebarMenu]);

  const isActive = useCallback((to: string) => isPathMatching(to, pathname, 3), [pathname]);

  if (!currentSidebarMenu || !submenus) {
    return null;
  }

  const renderLink = (link: Menu) => {
    return isGroup(link) ? (
      <div
        className='text-slate-600 border-b pb-2 mb-2 border-dashed border-slate-200 first:mt-0 mt-4'
        key={link.id}
      >
        <span className='font-medium'>{t(link.label)}</span>
        <Button
          variant='unstyle'
          size='ratio'
          className='float-right text-primary-600 p-1'
          onClick={() => console.log('add events')}
          // appendIcon={<Icons name='IconPlus' />}
        />
      </div>
    ) : (
      <Button
        key={link.id || link.label}
        variant='link'
        className={cn(
          'justify-start my-1 text-wrap text-left text-slate-500 hover:text-slate-600 hover:bg-slate-50',
          isActive(link.path) &&
            'text-primary-500 bg-primary-50/65 hover:bg-primary-50/65 hover:text-primary-500'
        )}
        onClick={() => navigate(link.path)}
      >
        <span>{t(link.label)}</span>
      </Button>
    );
  };

  return (
    <ShellSubmenu className='p-5 overflow-auto text-slate-600 font-normal' {...rest}>
      {submenus.map(link => renderLink(link))}
    </ShellSubmenu>
  );
};

export const Submenu = React.memo(SubmenuComponent);
