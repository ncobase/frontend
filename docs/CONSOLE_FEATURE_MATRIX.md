# Console Feature Matrix

This document maps the current console UI to backend routes, permissions, state, and next work.
Use it together with the root `PROJECT_PLAN.md`.

## Status Labels

- `aligned`: UI, request layer, backend route, and permission are usable together.
- `partial`: main flow exists, but contracts, UX states, tests, or docs still need work.
- `frontend-only`: UI/API wrapper exists, but the current `ncobase` backend has no matching route.
- `blocked`: usable only after backend config, feature flag, infrastructure, or permission seed changes.
- `beta`: development tool or sample surface; production exposure must be explicit.

## Cross-Cutting Baseline

| Area | Current behavior | Required follow-up |
| --- | --- | --- |
| Request base | `VITE_API_PROXY=true/1` uses `/api`; otherwise `VITE_API_URL` or `/api`. | Document deployment proxy rules per environment. |
| Auth headers | Requests attach `Authorization: Bearer <token>` and `x-md-sid` when a space is active. | Space switch must refresh account, permissions, menus, and business query cache. |
| Request body | JSON is default; `FormData`, `Blob`, `URLSearchParams`, and binary payloads bypass JSON serialization. | Run real resource upload integration against backend storage. |
| Request dedupe | GET/HEAD dedupe by method + URL + query; writes are not deduped by default. | Keep write operations idempotent at backend where needed. |
| Route exposure | Builder and Example routes are enabled outside production by default; production requires explicit env flags. | Seed/menu data should match the same production exposure policy. |
| Permissions | Frontend guards are UX only; backend is the trusted boundary. | Keep menu `perms`, route guards, token permissions, and backend middleware aligned. |

## Feature Matrix

