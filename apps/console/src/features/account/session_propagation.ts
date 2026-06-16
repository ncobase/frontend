import type { QueryClient, QueryKey } from '@tanstack/react-query';

import { Permission } from './permissions/service';
import { refreshAccessToken } from './token_service';

import { request } from '@/lib/api/request';
import { eventEmitter } from '@/lib/events';

type UpdateTokens = (_accessToken?: string, _refreshToken?: string) => void;

const identityQueryPrefixes: QueryKey[] = [
  ['accountService'],
  ['menuService', 'navigation'],
  ['menuService', 'authorized'],
  ['roleService'],
  ['roles'],
  ['role'],
  ['roleBySlug'],
  ['rolePermissions'],
  ['roleUsers'],
  ['enabledRoles'],
  ['permission'],
  ['permissions'],
  ['permissionsByAction'],
  ['permissionsBySubject'],
  ['defaultPermissions'],
  ['casbinService'],
  ['userService'],
  ['spaceService', 'spaceUsers'],
  ['spaceService', 'userSpaceRoles'],
  ['spaceService', 'spaceUsersByRole']
];

const spaceScopedQueryPrefixes: QueryKey[] = [
  ['accountService'],
  ['menuService'],
  ['spaceService'],
  ['orgService'],
  ['dictionaryService'],
  ['optionService'],
  ['userService'],
  ['resourceService'],
  ['mediaService'],
  ['topicService'],
  ['taxonomyService'],
  ['channelService'],
  ['distributionService'],
  ['commentService'],
  ['templateService'],
  ['seoService'],
  ['versionService'],
  ['workflowService'],
  ['workflows'],
  ['workflow-instances'],
  ['pending-tasks'],
  ['scheduleService'],
  ['schedules'],
  ['paymentService'],
  ['realtimeNotificationService']
];

const queryKeyStartsWith = (queryKey: QueryKey, prefix: QueryKey) => {
  if (!Array.isArray(queryKey) || !Array.isArray(prefix)) return false;
  if (queryKey.length < prefix.length) return false;
  return prefix.every((item, index) => queryKey[index] === item);
};

const matchesAnyPrefix = (queryKey: QueryKey, prefixes: QueryKey[]) =>
  prefixes.some(prefix => queryKeyStartsWith(queryKey, prefix));

const reportRejectedQueryOperations = (
  results: PromiseSettledResult<unknown>[],
  operation: string
) => {
  results.forEach(result => {
    if (result.status === 'rejected') {
      console.warn(`Session propagation query ${operation} failed:`, result.reason);
    }
  });
};

export const resetPermissionRuntimeState = () => {
  Permission.refreshState();
  request.clearState();
};

export const invalidateIdentityQueries = async (queryClient: QueryClient) => {
  const results = await Promise.allSettled(
    identityQueryPrefixes.map(queryKey =>
      queryClient.invalidateQueries({
        queryKey,
        refetchType: 'active'
      })
    )
  );
  reportRejectedQueryOperations(results, 'invalidation');
};

export const clearSpaceScopedQueries = async (queryClient: QueryClient) => {
  const predicate = ({ queryKey }: { queryKey: QueryKey }) =>
    matchesAnyPrefix(queryKey, spaceScopedQueryPrefixes);

  try {
    await queryClient.cancelQueries({ predicate }, { silent: true });
  } catch (error) {
    console.warn('Session propagation query cancellation failed:', error);
  }

  queryClient.removeQueries({ predicate, type: 'inactive' });

  try {
    await queryClient.invalidateQueries({ predicate, refetchType: 'active' });
  } catch (error) {
    console.warn('Session propagation query invalidation failed:', error);
  }
};

export const refetchIdentityQueries = async (queryClient: QueryClient) => {
  const results = await Promise.allSettled([
    queryClient.refetchQueries({ queryKey: ['accountService'], type: 'active' }),
    queryClient.refetchQueries({ queryKey: ['menuService', 'navigation'], type: 'active' })
  ]);
  reportRejectedQueryOperations(results, 'refetch');
};

export const propagateRbacChange = async (
  queryClient: QueryClient,
  options: { reason: string; affectedUserIds?: string[]; affectedSpaceIds?: string[] }
) => {
  resetPermissionRuntimeState();
  await invalidateIdentityQueries(queryClient);

  options.affectedUserIds?.forEach(userId => {
    if (!userId) return;
    queryClient.invalidateQueries({ queryKey: ['userService', 'user', { user: userId }] });
    queryClient.invalidateQueries({ queryKey: ['userService', 'userMeshes', { user: userId }] });
    queryClient.invalidateQueries({ queryKey: ['userService', 'userRoles', { user: userId }] });
  });

  options.affectedSpaceIds?.forEach(spaceId => {
    if (!spaceId) return;
    queryClient.invalidateQueries({ queryKey: ['spaceService', 'spaceUsers', { spaceId }] });
    queryClient.invalidateQueries({ queryKey: ['spaceService', 'userSpaceRoles'] });
  });

  eventEmitter.emit('rbac-change', {
    reason: options.reason,
    affectedUserIds: options.affectedUserIds || [],
    affectedSpaceIds: options.affectedSpaceIds || [],
    timestamp: Date.now()
  });
};

export const refreshSessionForCurrentSpace = async (
  queryClient: QueryClient,
  updateTokens: UpdateTokens
) => {
  const tokens = await refreshAccessToken();
  updateTokens(tokens.access_token, tokens.refresh_token);
  resetPermissionRuntimeState();
  await clearSpaceScopedQueries(queryClient);
  await refetchIdentityQueries(queryClient);
  return tokens;
};

export const queryKeyMatchesSessionPrefix = (queryKey: QueryKey, scope: 'identity' | 'space') =>
  matchesAnyPrefix(
    queryKey,
    scope === 'identity' ? identityQueryPrefixes : spaceScopedQueryPrefixes
  );
