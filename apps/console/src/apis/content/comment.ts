import { PaginationResult } from '@ncobase/react';
import { buildQueryString } from '@ncobase/utils';

import { request } from '@/apis/request';
import { Comment, ExplicitAny } from '@/types';

const ENDPOINT = '/content/comments';

// create
export const createComment = async (payload: Comment): Promise<Comment> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getComment = async (id: string): Promise<Comment> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateComment = async (payload: Comment): Promise<Comment> => {
  return request.put(`${ENDPOINT}/${payload.id}`, { ...payload });
};

// delete
export const deleteComment = async (id: string): Promise<Comment> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getComments = async (params: ExplicitAny): Promise<PaginationResult<Comment>> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}${queryString ? `?${queryString}` : ''}`);
};
