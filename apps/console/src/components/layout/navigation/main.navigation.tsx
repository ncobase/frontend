import React, { useRef, useState, useEffect, useCallback } from 'react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeMenuRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Auto scroll to active menu when visible
  const scrollToActiveMenu = useCallback(() => {
    const container = scrollContainerRef.current;
    const activeMenu = activeMenuRef.current;

    if (!container || !activeMenu) return;

    const containerRect = container.getBoundingClientRect();
    const activeRect = activeMenu.getBoundingClientRect();

    // Calculate relative position within scroll container
    const activeLeft = activeRect.left - containerRect.left + container.scrollLeft;
    const activeRight = activeLeft + activeRect.width;

    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const scrollRight = scrollLeft + containerWidth;

    // Check if active menu is not fully visible
    if (activeLeft < scrollLeft || activeRight > scrollRight) {
      // Center the active menu in container
      const targetScroll = activeLeft - (containerWidth - activeRect.width) / 2;

      container.scrollTo({
        left: Math.max(0, Math.min(targetScroll, container.scrollWidth - containerWidth)),
        behavior: 'smooth'
      });
    }
  }, []);

  // Check scroll state and update button visibility
  const checkScrollState = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    setShowScrollButtons(scrollWidth > clientWidth);
  }, []);

  // Setup scroll and resize listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => checkScrollState();
    const handleResize = () => setTimeout(checkScrollState, 100);

    checkScrollState();
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [checkScrollState, menus]);

  // Auto scroll to active menu when route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToActiveMenu();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, scrollToActiveMenu]);

  // Manual scroll handler
  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const scrollAmount = containerWidth * 0.7;
    const targetScroll =
      direction === 'left'
        ? Math.max(0, container.scrollLeft - scrollAmount)
        : Math.min(container.scrollWidth - containerWidth, container.scrollLeft + scrollAmount);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

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
    const isMenuActive = isActive(path || '');

    // Render dropdown for menu
    const linkBase = cn(
      'py-2 px-2.5 mr-3 rounded-none hover:bg-transparent border-b-2 border-transparent text-white hover:opacity-85 cursor-pointer inline-flex items-center whitespace-nowrap',
      'max-md:px-2 max-md:mr-2 max-sm:px-1.5 max-sm:mr-1.5'
    );

    if (hasChildren && withSubmenu) {
      return (
        <Dropdown key={id || label}>
          <DropdownTrigger className={linkBase} onClick={handleClick}>
            <span className='mr-2'>{t(label || '') || 'Menu'}</span>
            <Icons name='IconChevronDown' />
          </DropdownTrigger>
          <DropdownContent className='w-48 max-h-96 overflow-y-auto'>
            <DropdownMenuItems menuItems={children as MenuTree[]} navigate={navigate} t={t} />
          </DropdownContent>
        </Dropdown>
      );
    }

    // Render regular menu button
    return (
      <button
        key={id || label}
        ref={isMenuActive ? activeMenuRef : undefined}
        title={(t(label || '') || 'Menu') as string}
        className={cn(linkBase, 'flex-shrink-0', isMenuActive && 'border-white')}
        onClick={handleClick}
      >
        {t(label || '') || 'Menu'}
      </button>
    );
  };

  if (!menus.length) return null;

  return (
    <div className='flex items-center ml-4 relative min-w-0'>
      {showScrollButtons && canScrollLeft && (
        <Button
          variant='icon'
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 z-20',
            'text-[color-mix(in_srgb,var(--foreground-color,#fff)_60%,transparent)] hover:text-[color-mix(in_srgb,var(--foreground-color,#fff)_90%,transparent)]',
            'w-6 h-6 p-0 rounded-r-full rounded-l-none transition-all duration-150 ease-in-out',
            'hover:bg-white/5 hover:text-white/95 hover:scale-105 backdrop-blur-[4px]',
            'max-md:w-5 max-md:h-5 max-sm:w-4 max-sm:h-4'
          )}
          onClick={() => scroll('left')}
          aria-label='Scroll left'
        >
          <Icons name='IconChevronLeft' />
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        className={cn(
          'flex items-center gap-3 overflow-x-auto scrollbar-hide',
          'scroll-smooth w-full',
          showScrollButtons && canScrollLeft && 'pl-8',
          showScrollButtons && canScrollRight && 'pr-8'
        )}
      >
        {menus.map(renderLink)}
      </div>
      {showScrollButtons && canScrollRight && (
        <Button
          variant='icon'
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 z-20',
            'text-[color-mix(in_srgb,var(--foreground-color,#fff)_60%,transparent)] hover:text-[color-mix(in_srgb,var(--foreground-color,#fff)_90%,transparent)]',
            'w-6 h-6 p-0 rounded-l-full rounded-r-none transition-all duration-150 ease-in-out',
            'hover:bg-white/5 hover:text-white/95 hover:scale-105 backdrop-blur-[4px]',
            'max-md:w-5 max-md:h-5 max-sm:w-4 max-sm:h-4'
          )}
          onClick={() => scroll('right')}
          aria-label='Scroll right'
        >
          <Icons name='IconChevronRight' />
        </Button>
      )}
    </div>
  );
};
