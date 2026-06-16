import React, { useCallback, useContext } from 'react';

import { useToastMessage } from '@ncobase/react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useAuthContext } from '@/features/account/context';
import { refreshSessionForCurrentSpace } from '@/features/account/session_propagation';

interface SpaceContextValue {
  space_id: string;
  hasSpace: boolean;
  updateSpace: (_id: string) => Promise<void>;
  isSwitching: boolean;
}

const SpaceContext = React.createContext<SpaceContextValue>({
  space_id: '',
  hasSpace: false,
  updateSpace: async () => undefined,
  isSwitching: false
});

export const SpaceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { t } = useTranslation();
  const toast = useToastMessage();
  const queryClient = useQueryClient();
  const { spaceId, switchSpace, updateTokens, isAuthenticated } = useAuthContext();
  const [isSwitching, setIsSwitching] = React.useState(false);

  const handleUpdateSpace = useCallback(
    async (id: string) => {
      if (!id || id === spaceId || isSwitching) return;
      const previousSpaceId = spaceId;
      setIsSwitching(true);

      try {
        switchSpace(id);
        await refreshSessionForCurrentSpace(queryClient, updateTokens);
      } catch (error) {
        switchSpace(previousSpaceId || '');
        toast.error(t('space_switcher.switch_error', 'Failed to switch space'), {
          description: t(
            'space_switcher.switch_error_description',
            'Your session could not be refreshed for the selected space.'
          )
        });
        throw error;
      } finally {
        setIsSwitching(false);
      }
    },
    [isSwitching, queryClient, spaceId, switchSpace, t, toast, updateTokens]
  );

  const value = {
    space_id: spaceId,
    hasSpace: isAuthenticated && !!spaceId,
    updateSpace: handleUpdateSpace,
    isSwitching
  };

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
};

export const useSpaceContext = (): SpaceContextValue => useContext(SpaceContext);
