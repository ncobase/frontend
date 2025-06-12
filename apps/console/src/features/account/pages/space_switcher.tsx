import React, { useCallback, useEffect } from 'react';

import { Button, Modal } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/features/account/context';
import { Space } from '@/features/system/space/space';
import { useRedirectFromUrl } from '@/router/router.hooks';

interface SpaceOptionProps extends Space {
  isSelected: boolean;
  onSelect: (_id: string) => void;
}

const SpaceOption = React.memo(
  ({ id, logo, name, slug, isSelected, onSelect }: SpaceOptionProps) => {
    return (
      <Button
        variant='unstyle'
        className={cn(
          'px-3 py-6 bg-transparent hover:bg-slate-50 rounded-md w-full',
          isSelected && 'bg-slate-50 disabled hidden'
        )}
        onClick={() => onSelect(id)}
      >
        <div className='flex'>
          {logo && (
            <img
              src={logo}
              className='inline-flex items-center justify-center size-[1.75rem] font-medium rounded-full bg-slate-50'
              alt={name}
            />
          )}
          <div className='flex-1'>
            <p className='font-medium text-slate-800'>{name}</p>
            <p className='text-slate-400'>{slug || name}</p>
          </div>
        </div>
      </Button>
    );
  }
);

export const SpaceSwitcher = ({
  opened = false,
  spaces = [],
  onVisible
}: {
  opened?: boolean;
  spaces?: Space[];
  onVisible?: (_visible: boolean) => void;
}) => {
  const { t } = useTranslation();
  const { isAuthenticated, spaceId, switchSpace } = useAuthContext();
  const redirect = useRedirectFromUrl();

  const hasSpace = !!spaceId;

  const onSelect = useCallback(
    (id: string) => {
      if (!id || !spaceId) return;
      if (id !== spaceId) {
        switchSpace(id);
        redirect();
      }
      if (onVisible) {
        onVisible(false);
      }
    },
    [spaceId, redirect, onVisible, switchSpace]
  );

  useEffect(() => {
    if (isAuthenticated && !hasSpace && spaces.length > 1 && onVisible) {
      onVisible(true);
    } else if (isAuthenticated && !hasSpace && spaces.length === 1) {
      onSelect(spaces[0].id);
    }
  }, [isAuthenticated, hasSpace, spaces.length, onSelect]);

  if (!spaces.length || !isAuthenticated) return null;

  return (
    <Modal
      title={t('space_switcher.title')}
      isOpen={opened}
      onChange={() => {
        if (onVisible) {
          onVisible(!opened);
        }
      }}
      className='max-w-80 max-h-40'
    >
      <div
        className={cn(
          'grid gap-2',
          spaces.filter((space: Space) => space.id !== spaceId).length > 1 && 'grid-cols-2'
        )}
      >
        {spaces.map((space: Space) => (
          <SpaceOption
            key={space.id}
            {...space}
            isSelected={space.id === spaceId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Modal>
  );
};
