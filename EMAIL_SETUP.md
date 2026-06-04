# Post-assessment email (Keyman Readiness)

After each assessment submission, GIYA can automatically email the advisor their **readiness score** and links to:

- [Keyman Discovery Framework](https://joingiya.com/assets/bonus/keyman-discovery-framework.html)
- [Business Insurance Conversation Guide](https://joingiya.com/assets/bonus/business-insurance-conversation-guide.html)

The **two complimentary guides** are emailed on every completed assessment (regardless of future-updates preference). The resources question only controls ongoing nurture messaging. Sending runs in `POST /api/assessments/submit` (D1 path), with retry via `POST /api/assessments/send-resources`.

## Option A — Resend (recommended, fastest setup)

1. Create an account at [resend.com](https://resend.com).
2. Add and verify domain **`joingiya.com`** (DNS records in Resend dashboard).
3. Create an API key.
4. In **Cloudflare Pages → keyman-insurance → Settings → Variables and secrets**, add:

| Secret | Example |
|--------|---------|
| `RESEND_API_KEY` | `re_xxxxxxxx` |
| `GIYA_EMAIL_FROM` | `Nilo Matunog <hello@joingiya.com>` |
| `GIYA_ADMIN_EMAIL` | `nmatunog@gmail.com` (reply-to; already in wrangler.toml) |

5. Redeploy (or push to `main` if CI deploys).

Until the domain is verified, Resend allows testing from `onboarding@resend.dev` — set `GIYA_EMAIL_FROM` to `GIYA <onboarding@resend.dev>` for tests only.

## Option B — Cloudflare Email Sending

1. Enable sending on your zone: `npx wrangler email sending enable joingiya.com`
2. Add to `wrangler.toml`:

```toml
[[send_email]]
name = "EMAIL"
```

3. Set secrets/vars: `GIYA_EMAIL_FROM_ADDRESS`, `GIYA_EMAIL_FROM_NAME`, `GIYA_ADMIN_EMAIL`

Resend is tried first; Cloudflare Email is the fallback if `RESEND_API_KEY` is missing.

## Replace HTML with PDFs (optional)

Upload files to the site and update links in `functions/lib/readinessEmail.js` → `bonusLinks()`:

- `/assets/bonus/keyman-discovery-framework.pdf`
- `/assets/bonus/business-insurance-conversation-guide.pdf`

## Verify

1. Complete the assessment at `/readiness/assessment` with **Yes** on resources.
2. Check inbox (and spam).
3. API response includes `"email_sent": true` when delivery succeeded.

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `email_sent: false`, `email_reason: resend_domain_pending` | Verify **joingiya.com** in Resend so mail can go to any advisor (until then, only the Resend account owner inbox works; admin gets a forward request automatically) |
| `email_sent: false` | Add `RESEND_API_KEY` or Email Sending binding |
| Misleading `EMAIL binding not configured` | Fixed — UI now shows advisor-friendly copy; check API `email_reason` for the real Resend error |
| Local `serve.sh` only | Static server has no `/api` — run `npx wrangler pages dev` for email, or test on production |
| Supabase-only submit | Client always calls `/api/assessments/submit` for email; ensure that request succeeds |
