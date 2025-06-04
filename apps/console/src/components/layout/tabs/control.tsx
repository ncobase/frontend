import React from 'react';

import { Button, Icons, Tooltip } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useLayoutContext } from '@/components/layout';

export const TabControl: React.FC = () => {
  const { t } = useTranslation();
  const { tabsEnabled, setTabsEnabled } = useLayoutContext();

  const handleToggle = () => {
    setTabsEnabled?.(!tabsEnabled);
  };

  return (
    <Tooltip
      content={t(
        tabsEnabled ? 'tabs.disable' : 'tabs.enable',
        tabsEnabled ? 'Disable Tabs' : 'Enable Tabs'
      )}
    >
      <Button variant={tabsEnabled ? 'primary' : 'outline'} size='sm' onClick={handleToggle}>
        <Icons name='IconTabs' size={16} />
      </Button>
    </Tooltip>
  );
};
