import { useMutation, useQuery } from '@tanstack/react-query';

import { QueryFormParams } from './config/query';

import { createComment, getComment, getComments, updateComment } from '@/apis/content/comment';
import { paginateByCursor, PaginationResult } from '@/helpers/pagination';
import { Comment } from '@/types';

interface CommentKeys {
  create: ['commentService', 'create'];
  get: (options?: { comment?: string }) => ['commentService', 'comment', { comment?: string }];
  update: ['commentService', 'update'];
  list: (options?: QueryFormParams) => ['commentService', 'comments', QueryFormParams];
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

// Hook to list comments with pagination
export const useListComments = (queryParams: QueryFormParams = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: commentKeys.list(queryParams),
    queryFn: () => getComments(queryParams)
  });

  const paginatedResult = usePaginatedData<Comment>(
    data || { items: [], total: 0, has_next: false },
    queryParams?.cursor as string,
    queryParams?.limit as number
  );

  return { ...paginatedResult, ...rest };
};

// Helper hook for paginated data
const usePaginatedData = <T>(
  data: { items: T[]; total: number; has_next: boolean; next?: string },
  cursor?: string,
  limit: number = 10
): PaginationResult<T> => {
  const { items, has_next, next } = paginateByCursor(data.items, data.total, cursor, limit) || {
    items: [],
    has_next: data.has_next,
    next: data.next
  };

  return { items, total: data.total, next, has_next };
};
