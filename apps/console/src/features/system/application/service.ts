import { useMutation, useQuery } from '@tanstack/react-query';
import { AnyObject, Application, ExplicitAny } from '@ncobase/types';

import {
  createApplication,
  getApplication,
  getApplications,
  getApplicationTree,
  updateApplication
} from '@/apis/application/application';
import { paginateByCursor } from '@/helpers/pagination';

type ApplicationMutationFn = (
  payload: Pick<Application, keyof Application>
) => Promise<Application>;
type ApplicationQueryFn<T> = () => Promise<T>;

interface ApplicationKeys {
  create: ['applicationService', 'create'];
  get: (options?: {
    application?: string;
  }) => ['applicationService', 'application', { application?: string }];
  tree: (options?: AnyObject) => ['applicationService', 'tree', AnyObject];
  update: ['applicationService', 'update'];
  list: (options?: AnyObject) => ['applicationService', 'applications', AnyObject];
}

export const applicationKeys: ApplicationKeys = {
  create: ['applicationService', 'create'],
  get: ({ application } = {}) => ['applicationService', 'application', { application }],
  tree: (queryKey = {}) => ['applicationService', 'tree', queryKey],
  update: ['applicationService', 'update'],
  list: (queryKey = {}) => ['applicationService', 'applications', queryKey]
};

const useApplicationMutation = (mutationFn: ApplicationMutationFn) => useMutation({ mutationFn });

const useQueryApplicationData = <T>(queryKey: unknown[], queryFn: ApplicationQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryApplication = (application: string) =>
  useQueryApplicationData(applicationKeys.get({ application }), () => getApplication(application));

export const useQueryApplicationTreeData = (application: string, type?: string) =>
  useQueryApplicationData(applicationKeys.tree({ application, type }), () =>
    getApplicationTree(application, type)
  );

export const useCreateApplication = () =>
  useApplicationMutation(payload => createApplication(payload));
export const useUpdateApplication = () =>
  useApplicationMutation(payload => updateApplication(payload));

export const useListApplications = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: applicationKeys.list(queryKey),
    queryFn: () => getApplications(queryKey)
  });
  const { content: applications = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(applications, cursor as string, limit as number);

  return { applications: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
