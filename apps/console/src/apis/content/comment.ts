import { createApi } from '@/apis/factory';
import { Comment } from '@/types';

export const commentApi = createApi<Comment>('/cms/comments');

export const createComment = commentApi.create;
export const getComment = commentApi.get;
export const updateComment = commentApi.update;
export const deleteComment = commentApi.delete;
export const getComments = commentApi.list;
