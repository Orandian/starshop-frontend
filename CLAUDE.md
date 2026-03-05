# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # Run ESLint
npm run start    # Start production server
```

No test suite is configured in this project.

## Architecture

**Next.js 15 App Router** project with TypeScript, Tailwind CSS v4, and a separate backend API.

### User Types & Routing

Three user types controlled by middleware (`middleware.ts`):
- **Public** (no auth) — pages at `/`, `/products`, `/news`, etc.
- **Admin** (`userType: 1`) — dashboard at `/admin/*`
- **FC (Franchise/Partner)** (`userType: 2`) — portal at `/fc/*`

Auth uses cookie-based tokens (`token` + `user` cookies). Middleware redirects unauthenticated users to `/login` for `/admin` and `/fc` routes.

### Directory Structure

- `app/` — Next.js pages and API routes
  - `app/api/` — Next.js API route handlers (act as proxy/middleware to backend)
  - `app/admin/` — Admin dashboard pages
  - `app/fc/` — FC portal pages (registration, purchases, team, bonuses)
  - `app/components/` — Component showcase/demo pages
- `components/` — Reusable React components
  - `components/ui/` — Base UI primitives (shadcn/ui built on Radix UI)
  - `components/admin/` — Admin-specific components
  - `components/app/` — Shared app components
  - `components/layouts/` — Layout wrappers (`PublicLayout`, `AdminLayout`, `SectionLayout`, etc.)
  - `components/mail/` — Email templates using `@react-email`
- `lib/` — Utilities and API layer
  - `lib/api/api.gateway.ts` — Axios client with auth interceptors; auto-redirects on 401/403
  - `lib/api/api.route.ts` — Aggregates all route definitions
  - `lib/api/routes/` — Route definitions split by section: `public.route.ts`, `admin.route.ts`, `fc.route.ts`, `user.route.ts`
  - `lib/schema/` — Zod validation schemas (organized by section)
  - `lib/actions/` — Next.js server actions (payment flows)
- `store/` — Zustand state stores (`useAuthStore.ts` for auth state)
- `types/` — TypeScript type definitions organized by domain

### API Layer

The backend URL is configured via `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8080/api/v1`).

All external API calls go through `lib/api/api.gateway.ts` which provides typed helpers:
```ts
import { api } from "@/lib/api/api.gateway";
import { apiRoutes } from "@/lib/api/api.route";
```

Route functions are grouped: `apiRoutes.public`, `apiRoutes.admin`, `apiRoutes.fc`, `apiRoutes.user`.

### Key Libraries

- **State**: Zustand (`store/`)
- **Data fetching**: TanStack React Query
- **Forms**: React Hook Form + Zod
- **UI components**: shadcn/ui (Radix UI primitives) in `components/ui/`
- **Rich text**: Tiptap editor
- **Payments**: Stripe (`lib/stripe.ts`, `app/api/stripe/`)
- **Auth/DB**: Supabase SSR (`utils/supabase/`)
- **Notifications**: Sonner toasts
- **Charts**: Recharts
- **PDF**: jsPDF + jspdf-autotable

### Fonts

Four Google Fonts are loaded in `app/layout.tsx`: Geist Sans, Geist Mono, Noto Sans JP, and Cormorant Infant — available as CSS variables.
