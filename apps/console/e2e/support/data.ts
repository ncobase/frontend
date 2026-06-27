import { createTestToken, permissions } from './auth';

export const spaces = {
  alpha: {
    id: 'space-alpha',
    name: 'Alpha Workspace',
    slug: 'alpha',
    type: 'private',
    order: 1,
    disabled: false
  },
  beta: {
    id: 'space-beta',
    name: 'Beta Workspace',
    slug: 'beta',
    type: 'private',
    order: 2,
    disabled: false
  }
};

export const user = {
  id: 'user-admin',
  username: 'admin',
  email: 'admin@example.com',
  display_name: 'Console Admin',
  roles: ['admin'],
  permissions,
  spaces: [spaces.alpha, spaces.beta],
  user: {
    id: 'user-admin',
    username: 'admin',
    email: 'admin@example.com'
  },
  profile: {
    display_name: 'Console Admin',
    thumbnail: ''
  }
};

const menu = (
  id: string,
  name: string,
  path: string,
  type: 'header' | 'sidebar' | 'account' | 'space',
  perms = '*:*',
  children: any[] = []
) => ({
  id,
  name,
  label: name,
  slug: id,
  path,
  type,
  perms,
  order: 100,
  disabled: false,
  hidden: false,
  children
});

export const navigationForSpace = (spaceId: string) => {
  const spaceLabel = spaceId === spaces.beta.id ? 'Beta Dashboard' : 'Alpha Dashboard';

  return {
    headers: [
      menu('nav-dashboard', spaceLabel, '/dash', 'header'),
      menu('nav-content', 'Content', '/content', 'header', 'read:content'),
      menu('nav-resources', 'Resources', '/res', 'header', 'read:resources'),
      menu('nav-ai', 'AI', '/ai', 'header', 'read:ai'),
      menu('nav-system', 'System', '/system', 'header', 'read:system')
    ],
    sidebars: [
      menu('side-dashboard', spaceLabel, '/dash', 'sidebar'),
      menu('side-content', 'Content', '/content', 'sidebar', 'read:content', [
        menu('side-topics', 'Topics', '/content/topics', 'sidebar', 'read:content'),
        menu('side-media', 'Media', '/content/media', 'sidebar', 'read:content')
      ]),
      menu('side-resources', 'Resources', '/res', 'sidebar', 'read:resources'),
      menu('side-ai', 'AI', '/ai', 'sidebar', 'read:ai', [
        menu('side-ai-playground', 'Playground', '/ai/playground', 'sidebar', 'use:ai'),
        menu('side-ai-actions', 'Actions', '/ai/actions', 'sidebar', 'use:ai'),
        menu('side-ai-runs', 'Runs', '/ai/runs', 'sidebar', 'read:ai')
      ]),
      menu('side-system', 'System', '/system', 'sidebar', 'read:system', [
        menu('side-system-menus', 'Menus', '/system/menus', 'sidebar', 'manage:menu'),
        menu('side-system-roles', 'Roles', '/system/roles', 'sidebar', 'read:roles')
      ])
    ],
    accounts: [menu('account-profile', 'Profile', '/account/profile', 'account')],
    spaces: [
      menu('space-switch', 'Switch Space', '/spaces/switch', 'space'),
      menu('space-list', 'Spaces', '/spaces', 'space', 'read:spaces')
    ]
  };
};

export const refreshedTokenResponse = (spaceId: string) => ({
  access_token: createTestToken(spaceId),
  refresh_token: createTestToken(spaceId)
});

export const listResponse = <T>(items: T[], overrides: Record<string, unknown> = {}) => ({
  items,
  total: items.length,
  has_next: false,
  has_prev: false,
  ...overrides
});

type ConsoleOption = {
  id: string;
  name: string;
  type: 'object';
  value: string;
  autoload: boolean;
  category: string;
  description: string;
  created_at: number;
  updated_at: number;
};

const option = (
  name: string,
  value: Record<string, unknown>,
  category: string,
  description: string
): ConsoleOption => ({
  id: `option-${name.replace(/[^a-z0-9]+/gi, '-')}`,
  name,
  type: 'object',
  value: JSON.stringify(value),
  autoload: true,
  category,
  description,
  created_at: 1761600000000,
  updated_at: 1761600000000
});

export const runtimeOptions: Record<string, ConsoleOption> = {
  'resource.upload': option(
    'resource.upload',
    {
      max_upload_size: 5368709120,
      allowed_types: ['*'],
      default_storage: 'configured'
    },
    'resource',
    'Upload size, accepted file types, and default storage provider.'
  ),
  'resource.image': option(
    'resource.image',
    {
      enable_thumbnails: true,
      default_thumbnail_width: 300,
      default_thumbnail_height: 300,
      enable_resizing: true,
      max_image_width: 2048,
      max_image_height: 2048,
      compression_quality: 85
    },
    'resource',
    'Default image processing limits for upload and thumbnail workflows.'
  ),
  'resource.quota': option(
    'resource.quota',
    {
      enable_quotas: true,
      enable_enforcement: true,
      default_quota: 10737418240,
      warning_threshold: 0.8,
      quota_check_interval: '24h'
    },
    'resource',
    'Quota calculation and enforcement policy.'
  ),
  'system.storage_policy': option(
    'system.storage_policy',
    {
      default_provider: 'configured',
      allow_public_links: true,
      require_owner_scope: true,
      audit_downloads: true
    },
    'policy',
    'Storage provider selection and access policy.'
  )
};

