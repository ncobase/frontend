import { ExplicitAny, Application, Applications, ApplicationTrees } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/applications';

// create
export const createApplication = async (payload: Application): Promise<Application> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getApplication = async (id: string): Promise<Application> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateApplication = async (payload: Application): Promise<Application> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteApplication = async (id: string): Promise<Application> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getApplications = async (params: ExplicitAny): Promise<Applications> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

// get application tree
export const getApplicationTree = async (
  application: string,
  type?: string
): Promise<ApplicationTrees> => {
  const queryParams = buildQueryString({ application, type });
  return request.get(`/trees/applications?${queryParams}`);
};
