import { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Icons,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useLayoutContext } from '../layout/layout.context';

import { useLocalStorage } from '@/hooks/use_local_storage';

// Constants for preference storage keys
export const PREFERENCES_VIEW_MODE_KEY = 'app.preferences.view_mode';
export const PREFERENCES_COLOR_MODE_KEY = 'app.preferences.color_mode';
export const PREFERENCES_SIDEBAR_EXPANDED_KEY = 'app.sidebar.expanded';

// Define preference types
type ViewMode = 'modal' | 'flatten';
type ColorMode = 'light' | 'dark' | 'system';

export const Preferences = () => {
  const { t } = useTranslation();
  const { setVmode } = useLayoutContext();

  // Get stored preferences
  const { storedValue: storedViewMode, setValue: setStoredViewMode } = useLocalStorage<ViewMode>(
    PREFERENCES_VIEW_MODE_KEY,
    'flatten'
  );
  const { storedValue: storedColorMode, setValue: setStoredColorMode } = useLocalStorage<ColorMode>(
    PREFERENCES_COLOR_MODE_KEY,
    'light'
  );
  const { storedValue: sidebarExpanded, setValue: setSidebarExpanded } = useLocalStorage(
    PREFERENCES_SIDEBAR_EXPANDED_KEY,
    false
  );

  // Local state to track changes
  const [viewMode, setViewMode] = useState<ViewMode>(storedViewMode);
  const [colorMode, setColorMode] = useState<ColorMode>(storedColorMode);

  // Apply stored view mode to layout context on component mount
  useEffect(() => {
    if (setVmode && storedViewMode) {
      setVmode(storedViewMode);
    }
  }, [setVmode, storedViewMode]);

  // Apply color mode to document
  useEffect(() => {
    const body = document.body;
    if (colorMode === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }, [colorMode]);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (value: ViewMode) => {
      setViewMode(value);
      setStoredViewMode(value);
      if (setVmode) {
        setVmode(value);
      }
    },
    [setVmode, setStoredViewMode]
  );

  // Handle color mode change
  const handleColorModeChange = useCallback(
    (value: ColorMode) => {
      setColorMode(value);
      setStoredColorMode(value);
    },
    [setStoredColorMode]
  );

  // Handle sidebar toggle
  const handleSidebarToggle = useCallback(
    (checked: boolean) => {
      setSidebarExpanded(checked);
    },
    [setSidebarExpanded]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='unstyle'
          size='xs'
          className='relative text-slate-400/70 [&>svg]:stroke-slate-400/70'
        >
          <Icons name='IconSettings' className='stroke-slate-500/85' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 mt-3.5 p-4 bg-white z-999'>
        <h3 className='text-lg font-medium mb-4'>{t('preferences.title')}</h3>

        <div className='space-y-4'>
          {/* View Mode Preference */}
          <div className='flex items-center justify-between'>
            <label className='font-medium'>{t('preferences.view_mode')}</label>
            <Select value={viewMode} onValueChange={handleViewModeChange as any}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder={t('preferences.select_view_mode')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='flatten'>{t('preferences.flatten_mode')}</SelectItem>
                <SelectItem value='modal'>{t('preferences.modal_mode')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Color Mode Preference */}
          <div className='flex items-center justify-between'>
            <label className='font-medium'>{t('preferences.color_mode')}</label>
            <Select value={colorMode} onValueChange={handleColorModeChange as any}>
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder={t('preferences.select_color_mode')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='light'>{t('preferences.light_mode')}</SelectItem>
                <SelectItem value='dark'>{t('preferences.dark_mode')}</SelectItem>
                <SelectItem value='system'>{t('preferences.system_mode')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sidebar Expanded Preference */}
          <div className='hidden items-center justify-between'>
            <label className='font-medium'>{t('preferences.sidebar_expanded')}</label>
            <Switch checked={sidebarExpanded} onCheckedChange={handleSidebarToggle} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
