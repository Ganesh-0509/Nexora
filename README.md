<div align="center">

<img src="https://img.shields.io/badge/Nexora-AI%20Student%20Platform-6366f1?style=for-the-badge&logo=sparkles&logoColor=white" alt="Nexora" />

# ⚡ Nexora

### AI-Powered Student Opportunity Discovery Platform

*Personalized hackathons, internships, and career opportunities — built for students, by engineers who care about career growth.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io)

[![CI](https://img.shields.io/github/actions/workflow/status/Ganesh-0509/Nexora/ci.yml?branch=master&label=CI&style=flat-square)](https://github.com/Ganesh-0509/Nexora/actions)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

<br/>

[**Live Demo**](https://nexora.app) · [**Report Bug**](https://github.com/Ganesh-0509/Nexora/issues) · [**Request Feature**](https://github.com/Ganesh-0509/Nexora/issues)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Chrome Extension](#-chrome-extension)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Nexora** is a full-stack, production-grade AI platform that helps college students and freshers discover opportunities tailored to their exact skills, interests, and career goals. It replaces the tedious process of manually searching across LinkedIn, Devpost, Internshala, and dozens of other sites with a single, intelligent, personalized feed.

### The Problem

> Students spend hours every week manually searching fragmented platforms for hackathons, internships, and events — most of which aren't even relevant to their skill set.

### The Solution

Nexora aggregates opportunities from 10+ platforms in real-time, scores them against each student's unique profile using an AI matching engine, and delivers a **ranked, personalized discovery feed** — with a Chrome extension that autofills applications using their saved resume data.

---

## ✨ Features

### 🎯 Core Platform
| Feature | Description |
|---------|-------------|
| **Personalized Feed** | AI-ranked opportunity discovery based on skills, domains, and experience level |
| **Advanced Filtering** | Filter by type, domain, remote status, stipend, skills, and deadline |
| **Bookmark System** | Save and track interesting opportunities with one click |
| **Search with URL Sync** | Debounced full-text search with shareable filter URLs |
| **Infinite Scroll** | Smooth, paginated feed with skeleton loading states |
| **Match Scores** | Per-opportunity compatibility score calculated from your profile |

### 🤖 AI & Personalization
| Feature | Description |
|---------|-------------|
| **Scoring Engine** | Weighted matching across skills (40%), roles (25%), domains (15%), experience (10%), location (10%) |
| **Similar Opportunities** | "You might also like" recommendations based on tags and type |
| **Skill Gap Analysis** | Shows which skills you need to improve your match score |
| **Trending Feed** | Surface popular opportunities regardless of profile match |

### 🕷️ Data Pipeline
| Feature | Description |
|---------|-------------|
| **Real-time Scraping** | Playwright-powered scrapers for Devpost, LinkedIn, Greenhouse, Lever, and more |
| **Queue-based Ingestion** | BullMQ + Redis async workers with exponential backoff retry |
| **Deduplication** | Two-tier matching (URL exact match + fuzzy title/company/deadline) |
| **Auto-scheduling** | Cron-driven scraper sync every 6 hours per source |

### 🔐 Authentication & Onboarding
| Feature | Description |
|---------|-------------|
| **Clerk Auth** | Google OAuth + email/password with persistent sessions |
| **4-Step Onboarding** | Framer Motion-animated form collecting skills, domains, experience, and resume links |
| **Route Protection** | Middleware-level auth guards with public/private route separation |

### 🧩 Chrome Extension
| Feature | Description |
|---------|-------------|
| **Smart Autofill** | Detects 15+ field types and fills forms using native property setters (React/Vue/Angular compatible) |
| **Job Analysis Panel** | Injected overlay showing resume match %, matched skills, and missing skills |
| **Popup Dashboard** | Profile view, current job score, and quick autofill trigger |
| **Session Sync** | Securely syncs auth token from nexora.app to `chrome.storage.local` |

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org)** — App Router, Server Components, ISR
- **[TypeScript](https://typescriptlang.org)** — Strict mode throughout
- **[Tailwind CSS](https://tailwindcss.com)** — Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com)** — Accessible, composable UI primitives
- **[Framer Motion](https://framer.motion.com)** — Page transitions and micro-animations
- **[TanStack Query](https://tanstack.com/query)** — Server state, infinite scroll, caching
- **[nuqs](https://nuqs.47ng.com)** — URL-synced state for filters

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)** — Serverless API (v1 versioned)
- **[Prisma ORM](https://prisma.io)** — Type-safe database access with migrations
- **[PostgreSQL](https://postgresql.org)** — Primary relational database
- **[Redis (Upstash)](https://upstash.com)** — Caching, rate limiting, BullMQ queues
- **[BullMQ](https://bullmq.io)** — Job queues with retry and scheduling
- **[Playwright](https://playwright.dev)** — Headless browser scraping
- **[Zod](https://zod.dev)** — Runtime validation on all API inputs

### Auth & Services
- **[Clerk](https://clerk.com)** — Authentication, session management, OAuth
- **[PostHog](https://posthog.com)** — Product analytics and event tracking
- **[Sentry](https://sentry.io)** — Error tracking and performance monitoring

### DevOps
- **[Vercel](https://vercel.com)** — Frontend hosting with Edge CDN
- **[GitHub Actions](https://github.com/features/actions)** — CI/CD pipelines
- **[Railway](https://railway.app)** — Background worker hosting

---

## 🏗️ Architecture

```
                    ┌─────────────────────────────┐
                    │     Vercel Edge Network      │
                    │   (CDN + Static Assets)      │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │   Next.js App (Serverless)   │
                    │  ┌──────────┐ ┌───────────┐ │
                    │  │Middleware│ │App Router │ │
                    │  │(Clerk +  │ │Server     │ │
                    │  │RateLimit)│ │Components │ │
                    │  └──────────┘ └───────────┘ │
                    └───────┬──────────────┬───────┘
                            │              │
           ┌────────────────▼──┐   ┌───────▼──────────────┐
           │  Upstash Redis    │   │   PostgreSQL (Neon)   │
           │  Cache + Queues   │   │   Prisma ORM          │
           └───────────────────┘   └──────────────────────┘
                                              │
                    ┌─────────────────────────▼─────┐
                    │      Railway Worker Service    │
                    │   BullMQ + Playwright Scrapers │
                    └───────────────────────────────┘
```

### Key Design Decisions

- **Adapter Pattern** for scrapers — adding a new source requires only a new adapter file
- **Service Layer** separation — all business logic lives in `src/server/services/`
- **URL-Driven Filters** — all discovery filters live in the URL for shareability
- **Cache-Aside** strategy — Redis is best-effort; all reads fall through to DB on miss

---

## 📁 Project Structure

```
nexora/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Type check, lint, build
│   │   └── deploy.yml          # Prisma migrate + Vercel deploy
│   └── SECRETS.md              # Required secrets reference
│
├── prisma/
│   └── schema.prisma           # Full database schema
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Sign-in, sign-up pages
│   │   ├── api/v1/             # REST API routes
│   │   │   ├── opportunities/
│   │   │   ├── bookmarks/
│   │   │   ├── onboarding/
│   │   │   ├── recommendations/
│   │   │   └── analytics/
│   │   ├── dashboard/          # Protected dashboard
│   │   ├── onboarding/         # 4-step onboarding flow
│   │   ├── opportunities/      # Discovery feed
│   │   ├── sitemap.ts          # Dynamic XML sitemap
│   │   └── robots.ts           # SEO robots.txt
│   │
│   ├── components/
│   │   ├── layout/             # DashboardLayout, Navbar
│   │   ├── providers/          # QueryProvider, AnalyticsProvider
│   │   ├── shared/             # OpportunityCard, FilterSidebar, InfiniteFeed
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── hooks/                  # useOpportunities, useBookmarks
│   ├── lib/                    # api client, metadata, utils
│   │
│   └── server/
│       ├── cache/              # Redis client & utilities
│       ├── middleware/         # Rate limiter
│       ├── repositories/       # Data access layer
│       ├── scraper/
│       │   ├── adapters/       # Devpost, LinkedIn, etc.
│       │   ├── core/           # Ingestion, deduplication
│       │   └── queue/          # BullMQ workers & scheduler
│       ├── services/           # Business logic (scoring, recommendations)
│       ├── utils/              # ApiUtils, Logger, withErrorHandler
│       └── validators/         # Zod schemas
│
├── nexora-extension/           # Chrome Extension (separate package)
│   └── src/
│       ├── background/         # Service worker
│       ├── content/            # Content scripts & site adapters
│       ├── popup/              # React popup UI
│       └── lib/                # Types, storage, API client, autofill engine
│
├── middleware.ts               # Clerk auth + rate limiting
└── next.config.ts              # Production-hardened config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x
- **PostgreSQL** (local or [Neon](https://neon.tech) / [Supabase](https://supabase.com))
- **Redis** (local or [Upstash](https://upstash.com))
- **Clerk account** — [clerk.com](https://clerk.com)

### 1. Clone the repository

```bash
git clone https://github.com/Ganesh-0509/Nexora.git
cd Nexora/nexora
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
# Fill in the values — see Environment Variables section below
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed sample data
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is running.

---

## 🔑 Environment Variables

Create a `.env.local` file in the `nexora/` directory:

```bash
# ── Authentication (Clerk) ─────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# ── Database ───────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/nexora

# ── Redis ──────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Analytics & Monitoring ────────────────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_SENTRY_DSN=https://...@o....ingest.sentry.io/...

# ── App ────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> **Never commit `.env.local`** — it's in `.gitignore`. See `.env.example` for the full list.

---

## 🗄️ Database Setup

Nexora uses **Prisma ORM** with PostgreSQL. The schema includes:

| Model | Description |
|-------|-------------|
| `User` | Core identity synced from Clerk |
| `Profile` | Student profile with skills, domains, experience level |
| `Opportunity` | Hackathons, internships, events |
| `Company` | Opportunity organizers |
| `Skill` / `Tag` | Many-to-many relations |
| `Bookmark` | Saved opportunities |
| `UserActivity` | Event tracking (Views, Clicks, Applications) |
| `SavedSearch` | Persisted filter configurations |

```bash
# Apply schema changes
npx prisma migrate dev --name <migration-name>

# View your database in a GUI
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
```

---

## 🧩 Chrome Extension

The extension lives in `nexora-extension/` and is a separate npm package.

### Build the extension

```bash
cd nexora-extension
npm install
npm run build         # Production build → dist/
npm run dev           # Watch mode for development
```

### Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **"Load unpacked"**
4. Select the `nexora-extension/dist/` folder

### Supported Sites
- LinkedIn Jobs
- Greenhouse
- Lever
- Wellfound
- Internshala
- YC Jobs
- Workday
- Generic job forms (fallback)

---

## 📡 API Reference

All endpoints are versioned under `/api/v1/`. Protected routes require a valid Clerk session.

### Opportunities

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/opportunities` | Public | List & filter opportunities |
| `GET` | `/api/v1/opportunities/:id` | Public | Get opportunity detail |
| `POST` | `/api/v1/opportunities` | Admin | Create opportunity |

**Query Parameters** for `GET /opportunities`:
```
?page=1&limit=10&type=INTERNSHIP&isRemote=true&search=react&skills=typescript,nodejs&minStipend=true
```

### Bookmarks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/bookmarks` | ✅ | Get user's saved opportunities |
| `POST` | `/api/v1/bookmarks` | ✅ | Toggle bookmark (add/remove) |

### Recommendations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/v1/recommendations/feed` | ✅ | Get personalized ranked feed |
| `GET` | `/api/v1/recommendations/similar/:id` | Public | Get similar opportunities |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/analytics/track` | Optional | Track user events |

**Example:**
```json
POST /api/v1/analytics/track
{
  "type": "VIEW",
  "opportunityId": "clx...",
  "metadata": { "source": "feed" }
}
```

### Rate Limits

| Route Pattern | Limit |
|---------------|-------|
| `/api/v1/ai/*` | 10 req/min |
| `/api/v1/onboarding` | 5 req/min |
| All other API routes | 100 req/min |

---

## 🚢 Deployment

### Frontend — Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ganesh-0509/Nexora)

1. Import the repository in Vercel
2. Set **Root Directory** to `nexora`
3. Add all environment variables from `.env.example`
4. Deploy

### CI/CD Pipeline

Every push to `main` triggers:

```
git push main
    │
    ├─► CI: type-check → lint → build → migration-check
    │
    └─► CD: prisma migrate deploy → vercel --prod
```

Pull requests automatically get **Vercel Preview URLs** for visual review.

### Workers — Railway

The BullMQ scraper workers run as a separate Node.js service:

```bash
# Start workers (in Railway or locally)
node -r ts-node/register src/server/scraper/queue/scraper-scheduler.ts
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feat/your-feature`
5. Open a **Pull Request** against `main`

### Adding a Scraper Adapter

1. Create `src/server/scraper/adapters/yoursite.adapter.ts`
2. Extend `BaseAdapter` and implement `scrape(): Promise<ScrapedOpportunity[]>`
3. Register it in `scraper-queue.ts`

```typescript
import { BaseAdapter, ScrapedOpportunity } from "../core/types";

export class YourSiteAdapter extends BaseAdapter {
  name = "YourSite";
  opportunityType = OpportunityType.INTERNSHIP;

  async scrape(): Promise<ScrapedOpportunity[]> {
    // Your scraping logic here
  }
}
```

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

**Built with ❤️ for students everywhere.**

If Nexora helped you find an opportunity, consider giving it a ⭐

[**Star on GitHub**](https://github.com/Ganesh-0509/Nexora) · [**Share Nexora**](https://twitter.com/intent/tweet?text=Just%20discovered%20Nexora%20—%20an%20AI-powered%20student%20opportunity%20platform%20that%20personalizes%20hackathons%20and%20internships%20to%20your%20skills!%20%F0%9F%9A%80%20https://nexora.app)

</div>
