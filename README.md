# GIYA Platform

**Guiding Advisors. Protecting Legacies.**

Unified site: GIYA landing + Business Insurance Academy + **Keyman Planning Reference**.

## Run locally

```bash
cd /Users/nmatunog2/Business-insurance
./serve.sh
```

| Page | URL |
|------|-----|
| GIYA home + Academy | http://127.0.0.1:8765/ |
| Keyman Reference | http://127.0.0.1:8765/keyman.html |
| Academy anchor | http://127.0.0.1:8765/#business-academy |

## Files

| File | Purpose |
|------|-----|
| `index.html` | GIYA platform + embedded Business Insurance Academy |
| `keyman.html` | Full Keyman Planning Reference (calculators, scripts, PDF) |
| `academy.html` | Redirects to `index.html#business-academy` |
| `assets/` | Founder photo and static assets |

## Cloudflare Pages (one deployment)

Deploy the **`Business-insurance`** folder as your Pages project root (same project that served [keyman-insurance.pages.dev](https://keyman-insurance.pages.dev/)).

- `/` → GIYA home
- `/keyman.html` → Keyman reference (replaces standalone subdomain content)
- Optional: add a `_redirects` file to forward old URLs:

```
/keyman-insurance/*  /keyman.html  301
```

## Brand

Black `#0A0A0B` · Ink `#141416` · Pearl `#F5F3EE` · Gold `#C4A052` · Inter + Source Serif 4

## Source

Keyman reference source also lives at `~/ Keyman-insurance/` (note: folder name has a leading space). The canonical branded copy is **`keyman.html`** in this repo.
