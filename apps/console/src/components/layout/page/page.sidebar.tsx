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
    collapseAll
  }: {
    menu: MenuTree;
    isActive: (_path: string) => boolean;
    handleLinkClick: (_menu: MenuTree) => void;
    className?: string;
    depth?: number;
    expandedAccordions: Record<string, boolean>;
    toggleAccordion: (_id: string) => void;
    collapseAll: () => void;
  }) => {
    const { t } = useTranslation();

    if (isDividerLink(menu)) {
      return <div className='h-[0.03125rem] w-1/2 mx-auto bg-slate-200' role='separator' />;
    }

    if (isGroup(menu)) {
      return (
        <div className='text-slate-600 border-b pb-2 mb-2 border-dashed border-slate-200 first:mt-0 mt-4'>
          <span className='font-medium'>{t(menu.label || '') || menu.name}</span>
        </div>
      );
    }

    // Check if menu has children
    const hasChildren = menu.children && Array.isArray(menu.children) && menu.children.length > 0;

    if (hasChildren) {
      return (
        <Accordion
          type='single'
          collapsible
          value={expandedAccordions[menu.id || ''] ? menu.id : ''}
          onValueChange={() => toggleAccordion(menu.id || '')}
          className='w-full'
        >
          <AccordionItem value={menu.id || ''} className='border-b border-b-gray-50 py-2.5'>
            <AccordionTrigger
              className={cn(
                'justify-between font-normal no-underline hover:no-underline px-2.5 py-2.5 mx-2.5 text-slate-500 [&>svg]:hover:stroke-slate-400 [&>svg]:focus:stroke-slate-400 hover:opacity-80 focus:opacity-90 hover:bg-slate-100/85 rounded-md',
                menu.disabled && 'cursor-not-allowed opacity-80'
              )}
              style={{ paddingLeft: `${1.25 + depth * 1}rem` }}
              aria-label={`${menu.name || menu.label} submenu`}
            >
              <div className='flex items-center justify-start'>
                {menu.icon && (
                  <Icons size={18} name={menu.icon} className='mr-2.5' aria-hidden='true' />
                )}
                <span>{t(menu.label || '') || menu.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='py-0 bg-slate-50/30 rounded-none'>
              {(menu.children as MenuTree[])?.map(child => (
                <MenuItemRecursive
                  key={child.id || child.slug}
                  menu={child}
                  isActive={isActive}
                  handleLinkClick={handleLinkClick}
                  depth={depth + 1}
                  className='pl-4'
                  expandedAccordions={expandedAccordions}
                  toggleAccordion={toggleAccordion}
                  collapseAll={collapseAll}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    }

    // Leaf menu item
    return (
      <div className='p-2.5 w-full border-b border-b-gray-50'>
        <Button
          variant='unstyle'
          size='ratio'
          className={cn(
            'hover:bg-slate-100/85 w-full text-left inline-flex justify-between py-2.5',
            { 'bg-slate-100/90 [&>svg]:stroke-slate-400/90': isActive(menu.path || '') },
            menu.disabled && 'cursor-not-allowed opacity-80',
            className
          )}
          style={{ paddingLeft: `${1.25 + depth * 1}rem` }}
          onClick={() => {
            if (depth === 0) collapseAll();
            handleLinkClick(menu);
          }}
          disabled={menu.disabled}
          aria-current={isActive(menu.path || '') ? 'page' : undefined}
        >
          <div className='flex items-center justify-start'>
            {menu.icon && (
              <Icons size={18} name={menu.icon} className='mr-2.5' aria-hidden='true' />
            )}
            <span>{t(menu.label || '') || menu.name}</span>
          </div>
        </Button>
      </div>
    );
  }
);

const CollapsedMenuItem = React.memo(
  ({
    menu,
    isActive,
    handleLinkClick
  }: {
    menu: MenuTree;
    isActive: (_path: string) => boolean;
    handleLinkClick: (_menu: MenuTree) => void;
  }) => {
    const { t } = useTranslation();

    if (isDividerLink(menu)) {
      return <div className='h-[0.03125rem] w-1/2 mx-auto bg-slate-200' role='separator' />;
    }

    return (
      <Tooltip side='right' content={t(menu.label || '') || menu.name}>
        <Button
          variant='unstyle'
          size='ratio'
          className={cn('my-2.5 hover:bg-slate-100/85', {
            'bg-slate-100/90 [&>svg]:stroke-slate-400/90': isActive(menu.path || '')
          })}
          onClick={() => handleLinkClick(menu)}
          aria-label={(t(menu.label || '') || menu.name) as string}
          aria-current={isActive(menu.path || '') ? 'page' : undefined}
        >
          {menu.icon ? (
            <Icons size={18} name={menu.icon} aria-hidden='true' />
          ) : (
            <span aria-hidden='true'>{getInitials(menu.name || menu.label || menu.id || 'M')}</span>
          )}
        </Button>
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

  // Get sidebar menus
  const sidebarMenus = useMenusByType('sidebars');

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
    [setExpandedAccordions]
  );

  const collapseAll = useCallback(() => {
    const newState = Object.keys(expandedAccordions).reduce(
      (acc, id) => ({ ...acc, [id]: false }),
      {}
    );
    setExpandedAccordions(newState);
  }, [expandedAccordions, setExpandedAccordions]);

  // Find current sidebar menus based on current path
  const currentPath = useMemo(() => pathname.split('/').filter(Boolean), [pathname]);

  const currentSidebarMenus = useMemo(() => {
    if (currentPath.length === 0 || !sidebarMenus.length) return sidebarMenus;

    // Try to find menus that match the current path
    const matchingMenus = sidebarMenus.filter(menu => {
      if (!menu.path) return false;
      const menuPath = menu.path.split('/').filter(Boolean);
      return menuPath.length > 0 && currentPath[0] === menuPath[0];
    });

    return matchingMenus.length > 0 ? matchingMenus : sidebarMenus;
  }, [sidebarMenus, currentPath]);

  const isActive = useCallback((path: string) => isPathMatching(path, pathname, 2), [pathname]);

  const handleLinkClick = useCallback(
    (menu: MenuTree) => {
      if (menu.path) {
        navigate(menu.path);
      }
    },
    [navigate]
  );

  return (
    <ShellSidebar className='flex flex-col' navId='app-sidebar'>
      <div className='flex-1 flex flex-col items-center overflow-y-auto'>
        {currentSidebarMenus.map((menu: MenuTree) =>
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
            />
          ) : (
            <CollapsedMenuItem
              key={menu.id || menu.slug}
              menu={menu}
              isActive={isActive}
              handleLinkClick={handleLinkClick}
            />
          )
        )}
      </div>

      <Button
        variant='unstyle'
        size='ratio'
        className='absolute bottom-4 -right-2.5 z-9999 bg-white hover:bg-slate-50 [&>svg]:stroke-slate-500 [&>svg]:hover:stroke-slate-600 shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] rounded-full p-0.5 border border-transparent'
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
