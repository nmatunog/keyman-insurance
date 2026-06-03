# Supabase — Keyman Readiness Assessment

GIYA assessment leads are stored in Supabase **`public.assessments`** (dual-written with Cloudflare D1 when the GIYA API is available).

## Project

| Field | Value |
|-------|--------|
| Name | `b2ccoop-acccounting` |
| Project ref | `muexcvwhsynoqauotmiz` |
| Region | ap-northeast-2 |
| Dashboard | https://supabase.com/dashboard/project/muexcvwhsynoqauotmiz |

> **Free-tier limit:** A dedicated `giya-keyman` project could not be created (2 active projects on the org). Pause or upgrade a project, then run `supabase projects create` and `supabase link` to move to a GIYA-only database.

## Local development

```bash
cd readiness-assessment
cp .env.example .env.local
# Edit .env.local with anon key from dashboard or: supabase projects api-keys --project-ref muexcvwhsynoqauotmiz
npm run build   # Vite embeds VITE_* at build time
```

## Production (Cloudflare Pages)

In **Pages → keyman-insurance → Settings → Environment variables**, add:

| Variable | Value |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://muexcvwhsynoqauotmiz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Anon key from [API settings](https://supabase.com/dashboard/project/muexcvwhsynoqauotmiz/settings/api) |

Then rebuild/redeploy the readiness app:

```bash
cd readiness-assessment && npm run build
# from repo root:
npx wrangler pages deploy .
```

## Schema & migrations

Migrations live in `supabase/migrations/`. Apply to remote:

```bash
supabase db push
```

RLS: **`anon`** may **INSERT** only. View/export leads in the dashboard with the **service role** key (server-side only — never ship to the browser).

## Viewing leads

1. [Table Editor → assessments](https://supabase.com/dashboard/project/muexcvwhsynoqauotmiz/editor/assessments)
2. Filter by `lead_tier`: `General`, `Warm`, `MasterClass`, `InnerCircle`

## Dual storage

On submit, the app:

1. Inserts into Supabase (if `VITE_SUPABASE_*` is set at build time)
2. Posts to `POST /api/assessments/submit` (D1)

If one backend fails, the other can still succeed.
