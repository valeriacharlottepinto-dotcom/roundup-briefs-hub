# shared ground — Claude Brain

## What is this project?
Feminist/LGBTQIA+ news aggregator available in English and German (and growing to more locales).
Built by **Valeria Pinto** (scraping, backend, data) and **Alexandra Brandl** (frontend, design, UX).

Live at: **roundup-briefs-hub.pages.dev** (will move to a custom domain)
GitHub: **https://github.com/shared-ground-news/roundup-briefs-hub**

---

## 🚨 PENDING ACTIONS — read this first

### Open PR awaiting Valeria's review
- **PR #3:** https://github.com/shared-ground-news/roundup-briefs-hub/pull/3
- **Branch:** `alex/match-vercel-design`
- **What it does:** Replaces the patchwork frontend with the cleaner newspaper-style design Alex prototyped on Vercel. Preserves all of Valeria's Supabase auth/save features.
- **Branch preview (look at this before reviewing the code):** https://alex-match-vercel-design.sharedgroundnews.pages.dev — compare it side-by-side with https://shared-ground-frontend.vercel.app/ (Alex's reference)

### ⚠️ Valeria — Render scraper deployment needs reconfiguration

The PR moves `requirements.txt` and `scraper_UPDATED.py` from the repo root into a new `scraper/` subfolder. Reason: Cloudflare Pages auto-detected `requirements.txt` at the root and tried to install Python deps during the frontend build, which failed because `pg_config` wasn't available.

**What Valeria needs to do on Render** (one-time fix, takes 2 minutes):

1. Log into https://dashboard.render.com
2. Click on the scraper service (probably named something like `roundup-briefs-germany` or `shared-ground-scraper`)
3. Go to **Settings → Build & Deploy**
4. Find the field **"Root Directory"**:
   - **Before:** `/` (or empty)
   - **Change to:** `scraper`
5. Click **"Save Changes"**
6. Trigger a manual deploy (top right) to confirm the build still works
7. Once confirmed, the PR can be merged

**If "Root Directory" doesn't exist on your plan** — alternative is to update the build/start commands instead:
   - **Build Command:** `cd scraper && pip install -r requirements.txt`
   - **Start Command:** `cd scraper && python scraper_UPDATED.py`

After this is done and the PR is merged: Cloudflare Pages auto-deploys to production (`roundup-briefs-hub.pages.dev`).

---

## Who does what
| Person | Role | Focus |
|--------|------|-------|
| Valeria | Backend / data | Python scraper, RSS feeds, Postgres DB, Supabase schema |
| Alexandra (Alex) | Frontend / design | React components, UI/UX, styling, Tailwind |

When working with Claude: tell it who you are at the start of a session if you're working on your specific area.

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — component framework
- **Vite** — build tool (fast HMR, outputs to `dist/`)
- **Tailwind CSS** + **shadcn/ui** (Radix UI) — styling and component library
- **React Router v6** — client-side routing, multi-locale (`/de`, `/en`, `/at`, etc.)
- **TanStack React Query v5** — data fetching and caching
- **React Hook Form** + **Zod** — forms and validation

### Backend / Data
- **Python scraper** (`scraper/scraper_UPDATED.py`) — pulls ~30+ RSS feeds, keyword filtering, topic + identity tags, paywall detection
- **PostgreSQL on Render** — stores articles (accessed by the scraper)
- **Supabase** — user auth (magic link + Google OAuth) + user data (saves, follows, preferences)

### Hosting / Infrastructure
- **Cloudflare Pages** — hosts the React frontend, auto-deploys on push to `main`
  - Project name in Cloudflare: `sharedground`
  - Config: `wrangler.toml`
- **Render** — hosts the Python scraper and the articles Postgres DB

---

## Environment Variables
Copy `.env.example` to `.env.local` and fill in the values.

```
VITE_SUPABASE_URL=https://mhnjjstdayhkdwfxfxlv.supabase.co
VITE_SUPABASE_ANON_KEY   → get from Supabase → Settings → API Keys → Legacy → anon public
```

These are **build-time** variables (Vite bakes them in at build). They must also be set in Cloudflare Pages → Settings → Variables and Secrets → Production.

---

## Key Files

### Entry points
- `src/main.tsx` — React DOM render
- `src/App.tsx` — Router setup, AuthProvider wrapper, all routes

### Auth
- `src/contexts/AuthContext.tsx` — AuthProvider, `requireAuth()` pattern, onboarding trigger
- `src/hooks/useAuth.ts` — `useAuth()` hook (reads AuthContext)
- `src/components/AuthModal.tsx` — sign-in modal (magic link + Google)
- `src/components/OnboardingModal.tsx` — topic selection after first sign-in
- `src/lib/supabase.ts` — Supabase client (gracefully degrades if env vars missing)

### Layout & Navigation
- `src/components/Navbar.tsx` — top nav with Sign In, Saved, theme toggle (wired to `useAuth`)
- `src/components/Footer.tsx` — footer

