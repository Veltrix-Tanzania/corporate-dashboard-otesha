# Otesha — Corporate Portal

Next.js + Tailwind CSS corporate sustainability portal with a typed REST API layer.

## Stack

- **Next.js 15** (App Router + Route Handlers)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**

## Getting started

```bash
cp .env.example .env.local   # optional
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── app/api/v1/          # REST API routes
├── server/
│   ├── data/store.ts    # Data source (swap for DB/service)
│   └── services/        # Business logic
├── lib/api/             # Typed client + response types
├── providers/           # PortalProvider (React context)
├── hooks/               # useRoute, useSettings
└── components/          # UI + screens
```

### Data flow

1. **UI** calls `usePortal()` or `portalApi.*`
2. **Client** fetches `/api/v1/*` via `lib/api/client.ts`
3. **Route handlers** delegate to `server/services/portal.service.ts`
4. **Service** reads from `server/data/store.ts` (replace with real DB)

### API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/portal` | Full portal bootstrap payload |
| `GET` | `/api/v1/company` | Account / user info |
| `GET` | `/api/v1/portfolio` | Portfolio rollups |
| `GET` | `/api/v1/projects` | All projects |
| `GET` | `/api/v1/projects/:id` | Single project |
| `GET` | `/api/v1/reports` | Reports (supports `?status=&projectId=&monthsBack=`) |
| `GET` | `/api/v1/reports/:id` | Single report |
| `GET` | `/api/v1/alerts` | Dashboard alerts |
| `GET` | `/api/v1/metrics/monthly` | Monthly time series |
| `GET` | `/api/v1/settings` | Report settings |
| `PUT` | `/api/v1/settings` | Save report settings |

All responses use `{ data: T }`. Errors return `{ error: { code, message } }`.

### External API

Set `NEXT_PUBLIC_API_BASE_URL` to point the client at a remote backend. Implement the same response shapes.

### Swapping mock data for production

1. Replace queries in `server/services/portal.service.ts` with DB/API calls
2. Keep route handlers thin — they only parse input and return `ok()` / `fail()`
3. UI stays unchanged — it only talks to `/api/v1/*`

## Design reference

Original handoff files are in `design_handoff_panda_tree_portal/`.
