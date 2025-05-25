import React from 'react';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icons
} from '@ncobase/react';
import { cn, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

import { isDividerLink } from '../page/page.helper';

import classes from './navigator.module.css';

import { MenuTree } from '@/features/system/menu/menu';

interface MainNavigationProps {
  menus?: MenuTree[];
  withSubmenu?: boolean;
}

const DropdownMenuItems = React.memo(
  ({
    menuItems,
    navigate,
    t,
    depth = 0
  }: {
    menuItems: MenuTree[];
    navigate: (_path: string) => void;
    t: (_key: string) => string;
    depth?: number;
  }) => {
    return (
      <>
        {menuItems.map(menu => {
          const { id, name, slug, path, label, hidden, disabled, children } = menu;

          if (hidden || disabled || isDividerLink({ name, slug, path })) return null;

          const hasChildren = children && Array.isArray(children) && children.length > 0;

          if (hasChildren) {
            return (
              <div key={id || label} className='relative'>
                <DropdownItem className='font-medium cursor-default'>
                  <span className={depth > 0 ? 'ml-4' : ''}>{t(label || '') || name}</span>
                </DropdownItem>
                <div className='ml-2'>
                  <DropdownMenuItems
                    menuItems={children as MenuTree[]}
                    navigate={navigate}
                    t={t}
                    depth={depth + 1}
                  />
                </div>
              </div>
            );
          }

          return (
            <DropdownItem
              key={id || label}
              onClick={() => path && navigate(path)}
              className={depth > 0 ? 'ml-4' : ''}
            >
              {t(label || '') || name}
            </DropdownItem>
          );
        })}
      </>
    );
  }
);

export const MainNavigation: React.FC<MainNavigationProps> = ({ menus = [], withSubmenu }) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (to: string) => {
    return isPathMatching(to, pathname);
  };

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  const renderLink = (menu: MenuTree) => {
    const { id, path, label, children, hidden, disabled } = menu;

    if (hidden || disabled) return null;

    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault();
      if (path) {
        handleLinkClick(path);
      }
    };

    const hasChildren = children && Array.isArray(children) && children.length > 0;

    if (hasChildren && withSubmenu) {
      return (
        <Dropdown key={id || label}>
          <DropdownTrigger className={classes.link} onClick={handleClick}>
            <span className={classes.linkLabel}>{t(label || '') || 'Menu'}</span>
            <Icons name='IconChevronDown' size='0.9rem' />
          </DropdownTrigger>
          <DropdownContent className='w-48 max-h-96 overflow-y-auto'>
            <DropdownMenuItems menuItems={children as MenuTree[]} navigate={navigate} t={t} />
          </DropdownContent>
        </Dropdown>
      );
    }

    return (
      <Button
        key={id || label}
        title={(t(label || '') || 'Menu') as string}
        variant='unstyle'
        className={`${classes.link} ${isActive(path || '') ? classes.linkActive : ''}`}
        onClick={handleClick}
      >
        {t(label || '') || 'Menu'}
      </Button>
    );
  };

  if (!menus.length) return null;

  return (
    <div className={cn('flex-1 flex items-center gap-4 ml-4', classes.links)}>
      {menus.map(renderLink)}
    </div>
  );
};