### Article feed
- `src/pages/Index.tsx` — homepage with newspaper 3-column layout (sidebar / hero / podcasts) + WIRED-style category tabs
- `src/components/FeaturedArticle.tsx` — hero article
- `src/components/ArticleTile.tsx` — grid tile (with optional `article` prop that adds a BookmarkButton overlay)
- `src/components/ArticleCardSmall.tsx` — sidebar list card
- `src/components/PodcastCard.tsx` — podcast list item
- `src/components/TopicFilterBar.tsx` — Alle / Politik / Kultur / Wirtschaft / Sport tabs
- `src/components/BookmarkButton.tsx` — bookmark icon, calls `requireAuth()`
- `src/hooks/useArticles.ts` — `useFeedArticles`, `usePodcasts`, `useCountryArticles`
- `src/hooks/useSavedArticles.ts` — save/unsave logic via Supabase
- `src/lib/api.ts` — Article/Stats types, category mapping, paywall detection

### Pages
- `src/pages/Index.tsx` — main feed (`/`, `/de`, `/en`)
- `src/pages/Podcasts.tsx` — podcasts page (`/podcasts`)
- `src/pages/GlobalMap.tsx` — interactive world map (`/map`)
- `src/pages/Newsletter.tsx` — newsletter signup (`/newsletter`)
- `src/pages/About.tsx` — about us (`/about`)
- `src/pages/Contact.tsx` — contact form (`/contact`)
- `src/pages/Impressum.tsx` — legal imprint, Valeria + Alex (`/impressum`)
- `src/pages/Saved.tsx` — saved articles (`/saved`, signed-in only — shows sign-in prompt otherwise)
- `src/pages/NotFound.tsx` — 404

### Config
- `wrangler.toml` — Cloudflare Pages config (`pages_build_output_dir = "dist"`)
- `vite.config.ts` — Vite config (PWA plugin lives here)
- `tailwind.config.ts` — Tailwind theme (font-headline / font-body, accent-blue/orange/magenta)
- `src/lib/constants.ts` — topic slugs, shared constants, `API_BASE` (reads `VITE_API_BASE_URL` env var)

### Scraper
- `scraper/scraper_UPDATED.py` — Python scraper (Valeria's domain)
- `scraper/requirements.txt` — Python deps
- `scraper/README.md` — how to run locally + Render setup notes

---

## Routes (after PR #3)
```
/           → main feed (Index)
/de, /en    → aliases of Index (locale switching TBD)
/map        → interactive world map (GlobalMap)
/podcasts   → podcasts page
/newsletter → newsletter signup
/about      → about us
/contact    → contact form
/impressum  → legal imprint
/saved      → saved articles (auth-aware: shows sign-in prompt when logged out)
*           → 404
```

**Old country routes (`/at /ch /es /it /us /cn /ug /fi /tr /ir /za /in`) were dropped** as part of the Vercel-design adoption (Alex's call: "DE/EN only for now"). The data layer still supports country filtering — they can be re-added when needed.

---

## Supabase DB Schema (6 tables)
| Table | Purpose |
|-------|---------|
| `saved_articles` | Articles bookmarked by users (snapshot at save time) |
| `user_topic_preferences` | Topics a user follows (for personalised feed) |
| `users` (auth.users) | Managed by Supabase Auth |
| *(+ 3 more for Phase 2/3)* | Follows, digest preferences, digest logs |

---

## What's done (Phase 1)
- Supabase auth: magic link + Google OAuth
- Bookmark/save articles per user
- `requireAuth()` pattern: bookmark while logged out → modal → auto-saves after sign-in
- Saved articles pages (`/de/saved`, `/en/saved`)
- Onboarding modal after first sign-in (topic selection)
- Imprint listing Valeria Pinto & Alexandra Brandl
- 14 country/locale feeds
- Dark mode
- PWA-ready (manifest + service worker via `vite-plugin-pwa`)

---

## What's next

### Phase 2 — Topic follows
- "Follow" button on topic pills
- Personalised feed filtered to followed topics
- Onboarding screen improvements

### Phase 3 — Email digests
- Weekly/daily digest emails for followed topics
- Digest preferences screen (frequency, format)
- GitHub Actions cron job to send digests

### Longer term
- Capacitor wrap for App Store / Play Store

---

## Branch strategy
```
main          → production (Cloudflare auto-deploys on every push)
feature/xxx   → Valeria's feature branches
feature/yyy   → Alex's feature branches
```
Open a PR to `main` before merging. Review each other's PRs before merging.

---

## Dev setup (both Valeria and Alex)
```bash
git clone https://github.com/shared-ground-news/roundup-briefs-hub
cd roundup-briefs-hub
cp .env.example .env.local    # fill in Supabase values
npm install
npm run dev                   # runs on localhost:8080
```

---

## Cloudflare deployment
- Auto-deploys when code is pushed to `main`
- Build command: `npm run build`
- Output dir: `dist`
- Env vars must be set in Cloudflare Pages → Settings → Variables and Secrets → Production

---

## Notes for Claude
- The Supabase client in `src/lib/supabase.ts` gracefully degrades — the app loads even without env vars, but auth and saves are disabled.
- Auth is wrapped at the App level via `<AuthProvider>` in `src/App.tsx`.
- `requireAuth(callback)` is the pattern for any action that needs a logged-in user — it opens the sign-in modal and runs the callback after sign-in.
- Topic slugs are defined in `src/lib/constants.ts` — always use slugs, not raw labels, in the DB.
