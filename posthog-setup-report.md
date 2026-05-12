<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Nexora platform. Here is a summary of all changes made:

**Client-side initialization** was set up via `instrumentation-client.ts` (the Next.js 15.3+ recommended approach), which initializes PostHog with a reverse proxy, error tracking, and debug mode in development.

**Reverse proxy rewrites** were added to `next.config.ts` so that PostHog requests route through `/ingest/*` on your own domain, improving ad-blocker bypass rates and data accuracy.

**Environment variables** (`NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`) were written to `.env.local` and are referenced via `process.env` in all code — no tokens are hardcoded.

**A server-side PostHog client** (`src/lib/posthog-server.ts`) was created as a singleton for use in API routes, with `flushAt: 1` and `flushInterval: 0` to ensure events are sent immediately in serverless environments.

**12 events** were instrumented across 8 files, covering the full user journey from landing page through onboarding, opportunity discovery, and engagement.

| Event Name | Description | File |
|---|---|---|
| `signup_cta_clicked` | User clicks "Get Started for Free" on the landing page | `src/app/page.tsx` |
| `login_method_selected` | User clicks a sign-in button (email, Google, or GitHub) | `src/app/login/page.tsx` |
| `onboarding_step_completed` | User advances through an onboarding step | `src/app/onboarding/page.tsx` |
| `onboarding_completed` | User submits the final onboarding form (with user identify) | `src/app/onboarding/page.tsx` |
| `opportunity_bookmark_toggled` | User bookmarks or unbookmarks an opportunity card | `src/components/shared/opportunity-card.tsx` |
| `opportunity_view_details_clicked` | User clicks "View Details" or the title link on a card | `src/components/shared/opportunity-card.tsx` |
| `opportunities_searched` | User performs a debounced search query | `src/components/shared/search-header.tsx` |
| `opportunities_sorted` | User changes the feed sort order | `src/components/shared/search-header.tsx` |
| `opportunity_filter_applied` | User applies a filter (type, remote, paid, or skills) | `src/components/shared/filter-sidebar.tsx` |
| `opportunity_filters_reset` | User resets all active filters | `src/components/shared/filter-sidebar.tsx` |
| `onboarding_completed_server` | Server confirms onboarding profile was saved (with server-side identify) | `src/app/api/v1/onboarding/route.ts` |
| `opportunity_bookmarked_server` | Server confirms a bookmark toggle was persisted | `src/app/api/v1/bookmarks/route.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1572242)
- [User Acquisition Funnel](/insights/aFFBvc1p) — conversion from landing page CTA → onboarding complete
- [Onboarding Completions Over Time](/insights/bpxYbOnP) — daily unique users finishing onboarding
- [Login Method Distribution](/insights/r2L8tkjH) — bar chart of email vs Google vs GitHub sign-ins
- [Opportunity Engagement](/insights/SjmdmomD) — trend of views and bookmarks over time
- [Search & Filter Activity](/insights/fwQsecmp) — how actively users search and filter the feed

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
