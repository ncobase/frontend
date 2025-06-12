import React, { useState, useEffect, useCallback } from 'react';

import { LayoutContext, LayoutContextValue, NavigationMenus, TabItem } from './layout.context';

import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { Viewport } from '@/components/viewport';
import { LoginInterceptorProvider } from '@/features/account/pages/auth/login_interceptor';
import { MenuTree } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

interface LayoutProps {
  children: React.ReactNode;
}

// Flatten menu groups
const flattenNavigationMenus = (groups: NavigationMenus): MenuTree[] => {
  const flattened: MenuTree[] = [];
  try {
    if (groups.headers && Array.isArray(groups.headers)) flattened.push(...groups.headers);
    if (groups.sidebars && Array.isArray(groups.sidebars)) flattened.push(...groups.sidebars);
    if (groups.accounts && Array.isArray(groups.accounts)) flattened.push(...groups.accounts);
    if (groups.spaces && Array.isArray(groups.spaces)) flattened.push(...groups.spaces);
  } catch (error) {
    console.error('Error flattening menu groups:', error);
  }
  return flattened;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { storedValue: preferredViewMode, setValue: setPreferredViewMode } = useLocalStorage<
    LayoutContextValue['vmode']
  >(PREFERENCES_VIEW_MODE_KEY, 'flatten');

  const [isFocusMode, setIsFocusMode] = React.useState<LayoutContextValue['isFocusMode']>(false);
  const [vmode, setVmodeInternal] = React.useState<LayoutContextValue['vmode']>(preferredViewMode);
  const [navigationMenus, setNavigationMenus] = useState<NavigationMenus>({
    headers: [],
    sidebars: [],
    accounts: [],
    spaces: []
  });
  const [menus, setMenus] = useState<MenuTree[]>([]);

  // Tab management state
  const [tabsEnabled, setTabsEnabled] = useState(false);
  const [tabs, setTabs] = useState<TabItem[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const setVmode = React.useCallback(
    (newMode: 'modal' | 'flatten') => {
      setVmodeInternal(newMode);
      setPreferredViewMode(newMode);
    },
    [setPreferredViewMode]
  );

  useEffect(() => {
    if (preferredViewMode && preferredViewMode !== vmode) {
      setVmodeInternal(preferredViewMode);
    }
  }, [preferredViewMode, vmode]);

  // Flatten menu groups for backward compatibility
  useEffect(() => {
    try {
      const allMenus = flattenNavigationMenus(navigationMenus);
      setMenus(allMenus);
    } catch (error) {
      console.error('Error setting flattened menus:', error);
      setMenus([]);
    }
  }, [navigationMenus]);

  // Tab operations
  const addTab = useCallback((tab: TabItem) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(t => t.id === tab.id || t.path === tab.path);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return prevTabs;
      }
      return [...prevTabs, { ...tab, active: true }];
    });
    setActiveTabId(tab.id);
  }, []);

  const removeTab = useCallback(
    (id: string) => {
      setTabs(prevTabs => {
        const newTabs = prevTabs.filter(tab => tab.id !== id);
        if (activeTabId === id && newTabs.length > 0) {
          const nextTab = newTabs[newTabs.length - 1];
          setActiveTabId(nextTab.id);
          // Optional: navigate to the next tab
          // navigate(nextTab.path);
        }
        return newTabs;
      });
    },
    [activeTabId]
  );

  const updateTab = useCallback((id: string, updates: Partial<TabItem>) => {
    setTabs(prevTabs => prevTabs.map(tab => (tab.id === id ? { ...tab, ...updates } : tab)));
  }, []);

  const closeOtherTabs = useCallback((id: string) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.id === id || !tab.closable));
    setActiveTabId(id);
  }, []);

  const closeAllTabs = useCallback(() => {
    setTabs(prevTabs => prevTabs.filter(tab => !tab.closable));
    const nonClosableTabs = tabs.filter(tab => !tab.closable);
    if (nonClosableTabs.length > 0) {
      setActiveTabId(nonClosableTabs[0].id);
    } else {
      setActiveTabId('');
    }
  }, [tabs]);

  const layoutContextValue = React.useMemo(
    () => ({
      vmode,
      setVmode,
      navigationMenus,
      setNavigationMenus,
      menus,
      setMenus,
      isFocusMode,
      setIsFocusMode,
      tabsEnabled,
      setTabsEnabled,
      tabs,
      setTabs,
      activeTabId,
      setActiveTabId,
      addTab,
      removeTab,
      updateTab,
      closeOtherTabs,
      closeAllTabs
    }),
    [
      vmode,
      setVmode,
      navigationMenus,
      menus,
      isFocusMode,
      setIsFocusMode,
      tabsEnabled,
      tabs,
      activeTabId,
      addTab,
      removeTab,
      updateTab,
      closeOtherTabs,
      closeAllTabs
    ]
  );

  return (
    <LayoutContext.Provider value={layoutContextValue}>
      <Viewport>{children}</Viewport>
      <LoginInterceptorProvider />
    </LayoutContext.Provider>
  );
};
