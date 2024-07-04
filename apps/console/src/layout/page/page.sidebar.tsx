import React, { useCallback, useMemo, useState } from 'react';

import {
  Button,
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

import { Menu, MenuTree } from '@/types';

interface SidebarProps {
  activeLabel?: string;
  onLinkClick?: (label: string) => void;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarComponent: React.FC<SidebarProps> = ({
  activeLabel = '',
  onLinkClick,
  expanded,
  setExpanded
}: SidebarProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(activeLabel);

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

  const renderIconLink = (link: Menu) => {
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

  const renderFullLink = (link: MenuTree) => {
    if (link.hidden || link.disabled) return null;
    if (isDividerLink(link)) {
      return null;
    }
    // if (link.children && link.children.length > 0) {
    //   return (
    //     <div className='px-2.5 w-full my-2'>
    //       <Accordion key={link.id} type='single' collapsible>
    //         <AccordionItem value={link.name || link.label} className='w-full no-underline'>
    //           <AccordionTrigger
    //             className={cn(
    //               'justify-between font-normal no-underline hover:no-underline',
    //               link.disabled && 'cursor-not-allowed opacity-80'
    //             )}
    //           >
    //             <div className='flex items-center justify-start'>
    //               {link.icon && <Icons size={18} name={link.icon} className='mr-2.5' />}
    //               {link.name || link.label}
    //             </div>
    //           </AccordionTrigger>
    //           <AccordionContent>
    //             {link.children.map(child => (
    //               <div key={child.id} className='pl-4'>
    //                 {renderFullLink(child)}
    //               </div>
    //             ))}
    //           </AccordionContent>
    //         </AccordionItem>
    //       </Accordion>
    //     </div>
    //   );
    // }
    return (
      <div className='p-2.5 w-full border-b border-b-gray-50'>
        <Button
          key={link.id}
          variant='unstyle'
          size='ratio'
          className={cn(
            'hover:bg-slate-100/85 w-full text-left inline-flex justify-between py-2.5',
            {
              'bg-slate-100/90 [&>svg]:stroke-slate-400/90':
                isActive(link.path) || active === link.label
            }
          )}
          onClick={() => handleLinkClick(link)}
        >
          <div className='flex items-center justify-start'>
            {link.icon && <Icons size={18} name={link.icon} className='mr-2.5' />}
            {link.name || link.label}
          </div>
        </Button>
      </div>
    );
  };

  return (
    <ShellSidebar className='flex flex-col'>
      {/* Resverving */}
      {/* <Logo className='min-h-12 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]' type='min' /> */}
      {/* Top wrapper */}
      <div className='flex-1 flex flex-col items-center'>
        {(sidebarMenus || [])?.map((link: Menu) =>
          expanded ? renderFullLink(link) : renderIconLink(link)
        )}
      </div>
      {/* Bottom wrapper */}
      {/* <div className='flex flex-col items-center justify-center pb-3 gap-y-2'></div> */}
      <Button
        variant='unstyle'
        size='ratio'
        className='absolute bottom-4 -right-2.5 z-[9999] bg-white [&>svg]:stroke-slate-800 hover:[&>svg]:stroke-slate-900 shadow-[0_1px_3px_0_rgba(0,0,0,0.10)] rounded-full p-1'
        title={t(expanded ? 'actions.sidebar_collapse' : 'actions.sidebar_expand')}
      >
        <Icons
          name={expanded ? 'IconChevronsLeft' : 'IconChevronsRight'}
          size={12}
          onClick={() => setExpanded(!expanded)}
        />
      </Button>
    </ShellSidebar>
  );
};

export const Sidebar = React.memo(SidebarComponent);
