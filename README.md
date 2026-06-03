# GIYA Platform

**Guiding Advisors. Protecting Legacies.**

Unified site: GIYA landing + Business Insurance Academy + **Keyman Planning Reference**.

## Live site

- **https://keyman-insurance.pages.dev/** — GIYA home + Academy
- **https://keyman-insurance.pages.dev/keyman/** — Keyman Planning Reference

## GitHub

https://github.com/nmatunog/keyman-insurance

## Run locally

```bash
cd /Users/nmatunog2/Business-insurance
./serve.sh
```

| Page | URL |
|------|-----|
| GIYA home + Academy | http://127.0.0.1:8765/ |
| Keyman Reference | http://127.0.0.1:8765/keyman/ |

## Files

| Path | Purpose |
|------|---------|
| `index.html` | GIYA platform + Business Insurance Academy |
| `keyman/index.html` | Full Keyman Planning Reference |
| `academy.html` | Redirects to `index.html#business-academy` |
| `assets/` | Founder photo and static assets |

## Deploy (Cloudflare Pages)

```bash
npx wrangler pages deploy . --project-name=keyman-insurance --branch=main
```

Project: **keyman-insurance** (same as [keyman-insurance.pages.dev](https://keyman-insurance.pages.dev/))

## Brand

Black `#0A0A0B` · Ink `#141416` · Pearl `#F5F3EE` · Gold `#C4A052` · Inter + Source Serif 4
