# Console Feature Operation Spec

This document describes how major console operations should behave in the UI, what they call, and
which cross-feature effects they must handle.

## Global Operation Rules

- Every protected request includes `Authorization` and current `x-md-sid` when available.
- Create/update/delete mutations must show saving/deleting state, success feedback, and field or
  request errors.
- Dangerous operations must use a confirmation dialog that names the target and describes impact.
- Product routes must not ship placeholder handlers, debug-only `console.log` actions, or native browser
  `prompt`/`confirm` flows when the project dialog/toast system can express the operation.
- Successful mutations invalidate the exact React Query keys that changed; broad invalidation is a
  fallback only when the impact is cross-cutting.
- Permission failures render 403 or a local unavailable state; they must not look like generic
  network errors.
- Feature flags must be checked for development-only surfaces before routes and menus are exposed.

## Auth and Account

### Login

- Entry: `/login`.
- Actions: submit username/email/password, handle failed attempts, navigate to redirect target.
- API: `POST /login`.
- Success effects: store access/refresh token, refresh permission state, load `/account`, set default
  space if available, refetch navigation menus.
- Failure states: invalid credentials, account locked after configured attempts, MFA challenge,
  captcha required, network error.
- Gaps: MFA challenge page and captcha flow are not complete.

### Token Refresh

- Entry: automatic before protected non-auth requests.
- API: `POST /refresh-token`.
- Success effects: replace access/refresh tokens, clear permission token cache, and reset request
  circuit/dedupe state.
- Failure states: clear session, redirect to `/login?redirect=...`.
- Space switch: active space changes call the shared `refreshSessionForCurrentSpace` flow. It sends
  the selected `x-md-sid` to `/refresh-token`, stores the returned tokens, resets permission/request
  runtime state, cancels/removes stale inactive space-scoped queries, invalidates active
  space-scoped queries, and actively refetches `/account` plus navigation menus. Cache refetch
  failures are logged and do not roll back a successful token refresh.

### Logout

- Entry: `/logout` or account dropdown.
- API: `POST /logout`.
- Success effects: clear tokens, AuthContext, permission cache, and React Query cache; navigate to
  login.
- Failure states: server logout failure still performs local cleanup and reports a warning.
- Quick logout uses the project confirmation dialog before calling the logout mutation.

### Session Management

- Entry: `/account/sessions`.
- Actions: list sessions, delete one session, deactivate all other sessions.
- API: `/sessions`, `/sessions/:session_id`, `/sessions/deactivate-all`.
- Required UX: current session must be visually protected; bulk deactivation needs confirmation.

## System Management

### Users

- Entry: `/system/users`.
- Actions: list/search, create user with profile, edit meshes, reset/update password, enable/disable,
  assign roles, manage employee and API key data.
- API: `/sys/users`, `/sys/users/:username/*`, `/sys/employees`.
- Cache effects: invalidate user list, single user meshes, roles for user, employees when changed.
- Required permissions: `read:users`, `create:users`, `update:users`, `delete:users`,
  employee-specific permissions.
- Gaps: not every API wrapper has a visible, tested UI action.

### Roles, Permissions, and Policies

- Entry: `/system/roles`, `/system/permissions`, `/system/access`.
- Actions: CRUD roles/permissions, assign permission to role, manage Casbin policy, inspect
  activities.
- API: `/sys/roles`, `/sys/permissions`, `/sys/policies`, `/sys/activities`.
- Cross-effects: role/permission changes affect menus, token permissions, and current route access.
- Cache effects: role, permission, Casbin, menu, and space-role mutations call shared RBAC
  propagation. The current browser resets permission/request runtime state, invalidates identity and
  navigation queries, invalidates affected user/space records when ids are known, and emits
  `rbac-change` for local listeners.
- Current assignment behavior:
  - Permission list row selection feeds bulk state so assignment actions only appear with selected
    permissions.
  - Assign-permission-to-role uses typed role assignment hooks instead of raw `fetch`, disables confirm
    until roles are selected, and resets state on close.
  - Role list permission assignment opens a modal, loads current role permissions, computes added and
    removed ids, and calls assign/remove hooks before closing.
- Required UX: show affected users/menus before destructive changes. Affected users in other
  browsers or devices still need token refresh, re-login, or a future live permission refresh event.

### Menus

