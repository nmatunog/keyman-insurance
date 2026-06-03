# GIYA Platform

**Guiding Advisors. Protecting Legacies.**

Unified site: GIYA landing + Business Insurance Academy + **Keyman Planning Reference**.

## Live site

**Primary domain:** [https://joingiya.com/](https://joingiya.com/)

| Page | URL |
|------|-----|
| GIYA home + Academy | https://joingiya.com/ |
| Keyman Planning Reference | https://joingiya.com/keyman/ |

Cloudflare Pages preview (always available): [keyman-insurance.pages.dev](https://keyman-insurance.pages.dev/)

## Auth & subscriptions

Member login, admin panel, and paid tiers — see **[AUTH_SETUP.md](./AUTH_SETUP.md)**.

| Page | URL |
|------|-----|
| Sign in | `/login.html` |
| Register | `/register.html` |
| Account / billing | `/account.html` |
| Admin | `/admin/` |

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