export const runtimeOptionsByName = (names: string[]) =>
  names.reduce<Record<string, ConsoleOption>>((result, name) => {
    const record = runtimeOptions[name];
    if (record) result[name] = record;
    return result;
  }, {});

export const resourceFiles = {
  referenced: {
    id: 'resource-referenced',
    name: 'referenced-image.jpg',
    original_name: 'Referenced Image.jpg',
    path: 'content/media/referenced-image.jpg',
    type: 'image/jpeg',
    category: 'image',
    size: 42000,
    access_level: 'private',
    owner_id: user.id,
    created_at: 1761600000000,
    download_url: '/api/res/resource-referenced/download',
    thumbnail_url: '/api/res/thumb/resource-referenced'
  },
  clear: {
    id: 'resource-clear',
    name: 'clear-document.pdf',
    original_name: 'Clear Document.pdf',
    path: 'documents/clear-document.pdf',
    type: 'application/pdf',
    category: 'document',
    size: 20480,
    access_level: 'private',
    owner_id: user.id,
    created_at: 1761600100000,
    download_url: '/api/res/resource-clear/download'
  },
  gallery: {
    id: 'resource-gallery',
    name: 'gallery-image.jpg',
    original_name: 'Gallery Image.jpg',
    path: 'content/media/gallery-image.jpg',
    type: 'image/jpeg',
    category: 'image',
    size: 32000,
    access_level: 'private',
    owner_id: user.id,
    created_at: 1761600200000,
    download_url: '/api/res/resource-gallery/download',
    thumbnail_url: '/api/res/thumb/resource-gallery'
  }
};

export const mediaItems = {
  referenced: {
    id: 'media-referenced',
    title: 'Referenced CMS Image',
    type: 'image',
    resource_id: resourceFiles.referenced.id,
    url: '/api/res/resource-referenced/download',
    mime_type: 'image/jpeg',
    size: resourceFiles.referenced.size,
    space_id: spaces.alpha.id,
    owner_id: user.id,
    resource: resourceFiles.referenced
  },
  gallery: {
    id: 'media-gallery',
    title: 'Gallery CMS Image',
    type: 'image',
    resource_id: resourceFiles.gallery.id,
    url: '/api/res/resource-gallery/download',
    mime_type: 'image/jpeg',
    size: resourceFiles.gallery.size,
    space_id: spaces.alpha.id,
    owner_id: user.id,
    resource: resourceFiles.gallery
  }
};

export const topics = {
  referenced: {
    id: 'topic-referenced',
    name: 'referenced-topic',
    title: 'Referenced Topic',
    content: 'Topic with linked media.',
    taxonomy_id: 'taxonomy-news',
    content_type: 'article',
    status: 1,
    private: false,
    markdown: false,
    space_id: spaces.alpha.id,
    created_at: 1761600300000
  },
  editable: {
    id: 'topic-editable',
    name: 'editable-topic',
    title: 'Editable Topic',
    content: 'Editable topic content.',
    taxonomy_id: 'taxonomy-news',
    content_type: 'article',
    status: 0,
    private: false,
    markdown: false,
    space_id: spaces.alpha.id,
    created_at: 1761600400000
  }
};

export const topicMedia = {
  referenced: {
    id: 'topic-media-referenced',
    topic_id: topics.referenced.id,
    media_id: mediaItems.referenced.id,
    type: 'featured',
    order: 0,
    media: mediaItems.referenced
  },
  editableGallery: {
    id: 'topic-media-gallery',
    topic_id: topics.editable.id,
    media_id: mediaItems.gallery.id,
    type: 'gallery',
    order: 0,
    media: mediaItems.gallery
  }
};

export const roles = {
  editor: {
    id: 'role-editor',
    name: 'Editor',
    slug: 'editor',
    description: 'Content editor role',
    disabled: false,
    created_at: 1761600500000
  },
  auditor: {
    id: 'role-auditor',
    name: 'Auditor',
    slug: 'auditor',
    description: 'Audit role',
    disabled: false,
    created_at: 1761600600000
  }
};

export const menuRecords = [
  menu('menu-content', 'Content', '/content', 'header', 'read:content'),
  menu('menu-ai', 'AI', '/ai', 'header', 'read:ai')
];

export const aiRun = {
  id: 'run-playground-1',
  operation_id: 'op-playground-1',
  mode: 'complete',
  status: 'succeeded',
  provider: 'openai',
  model: 'gpt-4o-mini',
  input_tokens: 12,
  output_tokens: 18,
  total_tokens: 30,
  reasoning_tokens: 0,
  cache_created_tokens: 0,
  cache_read_tokens: 0,
  duration_ms: 320,
  estimated_cost: 0.00012,
  currency: 'USD',
  metadata: {
    source: 'console.ai.playground'
  },
  space_id: spaces.alpha.id,
  user_id: user.id,
  created_at: 1761600700000,
  updated_at: 1761600700500,
  request_hash: 'reqhash',
  response_hash: 'resphash'
};