- Entry: `/system/menus`.
- Actions: CRUD, move, reorder, enable/disable, show/hide, navigation preview.
- API: `/sys/menus`, `/sys/menus/tree`, `/sys/menus/navigation`, `/sys/menus/authorized/:userId`.
- Cache effects: invalidate `menuService` list/tree/navigation queries and run shared RBAC
  propagation so current account/navigation permission state is refreshed.
- Current move behavior: the table action opens a modal with parent and order fields, rejects moving a
  menu under itself or a descendant, sends `parent_id` including explicit `null`, and refetches menu
  data after success.
- Required UX: validate unique path/slug, detect missing `perms`, show whether a menu is hidden by
  feature exposure.

### Dictionaries and Options

- Entry: `/system/dictionaries`, `/system/options`.
- Actions: CRUD, validate dictionary option value, batch load, delete by prefix, export options.
- API: `/sys/dictionaries`, `/sys/options`.
- Cross-effects: forms using dictionaries/options need refetch or stale indicators after changes.
- Current validation behavior: dictionary table validation opens a modal, parses JSON when required,
  validates enum/object/number/boolean/scalar expectations, and shows normalized JSON preview or
  deterministic validation errors.
- Required UX: usage/impact query before delete or prefix delete.

## Content

### Topics and Taxonomies

- Entry: `/content/topics`, `/content/taxonomies`.
- Actions: list/filter, create, edit, view, delete, create topic within taxonomy context, upload
  thumbnail media, and manage featured/gallery/attachment topic media.
- API: `/cms/topics`, `/cms/taxonomies`, `/res`, `/cms/media`, `/cms/topic-media`.
- Cross-effects: topic create/update may require taxonomy validation, media association, distribution
  invalidation, and content overview refresh.
- Current media behavior: thumbnail uploader uses `useTopicMediaUpload`, which uploads through `/res`
  and creates a CMS media record before writing the media URL back to the form.
- Current topic form behavior:
  - Create includes `TopicMediaField`, stores selected media relations locally, and sends them with
    the create payload so relations are synchronized after the topic receives an id.
  - Edit includes `TopicMediaField` for the persisted topic id and saves relation changes
    immediately through topic-media sync.
  - The manager supports upload, gallery selection, duplicate movement between featured/gallery/
    attachment, remove, reorder, loading/error/disabled states, and save feedback.
- Required UX: settle id/slug display and route usage; show taxonomy validation errors inline; add
  browser integration coverage for create staging, edit immediate save, ordering, and failure states.

### Media and Resource Picker

- Entry: `/content/media`, topic editor media fields.
- API: `/cms/media` and `/res` file APIs.
- Current upload behavior:
  - `MediaUpload` and content upload hooks build resource `FormData` with the single-file `file`
    field, access level, public flag, path prefix, tags, processing options, `owner_id`, and
    `space_id`.
  - The uploaded resource response is converted into a `/cms/media` create payload with
    `resource_id`, URL/path, mime type, size, owner, space, and source metadata.
  - `ResourceMediaPicker` can select existing `/res` files, checks `/cms/media?resource_id=...` to
    reuse an existing CMS media record, and creates `/cms/media` only when no record exists yet.
  - Media list exposes resource reuse as a first-class action; `TopicMediaManager` exposes the same
    picker beside upload and gallery selection for featured/gallery/attachment media.
  - Media list, gallery, view, and edit screens use resource-backed preview/download URLs when
    present.
- Current topic-media behavior:
  - `TopicMediaManager` queries `/cms/topic-media/by-topic/:topicId`.
  - Saving reconciles desired featured/gallery/attachment items against persisted relations and calls
    create, update, or delete on `/cms/topic-media`.
  - Unsaved topic creation stores local selections and synchronizes relations after topic creation;
    persisted topic edit writes immediately through the topic-media sync mutation.
  - The same media cannot be duplicated across types; selecting it in another type moves the relation
    because backend topic/media uniqueness is enforced per pair.
  - Media detail queries `/cms/topic-media?media_id=...` to show topic usage and navigate back to the
    topic record.
- Current reference behavior:
  - CMS media detail links to `/res/view/:resourceId` and downloads resource-backed media through the
    protected `/res/:id/download` API instead of relying only on direct URLs.
  - Resource detail queries `/cms/media?resource_id=...` and links back to each CMS media record.
  - Media list accepts `?resource_id=...` so resource references can open a filtered CMS media view.
  - Resource single and batch delete confirmations run a delete-impact review before enabling the
    destructive action. The review queries all CMS media references for each `resource_id`, follows
    topic usage through `/cms/topic-media?media_id=...`, links to the referenced media and topic
    records, and blocks deletion when references or incomplete reference checks exist.
