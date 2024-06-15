import React from 'react';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icons
} from '@ncobase/react';
import { MenuTree } from '@ncobase/types';
import { cn, isPathMatching } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { isDividerLink } from '../page/page.helper';

import classes from './navigator.module.css';

interface MainNavigationProps {
  menus?: MenuTree[];
  withSubmenu?: boolean;
}

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

  const renderMenuItems = (menuItems: MenuTree[]) =>
    menuItems.map(({ id, name, slug, path, label, hidden, disabled }) => {
      if (hidden || disabled || isDividerLink({ name, slug, path })) return null;
      return (
        <DropdownItem key={id || label} onClick={() => handleLinkClick(path)}>
          {t(label)}
        </DropdownItem>
      );
    });

  const renderLink = ({ id, path, label, children, hidden, disabled }: MenuTree) => {
    if (hidden || disabled) return null;

    const handleClick = event => {
      event.preventDefault();
      handleLinkClick(path);
    };

    if (children && children.length > 0 && withSubmenu) {
      const menuItems = renderMenuItems(children!);
      return (
        <Dropdown key={id || label}>
          <DropdownTrigger className={classes.link} onClick={handleClick}>
            <span className={classes.linkLabel}>{t(label)}</span>
            <Icons name='IconChevronDown' size='0.9rem' />
          </DropdownTrigger>
          <DropdownContent className='w-32'>{menuItems}</DropdownContent>
        </Dropdown>
      );
    }

    return (
      <Button
        key={id || label}
        title={t(label) as string}
        variant='unstyle'
        className={`${classes.link} ${isActive(path) ? classes.linkActive : ''}`}
        onClick={handleClick}
      >
        {t(label)}
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
