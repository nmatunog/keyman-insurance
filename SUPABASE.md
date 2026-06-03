# Supabase — Keyman Readiness Assessment

GIYA assessment leads are stored in Supabase **`public.assessments`** (dual-written with Cloudflare D1 when the GIYA API is available).

## Project

| Field | Value |
|-------|--------|
| Project ref | `iljmyodcpozsnzlsdacb` |
| API URL | `https://iljmyodcpozsnzlsdacb.supabase.co` |
| Dashboard | https://supabase.com/dashboard/project/iljmyodcpozsnzlsdacb |

## One-time database setup

If `supabase db push` is not available (CLI access), run the migration in the SQL editor:

https://supabase.com/dashboard/project/iljmyodcpozsnzlsdacb/sql/new

Paste the contents of `supabase/migrations/20260601000000_giya_assessments.sql` and run.

## API keys

1. Open [Project Settings → API](https://supabase.com/dashboard/project/iljmyodcpozsnzlsdacb/settings/api)
2. Copy **Project URL** and **anon public** key
3. Set in `readiness-assessment/.env.local`:

```env
VITE_SUPABASE_URL=https://iljmyodcpozsnzlsdacb.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

4. Rebuild and deploy:

```bash
cd readiness-assessment && npm run build
cd .. && npx wrangler pages deploy . --project-name keyman-insurance
```

## Cloudflare Pages (CI builds)

Add environment variables (Production + Preview):

| Variable | Value |
|----------|--------|
| `VITE_SUPABASE_URL` | `https://iljmyodcpozsnzlsdacb.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Anon key from dashboard |

## CLI link (when you have project access)

```bash
supabase link --project-ref iljmyodcpozsnzlsdacb
supabase db push
```

## Viewing leads

[Table Editor → assessments](https://supabase.com/dashboard/project/iljmyodcpozsnzlsdacb/editor/assessments)

Filter by `lead_tier`: `General`, `Warm`, `MasterClass`, `InnerCircle`.

## RLS

**`anon`** may **INSERT** only. Never expose the **service_role** key in the browser.

## Dual storage

On submit: Supabase insert (when `VITE_SUPABASE_*` set at build time), then `POST /api/assessments/submit` (D1). Either backend can succeed independently.