- Cross-effects: media references resource files through `resource_id`; resource deletion must keep
  CMS media and topic-media relations intact by refusing to delete referenced files until the
  dependent records are removed or changed.
- Required next UX: per-file progress, retry failed uploads, protected preview states for private
  files, and browser integration coverage for resource delete impact loading, blocking, navigation,
  and successful clear-state deletion.

### Channels and Distributions

- Entry: `/content/channels`, `/content/distributions`.
- Actions: manage channels, create distribution, publish, cancel.
- API: `/cms/channels`, `/cms/distributions`, publish/cancel actions.
- Cross-effects: channel `allowed_types`, `auto_publish`, and `require_review` must constrain topic
  publish/distribution behavior.
- Current distribution behavior: list export downloads selected row JSON, cancel requires a reason in
  a modal, detail cancel uses the same modal pattern, and edit routes open the edit page rather than
  create.
- Required UX: status badges, publish/cancel confirmation, failure reason, retry path.

### Advanced Content Capabilities

Comments, tags, SEO, workflow, templates, versions, schedules, trash, and approval pages are not a
complete backend-backed product surface in the current `ncobase` backend. They must be hidden,
marked beta, or implemented backend-first before production exposure.

Current frontend closure from the feature/UI pass:

- Comments: list columns represent comment content, author, approval, reply target, and timestamps;
  create/edit forms expose content, reply target, parent thread, approval, and space; list approval
  actions call update mutation.
- Media: selected-row export downloads JSON instead of logging.
- Templates: duplicate uses a named input modal; delete uses `AlertDialog`; market install debug
  logging was removed until a real install contract exists.
- Workflows: delete uses `AlertDialog`; view no longer exposes a duplicate action without behavior.
- Schedules: execute and cancel use project dialogs, cancel captures a reason, and operations call
  their mutations with loading state.
- Versions: restore uses `AlertDialog` before calling the restore mutation.
- SEO/version settings: settings persist to local storage with dirty-state reset and success feedback
  until backend option contracts are available.

## Resources

- Entry: `/res`, `/res/admin`.
- Actions: upload, batch upload/delete, list/search, preview, download, create version, share,
  change access level, view quota/usage, admin cleanup.
- API: `/res`, `/res/search`, `/res/:slug/*`, `/res/batch/*`, `/res/admin/*`.
- Required permissions: `read:resources`, `manage:resources`, admin for admin routes.
- Cross-effects: resource files can back CMS media; delete/access changes must consider references.
- Current upload UX: upload modal has a local file queue, zero-byte/oversize rejection reasons,
  quota visibility and pre-check, private/shared/public access selection, public flag, path prefix,
  tags, image thumbnail options, single-file `file` upload, and multi-file `files` batch upload.
  Batch upload partial failures and request failures stay in the modal, mark queue rows as uploaded,
  failed, or retry-needed, show server errors, and let the user keep or retry only failed items.
- Current sharing/delete/reference UX: table actions expose share link generation with public/shared
  scope and expiration; delete confirmation checks CMS media and topic usage before single or batch
  deletion, shows per-file impact details, links to referenced media and topics, blocks deletion on
  references or reference-check failures, and only enables delete after a complete clear-state review;
  resource detail shows CMS media references and can open a filtered `/content/media?resource_id=...`
  list.
- Required next UX: per-file transfer progress, retry failed batch delete items, protected
  private-file preview states, and browser integration tests for delete impact review and upload
  failure recovery.

## Spaces

- Entry: `/spaces`.
- Actions: list/detail, member list, settings/quotas/billing views, export, space CRUD, add user to
  space role, update/remove role, setting writes, quota writes, billing writes.
- API: `/sys/spaces` and nested space subroutes.
- Permissions: `read:spaces` can enter `/spaces`, list/detail spaces, inspect members, and use
  read-only resource views; `manage:spaces` is required for create/edit/delete/import/status changes,
  member role mutations, settings writes, quota writes, billing writes, and bulk actions.
- Cross-effects: changing active space affects token permissions, navigation, resource ownership,
  content visibility, payment/billing, and cached queries.
- Current switch behavior: the `SpaceProvider` is mounted around the console router, so
  `useSpaceContext()` consumers receive the active space. Manual switcher and provider-driven
  updates refresh the selected-space token, permission runtime, account data, navigation, and
  space-scoped React Query caches through the same shared helper.
