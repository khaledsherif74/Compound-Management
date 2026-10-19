# Compound Management: Frontend

React 18 + Vite dashboard for the Compound Management REST API (gated residential compound,
vehicle registry, gate access logs, audit trail). English and Arabic (RTL), light and dark theme.

## Quick start

```bash
cp .env.example .env      # set VITE_API_BASE_URL
npm install
npm run dev               # http://localhost:5173
```

The backend must allow this origin with credentials. Set `LOCAL_FRONTEND_SERVER=http://localhost:5173`
(and `PRODUCTION_FRONTEND_SERVER` in production) in the API's `.env`. Authentication is the
httpOnly `token` cookie set by `POST /auth/login`; the app never stores the token. In production
the cookie is `SameSite=None; Secure`, so serve both apps over HTTPS.

### Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_API_BASE_URL` | API base URL including `/api/v1` | `/api/v1` (same origin) |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` / `npm run preview` | Production build / serve it locally |
| `npm run lint` / `npm run lint:fix` | ESLint (warnings fail the run) |
| `npm run format` | Prettier |
| `npm test` / `npm run test:watch` | Vitest + Testing Library |

## Roles

| | OWNER | SUPERVISOR | ROLLER | SUB_ADMIN | ADMIN |
| --- | :-: | :-: | :-: | :-: | :-: |
| Dashboard, Profile | x | x | x | x | x |
| My vehicles (list, add) | x | | | | |
| My access logs (3 days) | x | | | | |
| Access logs (full, manual entry) | | x | x | x | x |
| Gates (read) | | x | x | x | x |
| Gates (create, edit, disable, delete) | | | | x | x |
| Users | | | own scope* | own scope* | x |
| Vehicles (add, approve, reject, delete) | | | x | x | x |
| Vehicles (edit) | | | | x | x |
| Audit logs | | | | x | x |

\* ROLLER manages OWNER and SUPERVISOR accounts; SUB_ADMIN cannot manage ADMIN or SUB_ADMIN.
ADMIN accounts can never be disabled or deleted. The rules live in `src/constants/permissions.js`
and drive the sidebar, route guards (403 page) and every button. The backend stays authoritative and
its messages are always shown.

## Folder map

```
src/
  main.jsx, App.jsx        Entry, store provider, session bootstrap (GET /auth/me)
  config/                  env.js (API URL), i18n.js (languages, <html lang dir>)
  constants/               roles, permissions (+ helpers), routes, navigation, enums
  api/                     axiosClient.js (single instance, 401 hook) + one file per resource
                           session.js wires the 401 hook to the store
  store/                   auth, ui, users, vehicles, gates, accessLogs, auditLogs, dashboard slices
                           createApiThunk.js, selectors.js, index.js (resets data on login/logout)
  routes/                  AppRouter, appRoutes (page + permission), Protected/Public/RoleRoute
  layouts/                 AuthLayout, DashboardLayout (sidebar, topbar, error boundary)
  pages/                   auth, dashboard, users, vehicles, gates, access-logs, audit-logs, profile, errors
  components/ui/           Primitives: Button, Input, Select, Modal, Drawer, Table, Pagination, ...
  components/common/       PageHeader, FilterBar, StatusBadge, PlateBadge, RoleBadge, JsonViewer, ...
  components/forms/        UserForm, VehicleForm, GateForm, AccessLogForm, PasswordForm, ...
  components/layout/       Sidebar, MobileNav, Topbar, Breadcrumbs, UserMenu, theme/language toggles
  hooks/                   useAuth, usePermission, useQueryParams, usePolling, useThemeSync, ...
  validations/             zod schemas mirroring the backend Joi rules (+ messages.js)
  utils/                   plate, formatDate, apiError, payload builders, filter parsing, cn, storage
  locales/                 en.json, ar.json
  styles/globals.css       Design tokens (CSS variables) and base styles
```

Conventions: no business logic in components (thunks and `use*Actions` hooks own it), no raw
axios outside `src/api`, absolute imports with `@/`, every user-facing string through `t()`,
logical CSS (`ms-`, `pe-`, `start-`, `text-start`) so RTL works, files under ~250 lines.

## Adding a new resource (example: `units`)

1. **API** `src/api/units.api.js`: thin functions around `apiClient` (use `data` or `envelope` from `axiosClient.js`, and `cleanParams` for query strings).
2. **Slice** `src/store/units.slice.js`: copy `gates.slice.js` (list state `{items,total,page,limit,totalPages,status,error,requestId}`, thunks via `createApiThunk`). Register it in `src/store/index.js`, add selectors in `selectors.js`.
3. **Validation** `src/validations/unit.schema.js`: zod schema; messages are i18n keys via `msg()`.
4. **Payloads and form** `src/utils/unitPayload.js` and `src/components/forms/UnitForm.jsx` (see `GateForm.jsx`: server errors map to fields with `findFieldForMessage`).
5. **Page** `src/pages/units/UnitsPage.jsx` plus an actions hook (see `pages/gates/`): filters and paging in the URL via `useQueryParams`, skeleton, empty and error states, confirm dialog for delete.
6. **Permission** add keys to `PERMISSIONS` and the role sets in `src/constants/permissions.js` (add a test in `permissions.test.js`).
7. **Route and nav** add the path to `ROUTES`, an entry to `APP_ROUTES` (`routes/appRoutes.jsx`) and to `NAV_ITEMS` (`constants/navigation.js`).
8. **Locales** add the same keys to `en.json` and `ar.json`.

## Backend behaviour worth knowing

- List endpoints accept only `page` and `limit` (users also `role`). There is no search or status filter, so
  the vehicles, gates and users tables have no text filters, and the owner picker loads all owners and searches in the browser.
- `PATCH /users/:id` rejects `unitCode`, so an owner's unit is read-only when editing.
- `POST /access-logs` writes the body straight into the model; `gate` and `color` have no columns there, so the
  manual log form does not send them (nor `vehicleId`). Mapping `gate` to `gateRaw` on the server would enable a gate field.
- Access log rows have no `id`; React keys are built from timestamp, plate and position.
- `POST /anpr/*` and `/shelly/*` are not used anywhere in this app, by design.

## Accessibility and i18n

- Language toggle (EN default, AR with RTL) and light/dark/system theme, both persisted and applied before first paint.
- Keyboard navigable, visible focus rings, skip link, focus moves to the content after navigation, page titles per route,
  `prefers-reduced-motion` respected, status never conveyed by color alone.
- Plates render in a fixed LTR frame so digits and letters keep their order in RTL.

## Testing

```bash
npm test
```

Covered: permission helpers, plate utilities, zod schemas (auth, user, vehicle, gate), payload builders,
URL filter parsing, the auth slice (bootstrap, login, logout, session expiry), `ProtectedRoute` and `RoleRoute`.

## Troubleshooting

- **Login works but every call returns 401:** the cookie is not being sent. Check that `VITE_API_BASE_URL` points to the
  API, the API lists this origin in CORS, and (in production) both sites use HTTPS.
- **CORS error in the console:** the exact origin (scheme, host, port) must match `LOCAL_FRONTEND_SERVER` / `PRODUCTION_FRONTEND_SERVER`.
- **Fonts look different offline:** Inter and Cairo load from Google Fonts; system fonts are the fallback.
