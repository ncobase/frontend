import React, { useCallback, useMemo, useState } from 'react';

import {
  Button,
  Divider,
  Icons,
  ShellSidebar,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@ncobase/react';
import { cn, getInitials, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { useMenus } from '../layout.hooks';

import { getMenuByUrl, isDividerLink } from './page.helper';

import { Menu } from '@/types';

interface SidebarProps {
  activeLabel?: string;
  onLinkClick?: (label: string) => void;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  activeLabel = '',
  onLinkClick
}: SidebarProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(activeLabel);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const [menus] = useMenus();
  const currentHeaderMenu = useMemo(() => getMenuByUrl(menus, pathname), [menus, pathname]);
  const sidebarMenus = useMemo(() => {
    if (currentHeaderMenu && currentHeaderMenu?.children) {
      return currentHeaderMenu.children.filter(menu => !menu.hidden && !menu.disabled);
    }
    return [];
  }, [menus, currentHeaderMenu]);

  const isActive = useCallback((to: string) => isPathMatching(to, pathname, 2), [pathname]);

  const handleLinkClick = useCallback(
    (link: Menu) => {
      setActive(link.label);
      navigate(link.path);
      if (onLinkClick) onLinkClick(link.label);
    },
    [navigate, onLinkClick]
  );

  const renderLink = (link: Menu) => {
    if (link.hidden || link.disabled) return null;
    if (isDividerLink(link)) {
      return <div className='h-[0.03125rem] w-1/2 !mx-auto bg-slate-200' key={link.id} />;
    }
    return (
      <Tooltip key={link.id}>
        <TooltipTrigger asChild>
          <Button
            variant='unstyle'
            size='ratio'
            className={cn('my-2.5 hover:bg-slate-100/85', {
              'bg-slate-100/90 [&>svg]:stroke-slate-400/90':
                isActive(link.path) || active === link.label
            })}
            onClick={() => handleLinkClick(link)}
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
  };

  return (
    <ShellSidebar className='flex flex-col'>
      {/* Reserving */}
      {/* <Logo className='min-h-12 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]' type='min' /> */}
      {/* Top warpper */}
      <div className='flex-1 flex flex-col items-center'>
        {(sidebarMenus || [])?.map((link: Menu) => renderLink(link))}
      </div>
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

export const Sidebar = React.memo(SidebarComponent);
