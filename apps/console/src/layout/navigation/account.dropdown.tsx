import React, { useMemo } from 'react';

import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Icons } from '@ncobase/react';
import { MenuTree } from '@ncobase/types';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useMenus } from '../page/page.context';

import versionInfo from '@/../version.json';
import { AvatarButton } from '@/components/avatar/avatar_button';
import { useAccount } from '@/features/account/service';
import { useCopyToClipboard } from '@/hooks/use_copy_to_clipboard';

// const AdminMenu = ({ isAdmin = false }) => {
//   const { t } = useTranslation();
//   const navigate = useNavigate();

//   if (!isAdmin) return null;

//   return (
//     <>
//       <DropdownItem onClick={() => navigate('/system/tenant')}>
//         <Icons name='IconBuilding' className='-ml-0.5 mr-2.5' />
//         {t('system.navigation')}
//       </DropdownItem>
//     </>
//   );
// };

const AppVersion = () => {
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
};

export const AccountDropdown = ({ ...rest }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profile, isLoading } = useAccount();

  const [menus] = useMenus();
  const accountMenus = useMemo(() => menus.filter(menu => menu.type === 'account'), [menus]);

  const renderMenuDropdown = (menuItems: MenuTree[]) => {
    const visibleItems = menuItems.filter(item => !item.hidden || item.disabled);
    if (!visibleItems.length) return null;
    return (
      <DropdownContent align='end' alignOffset={-16}>
        {/* <AdminMenu isAdmin={isAdministered} /> */}
        {visibleItems.map(renderLink)}
        <AppVersion />
      </DropdownContent>
    );
  };

  const renderLink = (menu: MenuTree) => {
    return (
      <DropdownItem onClick={() => navigate(menu.path)} key={menu.id || menu.label}>
        <Icons name={menu.icon} className='-ml-0.5 mr-2.5' />
        {t(menu.label) || menu.name}
      </DropdownItem>
    );
  };

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
      {renderMenuDropdown(accountMenus)}
    </Dropdown>
  );
};
