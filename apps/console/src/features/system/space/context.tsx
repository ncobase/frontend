import React, { useCallback, useContext } from 'react';

import { useAuthContext } from '@/features/account/context';

interface SpaceContextValue {
  space_id: string;
  hasSpace: boolean;
  updateSpace: (_id: string) => void;
}

const SpaceContext = React.createContext<SpaceContextValue>({
  space_id: '',
  hasSpace: false,
  updateSpace: () => undefined
});

export const SpaceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { spaceId, switchSpace, isAuthenticated } = useAuthContext();

  // Simplified space update method that calls the AuthContext's switchSpace
  const handleUpdateSpace = useCallback(
    (id: string) => {
      switchSpace(id);
    },
    [switchSpace]
  );

  const value = {
    space_id: spaceId,
    hasSpace: isAuthenticated && !!spaceId,
    updateSpace: handleUpdateSpace
  };

  return <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>;
};

export const useSpaceContext = (): SpaceContextValue => useContext(SpaceContext);
