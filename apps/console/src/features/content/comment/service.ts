import { AnyObject, Comment, ExplicitAny } from '@ncobase/types';
import { useMutation, useQuery } from '@tanstack/react-query';

import { createComment, getComment, getComments, updateComment } from '@/apis/content/comment';
import { paginateByCursor } from '@/helpers/pagination';

type CommentMutationFn = (payload: Pick<Comment, keyof Comment>) => Promise<Comment>;
type CommentQueryFn<T> = () => Promise<T>;

interface CommentKeys {
  create: ['commentService', 'create'];
  get: (options?: { comment?: string }) => ['commentService', 'comment', { comment?: string }];
  tree: (options?: AnyObject) => ['commentService', 'tree', AnyObject];
  update: ['commentService', 'update'];
  list: (options?: AnyObject) => ['commentService', 'comments', AnyObject];
}

export const commentKeys: CommentKeys = {
  create: ['commentService', 'create'],
  get: ({ comment } = {}) => ['commentService', 'comment', { comment }],
  tree: (queryKey = {}) => ['commentService', 'tree', queryKey],
  update: ['commentService', 'update'],
  list: (queryKey = {}) => ['commentService', 'comments', queryKey]
};

const useCommentMutation = (mutationFn: CommentMutationFn) => useMutation({ mutationFn });

const useQueryCommentData = <T>(queryKey: unknown[], queryFn: CommentQueryFn<T>) => {
  const { data, ...rest } = useQuery<T>({ queryKey, queryFn });
  return { data, ...rest };
};

export const useQueryComment = (comment: string) =>
  useQueryCommentData(commentKeys.get({ comment }), () => getComment(comment));

export const useCreateComment = () => useCommentMutation(payload => createComment(payload));
export const useUpdateComment = () => useCommentMutation(payload => updateComment(payload));

export const useListComments = (queryKey: AnyObject = {}) => {
  const { data, ...rest } = useQuery({
    queryKey: commentKeys.list(queryKey),
    queryFn: () => getComments(queryKey)
  });
  const { content: comments = [] } = data || {};
  const { cursor, limit } = queryKey;
  const paginatedResult = usePaginatedData(comments, cursor as string, limit as number);

  return { comments: paginatedResult.data, ...paginatedResult, ...rest };
};

const usePaginatedData = (data: ExplicitAny[], cursor?: string, limit?: number) => {
  const { rs, hasNextPage, nextCursor } =
    (data && paginateByCursor(data, cursor, limit)) || ({} as ExplicitAny);
  return { data: rs, hasNextPage, nextCursor };
};
