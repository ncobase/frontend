import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { ExplicitAny, Topic } from '@/types';

const ENDPOINT = '/content/topics';

// create
export const createTopic = async (payload: Topic): Promise<Topic> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getTopic = async (id: string): Promise<Topic> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateTopic = async (payload: Topic): Promise<Topic> => {
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteTopic = async (id: string): Promise<Topic> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getTopics = async (params: ExplicitAny): Promise<PaginationResult<Topic>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
