import type { Page, Route } from '@playwright/test';

import {
  aiRun,
  listResponse,
  mediaItems,
  menuRecords,
  navigationForSpace,
  refreshedTokenResponse,
  resourceFiles,
  roles,
  runtimeOptionsByName,
  spaces,
  topicMedia,
  topics,
  user
} from './data';

type RequestLog = {
  method: string;
  path: string;
  headers: Record<string, string>;
  postData?: string | null;
};

export type ConsoleMockServer = {
  requests: RequestLog[];
  topicMediaSyncFailure: boolean;
};

const json = async (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  });

const text = async (route: Route, body: string, contentType = 'text/plain', status = 200) =>
  route.fulfill({ status, contentType, body });

const currentSpaceFromHeaders = (route: Route) =>
  route.request().headers()['x-md-sid'] || spaces.alpha.id;

const currentSpaceFromBody = (postData?: string | null) => {
  if (!postData) return undefined;
  try {
    const parsed = JSON.parse(postData);
    return parsed.space_id || parsed.spaceId;
  } catch {
    return undefined;
  }
};

const arrayBody = (postData?: string | null): string[] => {
  if (!postData) return [];
  try {
    const parsed = JSON.parse(postData);
    return Array.isArray(parsed) ? parsed.map(item => String(item)) : [];
  } catch {
    return [];
  }
};

const idsBody = (postData?: string | null): string[] => {
  if (!postData) return [];
  try {
    const parsed = JSON.parse(postData);
    return Array.isArray(parsed?.ids) ? parsed.ids.map((item: unknown) => String(item)) : [];
  } catch {
    return [];
  }
};

const mediaByResource = (resourceId: string | null) => {
  if (!resourceId) return Object.values(mediaItems);
  return Object.values(mediaItems).filter(media => media.resource_id === resourceId);
};

const topicMediaByMedia = (mediaId: string | null) => {
  if (!mediaId) return Object.values(topicMedia);
  return Object.values(topicMedia).filter(item => item.media_id === mediaId);
};

const topicById = (topicId?: string) => Object.values(topics).find(topic => topic.id === topicId);

const deleteImpactForResources = (ids: string[]) => {
  const impacts = ids.map(id => {
    const file = Object.values(resourceFiles).find(resource => resource.id === id) || {
      id,
      name: id,
      path: ''
    };
    const mediaReferences = mediaByResource(id);
    const topicReferences = mediaReferences.flatMap(media =>
      topicMediaByMedia(media.id).map(relation => ({
        media,
        relation,
        topic: topicById(relation.topic_id)
      }))
    );

    return {
      file,
      media_references: mediaReferences,
      topic_references: topicReferences,
      media_reference_total: mediaReferences.length,
      topic_reference_total: topicReferences.length,
      media_references_complete: true,
      topic_references_complete: true,
      errors: [],
      can_delete: mediaReferences.length === 0 && topicReferences.length === 0
    };
  });

  const mediaReferenceCount = impacts.reduce(
    (sum, impact) => sum + impact.media_reference_total,
    0
  );
  const topicReferenceCount = impacts.reduce(
    (sum, impact) => sum + impact.topic_reference_total,
    0
  );
  const errorCount = impacts.reduce((sum, impact) => sum + impact.errors.length, 0);
  const referencedFileCount = impacts.filter(
    impact => impact.media_reference_total > 0 || impact.topic_reference_total > 0
  ).length;

  return {
    impacts,
    summary: {
      file_count: impacts.length,
      referenced_file_count: referencedFileCount,
      media_reference_count: mediaReferenceCount,
      topic_reference_count: topicReferenceCount,
      error_count: errorCount,
      can_delete: referencedFileCount === 0 && errorCount === 0
    }
  };
};

const routePath = (route: Route) => {
  const url = new URL(route.request().url());
  return url.pathname.replace(/^\/api/, '') || '/';
};

const routeSearch = (route: Route) => new URL(route.request().url()).searchParams;

const requiresMultipartUpload = (route: Route) =>
  route.request().headers()['content-type']?.includes('multipart/form-data');

