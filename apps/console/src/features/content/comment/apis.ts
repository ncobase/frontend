import { Comment } from './comment';

import { createApi } from '@/lib/api/factory';

export const commentApi = createApi<Comment>('/cms/comments');

export const createComment = commentApi.create;
export const getComment = commentApi.get;
export const updateComment = commentApi.update;
export const deleteComment = commentApi.delete;
export const getComments = commentApi.list;
