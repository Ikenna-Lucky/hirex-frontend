# HireX Frontend

> Recruiter dashboard and public job board for the HireX AI recruitment platform — built with Next.js 14 App Router and Tailwind CSS.

![License](https://img.shields.io/badge/license-MIT-blue)

---

## What It Does

`hirex-frontend` serves two distinct surfaces from one codebase. The **public job board** lets candidates browse open positions and submit applications with their CV. The **recruiter dashboard** lets hiring teams manage job postings, review AI-scored applications, move candidates through a hiring pipeline, and manage their subscription — all in a dark, minimal interface.

---

## Tech Stack

`Next.js 14` · `TypeScript` · `Tailwind CSS` · `Axios` · `react-hot-toast`

---

## Architecture

```
             hirex-frontend (Next.js / Vercel)
            ↙                              ↘
  Public Job Board                  Recruiter Dashboard
  /jobs — candidates apply          /dashboard — recruiters manage
            ↓                              ↓
         hirex-api  (Hono REST API — http://localhost:3001)
```

---

## Key Features

- **Public job board** — searchable, filterable list of active jobs with inline application form and CV upload
- **Recruiter dashboard** — job management, 7-stage hiring pipeline, AI score display per candidate
- **AI scoring results** — score (0–100), summary, strengths, and weaknesses rendered per application
- **httpOnly cookie auth** — tokens are never accessible to JavaScript; silent refresh on expiry
- **Subscription management** — plan selection and Paystack payment flow built in
- **Privacy policy page** — NDPR-compliant, with account deletion instructions
- **Responsive** — dashboard sidebar collapses to off-canvas on mobile

---

## Prerequisites

- [Node.js](https://nodejs.org) ≥ 20 or [Bun](https://bun.sh) ≥ 1.1
- `hirex-api` running at `http://localhost:3001`

---

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/hirex-frontend
cd hirex-frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm run dev
```

App runs at `http://localhost:3000`.

---

## Environment Variables

| Variable              | Required | Description                                          |
| --------------------- | -------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | ✅       | Base URL for all API requests (includes `/api` path) |

---

## Available Scripts

```bash
npm run dev      # Start dev server with Turbopack (hot reload)
npm run build    # Build for production
npm run start    # Start the production server
npm run lint     # Run ESLint (no-console rule enforced)
```

---

## Deployment

Deployed to [Vercel](https://vercel.com):

1. Connect the `hirex-frontend` repo to Vercel
2. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-api-url.com/api`
3. Deploy — Vercel handles builds, CDN, and SSL automatically

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout — fonts, Toaster
│   ├── page.tsx                      # Landing page
│   ├── privacy/page.tsx              # Privacy policy (NDPR)
│   ├── (auth)/
│   │   ├── login/page.tsx            # Company login
│   │   └── register/page.tsx         # Company registration
│   ├── jobs/
│   │   ├── page.tsx                  # Public job board
│   │   └── [id]/page.tsx             # Job detail + application form
│   └── (dashboard)/
│       └── dashboard/
│           ├── page.tsx              # Overview — stats, recent activity
│           ├── jobs/                 # Job management pages
│           ├── candidates/           # Candidate profiles
│           ├── billing/page.tsx      # Plans + Paystack payment
│           └── settings/page.tsx     # Company profile + logo
├── components/
│   ├── JobForm.tsx                   # Shared job create/edit form
│   └── ErrorBoundary.tsx             # Class-based error boundary
└── lib/
    ├── api.ts                        # Axios instance + all API functions
    ├── auth.ts                       # Company data stored in localStorage
    └── utils.ts                      # Shared helpers (formatDate, etc.)
```

---

## Auth Flow

1. User logs in via `POST /api/auth/login`
2. API sets `accessToken` (15 min) and `refreshToken` (30 days) as **httpOnly cookies** — JavaScript cannot read them
3. Non-sensitive company display data (name, email, logo) is stored in `localStorage` for UI rendering
4. The Axios interceptor in `src/lib/api.ts` automatically calls `POST /api/auth/refresh` on any `401` response, then retries the original request
5. On logout, cookies are cleared server-side and `localStorage` is wiped

---

## Related Repositories

| Repository                              | Description                                        |
| --------------------------------------- | -------------------------------------------------- |
| [`hirex-api`](../hirex-api)             | Hono REST API — the backend this frontend talks to |
| [`hirex-ai-worker`](../hirex-ai-worker) | BullMQ worker — AI CV scoring runs here            |
| [`hirex-infra`](../hirex-infra)         | Docker Compose orchestration for local dev         |

---

## License

MIT — see `LICENSE` for details.
