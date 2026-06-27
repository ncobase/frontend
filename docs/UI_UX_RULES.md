# Console UI/UX Rules

These rules apply to `frontend/apps/console`. Shared, long-term UI primitives should be moved to
`axis`; business composition stays in the console.

## Navigation and Feature Exposure

- Runtime navigation comes from `/sys/menus/navigation` and is filtered by frontend permissions.
- Development-only surfaces are filtered again by feature exposure:
  - Builder: enabled outside production, or production with `VITE_ENABLE_BUILDER_ROUTES=true`.
  - Example: enabled outside production, or production with `VITE_ENABLE_EXAMPLE_ROUTES=true`.
  - Advanced content: enabled outside production, or production with
    `VITE_ENABLE_CONTENT_ADVANCED_ROUTES=true`.
- Menus hidden by feature exposure must not render even if backend seed still contains them.
- A route must not be exposed when its menu permission points to a backend route permission that does
  not exist.

## Page Structure

- Operational screens should use the existing `Page`, `CurdView`, table, modal, and flatten patterns.
- Use a list-first experience for management domains unless the feature is primarily a focused tool.
- Page titles, table headings, actions, and status labels should be concise and scan-friendly.
- Do not add marketing-style hero sections to console workflows.
- Do not expose action buttons whose handler only logs, opens a native prompt, or leaves the user
  without visible success/error state.

## Lists and Tables

- Lists need loading, empty, filtered-empty, error, and forbidden states.
- Server-backed lists should pass page, limit, search, filter, and sort explicitly.
- Default sort must be stable and documented for each domain.
- Bulk actions must show selected count, disabled state while running, and partial success/failure
  results.
- `CurdView` screens that define bulk actions must pass row and select-all selection events through to
  `TableView` so selected-count state matches the table.
- Row actions should use icons when the command is familiar, with tooltips for less obvious actions.

## Forms

- Forms must show field-level validation errors returned by the backend when available.
- Save buttons must reflect dirty, saving, disabled, success, and failure states.
- Edit forms with unsaved changes should confirm before leaving.
- Back, cancel, and discard reminder actions must share the same unsaved-change confirmation path.
- Create/edit/view layouts must use the same field grouping when possible.
- Select fields backed by dictionaries/options should refetch or mark stale after dictionary/option
  changes.

## CRUD Modals and Flatten Views

- Use modal mode for short edits and quick creates.
- Use flatten/page mode for complex forms, rich text, upload flows, payment provider config, or any
  operation that needs side effects and warnings.
- View mode must expose the same identifiers used by the API: slug, id, status, owner, space, and
  timestamps where relevant.

## Uploads and Resource Actions

- Upload components must validate file size, type, count, quota, and owner/space before upload.
- Rejected files must show specific rejection reasons.
- Upload progress and batch partial failures must be visible.
- Share/public/access changes must show the resulting access scope.
- Delete must query CMS media and topic references before removal, show linked records, and block
  removal when references exist or reference checks are incomplete.

## Dangerous Operations

- Delete, batch delete, disable, hide, refund, cancel subscription, publicize file, and plugin
  load/unload/reload all require confirmation.
- Use `AlertDialog` for destructive and irreversible choices; use `Modal` with explicit form fields
  when the operation needs a reason, name, destination, or JSON/value input.
- Confirmation copy must name the target and describe scope, reversibility, and audit behavior.
- Irreversible or production-impacting actions should require a stronger confirmation than a single
  click.

## Status and Feedback

- Use consistent status tokens: `draft`, `published`, `scheduled`, `pending`, `active`, `disabled`,
  `failed`, `cancelled`, `expired`, `refunded`.
- Success feedback should be a toast for short operations and a visible timeline/log for long-running
  or high-risk operations.
- Errors should distinguish validation, permission, not found, conflict, network, and backend
  unavailable cases.
- Header notifications and other global status surfaces must use real backend data when the backend
  contract exists. They must expose loading, empty, error, retry, unread, disabled, and keyboard
  activation states instead of permanent mock items.
- AI surfaces must show disabled/unconfigured provider states before accepting prompts, distinguish
  policy/provider/permission failures, show generated output with run ids, and link to the backend
  run record for auditability. Contextual AI assistants may generate reviewable output, but must not
  silently mutate business records.

## Permissions and Ownership

- Frontend guards only control user experience; backend must enforce all permissions.
- Route guards should use the same permission strings as backend middleware and menu seed data.
- Menu permission filtering must preserve a visible parent when at least one child menu remains
  accessible; otherwise read-only child pages such as roles or permissions can become unreachable
  from navigation even when their route and API permissions are valid.
- Permission downgrades must be visible and consistent: read-only users can still inspect list/detail
  data, but create/edit/delete/refund/cancel/bulk actions and mutation subroutes must be hidden or
  render a 403 state.
- System management pages must split read and manage affordances at the row, toolbar, bulk action,
  modal, and direct URL levels. Examples: permission readers can view/export but not bulk mutate;
  dictionary readers can validate/export but not import or delete; option readers cannot enter
  runtime settings; user API key creation is only shown for the current user's own keys unless a
  backend target-user creation contract exists.
- Ownership-sensitive screens must display whether the object is user-owned, space-owned, public, or
  shared.
- Space switch must be treated as an authorization boundary change.
- Payment provider config, payment logs, webhook payloads, resource publicization, proxy rules, AI
  provider configuration, and NCore runtime operations are high-risk surfaces. They need explicit
  permissions, masked sensitive values, confirmation or review steps, and audit visibility before
  production use.

## I18n, Accessibility, and Responsiveness

- New visible strings should use i18n keys unless the surrounding feature is still hard-coded and
  scheduled for i18n cleanup.
- Icon-only buttons need labels or tooltips.
- Keyboard focus must stay trapped in dialogs and return to the triggering action on close.
- Dense admin pages must remain usable on mobile, but priority is efficient desktop operation.