export const installConsoleApiMocks = async (
  page: Page,
  options: Partial<ConsoleMockServer> = {}
): Promise<ConsoleMockServer> => {
  const server: ConsoleMockServer = {
    requests: [],
    topicMediaSyncFailure: options.topicMediaSyncFailure || false
  };

  await page.route(/^https?:\/\/[^/]+\/api(\/|$).*/, async route => {
    const request = route.request();
    const method = request.method();
    const path = routePath(route);
    const search = routeSearch(route);
    const postData = request.postData();
    server.requests.push({ method, path, headers: request.headers(), postData });

    if (path === '/refresh-token' && method === 'POST') {
      const requestedSpace = currentSpaceFromBody(postData) || currentSpaceFromHeaders(route);
      return json(route, refreshedTokenResponse(requestedSpace));
    }

    if (path === '/account' && method === 'GET') return json(route, user);
    if (path === '/account/spaces' && method === 'GET') {
      return json(route, listResponse([spaces.alpha, spaces.beta]));
    }
    if (path === '/rt/notifications' && method === 'GET') return json(route, listResponse([]));
    if (path === '/rt/notifications/read-all' && method === 'PUT') return json(route, {});

    if (path === '/sys/menus/navigation' && method === 'GET') {
      return json(route, navigationForSpace(currentSpaceFromHeaders(route)));
    }

    if (path === '/sys/menus' && method === 'GET') return json(route, listResponse(menuRecords));
    if (path.startsWith('/sys/menus/') && method === 'PUT') {
      return json(route, { ...menuRecords[0], hidden: true, updated_at: Date.now() });
    }
    if (path === '/sys/options/batch' && method === 'POST') {
      return json(route, runtimeOptionsByName(arrayBody(postData)));
    }

    if (path === '/sys/roles' && method === 'GET') {
      return json(route, listResponse([roles.editor, roles.auditor]));
    }

    if (path === '/sys/spaces/space-alpha' && method === 'GET') return json(route, spaces.alpha);
    if (path === '/sys/spaces/space-beta' && method === 'GET') return json(route, spaces.beta);
    if (path === '/sys/spaces/space-alpha/users' && method === 'GET') {
      return json(route, {
        users: [
          {
            user_id: 'user-editor',
            username: 'editor',
            email: 'editor@example.com',
            role_ids: [roles.editor.id],
            access_level: 'standard',
            is_active: true,
            joined_at: 1761600800000
          }
        ],
        total: 1,
        cursor: ''
      });
    }
    if (path === '/sys/spaces/space-alpha/users/user-editor/roles' && method === 'GET') {
      return json(route, {
        user_id: 'user-editor',
        space_id: spaces.alpha.id,
        role_ids: [roles.editor.id]
      });
    }
    if (path === '/sys/spaces/space-alpha/users/roles' && method === 'POST') {
      return json(route, {
        user_id: 'user-editor',
        space_id: spaces.alpha.id,
        role_id: roles.auditor.id
      });
    }

    if (path === '/res' && method === 'GET') {
      return json(route, listResponse([resourceFiles.referenced, resourceFiles.clear]));
    }
    if (path === '/res/delete-impact' && method === 'POST') {
      return json(route, deleteImpactForResources(idsBody(postData)));
    }
    if (path === '/res/usage' && method === 'GET') {
      return json(route, {
        user_id: user.id,
        usage: 1024,
        quota: 1024 * 1024 * 1024,
        usage_percent: 0.01,
        file_count: 2
      });
    }
    if (path === '/res/resource-clear' && method === 'DELETE') return json(route, {});
    if (path === '/res/batch/delete' && method === 'POST') {
      return json(route, {
        operation_id: 'delete-op-1',
        total_files: 1,
        success_count: 1,
        failure_count: 0,
        deleted_ids: [resourceFiles.clear.id],
        failed_ids: []
      });
    }
    if (path === '/res' && method === 'POST' && requiresMultipartUpload(route)) {
      return json(route, resourceFiles.gallery);
    }
    if (path.startsWith('/res/thumb/') && method === 'GET') return text(route, '');
    if (path.endsWith('/download') && method === 'GET') return text(route, 'file-bytes');

    if (path === '/cms/media' && method === 'GET') {
      return json(route, listResponse(mediaByResource(search.get('resource_id'))));
    }
    if (path === '/cms/media' && method === 'POST') {
      return json(route, mediaItems.gallery);
    }
    if (path === '/cms/media/media-referenced' && method === 'GET') {
      return json(route, mediaItems.referenced);
    }
    if (path === '/cms/media/media-gallery' && method === 'GET') {
      return json(route, mediaItems.gallery);
    }

    if (path === '/cms/topics' && method === 'GET') {
      return json(route, listResponse([topics.referenced, topics.editable]));
    }
    if (path === '/cms/topics' && method === 'POST') {
      return json(route, { ...topics.editable, id: 'topic-created', title: 'Created Topic' });
    }
    if (path === '/cms/topics/topic-referenced' && method === 'GET') {
      return json(route, topics.referenced);
    }
    if (path === '/cms/topics/topic-editable' && method === 'GET') {
      return json(route, topics.editable);
    }
    if (path === '/cms/topics/topic-editable' && method === 'PUT') {
      return json(route, { ...topics.editable, updated_at: Date.now() });
    }
    if (path === '/cms/taxonomies' && method === 'GET') {
      return json(
        route,
        listResponse([{ id: 'taxonomy-news', name: 'News', slug: 'news', type: 'category' }])
      );
    }

    if (path === '/cms/topic-media/by-topic/topic-editable' && method === 'GET') {
      return json(route, listResponse([topicMedia.editableGallery]));
    }
    if (path === '/cms/topic-media/by-topic/topic-created' && method === 'GET') {
      return json(route, listResponse([]));
    }
    if (path === '/cms/topic-media' && method === 'GET') {
      return json(route, listResponse(topicMediaByMedia(search.get('media_id'))));
    }
    if (path === '/cms/topic-media' && method === 'POST') {
      if (server.topicMediaSyncFailure) {
        return json(route, { message: 'Topic media sync failed' }, 500);
      }
      return json(route, { ...topicMedia.editableGallery, id: `topic-media-${Date.now()}` });
    }
    if (path.startsWith('/cms/topic-media/') && method === 'PUT') {
      if (server.topicMediaSyncFailure) {
        return json(route, { message: 'Topic media sync failed' }, 500);
      }
      return json(route, { ...topicMedia.editableGallery, updated_at: Date.now() });
    }
    if (path.startsWith('/cms/topic-media/') && method === 'DELETE') return json(route, {});

    if (path === '/ai/status' && method === 'GET') {
      return json(route, {
        enabled: true,
        ready: true,
        configured: true,
        primary: 'openai/gpt-4o-mini',
        fallbacks: [],
        embedding_model: 'openai/text-embedding-3-small',
        providers: [
          {
            name: 'openai',
            type: 'openai',
            enabled: true,
            configured: true,
            supports_authentication: true
          }
        ],
        allowed_actions: ['content.summary'],
        policy: {
          enabled: true,
          max_prompt_chars: 12000,
          max_messages: 20,
          max_input_items: 20,
          max_output_tokens: 4096,
          timeout_seconds: 30,
          retry: 1,
          rate_limit_per_second: 2,
          circuit_breaker: { max_failures: 3, reset_seconds: 60 },
          store_raw_output: false,
          require_configured_model: true
        },
        safety: {
          redact_prompts: true,
          store_request_hash: true,
          max_error_chars: 1000,
          allow_system_prompts: true
        },
        stats: {
          total_requests: 1,
          success_requests: 1,
          failed_requests: 0,
          input_tokens: 12,
          output_tokens: 18,
          total_tokens: 30,
          cache_created_tokens: 0,
          cache_read_tokens: 0
        }
      });
    }
    if (path === '/ai/actions' && method === 'GET') {
      return json(route, [
        {
          key: 'content.summary',
          domain: 'content',
          name: 'Summarize Content',
          description: 'Create an editorial summary.',
          output_type: 'markdown',
          permissions: ['use:ai']
        }
      ]);
    }
    if (path === '/ai/complete' && method === 'POST') {
      return json(route, {
        run_id: aiRun.id,
        operation_id: aiRun.operation_id,
        content: 'Production-ready AI completion.',
        provider: 'openai',
        model: 'gpt-4o-mini',
        finish_reason: 'stop',
        input_tokens: 12,
        output_tokens: 18,
        total_tokens: 30,
        reasoning_tokens: 0,
        cache_usage: { created_tokens: 0, read_tokens: 0 }
      });
    }
    if (path === '/ai/actions/content.summary' && method === 'POST') {
      return json(route, {
        run_id: 'run-action-1',
        action: 'content.summary',
        content: 'Action summary output.',
        provider: 'openai',
        model: 'gpt-4o-mini',
        total_tokens: 25
      });
    }
    if (path === '/ai/runs' && method === 'GET') {
      return json(route, listResponse([aiRun]));
    }
    if (path === '/ai/runs/run-playground-1' && method === 'GET') {
      return json(route, aiRun);
    }
    if (path === '/ai/usage' && method === 'GET') {
      return json(route, { total_requests: 1, total_tokens: 30, buckets: [] });
    }
    if (path === '/ai/stream' && method === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: [
          `event: start\ndata: ${JSON.stringify({ run_id: 'run-stream-1', operation_id: 'op-stream-1' })}`,
          `event: chunk\ndata: ${JSON.stringify({ run_id: 'run-stream-1', content: 'Streamed ', done: false })}`,
          `event: chunk\ndata: ${JSON.stringify({ run_id: 'run-stream-1', content: 'completion.', done: true, total_tokens: 12, finish_reason: 'stop' })}`,
          `event: run\ndata: ${JSON.stringify({ ...aiRun, id: 'run-stream-1', mode: 'stream' })}`
        ].join('\n\n')
      });
    }

    return json(route, { message: `Unhandled E2E API route: ${method} ${path}` }, 404);
  });

  return server;
};
