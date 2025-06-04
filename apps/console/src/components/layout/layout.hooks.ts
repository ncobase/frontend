import { useEffect, useCallback } from 'react';

import { useLocation, useNavigate } from 'react-router';

import { useLayoutContext, NavigationMenus, TabItem } from './layout.context';

import { PREFERENCES_VIEW_MODE_KEY } from '@/components/preferences';
import { MenuTree } from '@/features/system/menu/menu';
import { useLocalStorage } from '@/hooks/use_local_storage';

/**
 * set focus mode
 */
export const useFocusMode = (enabled = true) => {
  const { setIsFocusMode = () => {} } = useLayoutContext();

  useEffect(() => {
    setIsFocusMode(enabled);
    return () => setIsFocusMode(false);
  }, [setIsFocusMode, enabled]);
};

/**
 * set page view mode
 */
export const useVmode = (vmode: 'modal' | 'flatten') => {
  const { setVmode = () => {} } = useLayoutContext();
  const { setValue: setPreferredViewMode } = useLocalStorage(PREFERENCES_VIEW_MODE_KEY, null);

  useEffect(() => {
    setVmode(vmode);
    setPreferredViewMode(vmode);

    return () => {
      setVmode('flatten');
      setPreferredViewMode('flatten');
    };
  }, [setVmode, setPreferredViewMode, vmode]);
};

/**
 * Get menu groups by type
 */
export const useNavigationMenus = (): [NavigationMenus, (_groups: NavigationMenus) => void] => {
  const { navigationMenus, setNavigationMenus } = useLayoutContext();

  if (!setNavigationMenus) {
    throw new Error('setNavigationMenus function is not provided');
  }

  // Create a stable callback that doesn't change on every render
  const stableSetNavigationMenus = useCallback(
    (groups: NavigationMenus) => {
      setNavigationMenus(groups);
    },
    [setNavigationMenus]
  );

  return [navigationMenus || ({} as NavigationMenus), stableSetNavigationMenus];
};

/**
 * Get specific menu type
 */
export const useMenusByType = (type: keyof NavigationMenus): MenuTree[] => {
  const [navigationMenus] = useNavigationMenus();

  // Use callback to ensure stable reference and prevent unnecessary re-renders
  return useCallback(() => {
    return navigationMenus[type] || [];
  }, [navigationMenus, type])();
};

/**
 * Get all menus flattened (for backward compatibility)
 */
export const useMenus = (): [MenuTree[], (_menus: MenuTree[]) => void] => {
  const { menus, setMenus } = useLayoutContext();

  if (!setMenus) {
    throw new Error('setMenus function is not provided');
  }

  // Create stable callback
  const stableSetMenus = useCallback(
    (newMenus: MenuTree[]) => {
      setMenus(newMenus);
    },
    [setMenus]
  );

  return [menus || [], stableSetMenus];
};

/**
 * Tabs router options
 */
interface UseTabsRouterOptions {
  enabled?: boolean;
  autoAddTab?: boolean;
  getTabInfo?: (_path: string) => Partial<TabItem>;
}

/**
 * Tabs router
 */
export const useTabsRouter = (options: UseTabsRouterOptions = {}) => {
  const { enabled = true, autoAddTab = true, getTabInfo } = options;
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    tabsEnabled,
    addTab,
    removeTab,
    tabs = [],
    activeTabId,
    setActiveTabId
  } = useLayoutContext();

  // Auto-add current route as tab
  useEffect(() => {
    if (!enabled || !tabsEnabled || !autoAddTab) return;

    const existingTab = tabs.find(tab => tab.path === pathname);
    if (existingTab) {
      setActiveTabId?.(existingTab.id);
      return;
    }

    const tabInfo = getTabInfo?.(pathname) || {};
    const newTab: TabItem = {
      id: pathname + '-' + Date.now(),
      title: tabInfo.title || pathname.split('/').pop() || 'Page',
      path: pathname,
      icon: tabInfo.icon || 'IconFile',
      closable: tabInfo.closable !== false,
      ...tabInfo
    };

    addTab?.(newTab);
  }, [pathname, enabled, tabsEnabled, autoAddTab, tabs, addTab, setActiveTabId, getTabInfo]);

  const openInNewTab = useCallback(
    (path: string, tabInfo?: Partial<TabItem>) => {
      const newTab: TabItem = {
        id: path + '-' + Date.now(),
        title: tabInfo?.title || path.split('/').pop() || 'Page',
        path,
        icon: tabInfo?.icon || 'IconFile',
        closable: tabInfo?.closable !== false,
        ...tabInfo
      };

      addTab?.(newTab);
      navigate(path);
    },
    [addTab, navigate]
  );

  const closeTab = useCallback(
    (tabId: string) => {
      removeTab?.(tabId);
    },
    [removeTab]
  );

  return {
    openInNewTab,
    closeTab,
    tabs,
    activeTabId,
    tabsEnabled
  };
};

/**
 * Tab navigation
 */
export const useTabNavigation = () => {
  const navigate = useNavigate();
  const { tabs, activeTabId, setActiveTabId } = useLayoutContext();

  const goToNextTab = useCallback(() => {
    if (!tabs.length || !activeTabId) return;

    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    const nextIndex = (currentIndex + 1) % tabs.length;
    const nextTab = tabs[nextIndex];

    setActiveTabId?.(nextTab.id);
    navigate(nextTab.path);
  }, [tabs, activeTabId, setActiveTabId, navigate]);

  const goToPreviousTab = useCallback(() => {
    if (!tabs.length || !activeTabId) return;

    const currentIndex = tabs.findIndex(tab => tab.id === activeTabId);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    const prevTab = tabs[prevIndex];

    setActiveTabId?.(prevTab.id);
    navigate(prevTab.path);
  }, [tabs, activeTabId, setActiveTabId, navigate]);

  const goToTab = useCallback(
    (index: number) => {
      if (!tabs.length || index < 0 || index >= tabs.length) return;

      const tab = tabs[index];
      setActiveTabId?.(tab.id);
      navigate(tab.path);
    },
    [tabs, setActiveTabId, navigate]
  );

  return {
    goToNextTab,
    goToPreviousTab,
    goToTab,
    currentTabIndex: tabs.findIndex(tab => tab.id === activeTabId),
    totalTabs: tabs.length
  };
};

/**
 * Tab navigation shortcuts
 */
export const useTabShortcuts = (enabled = true) => {
  const { goToNextTab, goToPreviousTab, goToTab } = useTabNavigation();

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Tab: Next tab
      if ((event.ctrlKey || event.metaKey) && event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        goToNextTab();
      }

      // Ctrl/Cmd + Shift + Tab: Previous tab
      if ((event.ctrlKey || event.metaKey) && event.key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        goToPreviousTab();
      }

      // Ctrl/Cmd + Number: Go to specific tab
      if ((event.ctrlKey || event.metaKey) && /^[1-9]$/.test(event.key)) {
        event.preventDefault();
        const tabIndex = parseInt(event.key) - 1;
        goToTab(tabIndex);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, goToNextTab, goToPreviousTab, goToTab]);
};
