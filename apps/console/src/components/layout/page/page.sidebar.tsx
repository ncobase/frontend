import React, { useCallback, useMemo } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Icons,
  ShellSidebar,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@ncobase/react';
import { cn, getInitials, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { useMenus } from '../layout.hooks';

import { getMenuByUrl, isDividerLink, isGroup } from './page.helper';

import { Menu, MenuTree } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

export const APP_SIDEBAR_ACCORDION_KEY = 'app.sidebar.expanded_accordions';

// Extract the menu item rendering to a separate component
const MenuItem = React.memo(
  ({
    link,
    isActive,
    handleLinkClick,
    className,
    disabled
  }: {
    link: Menu;
    // eslint-disable-next-line no-unused-vars
    isActive: (path: string) => boolean;
    // eslint-disable-next-line no-unused-vars
    handleLinkClick: (link: Menu) => void;
    className?: string;
    disabled?: boolean;
  }) => {
    return (
      <Button
        variant='unstyle'
        size='ratio'
        className={cn(
          'hover:bg-slate-100/85 w-full text-left inline-flex justify-between py-2.5',
          { 'bg-slate-100/90 [&>svg]:stroke-slate-400/90': isActive(link.path) },
          disabled && 'cursor-not-allowed opacity-80',
          className
        )}
        onClick={() => handleLinkClick(link)}
        disabled={disabled}
        aria-current={isActive(link.path) ? 'page' : undefined}
      >
        <div className='flex items-center justify-start'>
          {link.icon && <Icons size={18} name={link.icon} className='mr-2.5' aria-hidden='true' />}
          <span>{link.name || link.label}</span>
        </div>
      </Button>
    );
  }
);

const ExpandedLink: React.FC<{
  link: MenuTree;
  // eslint-disable-next-line no-unused-vars
  isActive: (to: string, depth?: number) => boolean;
  // eslint-disable-next-line no-unused-vars
  handleLinkClick: (link: Menu) => void;
  className?: string;
  depth?: number;
  isInsideAccordion?: boolean;
  expandedAccordions: Record<string, boolean>;
  // eslint-disable-next-line no-unused-vars
  toggleAccordion: (id: string) => void;
  collapseAll: () => void;
}> = React.memo(
  ({
    link,
    isActive,
    handleLinkClick,
    className,
    depth = 2,
    isInsideAccordion = false,
    expandedAccordions,
    toggleAccordion,
    collapseAll
  }) => {
    if (isDividerLink(link) || isGroup(link)) {
      return null;
    }

    if (link.children && link.children.length > 0) {
      return (
        <Accordion
          type='single'
          collapsible
          value={expandedAccordions[link.id] ? link.id : ''}
          onValueChange={() => toggleAccordion(link.id)}
          className='w-full'
        >
          <AccordionItem value={link.id} className='border-b border-b-gray-50 py-2.5'>
            <AccordionTrigger
              className={cn(
                'justify-between font-normal no-underline hover:no-underline px-2.5 py-2.5 mx-2.5 text-slate-500 [&>svg]:hover:stroke-slate-400 [&>svg]:focus:stroke-slate-400 hover:opacity-80 focus:opacity-90 hover:bg-slate-100/85 rounded-md',
                link.disabled && 'cursor-not-allowed opacity-80'
              )}
              aria-label={`${link.name || link.label} submenu`}
            >
              <div className='flex items-center justify-start'>
                {link.icon && (
                  <Icons size={18} name={link.icon} className='mr-2.5' aria-hidden='true' />
                )}
                <span>{link.name || link.label}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='py-0 bg-slate-50/30 rounded-none'>
              {link.children?.map(child => (
                <ExpandedLink
                  key={child.id}
                  link={child}
                  isActive={isActive}
                  handleLinkClick={handleLinkClick}
                  depth={depth + 1}
                  className={'pl-[2.25rem]!'}
                  isInsideAccordion={true}
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

    const handleClick = () => {
      if (!isInsideAccordion) {
        collapseAll();
      }
      handleLinkClick(link);
    };

    return (
      <div className='p-2.5 w-full border-b border-b-gray-50'>
        <MenuItem
          link={link}
          isActive={path => isActive(path, depth)}
          handleLinkClick={handleClick}
          className={cn(`pl-[${1.25 + depth * 1}rem]`, className)}
          disabled={link.disabled}
        />
      </div>
    );
  }
);

const CollapsedLink: React.FC<{
  link: Menu;
  // eslint-disable-next-line no-unused-vars
  isActive: (to: string) => boolean;
  // eslint-disable-next-line no-unused-vars
  handleLinkClick: (link: Menu) => void;
}> = React.memo(({ link, isActive, handleLinkClick }) => {
  const { t } = useTranslation();

  if (isDividerLink(link)) {
    return <div className='h-[0.03125rem] w-1/2 mx-auto! bg-slate-200' role='separator' />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='unstyle'
          size='ratio'
          className={cn('my-2.5 hover:bg-slate-100/85', {
            'bg-slate-100/90 [&>svg]:stroke-slate-400/90': isActive(link.path)
          })}
          onClick={() => handleLinkClick(link)}
          aria-label={t(link.label) as string}
          aria-current={isActive(link.path) ? 'page' : undefined}
        >
          {link.icon ? (
            <Icons size={18} name={link.icon} aria-hidden='true' />
          ) : (
            <span aria-hidden='true'>{getInitials(link.name || link.label || link.id)}</span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>{t(link.label)}</TooltipContent>
    </Tooltip>
  );
});

const SidebarComponent: React.FC<{
  expanded?: boolean;
  setExpanded?: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ expanded, setExpanded }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menus] = useMenus();

  // Use the custom localStorage hook with the correct structure
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

  // Memoize these calculations to prevent unnecessary re-renders
  const currentHeaderMenu = useMemo(() => getMenuByUrl(menus, pathname), [menus, pathname]);

  const sidebarMenus = useMemo(
    () => currentHeaderMenu?.children?.filter(menu => !menu.hidden && !menu.disabled) || [],
    [currentHeaderMenu]
  );

  const isActive = useCallback(
    (to: string, depth?: number) => isPathMatching(to, pathname, depth || 2),
    [pathname]
  );

  const handleLinkClick = useCallback(
    (link: Menu) => {
      navigate(link.path);
    },
    [navigate]
  );

  return (
    <ShellSidebar className='flex flex-col' navId='app-sidebar'>
      <div className='flex-1 flex flex-col items-center overflow-x-auto'>
        {sidebarMenus.map((link: Menu) =>
          expanded ? (
            <ExpandedLink
              key={link.id}
              link={link}
              isActive={isActive}
              handleLinkClick={handleLinkClick}
              isInsideAccordion={false}
              expandedAccordions={expandedAccordions}
              toggleAccordion={toggleAccordion}
              collapseAll={collapseAll}
            />
          ) : (
            <CollapsedLink
              key={link.id}
              link={link}
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
