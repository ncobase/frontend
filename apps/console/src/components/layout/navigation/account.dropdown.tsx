import { useMemo } from 'react';
import React from 'react';

import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Icons } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useMenusByType } from '../layout.hooks';

import versionInfo from '@/../version.json';
import { AvatarButton } from '@/components/avatar/avatar_button';
import { useAccount } from '@/features/account/service';
import { MenuTree } from '@/features/system/menu/menu';
import { useCopyToClipboard } from '@/hooks/use_copy_to_clipboard';

const AppVersion = React.memo(() => {
  const { t } = useTranslation();
  const { copied, copy } = useCopyToClipboard();

  if (!versionInfo?.version) return null;

  return (
    <DropdownItem
      className={cn({
        'text-green-500': copied
      })}
      onClick={e => {
        e.preventDefault();
        copy(JSON.stringify(versionInfo, null, 2));
      }}
      title={copied ? t('actions.copied') : t('actions.copy')}
    >
      {copied ? <Icons name='IconClipboardCheck' className='stroke-green-600' /> : null}
      {copied ? t('actions.copied') : versionInfo?.version}
    </DropdownItem>
  );
});

// Recursive menu renderer for account dropdown - memoized
const AccountMenuItems = React.memo(
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
          if (menu.hidden || menu.disabled) return null;

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
                  <AccountMenuItems
                    menuItems={menu.children as MenuTree[]}
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
              key={menu.id || menu.label}
              onClick={() => menu.path && navigate(menu.path)}
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

export const AccountDropdown = ({ ...rest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAccount();

  // Get account menus - memoized to prevent unnecessary recalculations
  const accountMenus = useMenusByType('accounts');

  const renderMenuDropdown = useMemo(() => {
    const visibleItems = accountMenus.filter(item => !item.hidden && !item.disabled);

    return (
      <DropdownContent align='end' alignOffset={-16}>
        <AccountMenuItems menuItems={visibleItems} navigate={navigate} t={t} />
        <AppVersion />
      </DropdownContent>
    );
  }, [accountMenus, navigate, t]);

  return (
    <Dropdown {...rest}>
      <DropdownTrigger>
        <AvatarButton
          isLoading={isLoading}
          src={profile?.thumbnail}
          title={profile?.display_name || user?.username || ''}
          alt={profile?.display_name || user?.username || ''}
        />
      </DropdownTrigger>
      {renderMenuDropdown}
    </Dropdown>
  );
};
