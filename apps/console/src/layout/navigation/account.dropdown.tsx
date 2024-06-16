import React from 'react';

import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger, Icons } from '@ncobase/react';
import { MenuTree } from '@ncobase/types';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import versionInfo from '@/../version.json';
import { AvatarButton } from '@/components/avatar/avatar_button';
import { useAccount } from '@/features/account/service';
import { useListMenus } from '@/features/system/menu/service';
import { useCopyToClipboard } from '@/hooks/use_copy_to_clipboard';

const AdminMenu = ({ isAdmin = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <>
      <DropdownItem
        // icon={<Icons name='IconSettings' />}
        onClick={() => navigate('/system/tenant')}
      >
        {t('account.system.label')}
      </DropdownItem>
    </>
  );
};

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
  const { account, isAdministered, isLoading } = useAccount();
  const { menus = [] } = useListMenus({ type: 'account' });

  const renderMenuDropdown = (menuItems: MenuTree[]) => {
    const visibleItems = menuItems.filter(item => !item.hidden || item.disabled);
    if (!visibleItems.length) return null;
    return (
      <DropdownContent align='end' alignOffset={-16}>
        <AdminMenu isAdmin={isAdministered} />
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
          src={account?.profile?.thumbnail}
          title={account?.profile?.display_name || account?.username || ''}
          alt={account?.profile?.display_name || account?.username || ''}
        />
      </DropdownTrigger>
      {renderMenuDropdown(menus)}
    </Dropdown>
  );
};
