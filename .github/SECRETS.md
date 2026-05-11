## Required GitHub Actions Secrets

### CI/CD (`ci.yml` + `deploy.yml`)

| Secret Name                         | Description                                      |
|--------------------------------------|--------------------------------------------------|
| `DATABASE_URL`                       | PostgreSQL connection string (production)        |
| `VERCEL_TOKEN`                       | Vercel personal access token                     |
| `VERCEL_ORG_ID`                      | Vercel organization ID                           |
| `VERCEL_PROJECT_ID`                  | Vercel project ID                                |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe for client)          |
| `CLERK_SECRET_KEY`                   | Clerk secret key (server only)                   |
| `NEXT_PUBLIC_POSTHOG_KEY`           | PostHog project API key                          |
| `NEXT_PUBLIC_SENTRY_DSN`            | Sentry DSN for error tracking                    |
| `REDIS_URL`                          | Redis connection URL (Upstash or Railway Redis)  |
| `NEXT_PUBLIC_APP_URL`               | `https://nexora.app`                             |

### Environment Variables (Vercel Dashboard)
Set these in Vercel → Project → Settings → Environment Variables:

```bash
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=rediss://...

# Analytics & Monitoring
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_SENTRY_DSN=https://...@o....ingest.sentry.io/...
SENTRY_AUTH_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=https://nexora.app
NODE_ENV=production
```
