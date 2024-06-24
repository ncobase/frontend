import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { ExplicitAny, Tag, Tags } from '@/types';

const ENDPOINT = '/v1/tags';

// create
export const createTag = async (payload: Tag): Promise<Tag> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getTag = async (id: string): Promise<Tag> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateTag = async (payload: Tag): Promise<Tag> => {
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteTag = async (id: string): Promise<Tag> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getTags = async (params: ExplicitAny): Promise<Tags> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
