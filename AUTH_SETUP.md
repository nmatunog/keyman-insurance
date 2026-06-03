# GIYA Auth, Admin & Subscriptions

Cloudflare **Pages Functions** + **D1** power member login, admin panel, and subscription checkout on [joingiya.com](https://joingiya.com).

## URLs

| Page | URL |
|------|-----|
| Sign in | `/login.html` |
| Register (member / mentee) | `/register.html` |
| Account & billing | `/account.html` |
| Admin dashboard | `/admin/` |

## Subscription pricing (PHP)

| Tier ID | Public name | Founding rate | List (struck through) |
|---------|-------------|---------------|------------------------|
| `preview` | BI Academy — Preview | Free | — |
| `basic` | Core | ₱990/mo · ₱9,990/yr | ₱1,499/mo · ₱14,990/yr *(100 Core benefit seats)* |
| `advanced` | Professional | ₱3,990/mo · ₱39,990/yr | ₱4,990/mo · ₱49,900/yr *(30 Professional benefit seats)* |
| `master` | Complete | ₱6,990/mo · ₱69,990/yr | ₱5,990/mo · ₱59,990/yr *(10 Complete benefit seats)* |

See **MEMBERSHIP.md** for Elite All-Access vs program subscriptions.

Edit prices in `functions/lib/pricing.js`.

## Payment channels

1. **Stripe** — cards (Visa / Mastercard). Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
2. **PayMongo** — GCash, Maya, QR Ph, cards. Set `PAYMONGO_SECRET_KEY` and `PAYMONGO_WEBHOOK_SECRET`.
3. **Manual** — bank transfer / GCash direct. Set `GIYA_GCASH_NUMBER` and `GIYA_BANK_DETAILS`. Admin approves in `/admin/`.

## One-time production setup

### 1. Apply database migration

```bash
cd /Users/nmatunog2/Business-insurance
npx wrangler d1 migrations apply giya-platform --remote
```

### 2. Cloudflare Pages secrets

In **Workers & Pages → keyman-insurance → Settings → Variables and secrets**:

| Secret | Purpose |
|--------|---------|
| `GIYA_SETUP_SECRET` | One-time admin bootstrap token |
| `GIYA_ADMIN_PASSWORD` | Optional — used if not passed in bootstrap body |
| `STRIPE_SECRET_KEY` | Stripe Checkout |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook at `/api/webhooks/stripe` |
| `PAYMONGO_SECRET_KEY` | PayMongo secret key (`sk_test_…` or `sk_live_…`) |
| `PAYMONGO_WEBHOOK_SECRET` | From PayMongo → Developers → Webhooks → endpoint signing secret |
| `GIYA_GCASH_NUMBER` | `09209648523` (also in `wrangler.toml`) |
| `GIYA_GCASH_LABEL` | Display name on checkout, e.g. `Giya Gcash` |
| `GIYA_BANK_DETAILS` | One-line bank summary for API responses |
| `GIYA_BANK_NAME` | `GoTyme Bank` |
| `GIYA_ACCOUNT_NAME` | `NILO MATUNOG` |
| `GIYA_ACCOUNT_NUMBER` | `010330299152` |

Plaintext vars (or in `wrangler.toml`): `GIYA_SITE_URL`, `GIYA_ADMIN_EMAIL`.

### 3. Create your admin account (once)

After deploy, run (replace values):

```bash
curl -X POST https://joingiya.com/api/admin/bootstrap \
  -H "X-GIYA-Setup-Token: YOUR_GIYA_SETUP_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"email":"nmatunog@gmail.com","password":"YOUR_SECURE_PASSWORD","name":"Nilo Matunog"}'
```

Use header `X-GIYA-Setup-Token` (or `Authorization: Bearer …`). Runs **once** — if admin already exists you get `409`.

Then sign in at **https://joingiya.com/login.html** → opens **/admin/** for admins.

### 4. Stripe webhook

In Stripe Dashboard → Webhooks → add endpoint:

`https://joingiya.com/api/webhooks/stripe`

Event: `checkout.session.completed`

### PayMongo webhook

1. PayMongo Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. URL: `https://joingiya.com/api/webhooks/paymongo`
3. Event: **`checkout_session.payment.paid`**
4. Copy the **signing secret** → Cloudflare secret `PAYMONGO_WEBHOOK_SECRET`

Without the webhook secret, payments redirect successfully but tier auto-upgrade may require manual admin approval.

## Member flow

1. **Register** at `/register.html` (member or mentee).
2. **Sign in** — preview tier if status is `pending`.
3. **Subscribe** from `/account.html` or academy pricing cards.
4. **Admin** sets `active` or approves manual payment → tier unlocks academy content.

## Local development

```bash
npx wrangler d1 migrations apply giya-platform --local
npx wrangler pages dev . --d1 DB=giya-platform
```

Create `.dev.vars`:

```
GIYA_SETUP_SECRET=local-dev-secret
GIYA_SITE_URL=http://localhost:8788
```

## API routes

- `POST /api/auth/register` — create member/mentee
- `POST /api/auth/login` — session cookie
- `POST /api/auth/logout`
- `POST /api/auth/change-password` — current + new password (signed in)
- `GET /api/auth/me` — user + pricing
- `POST /api/checkout/create` — start payment
- `POST /api/webhooks/stripe`
- `GET /api/admin/members` — admin only
- `PATCH /api/admin/members/:id` — tier / status / role
- `POST /api/admin/subscriptions/:id` — approve/reject manual payment
- `POST /api/admin/bootstrap` — one-time admin setup
