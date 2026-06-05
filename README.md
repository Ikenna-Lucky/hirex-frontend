# hirex-frontend

> The recruiter-facing web application for the HireX AI Recruitment Platform — built with Next.js 14, TypeScript, and Tailwind CSS.

---

## Overview

`hirex-frontend` is the user interface for HireX. It serves two distinct audiences on two distinct surfaces:

- **Public job board** (`/jobs`) — candidates browse open positions and submit applications with their CV
- **Recruiter dashboard** (`/dashboard`) — companies manage job postings, review candidates, move applicants through a hiring pipeline, and view AI-generated CV scores

The frontend communicates exclusively with `hirex-api` via HTTP. All data fetching, mutations, and file uploads go through the API — the frontend contains no direct database access.

---

## Tech Stack

| Layer         | Technology                                         | Purpose                                  |
| ------------- | -------------------------------------------------- | ---------------------------------------- |
| Framework     | [Next.js 14](https://nextjs.org) (App Router)      | Routing, server components, layouts      |
| Language      | [TypeScript](https://www.typescriptlang.org)       | Full type safety across the codebase     |
| Styling       | [Tailwind CSS](https://tailwindcss.com)            | Utility-first CSS                        |
| Icons         | [@phosphor-icons/react](https://phosphoricons.com) | Duotone icon set used throughout         |
| HTTP Client   | [Axios](https://axios-http.com)                    | API requests with interceptors           |
| Notifications | [react-hot-toast](https://react-hot-toast.com)     | Toast notifications for user feedback    |
| UI Primitives | [@radix-ui/react-label](https://radix-ui.com)      | Accessible form primitives               |
| Build         | [Turbopack](https://turbo.build/pack)              | Fast dev builds (`next dev --turbopack`) |

---

## Project Structure

```
hirex-frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Root layout — fonts, global styles
│   │   ├── page.tsx                          # Landing page (/)
│   │   ├── error.tsx                         # App-level error boundary
│   │   ├── global-error.tsx                  # Root layout crash handler
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                    # Auth layout — centered card
│   │   │   ├── login/page.tsx                # Login page
│   │   │   └── register/page.tsx             # Registration page
│   │   ├── jobs/
│   │   │   ├── page.tsx                      # Public job board
│   │   │   └── [id]/page.tsx                 # Public job detail + application form
│   │   └── (dashboard)/
│   │       ├── layout.tsx                    # Dashboard shell — sidebar, top bar
│   │       ├── error.tsx                     # Dashboard error boundary
│   │       └── dashboard/
│   │           ├── page.tsx                  # Overview — stats, recent jobs, pipeline
│   │           ├── jobs/
│   │           │   ├── page.tsx              # Jobs list with filter tabs
│   │           │   ├── new/page.tsx          # Create job form
│   │           │   └── [id]/
│   │           │       ├── page.tsx          # Job pipeline — applications by stage
│   │           │       ├── edit/page.tsx     # Edit job form
│   │           │       └── applications/
│   │           │           └── [appId]/page.tsx  # Application detail + AI score
│   │           ├── candidates/
│   │           │   ├── page.tsx              # All candidates across jobs
│   │           │   └── [id]/page.tsx         # Candidate profile + application history
│   │           ├── billing/page.tsx          # Subscription plans + Paystack payment
│   │           └── settings/page.tsx         # Company profile + logo upload
│   ├── components/
│   │   ├── ErrorBoundary.tsx                 # Class-based React error boundary
│   │   └── JobForm.tsx                       # Shared job create/edit form component
│   ├── lib/
│   │   ├── api.ts                            # Axios instance + all API call functions
│   │   ├── auth.ts                           # localStorage token and company helpers
│   │   └── utils.ts                          # formatDate and other shared utilities
│   └── types/
│       └── index.ts                          # Shared TypeScript types (Job, Application, etc.)
├── public/                                   # Static assets
├── next.config.ts                            # Next.js configuration
├── tailwind.config.ts                        # Tailwind CSS configuration
├── tsconfig.json
└── package.json
```

---

## Pages Reference

### Public Routes

| Route        | Description                                                   |
| ------------ | ------------------------------------------------------------- |
| `/`          | Landing page — hero, features, pricing, CTA                   |
| `/login`     | Company login                                                 |
| `/register`  | Company registration                                          |
| `/jobs`      | Public job board — searchable, filterable list of active jobs |
| `/jobs/[id]` | Job detail page with inline application form (CV upload)      |

### Dashboard Routes (require authentication)

| Route                                       | Description                                                                                   |
| ------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `/dashboard`                                | Overview — key stats, recent jobs, pipeline summary, getting started guide                    |
| `/dashboard/jobs`                           | All jobs with status filter tabs and action menu                                              |
| `/dashboard/jobs/new`                       | Create a new job posting                                                                      |
| `/dashboard/jobs/[id]`                      | Job pipeline — applications grouped by hiring stage                                           |
| `/dashboard/jobs/[id]/edit`                 | Edit job details                                                                              |
| `/dashboard/jobs/[id]/applications/[appId]` | Full application detail with AI score, strengths, weaknesses, stage controls, recruiter notes |
| `/dashboard/candidates`                     | All unique candidates across all jobs                                                         |
| `/dashboard/candidates/[id]`                | Candidate profile with full application history                                               |
| `/dashboard/billing`                        | Subscription plans, current plan status, Paystack payment flow                                |
| `/dashboard/settings`                       | Company profile editor — name, logo, industry, size, location, description                    |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20 or [Bun](https://bun.sh) ≥ 1.1
- `hirex-api` running at `http://localhost:3001` (via `cd ../hirex-infra && make up`)

### Local Setup

```bash
# Install dependencies
npm install

# Copy env template and configure
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable              | Required | Description                                                      |
| --------------------- | -------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅       | Base URL for all API requests (e.g. `http://localhost:3001/api`) |

All other configuration (auth tokens, company data) is stored in `localStorage` on the client after login and never in environment variables.

---

## Available Scripts

```bash
npm run dev      # Start dev server with Turbopack (hot reload)
npm run build    # Build for production
npm run start    # Start the production server
npm run lint     # Run ESLint
```

---

## Authentication Flow

1. User logs in via `POST /api/auth/login`
2. API returns a JWT and company data
3. Frontend stores both in `localStorage` (`hirex_token`, `hirex_company`)
4. All subsequent API requests attach the token as `Authorization: Bearer <token>`
5. On logout, both `localStorage` keys are cleared

The Axios instance in `src/lib/api.ts` automatically reads the token from `localStorage` and attaches it to every request via an interceptor — routes never handle auth headers manually.

---

## Design System

The frontend uses a custom dark design system built with inline styles and Tailwind utilities:

| Token              | Value                 | Usage                           |
| ------------------ | --------------------- | ------------------------------- |
| Page background    | `#0a0a0f`             | Root background                 |
| Card background    | `#111118`             | All card surfaces               |
| Sidebar background | `#0e0e1a`             | Navigation sidebar              |
| Hero gradient      | `#0e0e1a → #13102a`   | Section hero cards              |
| Accent (violet)    | `#7c3aed` / `#a78bfa` | Primary actions, highlights     |
| Success (green)    | `#34d399`             | Active status, success states   |
| Danger (red)       | `#f87171`             | Destructive actions, errors     |
| Warning (amber)    | `#fbbf24`             | Warning states, exhausted quota |

**Typography:**

| Font          | Weight  | Usage                |
| ------------- | ------- | -------------------- |
| Space Grotesk | 300–700 | Body text, UI labels |
| Syne          | 800     | Logo wordmark only   |

**Icons:** Phosphor Icons with `weight="duotone"` throughout.

---

## Key Architectural Decisions

### App Router with Route Groups

The codebase uses three route groups:

- `(auth)` — shared centered card layout for login/register
- `(dashboard)` — shared sidebar shell with off-canvas mobile navigation
- Root-level — public landing page and job board

### Error Boundaries

Every route group has its own `error.tsx` boundary so errors are isolated:

- `/app/error.tsx` — catches errors in public routes
- `/app/(dashboard)/error.tsx` — catches errors inside the dashboard
- `/app/global-error.tsx` — catches root layout failures (must include `<html>` + `<body>`)

### Mobile Responsiveness

The dashboard sidebar is off-canvas on mobile (slides in from the left via a hamburger button). Key responsive patterns used:

- `hidden md:flex` — hide non-essential columns on mobile
- `overflow-x-auto` with `scrollbarWidth: none` — horizontally swipeable tab rows
- `flex-col sm:flex-row` — stacked layouts on mobile, side-by-side on larger screens
- `clamp()` — fluid typography for hero headings

### AI Score Display

AI scoring results (`aiStrengths`, `aiWeaknesses`) are stored in the database as JSON strings. The frontend uses a `parseJsonArray` helper to safely parse them before rendering, with an empty array as the fallback so rendering never crashes on malformed data.

---

## Hiring Pipeline

The platform supports a 7-stage hiring pipeline:

```
Applied → Screening → Shortlisted → Interview → Offer → Rejected / Withdrawn
```

Moving a candidate to a new stage via `PATCH /api/applications/:id/stage` automatically:

- Logs the change to `stage_history` (full audit trail)
- Sends the candidate an email notification about their updated status

---

## Docker & Deployment

The frontend is **not** containerised in the local Docker Compose setup — it runs as a standard Next.js dev server. For production:

```bash
# Build
npm run build

# Start production server
npm run start
```

**Recommended deployment: [Vercel](https://vercel.com)**

1. Connect your `hirex-frontend` repo to Vercel
2. Set the environment variable: `NEXT_PUBLIC_API_URL=https://your-api-domain.com/api`
3. Deploy — Vercel handles builds, CDN, and SSL automatically

---

## Related Repositories

| Repository                              | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| [`hirex-infra`](../hirex-infra)         | Docker Compose orchestration and developer tooling |
| [`hirex-api`](../hirex-api)             | Hono REST API — the backend this frontend talks to |
| [`hirex-ai-worker`](../hirex-ai-worker) | BullMQ worker — AI CV scoring runs here            |
