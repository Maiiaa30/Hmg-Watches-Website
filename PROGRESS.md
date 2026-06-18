# PROGRESS — HMG Watches

Context handoff for the next agent. Read this before making changes.

## What this is
Next.js 14/15 (App Router, TS) luxury-watch resale site + admin panel.
Stack: Supabase (Postgres via Drizzle), Supabase Auth + Storage, Tailwind,
Upstash rate limiting, Resend email, Telegram bot, Google Gemini (blog AI),
deployed on **Vercel** with DNS on **Cloudflare**. The original full project
spec is kept in a local-only (git-ignored) notes file.

## Git / deploy workflow (IMPORTANT)
- The user pushes manually (HTTPS + Personal Access Token). **`gh` CLI is NOT
  installed** and this environment has no GitHub auth — you cannot push or open
  PRs from here. Make commits locally and hand off the `git push` command.
- Repo: `Maiiaa30/Hmg-Watches-Website`.
- **Vercel deploys the `main` branch to production** (custom domains point to it).
  There is also a `feature/gemini-blog-and-ui-polish` branch kept in sync with
  `main`. Earlier the user pushed only the feature branch, so production lagged —
  **always make sure `main` is pushed** for changes to go live.
- After each commit we do `git branch -f feature/gemini-blog-and-ui-polish main`
  to keep them aligned.
- Verify before committing: `node ./node_modules/typescript/bin/tsc --noEmit --noUnusedLocals`
  and `npm run build`.

## Environment variables (set in Vercel → Production, and in local `.env.local`)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  (these are the new `sb_publishable_…` / `sb_secret_…` key format)
- `DATABASE_URL` — **Supabase session pooler** (`aws-0-eu-west-1.pooler.supabase.com:5432`),
  NOT the direct `db.<ref>.supabase.co` host (that's IPv6-only and unreachable).
- `GEMINI_API_KEY` (free, aistudio.google.com), `GEMINI_MODEL=gemini-2.5-flash`
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`
- `UPSTASH_REDIS_REST_URL` — must be the **https** REST URL (not `rediss://`),
  `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (currently `contact@hmgwatches.com`)
- `NEXT_PUBLIC_APP_URL=https://hmgwatches.com` (public domain, with https, no slash)
- `CRON_SECRET`
- `ADMIN_HOST=admin.hmgwatches.com` (admin subdomain — see below)
- `MAINTENANCE_MODE`, `MAINTENANCE_SECRET` (maintenance gate — see below)

## Key features / decisions made this session
- **Blog AI → Google Gemini** (was Anthropic; removed `@anthropic-ai/sdk`).
  Uses REST via fetch in `src/lib/ai/blog-generator.ts`. Must use
  `gemini-2.5-flash` (2.0-flash had `limit:0` free quota for this key), with
  `thinkingConfig.thinkingBudget=0` + `maxOutputTokens:8192` (else it spends the
  budget "thinking" and returns truncated JSON), and a `responseSchema` so the
  long Markdown content is always valid JSON.
- **Blog generation flow** is shared in `src/lib/ai/create-post.ts`
  (`generateAndSaveBlogPost`): generate → find a CC cover image via **Openverse**
  (keyless) → save as `pending_approval` → Telegram approval buttons. Used by the
  manual `/api/blog/gerar` and the weekly cron.
- **Weekly auto-blog**: `/api/cron/weekly-blog` (Vercel cron `0 10 * * *`, daily).
  Generates once/week on a chosen weekday (or random) + random/selected category,
  guarded by `site_settings.blog_auto_last_week`. Configurable in Admin →
  Definições (`blog_auto_enabled`, `blog_auto_day`, `blog_auto_category`).
- **Markdown rendering**: blog article content uses `marked` + DOMPurify
  (`src/lib/markdown.ts`, `.hmg-prose` styles).
- **Contact + watch-lead forms**: both send Telegram + a branded admin email +
  a branded confirmation email to the sender (`src/lib/notify.ts`, awaited so it
  fires on serverless). Resend needs the sending domain **verified** for customer
  emails to deliver.
- **Analytics**: `AnalyticsTracker` (public layout) records anonymous page views
  → `/api/analytics/track`. Dashboard is `revalidate=0`. (Top-watches needs
  per-view `watchId` which is NOT yet sent — a TODO if wanted.)
- **Auth**: server-side checks use `supabase.auth.getUser()` (validated), not
  `getSession()` (`requireAdmin` returns `{ user }`).
- **DB client** (`src/lib/db/index.ts`): `postgres(url, { max: 1, prepare: false,
  idle_timeout: 20 })` — `max:1` prevents pooler exhaustion (EMAXCONNSESSION)
  during build/serverless.
- **Admin subdomain** (`src/middleware.ts`, gated by `ADMIN_HOST`):
  `admin.hmgwatches.com` root rewrites to `/admin`; on the main domain, `/admin`
  returns **404** (rewrite to `/_not-found`, no redirect). Unset locally so admin
  stays at `/admin`.
- **Maintenance mode**: `MAINTENANCE_MODE=true` shows a branded 503 page to the
  public; unlock for yourself with `?preview=<MAINTENANCE_SECRET>` (sets the
  `hmg_preview` cookie). Admin + APIs are exempt. Middleware matcher is broadened
  to all non-static routes.
- **Mixed content**: CSP includes `upgrade-insecure-requests` (auto-upgrades any
  stored `http://` image to https).
- **Branding**: logo at `public/uploads/logoFinal.png`; used as the favicon via
  `src/app/icon.png` + `apple-icon.png` (header is the text wordmark, by request).
- **Mobile responsiveness**: public pages (`hmg-stack`, etc.) and the admin panel
  (off-canvas sidebar `hmg-admin-*`, card-list tables `hmg-watch-card` for
  watches/blog/messages, `hmg-admin-metrics`, `hmg-form-grid`) in `globals.css`.

## Supabase specifics
- Storage bucket `watch-images` is **public**; upload route uses the service key
  in BOTH `Authorization: Bearer` AND `apikey` headers (the new key format fails
  JWS parsing otherwise).
- `watches.featured` column added (admin "Destaque" → homepage hero).

## Gotchas
- **WSL dev**: the dev server runs under WSL on `/mnt/c`; file-watching is
  unreliable, so hot reload often misses changes — do a hard restart
  (`rm -rf .next && npm run dev`).
- **Flaky build**: `npm run build` sometimes fails with
  `PageNotFoundError: Cannot find module for page: /_document` (or `/_not-found`,
  `/admin/...`). It's a Next cache glitch — `rm -rf .next node_modules/.cache`
  and rebuild; it passes.
- Telegram webhook only works on a public HTTPS URL (set via `setWebhook` with
  `secret_token`); it can't reach localhost. Admin "Publicar" buttons need it.
- Cron on Vercel Hobby is daily-max; that's why scheduling is day-based, not
  arbitrary-hour.

## Open TODOs / not done
- Convert remaining admin tables to responsive cards: **Leads** and **Mercado**
  (watches, blog, messages are done).
- Send `watchId`/`blogPostId` in the analytics tracker so the dashboard
  "Top 5 relógios mais vistos" works.
- Optional: admin Definições toggle for maintenance mode (instead of env var).
- Optional: force `http→https` on Mercado image URLs at save time.
- Resend domain `hmgwatches.com` must be verified for customer confirmation
  emails to actually deliver.
