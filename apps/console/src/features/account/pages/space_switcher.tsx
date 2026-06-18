import React, { useCallback, useEffect, useState } from 'react';

import { Button, Modal, useToastMessage } from '@ncobase/react';
import { cn } from '@ncobase/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/features/account/context';
import { refreshSessionForCurrentSpace } from '@/features/account/session_propagation';
import type { Space } from '@/features/space/space';
import { useRedirectFromUrl } from '@/router/router.hooks';

interface SpaceOptionProps extends Space {
  isSelected: boolean;
  isSwitching?: boolean;
  onSelect: (_id: string) => void;
}

const SpaceOption = React.memo(
  ({ id, logo, name, slug, isSelected, isSwitching, onSelect }: SpaceOptionProps) => {
    return (
      <Button
        variant='unstyle'
        className={cn(
          'px-3 py-6 bg-transparent hover:bg-slate-50 rounded-md w-full',
          isSelected && 'bg-slate-50 disabled hidden',
          isSwitching && 'opacity-60 pointer-events-none'
        )}
        disabled={isSelected || isSwitching}
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
  const toast = useToastMessage();
  const queryClient = useQueryClient();
  const { isAuthenticated, spaceId, switchSpace, updateTokens } = useAuthContext();
  const redirect = useRedirectFromUrl();
  const [switchingSpaceId, setSwitchingSpaceId] = useState<string>();

  const hasSpace = !!spaceId;

  const onSelect = useCallback(
    async (id: string) => {
      if (!id || id === spaceId) {
        onVisible?.(false);
        return;
      }

      const previousSpaceId = spaceId;
      setSwitchingSpaceId(id);

      try {
        switchSpace(id);

        await refreshSessionForCurrentSpace(queryClient, updateTokens);

        redirect();
        onVisible?.(false);
        toast.success(t('space_switcher.switch_success', 'Space switched'));
      } catch (error) {
        switchSpace(previousSpaceId || '');

        console.error('Failed to switch space:', error);
        toast.error(t('space_switcher.switch_error', 'Failed to switch space'), {
          description: t(
            'space_switcher.switch_error_description',
            'Your session could not be refreshed for the selected space.'
          )
        });
      } finally {
        setSwitchingSpaceId(undefined);
      }
    },
    [spaceId, switchSpace, updateTokens, queryClient, redirect, onVisible, toast, t]
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
      onChange={nextOpen => {
        if (onVisible) {
          onVisible(nextOpen);
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
            isSwitching={switchingSpaceId === space.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </Modal>
  );
};
