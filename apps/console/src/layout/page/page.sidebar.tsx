import React, { useState } from 'react';

import {
  Button,
  ShellSidebar,
  Icons,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Divider
} from '@ncobase/react';
import { Menu } from '@ncobase/types';
import { cn, getInitials, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { setSidebarMenus, useHeaderMenus } from './page.context';
import { isDividerLink, pathSplit } from './page.helper';

import { useListMenus } from '@/features/system/menu/service';

interface SidebarProps {
  activeLabel?: string;
  onLinkClick?: (label: string) => void;
}

export const Sidebar = ({ activeLabel = '', onLinkClick }: SidebarProps) => {
  const [active, setActive] = useState(activeLabel);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const { t } = useTranslation();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const headerMenu = useHeaderMenus()?.find(menu => menu.slug === pathSplit(pathname)[0]) || {};

  const visibleSidebarMenus =
    (useListMenus({ type: 'sidebar', parent: headerMenu.id }).menus ?? []).filter(
      (menu: Menu) => !menu.hidden || !menu.disabled
    ) ?? [];

  setSidebarMenus(visibleSidebarMenus);

  const isActive = (to: string) => {
    return isPathMatching(to, pathname, 2);
  };

  const tooltipLink = (link: Menu) => (
    <Tooltip key={link.id}>
      <TooltipTrigger asChild>
        <Button
          variant='unstyle'
          size='ratio'
          className={cn('my-2.5 hover:bg-slate-100/85', {
            'bg-slate-100/90 [&>svg]:stroke-slate-400/90':
              isActive(link.path) || active === link.label
          })}
          onClick={() => {
            setActive(link.label);
            navigate(link.path);
            if (onLinkClick) onLinkClick(link.label);
          }}
        >
          {link.icon ? (
            <Icons size={18} name={link.icon} />
          ) : (
            <Button variant='unstyle' size='xs'>
              {getInitials(link.name || link.label || link.id)}
            </Button>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>{t(link.label)}</TooltipContent>
    </Tooltip>
  );

  const links = useListMenus({ type: 'sidebar', parent: headerMenu.id }).menus.map((link: Menu) => {
    if (link.hidden || link.disabled) return null;
    if (isDividerLink(link))
      return <div className='h-[0.03125rem] w-1/2 !mx-auto bg-slate-200' key={link.id} />;
    return tooltipLink(link);
  });

  return (
    <ShellSidebar className='flex flex-col'>
      {/* Reserving */}
      {/* <Logo className='min-h-12 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]' type='min' /> */}
      {/* Top warpper */}
      <div className='flex-1 flex flex-col items-center'>{links}</div>
      {/* Bottom wrapper */}
      <div className='flex flex-col items-center justify-center pb-3 gap-y-2'>
        <Divider className='w-[80%] pb-1' color='slate' />
        <Button variant='unstyle' size='ratio'>
          <Icons
            name={sidebarExpanded ? 'IconChevronsLeft' : 'IconChevronsRight'}
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
          />
        </Button>
      </div>
    </ShellSidebar>
  );
};
