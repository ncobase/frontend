import React, { useCallback, useMemo } from 'react';

import {
  Button,
  Icons,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger
} from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useLayoutContext, TabItem } from '../layout.context';

interface TabBarProps {
  className?: string;
}

export const TabBar: React.FC<TabBarProps> = ({ className }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    tabs = [],
    activeTabId,
    setActiveTabId,
    removeTab,
    closeOtherTabs,
    closeAllTabs
  } = useLayoutContext();

  const handleTabClick = useCallback(
    (tab: TabItem) => {
      setActiveTabId?.(tab.id);
      navigate(tab.path);
    },
    [setActiveTabId, navigate]
  );

  const handleTabClose = useCallback(
    (e: React.MouseEvent, tabId: string) => {
      e.stopPropagation();
      removeTab?.(tabId);
    },
    [removeTab]
  );

  const contextMenuItems = useCallback(
    (tabId: string) => [
      {
        label: t('tabs.close_others', 'Close Others'),
        icon: 'IconX',
        onClick: () => closeOtherTabs?.(tabId)
      },
      {
        label: t('tabs.close_all', 'Close All'),
        icon: 'IconXs',
        onClick: () => closeAllTabs?.()
      }
    ],
    [t, closeOtherTabs, closeAllTabs]
  );

  const visibleTabs = useMemo(() => tabs.slice(0, 10), [tabs]);
  const overflowTabs = useMemo(() => tabs.slice(10), [tabs]);

  if (!tabs.length) return null;

  return (
    <div className={cn('flex items-center h-full px-3 overflow-hidden', className)}>
      {/* Visible tabs */}
      <div className='flex items-center overflow-hidden'>
        {visibleTabs.map(tab => (
          <div
            key={tab.id}
            className={cn(
              'flex items-center px-3 py-2 mr-1 cursor-pointer group relative',
              'border-b-2 transition-colors duration-200 hover:bg-gray-50',
              {
                'border-blue-500 text-blue-600 bg-blue-50/50': tab.id === activeTabId,
                'border-transparent text-gray-600': tab.id !== activeTabId
              }
            )}
            onClick={() => handleTabClick(tab)}
          >
            {tab.icon && <Icons name={tab.icon} size={14} className='mr-2 flex-shrink-0' />}
            <span className='truncate max-w-32'>{tab.title}</span>
            {tab.closable !== false && (
              <Button
                variant='unstyle'
                size='ratio'
                className='ml-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-200'
                onClick={e => handleTabClose(e, tab.id)}
              >
                <Icons name='IconX' size={12} />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Overflow dropdown */}
      {overflowTabs.length > 0 && (
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant='outline' size='sm' className='ml-2 px-2 py-1 h-7'>
              <Icons name='IconChevronDown' size={12} />
              <span className='ml-0.5'>+{overflowTabs.length}</span>
            </Button>
          </DropdownTrigger>
          <DropdownContent className='max-h-48 overflow-y-auto'>
            {overflowTabs.map(tab => (
              <DropdownItem
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={tab.id === activeTabId ? 'bg-blue-50' : ''}
              >
                {tab.icon && <Icons name={tab.icon} className='mr-2' size={14} />}
                <span className='truncate'>{tab.title}</span>
              </DropdownItem>
            ))}
          </DropdownContent>
        </Dropdown>
      )}

      {/* Tab controls */}
      <div className='flex items-center ml-2'>
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant='unstyle' size='sm' className='p-1'>
              <Icons name='IconDots' size={12} />
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            {activeTabId &&
              contextMenuItems(activeTabId).map((item, index) => (
                <DropdownItem key={index} onClick={item.onClick}>
                  <Icons name={item.icon} className='mr-2' size={14} />
                  <span>{item.label}</span>
                </DropdownItem>
              ))}
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
};
