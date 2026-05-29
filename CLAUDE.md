# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Next.js dev server with Turbopack
pnpm build            # Production build with Turbopack
pnpm start            # Start production server
pnpm test             # Jest unit tests (__tests__/**/*.test.{ts,tsx})
pnpm test:e2e         # Playwright E2E tests (__tests__/e2e/**/*.spec.ts)

# Database (Prisma schema is at server/db/schema.prisma — always pass --schema)
pnpm prisma generate --schema=server/db/schema.prisma
pnpm prisma migrate dev --schema=server/db/schema.prisma
pnpm prisma studio --schema=server/db/schema.prisma
pnpm db:seed          # Seed with sample data
pnpm db:reset         # Reset DB and re-seed
```

The `postinstall` script auto-runs `prisma generate`, so the Prisma client should always be available after `pnpm install`.

## Project Structure

```
app/                        # Next.js App Router — route files only
  (landing)/                # Public pages (/, /blogs, /admin/blogs-dashboard)
  (dashboard)/app/          # Protected pages (/app/*)
  (auth)/                   # Sign-in/sign-up pages
  api/                      # API route handlers
components/
  ui/                       # Reusable UI primitives (shadcn/ui + custom)
  shared/                   # Shared app-level components (auth, error handling)
  landing/                  # Landing page sections
  dashboard/                # Dashboard feature components
hooks/                      # Shared React hooks
lib/                        # Shared client-side utilities and configs (cn, query-client, pricing, stripe-client)
providers/                  # React context providers
stores/                     # Zustand stores
server/
  api/                      # Client-side Axios API wrappers (browser)
  auth/                     # NextAuth configuration
  db/                       # Prisma schema, client singleton, seed
  integrations/             # Third-party services (Stripe, Cloudinary, Appwrite)
  services/                 # Core business logic (subscription, user, notes)
  utils/                    # Server-side utilities (rate-limit, api-protection, plan limits)
```

## Architecture

**Route groups.** The App Router uses three route groups:
- `(landing)` — public pages (landing home, /blogs, /admin/blogs-dashboard). The `/admin` route here is a public blog management dashboard, not the authenticated `/app` area.
- `(dashboard)` — all routes under `/app` are protected by middleware and use the `NotesLayout` with sidebar. Includes `/app/pricing`, `/app/subscription`, and the main notes dashboard at `/app`.
- `(auth)` — sign-in and sign-up pages, redirected to `/app` if already authenticated.

**Auth flow.** [server/auth/config.ts](server/auth/config.ts) configures NextAuth v5 with Google OAuth (JWT strategy, no database sessions). The JWT callback does a dynamic import of `getOrCreateUserByEmail` — Prisma is kept out of the Edge middleware bundle. On first sign-in it creates/looks up the user and stores the DB user ID as `token.sub`. The session callback copies `isSubscribed` from the token.

[middleware.ts](middleware.ts) wraps NextAuth's `auth()` middleware. It protects `/app/*`, redirects authenticated users away from `/sign-in` and `/sign-up`, and redirects authenticated users from the landing page and `/admin` to `/app`.

**Database.** PostgreSQL with Prisma. The Prisma client is a singleton ([server/db/client.ts](server/db/client.ts)) marked `server-only`. Generated client output goes to `server/lib/generated/prisma` (configured in the schema). The `User` model denormalizes `isSubscribed` and `noteCount` for fast checks without joining through `Subscription`.

**Subscription system.** Stripe webhooks ([app/api/stripe/webhook/route.ts](app/api/stripe/webhook/route.ts)) handle the full lifecycle: `checkout.session.completed` → create subscription + set `isSubscribed=true`; `customer.subscription.updated` / `deleted` → sync status; `invoice.payment_succeeded` / `failed` → renew or downgrade. The `Subscription` model tracks Stripe IDs, plan type, billing periods, and trial windows. Plan limits are defined in [server/utils/subscription-check.ts](server/utils/subscription-check.ts) with four tiers: free (no time limit), basic, pro, enterprise.

**AI suggestions.** [app/api/ai-suggestion/route.ts](app/api/ai-suggestion/route.ts) calls Gemini 2.5 Flash with three modes: improve, summarize, expand. Each has a tailored system prompt and temperature. Usage is tracked per-user with monthly resets via `aiSuggestionsCount` / `aiSuggestionsResetAt` on the User model. Two layers of rate limiting: in-memory by IP+user ID, and plan-tier quota from the database.

**AI chat (SnackAI).** [app/api/ai/chat/route.ts](app/api/ai/chat/route.ts) is a streaming SSE endpoint for in-note chat. It uses [server/ai/providers.ts](server/ai/providers.ts) for model management: Gemini 2.5 Flash as primary, [OpenAI GPT-4o-mini](server/api/ai-chat.ts) as automatic fallback when Gemini is rate-limited (detected via `shouldFallbackToOpenAI` matching on quota/429 patterns). The client hook [hooks/use-lang-chat.ts](hooks/use-lang-chat.ts) handles SSE parsing, abort, and message state. The `AiChatPanel` component ([components/dashboard/ai-chat-panel.tsx](components/dashboard/ai-chat-panel.tsx)) renders the chat UI with a lightweight markdown renderer ([components/dashboard/chat-markdown.tsx](components/dashboard/chat-markdown.tsx)). Usage is counted against the same per-plan AI quota as suggestions.

**Client-server data flow.** Client components use TanStack Query hooks that call `/api/` routes. The `server/api/` directory contains Axios-based API client functions (`getNotes`, `createNote`, etc.) consumed by React Query. API routes use `auth()` for session checks and the Prisma client directly. Server-side subscription checks go through [server/services/subscription.ts](server/services/subscription.ts) which runs Prisma transactions to keep `User.isSubscribed` in sync.

**State.** Zustand store ([stores/use-app-store.ts](stores/use-app-store.ts)) persists theme, user info, and sidebar state to localStorage. TanStack Query ([lib/query-client.ts](lib/query-client.ts)) handles server state with a 1-minute `staleTime` and no retry on 4xx errors.

**Stripe config.** [server/integrations/stripe/config.ts](server/integrations/stripe/config.ts) lazy-initializes the Stripe SDK behind a Proxy to avoid build-time errors when `STRIPE_SECRET_KEY` is missing.

**Next.js config.** PostHog analytics is reverse-proxied through `/ingest/*` rewrites. Security headers are applied globally. Heavy packages (Radix UI, GSAP, Stripe.js, etc.) are marked for `optimizePackageImports`.