- Current import/export behavior: import accepts JSON arrays or objects with `items`, creates spaces
  through `useCreateSpace`, reports deterministic parse/validation errors, and export writes current
  rows to JSON or CSV.
- Current edit behavior: space edit and space-user edit show unsaved reminders and use `AlertDialog`
  before discard from cancel, reminder, or back navigation.
- Current permission behavior: `/spaces/*` accepts either `read:spaces` or `manage:spaces`; create,
  edit, space-user create, and space-user edit subroutes require `manage:spaces`. List and member
  pages hide write buttons, destructive dropdown items, row selection, and bulk actions when only
  read access is present.
- Required UX: add browser/e2e coverage for selected-space token refresh, read-only route retention,
  navigation refresh, and stale domain cache cleanup.

## Payment

- Entry: `/pay`.
- Actions: view overview/orders, manage channels/products/subscriptions, generate payment URL, verify,
  refund, cancel subscription, inspect logs.
- API: `/pay/channels`, `/pay/products`, `/pay/orders`, `/pay/subscriptions`, `/pay/logs`,
  `/pay/providers`, `/pay/webhooks/:channel`.
- Pagination: payment backend list queries accept `page_size`; console table helpers may emit
  `limit`, and `features/payment/apis.ts` normalizes it before sending requests.
- Permissions:
  - `/pay` entry accepts `read:payments`, `manage:payments`, `refund:payments`, or `admin:payments`.
  - Order overview/list/detail use `read:payments` or a higher payment permission.
  - Products, subscriptions, channels, payment URL generation, verify, and subscription cancel require
    `manage:payments`.
  - Refund action requires `refund:payments` and is hidden otherwise.
  - Logs require `admin:payments`.
  - Webhook callbacks remain public at the route layer and must be provider-signed.
- Current log behavior: `/pay/logs` is a real admin page backed by `/pay/logs`; the table shows
  type, order, status transition, error presence, user, IP, and created time. `/pay/logs/view/:id`
  opens the admin-only detail page with request data, response data, metadata, error, user agent, and
  order navigation. Backend serialization masks sensitive payload fields before exposure.
- Required UX: order timeline, provider config masking, test connection, refund confirmation, webhook
  retry state, log export, and provider raw payload review policy.
- Gaps: provider implementation depth, webhook signature/idempotency/retry, export, and order/
  subscription state persistence need review.

## Realtime and Notifications

- Entry: header notification center, future realtime pages, and event-driven refreshes across
  resource, payment, workflow, and NCore.
- API: `/rt/notifications`, `/rt/ws`, `/rt/channels`, `/rt/events`, `/events`, `/search`,
  `/stats/realtime`.
- Required permissions: `read:realtime` or higher for notification/event reads and personal
  mark-read actions; `manage:realtime` or `admin:realtime` for channel management, event
  publish/retry/status processing, and system notification create/update/delete.
- Current state: header notification center uses `/rt/notifications?user_id=...`, shows loading,
  empty, error, retry, unread count, and mark-all-read states, and invalidates realtime notification
  queries after mark-read mutations.
- Backend ownership: normal users can only list/get/mark their own notifications; cross-user
  notification access requires realtime management/admin permission.
- Required UX: add notification detail/archive/delete management, then add WebSocket subscription for
  batch upload, payment webhook, workflow task, and plugin operation updates; events should
  invalidate exact query keys.

## NCore Operations

- Entry: `/ncore`.
- Actions: list extensions/plugins, load/unload/reload plugin, inspect metrics/health/collections.
- API: `/ncore/*`, registered only when backend management routes are enabled.
- Required permission: `manage:ncore`.
- UX behavior: probe `/ncore/health` with redirect disabled; show local unavailable/forbidden state.
- Required next work: two-step confirmation for load/unload/reload, dependency impact, audit event,
  recent error display, and operation result record.

## Builder and Example

- Builder entry: `/builder/form`, `/builder/feature`.
- Example entry: `/example/*`.
- Production exposure: hidden by default; opt in with `VITE_ENABLE_BUILDER_ROUTES=true` or
  `VITE_ENABLE_EXAMPLE_ROUTES=true`.
- Builder permission: `manage:builder`.
- Example permission: authenticated only when enabled.
- Required next work: Builder generated output must include backend schema/migration/API/permission
  checklist before it becomes a product feature.

## Independent Frontend Surfaces

- `website` is an independent public site project, not a console feature. Console tasks must not edit
  website files unless the task explicitly targets website.
- Shared visual primitives or Tailwind tokens should move through `axis`; website-only composition
  should stay in `website`.
