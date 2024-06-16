import React, { useCallback, useState } from 'react';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icons
} from '@ncobase/react';
import { MenuTree } from '@ncobase/types';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AvatarButton } from '@/components/avatar/avatar_button';
import { TenantSwitcher } from '@/features/account/pages/tenant_switcher';
import { useAccountTenants } from '@/features/account/service';
import { useListMenus } from '@/features/system/menu/service';
import { useTenantContext } from '@/features/system/tenant/context';

export const TenantDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasTenant } = useTenantContext();
  const { tenants: accountTenants } = useAccountTenants();

  const [opened, setOpened] = useState(false);
  const { menus } = useListMenus({ type: 'tenant' });

  const renderLink = useCallback(
    (menu: MenuTree) => {
      const isTenantSwitch = menu.slug?.includes('tenant') && menu.slug?.includes('switch');
      const isLabel =
        (menu.slug?.includes('label') || menu.name?.includes('label')) && menu.path?.includes('-');
      if (isLabel) {
        return null;
      }

      if (isTenantSwitch) {
        return (
          <DropdownItem key={menu.id} onClick={() => setOpened(true)}>
            <Icons name={menu.icon} className='-ml-0.5 mr-2.5' />
            {t(menu.label) || menu.name}
          </DropdownItem>
        );
      }

      return (
        <DropdownItem key={menu.id || menu.label} onClick={() => navigate(menu.path)}>
          <Icons name={menu.icon} className='-ml-0.5 mr-2.5' />
          {t(menu.label) || menu.name}
        </DropdownItem>
      );
    },
    [navigate, t]
  );

  const renderMenuDropdown = useCallback(
    (menuItems: MenuTree[]) => {
      const visibleItems = menuItems.filter(item => !item.hidden || item.disabled);
      if (!visibleItems.length) return null;
      return (
        <DropdownContent align='end' alignOffset={-16}>
          {visibleItems.map(renderLink)}
        </DropdownContent>
      );
    },
    [renderLink]
  );

  const MenuList = React.memo(() => (
    <Dropdown>
      <DropdownTrigger asChild>
        {accountTenants?.[0].logo ? (
          <AvatarButton src={accountTenants?.[0].logo} alt={accountTenants?.[0].name} />
        ) : (
          <Button variant='unstyle' className='p-0 text-slate-400/70 [&>svg]:stroke-slate-400/70'>
            <Icons name='IconBuildingCommunity' /> {accountTenants?.[0].name}
          </Button>
        )}
      </DropdownTrigger>

      {renderMenuDropdown(menus)}
    </Dropdown>
  ));

  return (
    <>
      {hasTenant && accountTenants?.length > 1 && <MenuList />}
      <TenantSwitcher opened={opened} onVisible={setOpened} tenants={accountTenants} />
    </>
  );
};
