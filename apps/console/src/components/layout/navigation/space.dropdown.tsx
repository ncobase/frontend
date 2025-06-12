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
import { SpaceSwitcher } from '@/features/account/pages/space_switcher';
import { useAccount } from '@/features/account/service';
import { MenuTree } from '@/features/system/menu/menu';
import { Space } from '@/features/system/space/space';

const SpaceMenuItems = React.memo(
  ({
    menuItems,
    navigate,
    t,
    onSpaceSwitch,
    depth = 0
  }: {
    menuItems: MenuTree[];
    navigate: (_path: string) => void;
    t: (_key: string) => string;
    onSpaceSwitch: () => void;
    depth?: number;
  }) => {
    return (
      <>
        {menuItems.map(menu => {
          if (menu.hidden || menu.disabled) return null;

          const isSpaceSwitch = menu.slug?.includes('space') && menu.slug?.includes('switch');
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
                  <SpaceMenuItems
                    menuItems={menu.children as MenuTree[]}
                    navigate={navigate}
                    t={t}
                    onSpaceSwitch={onSpaceSwitch}
                    depth={depth + 1}
                  />
                </div>
              </div>
            );
          }

          return (
            <DropdownItem
              key={menu.id || menu.label}
              onClick={() => (isSpaceSwitch ? onSpaceSwitch() : menu.path && navigate(menu.path))}
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

export const SpaceDropdown = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { spaceId } = useAuthContext();
  const [relatedSpaces, setRelatedSpaces] = useState<Space[]>([]);
  const [currentSpace, setCurrentSpace] = useState<Space>();
  const { spaces = [] } = useAccount();

  const hasSpace = !!spaceId;

  useEffect(() => {
    if (!spaces || spaces.length === 0) return;
    setRelatedSpaces(spaces);
    const current = spaces.find(t => t.id === spaceId);
    if (current) {
      setCurrentSpace(current);
    } else if (spaces.length > 0) {
      setCurrentSpace(spaces[0]);
    }
  }, [spaces, spaceId]);

  const [opened, setOpened] = useState(false);

  // Get space menus - memoized to prevent unnecessary recalculations
  const spaceMenus = useMenusByType('spaces');

  const renderMenuDropdown = useMemo(() => {
    const visibleItems = spaceMenus.filter(item => !item.hidden && !item.disabled);
    if (!visibleItems.length) return null;

    return (
      <DropdownContent align='end' alignOffset={-16}>
        <SpaceMenuItems
          menuItems={visibleItems}
          navigate={navigate}
          t={t}
          onSpaceSwitch={() => setOpened(true)}
        />
      </DropdownContent>
    );
  }, [spaceMenus, navigate, t]);

  const MenuList = React.memo(() => (
    <Dropdown>
      <DropdownTrigger asChild>
        {currentSpace?.logo ? (
          <AvatarButton src={currentSpace?.logo} alt={currentSpace?.name} />
        ) : (
          <Button variant='unstyle' className='p-0 text-slate-400/70 [&>svg]:stroke-slate-400/70'>
            <Icons name='IconBuildingCommunity' /> {currentSpace?.name}
          </Button>
        )}
      </DropdownTrigger>

      {renderMenuDropdown}
    </Dropdown>
  ));

  return (
    <>
      {hasSpace && relatedSpaces.length > 1 && <MenuList />}
      <SpaceSwitcher opened={opened} onVisible={setOpened} spaces={relatedSpaces} />
    </>
  );
};
