import { AnyObject, Comment, ExplicitAny } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createComment, getComment, getComments, updateComment } from '@/apis/content/comment';
import { paginateByCursor } from '@/helpers/pagination';

interface CommentKeys {
  create: ['commentService', 'create'];
  get: (options?: { comment?: string }) => ['commentService', 'comment', { comment?: string }];
  update: ['commentService', 'update'];
  list: (options?: AnyObject) => ['commentService', 'comments', AnyObject];
}

export const commentKeys: CommentKeys = {
  create: ['commentService', 'create'],
  get: ({ comment } = {}) => ['commentService', 'comment', { comment }],
  update: ['commentService', 'update'],
  list: (queryKey = {}) => ['commentService', 'comments', queryKey]
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

// Hook to list comments with pagination
export const useListComments = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: commentKeys.list(queryKey),
    queryFn: () => getComments(queryKey)
  });
  const paginatedResult = usePaginatedData(
    data?.content || [],
    queryKey?.cursor as string,
    queryKey?.limit as number
  );
  return { comments: paginatedResult.data, ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } = paginateByCursor(data, cursor, limit) || {};
  return { data: rs, hasNextPage, nextCursor };
};
