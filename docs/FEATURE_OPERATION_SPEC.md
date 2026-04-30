# Console Feature Operation Spec

This document describes how major console operations should behave in the UI, what they call, and
which cross-feature effects they must handle.

## Global Operation Rules

- Every protected request includes `Authorization` and current `x-md-sid` when available.
- Create/update/delete mutations must show saving/deleting state, success feedback, and field or
  request errors.
- Dangerous operations must use a confirmation dialog that names the target and describes impact.
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
- Success effects: replace access/refresh tokens and clear permission token cache.
- Failure states: clear session, redirect to `/login?redirect=...`.
- Space switch: active space changes refresh the access token, reset domain cache, and refetch
  account/navigation context.

### Logout

- Entry: `/logout` or account dropdown.
- API: `POST /logout`.
- Success effects: clear tokens, AuthContext, permission cache, and React Query cache; navigate to
  login.
- Failure states: server logout failure still performs local cleanup and reports a warning.

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
- Required UX: show affected users/menus before destructive changes; prompt users to refresh token or
  re-login after RBAC changes.

### Menus

- Entry: `/system/menus`.
- Actions: CRUD, move, reorder, enable/disable, show/hide, navigation preview.
- API: `/sys/menus`, `/sys/menus/tree`, `/sys/menus/navigation`, `/sys/menus/authorized/:userId`.
- Cache effects: invalidate `menuService` list/tree/navigation queries.
- Required UX: validate unique path/slug, detect missing `perms`, show whether a menu is hidden by
  feature exposure.

### Dictionaries and Options

- Entry: `/system/dictionaries`, `/system/options`.
- Actions: CRUD, validate dictionary option value, batch load, delete by prefix, export options.
- API: `/sys/dictionaries`, `/sys/options`.
- Cross-effects: forms using dictionaries/options need refetch or stale indicators after changes.
- Required UX: usage/impact query before delete or prefix delete.

## Content

### Topics and Taxonomies

- Entry: `/content/topics`, `/content/taxonomies`.
- Actions: list/filter, create, edit, view, delete, create topic within taxonomy context.
- API: `/cms/topics`, `/cms/taxonomies`.
- Cross-effects: topic create/update may require taxonomy validation, media association, distribution
  invalidation, and content overview refresh.
- Required UX: settle id/slug display and route usage; show taxonomy validation errors inline.

### Media and Resource Picker

- Entry: `/content/media`, topic editor media fields.
- API: `/cms/media` and `/res` file APIs.
- Cross-effects: media should reference resource files through `resource_id`; resource deletion should
  show media/topic references.
- Required UX: shared picker for upload/select, preview, access level, and reference warning.

### Channels and Distributions

- Entry: `/content/channels`, `/content/distributions`.
- Actions: manage channels, create distribution, publish, cancel.
- API: `/cms/channels`, `/cms/distributions`, publish/cancel actions.
- Cross-effects: channel `allowed_types`, `auto_publish`, and `require_review` must constrain topic
  publish/distribution behavior.
- Required UX: status badges, publish/cancel confirmation, failure reason, retry path.

### Advanced Content Capabilities

Comments, tags, SEO, workflow, templates, versions, schedules, trash, and approval pages are not a
complete backend-backed product surface in the current `ncobase` backend. They must be hidden,
marked beta, or implemented backend-first before production exposure.

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
- Required next UX: per-file progress, retry failed batch items, share scope, and reference warnings
  before deleting files used by CMS media.

## Spaces

- Entry: `/spaces`.
- Actions: space CRUD, member list, add user to space role, update/remove role, settings, quotas,
  billing.
- API: `/sys/spaces` and nested space subroutes.
- Cross-effects: changing active space affects token permissions, navigation, resource ownership,
  content visibility, payment/billing, and cached queries.
- Required UX: after switching space, clear or refetch account, navigation, and domain queries.

## Payment

- Entry: `/pay`.
- Actions: manage channels/products, view orders/subscriptions/logs, generate payment URL, verify,
  refund, cancel subscription.
- API: `/pay/channels`, `/pay/products`, `/pay/orders`, `/pay/subscriptions`, `/pay/logs`,
  `/pay/providers`, `/pay/webhooks/:channel`.
- Required UX: order timeline, provider config masking, test connection, refund confirmation, webhook
  log and retry state.
- Gaps: backend route-level permissions and provider implementation depth need review.

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
