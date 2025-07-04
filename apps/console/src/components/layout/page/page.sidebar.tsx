import React, { useCallback, useMemo } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Icons,
  ShellSidebar,
  Tooltip
} from '@ncobase/react';
import { cn, getInitials, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useMenusByType } from '../layout.hooks';

import { isDividerLink, isGroup } from './page.helper';

import { useMenuPermissions } from '@/features/account/permissions';
import { MenuTree } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

export const APP_SIDEBAR_ACCORDION_KEY = 'app.sidebar.expanded_accordions';

const MenuItemRecursive = React.memo(
  ({
    menu,
    isActive,
    handleLinkClick,
    className,
    depth = 0,
    expandedAccordions,
    toggleAccordion,
    collapseAll,
    canAccessMenu
  }: {
    menu: MenuTree;
    isActive: (_path: string, _depth?: number) => boolean;
    handleLinkClick: (_menu: MenuTree) => void;
    className?: string;
    depth?: number;
    expandedAccordions: Record<string, boolean>;
    toggleAccordion: (_id: string) => void;
    collapseAll: () => void;
    canAccessMenu: (_menu: MenuTree) => boolean;
  }) => {
    const { t } = useTranslation();

    if (!canAccessMenu(menu)) {
      return null;
    }

    if (isDividerLink(menu)) {
      return <div className='h-px w-4/5 mx-auto bg-slate-200 dark:bg-slate-700' role='separator' />;
    }

    if (isGroup(menu) && !expandedAccordions) {
      return (
        <div className='text-slate-600 dark:text-slate-300 border-b pb-2 mb-2 border-dashed border-slate-200 dark:border-slate-700 first:mt-0 mt-4'>
          <span className='font-medium'>{t(menu.label || '') || menu.name}</span>
        </div>
      );
    }

    const accessibleChildren =
      menu.children?.filter(child => canAccessMenu(child as MenuTree)) || [];
    const hasAccessibleChildren = accessibleChildren.length > 0;

    if (hasAccessibleChildren) {
      return (
        <Accordion
          type='single'
          collapsible
          value={expandedAccordions[menu.id || ''] ? menu.id : ''}
          onValueChange={() => toggleAccordion(menu.id || '')}
          className='w-full'
        >
          <AccordionItem
            value={menu.id || ''}
            className='border-b border-b-slate-100 dark:border-b-slate-800 py-2'
          >
            <AccordionTrigger
              className={cn(
                'justify-between font-normal no-underline hover:no-underline px-3 py-2.5 mx-2 text-slate-600 dark:text-slate-300',
                '[&>svg]:hover:stroke-slate-800 [&>svg]:focus:stroke-slate-800 dark:[&>svg]:hover:stroke-slate-200 dark:[&>svg]:focus:stroke-slate-200',
                'hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200',
                'data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
                menu.disabled && 'cursor-not-allowed opacity-60'
              )}
              style={{ paddingLeft: `${(0.5 + depth) * 1}rem` }}
              aria-label={`${menu.name || menu.label} submenu`}
            >
              <div className='flex items-center justify-start'>
                {menu.icon && (
                  <Icons name={menu.icon} className='mr-2 transition-colors' aria-hidden='true' />
                )}
                <span>{t(menu.label || '') || menu.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='py-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-lg my-1 mx-2'>
              {accessibleChildren.map(child => (
                <MenuItemRecursive
                  key={child.id || child.slug}
                  menu={child as MenuTree}
                  isActive={isActive}
                  handleLinkClick={handleLinkClick}
                  depth={depth + 1}
                  className='pl-2'
                  expandedAccordions={expandedAccordions}
                  toggleAccordion={toggleAccordion}
                  collapseAll={collapseAll}
                  canAccessMenu={canAccessMenu}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    return (
      <div className='px-2 py-1 w-full'>
        <button
          className={cn(
            'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-lg w-full text-left inline-flex justify-between px-3 py-2.5 transition-colors duration-200',
            {
              'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white': isActive(
                menu.path || '',
                3
              ),
              '[&>svg]:stroke-slate-900 dark:[&>svg]:stroke-white': isActive(menu.path || '', 3)
            },
            menu.disabled && 'cursor-not-allowed opacity-60',
            className
          )}
          style={{ paddingLeft: `${(0.5 + depth) * 1}rem` }}
          onClick={() => {
            if (depth === 0) collapseAll();
            handleLinkClick(menu);
          }}
          disabled={menu.disabled}
          aria-current={isActive(menu.path || '', 3) ? 'page' : undefined}
        >
          <div className='flex items-center justify-start'>
            {menu.icon && (
              <Icons
                name={menu.icon}
                size={16}
                className={cn('mr-2 transition-colors text-slate-500 dark:text-slate-300', {
                  'text-slate-800 dark:text-white': isActive(menu.path || '', 3)
                })}
                aria-hidden='true'
              />
            )}
            <span style={{ paddingLeft: `${depth * 0.5}rem` }}>
              {t(menu.label || '') || menu.name}
            </span>
          </div>
        </button>
      </div>
    );
  }
);

const CollapsedMenuItem = React.memo(
  ({
    menu,
    isActive,
    handleLinkClick,
    canAccessMenu
  }: {
    menu: MenuTree;
    isActive: (_path: string) => boolean;
    handleLinkClick: (_menu: MenuTree) => void;
    canAccessMenu: (_menu: MenuTree) => boolean;
  }) => {
    const { t } = useTranslation();

    if (!canAccessMenu(menu)) {
      return null;
    }

    if (isDividerLink(menu)) {
      return <div className='h-px w-1/2 mx-auto bg-slate-200 dark:bg-slate-700' role='separator' />;
    }

    return (
      <Tooltip side='right' content={t(menu.label || '') || menu.name}>
        <button
          type='button'
          className={cn(
            'p-2.5 rounded-lg my-1.5 transition-colors duration-200',
            'hover:bg-slate-100 dark:hover:bg-slate-800',
            'text-slate-600 dark:text-slate-300',
            {
              'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white': isActive(
                menu.path || ''
              ),
              '[&>svg]:stroke-slate-900 dark:[&>svg]:stroke-white': isActive(menu.path || '')
            }
          )}
          onClick={() => handleLinkClick(menu)}
          aria-label={(t(menu.label || '') || menu.name) as string}
          aria-current={isActive(menu.path || '') ? 'page' : undefined}
        >
          {menu.icon ? (
            <Icons
              name={menu.icon}
              size={18}
              className={cn('transition-colors text-slate-500 dark:text-slate-300', {
                'text-slate-800 dark:text-white': isActive(menu.path || '')
              })}
              aria-hidden='true'
            />
          ) : (
            <span className='text-sm font-medium' aria-hidden='true'>
              {getInitials(menu.name || menu.label || menu.id || 'M')}
            </span>
          )}
        </button>
      </Tooltip>
    );
  }
);

const SidebarComponent: React.FC<{
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ expanded, setExpanded }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const sidebarMenus = useMenusByType('sidebars');
  const { canAccessMenu, filterMenuTree } = useMenuPermissions();

  const { storedValue: expandedAccordions, setValue: setExpandedAccordions } = useLocalStorage<
    Record<string, boolean>
  >(APP_SIDEBAR_ACCORDION_KEY, {});

  const toggleAccordion = useCallback(
    (id: string) => {
      setExpandedAccordions({
        ...expandedAccordions,
        [id]: !expandedAccordions[id]
      });
    },
    [expandedAccordions, setExpandedAccordions]
  );

  const collapseAll = useCallback(() => {
    const newState = Object.keys(expandedAccordions).reduce(
      (acc, id) => ({ ...acc, [id]: false }),
      {}
    );
    setExpandedAccordions(newState);
  }, [expandedAccordions, setExpandedAccordions]);

  const currentPath = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const filteredSidebarMenus = useMemo(() => {
    const permissionFiltered = filterMenuTree(sidebarMenus);

    if (currentPath.length === 0) return [];

    const pathFiltered = permissionFiltered.filter(menu => {
      if (!menu.path) return false;
      const menuPath = menu.path.split('/').filter(Boolean);
      return menuPath.length > 0 && currentPath[0] === menuPath[0];
    });

    return pathFiltered;
  }, [sidebarMenus, currentPath, filterMenuTree]);

  const isActive = useCallback(
    (path: string, deep?: number) => isPathMatching(path, pathname, deep || 2),
    [pathname]
  );

  const handleLinkClick = useCallback(
    (menu: MenuTree) => {
      if (menu.path && canAccessMenu(menu)) {
        navigate(menu.path);
      }
    },
    [navigate, canAccessMenu]
  );

  if (filteredSidebarMenus.length === 0) {
    return null;
  }

  return (
    <ShellSidebar
      className='flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800'
      navId='app-sidebar'
    >
      <div className='flex-1 flex flex-col items-center overflow-y-auto pt-0 pb-4'>
        {filteredSidebarMenus.map((menu: MenuTree) =>
          expanded ? (
            <MenuItemRecursive
              key={menu.id || menu.slug}
              menu={menu}
              isActive={isActive}
              handleLinkClick={handleLinkClick}
              depth={0}
              expandedAccordions={expandedAccordions}
              toggleAccordion={toggleAccordion}
              collapseAll={collapseAll}
              canAccessMenu={canAccessMenu}
            />
          ) : (
            <CollapsedMenuItem
              key={menu.id || menu.slug}
              menu={menu}
              isActive={isActive}
              handleLinkClick={handleLinkClick}
              canAccessMenu={canAccessMenu}
            />
          )
        )}
      </div>

      <Button
        variant='unstyle'
        size='ratio'
        className={cn(
          'absolute bottom-4 -right-2.5 z-9999 rounded-full p-0.5 border transition-colors duration-200',
          'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800',
          '[&>svg]:stroke-slate-500 [&>svg]:hover:stroke-slate-700',
          'dark:[&>svg]:stroke-slate-400 dark:[&>svg]:hover:stroke-slate-200',
          'shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.2)]',
          'border-slate-200 dark:border-slate-700'
        )}
        title={t(expanded ? 'actions.sidebar_collapse' : 'actions.sidebar_expand')}
        onClick={() => setExpanded?.(!expanded)}
        aria-label={t(expanded ? 'actions.sidebar_collapse' : 'actions.sidebar_expand') as string}
        aria-expanded={expanded}
        aria-controls='app-sidebar'
      >
        <Icons
          name={expanded ? 'IconChevronsLeft' : 'IconChevronsRight'}
          size={12}
          aria-hidden='true'
        />
      </Button>
    </ShellSidebar>
  );
};

export const Sidebar = React.memo(SidebarComponent);
