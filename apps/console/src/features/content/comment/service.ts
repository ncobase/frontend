import { useMutation, useQuery } from '@tanstack/react-query';

import { Comment } from './comment';
import { QueryFormParams } from './config/query';

import {
  createComment,
  deleteComment,
  getComment,
  getComments,
  updateComment
} from '@/features/content/comment/apis';

interface CommentKeys {
  create: ['commentService', 'create'];
  get: (_options?: { comment?: string }) => ['commentService', 'comment', { comment?: string }];
  update: ['commentService', 'update'];
  list: (_options?: QueryFormParams) => ['commentService', 'comments', QueryFormParams];
}

export const commentKeys: CommentKeys = {
  create: ['commentService', 'create'],
  get: ({ comment } = {}) => ['commentService', 'comment', { comment }],
  update: ['commentService', 'update'],
  list: (queryParams = {}) => ['commentService', 'comments', queryParams]
};

// Hook to query a specific comment by ID or Slug
export const useQueryComment = (comment: string) =>
  useQuery({ queryKey: commentKeys.get({ comment }), queryFn: () => getComment(comment) });

// Hook for create comment mutation
export const useCreateComment = () =>
  useMutation({ mutationFn: (payload: Pick<Comment, keyof Comment>) => createComment(payload) });

// Hook for update comment mutation
export const useUpdateComment = () =>
  useMutation({ mutationFn: (payload: Pick<Comment, keyof Comment>) => updateComment(payload) });

// Hook for delete comment mutation
export const useDeleteComment = () =>
  useMutation({ mutationFn: (id: string) => deleteComment(id) });

// Hook to list comments
export const useListComments = (queryParams: QueryFormParams) => {
  return useQuery({
    queryKey: commentKeys.list(queryParams),
    queryFn: () => getComments(queryParams)
  });
};
