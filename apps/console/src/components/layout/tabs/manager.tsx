import React from 'react';

import { Button, Icons } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useLayoutContext } from '../layout.context';

export const TabManager: React.FC = () => {
  const { t } = useTranslation();
  const { tabs, closeAllTabs, tabsEnabled, setTabsEnabled } = useLayoutContext();

  if (!tabsEnabled) return null;

  return (
    <div className='flex items-center space-x-2 text-xs'>
      <span className='text-gray-500'>
        {t('tabs.count', { count: tabs.length, defaultValue: `${tabs.length} tabs` })}
      </span>
      {tabs.length > 0 && (
        <Button variant='outline' size='sm' onClick={closeAllTabs} className='h-5 px-2 text-xs'>
          <Icons name='IconX' size={10} className='mr-1' />
          {t('tabs.close_all', 'Close All')}
        </Button>
      )}
      <Button
        variant={tabsEnabled ? 'primary' : 'outline'}
        size='sm'
        onClick={() => setTabsEnabled?.(!tabsEnabled)}
        className='h-5 px-2 text-xs'
      >
        <Icons name='IconTabs' size={10} className='mr-1' />
        {t(tabsEnabled ? 'tabs.disable' : 'tabs.enable')}
      </Button>
    </div>
  );
};
