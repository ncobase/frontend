import React, { useCallback, useMemo } from 'react';

import { Button, ShellSubmenu } from '@ncobase/react';
import { cn, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useMenusByType } from '../layout.hooks';

import { isGroup, pathSplit } from './page.helper';

import { MenuTree } from '@/features/system/menu/menu';

const SubmenuItemRecursive = React.memo(
  ({
    menu,
    isActive,
    navigate,
    depth = 0
  }: {
    menu: MenuTree;
    isActive: (_path: string) => boolean;
    navigate: (_path: string) => void;
    depth?: number;
  }) => {
    const { t } = useTranslation();

    if (isGroup(menu)) {
      return (
        <div
          className='text-slate-600 border-b pb-2 mb-2 border-dashed border-slate-200 first:mt-0 mt-4'
          key={menu.id}
        >
          <span className='font-medium'>{t(menu.label || '') || menu.name}</span>
          <Button
            variant='unstyle'
            size='ratio'
            className='float-right text-primary-600 p-1'
            onClick={() => console.log('add events')}
          />
        </div>
      );
    }

    const hasChildren = menu.children && Array.isArray(menu.children) && menu.children.length > 0;

    return (
      <div key={menu.id || menu.label}>
        <button
          type='button'
          className={cn(
            'justify-start my-1 px-2.5 py-2 rounded-lg hover:underline text-wrap text-left text-slate-500 hover:text-slate-600',
            isActive(menu.path || '') && 'text-primary-500  hover:text-primary-500'
          )}
          style={{ paddingLeft: `${(depth + 1) * 1}rem` }}
          onClick={() => menu.path && navigate(menu.path)}
        >
          <span>{t(menu.label || '') || menu.name}</span>
        </button>

        {hasChildren && (
          <div className='ml-4'>
            {(menu.children as MenuTree[]).map(child => (
              <SubmenuItemRecursive
                key={child.id || child.slug}
                menu={child}
                isActive={isActive}
                navigate={navigate}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

const SubmenuComponent = ({ ...rest }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Get sidebar menus - these now include children which are the submenus
  const sidebarMenus = useMenusByType('sidebars');

  // Memoize path segments to prevent recalculation
  const pathSegments = useMemo(() => pathSplit(pathname), [pathname]);
  const [firstPart] = pathSegments;

  // Updated logic to find submenus from sidebar children
  const submenus = useMemo(() => {
    if (!sidebarMenus.length || !firstPart) return [];

    // Find the current sidebar menu based on path segments
    const findMatchingMenu = (menus: MenuTree[], targetPath: string): MenuTree | null => {
      for (const menu of menus) {
        if (menu.path && isPathMatching(menu.path, targetPath, 2)) {
          return menu;
        }
        // Also check children recursively
        if (menu.children && Array.isArray(menu.children)) {
          const found = findMatchingMenu(menu.children as MenuTree[], targetPath);
          if (found) return found;
        }
      }
      return null;
    };

    const currentMenu = findMatchingMenu(sidebarMenus, pathname);

    // Return children of the matched menu as submenus
    return (currentMenu?.children as MenuTree[]) || [];
  }, [sidebarMenus, pathname, firstPart]);

  const isActive = useCallback((path: string) => isPathMatching(path, pathname, 3), [pathname]);

  const handleNavigate = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate]
  );

  // Only show submenu if we have submenus to display
  if (!sidebarMenus.length || !submenus.length) {
    return null;
  }

  return (
    <ShellSubmenu className='p-5 overflow-auto text-slate-600 font-normal' {...rest}>
      {submenus.map(menu => (
        <SubmenuItemRecursive
          key={menu.id || menu.slug}
          menu={menu}
          isActive={isActive}
          navigate={handleNavigate}
          depth={0}
        />
      ))}
    </ShellSubmenu>
  );
};

export const Submenu = React.memo(SubmenuComponent);
