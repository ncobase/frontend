import React, { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  Icons
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useMenusByType } from '../layout.hooks';

import { AvatarButton } from '@/components/avatar/avatar_button';
import { useAuthContext } from '@/features/account/context';
import { TenantSwitcher } from '@/features/account/pages/tenant_switcher';
import { useAccount } from '@/features/account/service';
import { MenuTree } from '@/features/system/menu/menu';
import { Tenant } from '@/features/system/tenant/tenant';

const TenantMenuItems = React.memo(
  ({
    menuItems,
    navigate,
    t,
    onTenantSwitch,
    depth = 0
  }: {
    menuItems: MenuTree[];
    navigate: (_path: string) => void;
    t: (_key: string) => string;
    onTenantSwitch: () => void;
    depth?: number;
  }) => {
    return (
      <>
        {menuItems.map(menu => {
          if (menu.hidden || menu.disabled) return null;

          const isTenantSwitch = menu.slug?.includes('tenant') && menu.slug?.includes('switch');
          const isLabel =
            (menu.slug?.includes('label') || menu.name?.includes('label')) &&
            menu.path?.includes('-');

          if (isLabel) return null;

          const hasChildren =
            menu.children && Array.isArray(menu.children) && menu.children.length > 0;

          if (hasChildren) {
            return (
              <div key={menu.id || menu.label}>
                <DropdownItem className='font-medium cursor-default'>
                  {menu.icon && <Icons name={menu.icon} className='-ml-0.5 mr-2.5' />}
                  {t(menu.label || '') || menu.name}
                </DropdownItem>
                <div className='ml-4'>
                  <TenantMenuItems
                    menuItems={menu.children as MenuTree[]}
                    navigate={navigate}
                    t={t}
                    onTenantSwitch={onTenantSwitch}
                    depth={depth + 1}
                  />
                </div>
              </div>
            );
          }

          return (
            <DropdownItem
              key={menu.id || menu.label}
              onClick={() => (isTenantSwitch ? onTenantSwitch() : menu.path && navigate(menu.path))}
              className={depth > 0 ? 'ml-4' : ''}
            >
              {menu.icon && <Icons name={menu.icon} className='-ml-0.5 mr-2.5' />}
              {t(menu.label || '') || menu.name}
            </DropdownItem>
          );
        })}
      </>
    );
  }
);

export const TenantDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tenantId } = useAuthContext();
  const [relatedTenants, setRelatedTenants] = useState<Tenant[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant>();
  const { tenants = [] } = useAccount();

  const hasTenant = !!tenantId;

  useEffect(() => {
    if (!tenants || tenants.length === 0) return;
    setRelatedTenants(tenants);
    const current = tenants.find(t => t.id === tenantId);
    if (current) {
      setCurrentTenant(current);
    } else if (tenants.length > 0) {
      setCurrentTenant(tenants[0]);
    }
  }, [tenants, tenantId]);

  const [opened, setOpened] = useState(false);

  // Get tenant menus - memoized to prevent unnecessary recalculations
  const tenantMenus = useMenusByType('tenants');

  const renderMenuDropdown = useMemo(() => {
    const visibleItems = tenantMenus.filter(item => !item.hidden && !item.disabled);
    if (!visibleItems.length) return null;

    return (
      <DropdownContent align='end' alignOffset={-16}>
        <TenantMenuItems
          menuItems={visibleItems}
          navigate={navigate}
          t={t}
          onTenantSwitch={() => setOpened(true)}
        />
      </DropdownContent>
    );
  }, [tenantMenus, navigate, t]);

  const MenuList = React.memo(() => (
    <Dropdown>
      <DropdownTrigger asChild>
        {currentTenant?.logo ? (
          <AvatarButton src={currentTenant?.logo} alt={currentTenant?.name} />
        ) : (
          <Button variant='unstyle' className='p-0 text-slate-400/70 [&>svg]:stroke-slate-400/70'>
            <Icons name='IconBuildingCommunity' /> {currentTenant?.name}
          </Button>
        )}
      </DropdownTrigger>

      {renderMenuDropdown}
    </Dropdown>
  ));

  return (
    <>
      {hasTenant && relatedTenants.length > 1 && <MenuList />}
      <TenantSwitcher opened={opened} onVisible={setOpened} tenants={relatedTenants} />
    </>
  );
};