| Domain | Entry and UI | User operations | Frontend API | Backend contract | Permission/cache state | Status and next work |
| --- | --- | --- | --- | --- | --- | --- |
| Auth | `/login`, `/register`, `/forget-password`, `/logout` | Login, register, logout, failed-attempt feedback, local token cleanup. | `features/account/apis.ts` root auth calls. | `/login`, `/register`, `/logout`, `/refresh-token`. | Public routes; tokens update AuthContext and local storage. | `partial`; add MFA challenge UI, password reset, and auth e2e. |
| Account | `/account/profile`, `/account/sessions` | View account, list sessions, delete session, deactivate all. | `accountApi`, `sessionService`. | `/account`, `/account/spaces`, `/sessions`. | Authenticated; current session protection needs verification. | `partial`; profile/password/MFA settings need real UI. |
| Dashboard | `/dash` | View analytics summary. | Feature-local queries or static widgets. | Backend dashboard/admin stats are not fully real. | Authenticated. | `partial`; replace placeholders with real stats and empty states. |
| System users | `/system/users/*` | List, create, edit, delete, status, profile meshes, employee, roles, API keys. | `features/system/user/apis.ts`. | `/sys/users`, `/sys/employees`, user subroutes. | `read/create/update/delete:users`, employee permissions. | `partial`; validate every exposed action and add handler/UI tests. |
| Roles and permissions | `/system/roles/*`, `/system/permissions/*`, `/system/access/*` | CRUD roles/permissions, assign permissions, Casbin policies, activities. | role, permission, access APIs. | `/sys/roles`, `/sys/permissions`, `/sys/policies`, `/sys/activities`. | `read/manage:roles`, `manage:permissions`; token refresh not automatic after RBAC changes. | `partial`; add impact view and refresh strategy. |
| Menus | `/system/menus/*` | CRUD, tree, navigation, move, reorder, enable/disable/show/hide. | `features/system/menu/apis.ts`. | `/sys/menus`, `/tree`, `/navigation`, `/authorized`. | `manage:menu`; navigation query invalidated after mutations. | `partial`; add route conflict, missing permission detection, and preview. |
| Dictionaries/options | `/system/dictionaries/*`, `/system/options/*` | CRUD, options, validate, batch fetch, prefix delete/export. | dictionary and option APIs. | `/sys/dictionaries`, `/sys/options`. | `read:dictionaries`, `manage:dictionary`, `manage:system`. | `partial`; add usage/impact views before destructive changes. |
| Content overview | `/content` | View content stats and quick links. | Mixed content services. | Backed only by implemented content modules. | `read:content`. | `partial`; hide frontend-only capabilities in production menus. |
| Topics/taxonomies | `/content/topics/*`, `/content/taxonomies/*` | List, filter, create, edit, view, delete, taxonomy context create. | topic/taxonomy services. | `/cms/topics`, `/cms/taxonomies`. | Current backend mostly slug-based; UI routes use `:id`. | `partial`; settle id/slug and add media picker. |
| Channels/distributions | `/content/channels/*`, `/content/distributions/*` | Manage channels, create distribution, publish, cancel. | channel/distribution services. | `/cms/channels`, `/cms/distributions`. | `manage:cms` from seed; backend route-level permissions need review. | `partial`; add status machine, review/schedule integration. |
| CMS media | `/content/media/*` | Upload/list/view/edit media metadata. | media service and upload component. | `/cms/media`, topic-media routes. | CMS media should reference resource files through `resource_id`. | `partial`; connect with `/res` picker and reference checks. |
| Content advanced | comments, tags, SEO, workflow, templates, versions, schedules, trash, approval | Pages and wrappers exist for many flows. | content subfeature APIs. | No matching current backend modules for most of these. | Seed contains some menu permissions. | `frontend-only`; hide or implement backend modules before production use. |
| Resources | `/res/*` | List, upload, update, delete, download, versions, share, access, quota, admin stats. | `features/resource/apis.ts`. | `/res` plus public/share/admin/batch routes. | Route guard uses `read:resources`; admin page uses `admin`; backend requires `read/manage:resources`. | `partial`; run upload/share/quota integration and owner strategy tests. |
| Spaces | `/spaces/*` | Space CRUD, members, user roles, settings, quotas, billing. | `features/space/apis.ts`. | `/sys/spaces` and nested subroutes. | Frontend `super`; backend main group currently `manage:spaces`. | `partial`; split read/manage and refresh permissions after switch. |
| Payment | `/pay/*` | Overview, channels, products, orders, subscriptions, refunds, cancels. | `features/payment/apis.ts`. | `/pay/*` plugin routes. | Frontend `admin`; backend relies heavily on Casbin path policy. | `partial`; add explicit route permissions and state-machine UI. |
| NCore | `/ncore/*` | Extensions, plugin load/unload/reload, metrics, health, collections. | `features/ncore/apis.ts`; availability probe. | `/ncore/*` only when hot reload management routes are registered. | Frontend and backend require `manage:ncore`; probe uses `skipRedirect`. | `aligned` for guard/probe; add audit events and confirmations. |
| Builder | `/builder/form`, `/builder/feature` | Form design, feature schema, generated frontend files. | local generator service. | No backend generator/migration/permission/menu seed closure. | `manage:builder`; production hidden unless `VITE_ENABLE_BUILDER_ROUTES=true`. | `beta`; keep as developer tool until backend generation exists. |
| Example | `/example/*` | UI demos, charts, auth examples, responsive samples. | local/mock/sample services. | Not business backend. | Authenticated only when feature is enabled; production hidden unless `VITE_ENABLE_EXAMPLE_ROUTES=true`. | `beta`; never treat as product capability. |

## Immediate Frontend Follow-Up

1. Add a real feature matrix test/check that flags routes with no backend contract.
2. Hide or mark frontend-only content pages when backend modules are absent.
3. Add integration tests for auth refresh, space header, menu refresh, and resource upload.
4. Move long-term library changes to `axis`; keep `frontend/packages` as migration-era reference.
