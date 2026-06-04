# GIYA pricing model (locked)

## Membership plans

| Plan | Price | Includes |
|------|-------|----------|
| **Discover** | Free | Assessment, newsletter, webinars |
| **Professional** | ₱999/mo (₱9,990/yr) | Community, monthly Master Class, resource library, case studies, **20% off all Academies** |
| **GIYA Elite** | ₱2,999/mo (₱29,990/yr) | Everything in Professional + **all Academies** + coaching |

**Professional** = learning community. **GIYA Elite** = full knowledge ecosystem. **GIYA Fellow** = earned designation (not a subscription).

## Academies (standalone, one-time)

| Academy | Price | Status |
|---------|-------|--------|
| Business Insurance Academy | ₱7,990 | Live |
| Estate Conservation Academy | ₱7,990 | Coming soon |
| Health Planning Academy | ₱7,990 | Coming soon |
| Wealth Management Academy | ₱9,990 | Coming soon |
| Succession Planning Academy | ₱12,990 | Coming soon |

Professional members pay **20% less** at academy checkout. GIYA Elite members do not buy academies separately (included).

## Upsell

> Buy one Academy for ₱7,990 — or join GIYA Elite for ₱2,999/month and access all Academies plus coaching.

## Checkout API

```json
{ "skuType": "membership", "tier": "professional", "billingPeriod": "monthly" }
{ "skuType": "academy", "academyId": "business_insurance" }
```

## Membership lapse (enforced)

- **Professional** and **GIYA Elite** stay active only while a paid membership row has `ends_at` in the future.
- When the period ends (or is not renewed), the member is downgraded to **Discover** (`preview`). Elite/Professional academy and coaching access stop.
- **Standalone Academy** purchases (`sku_type = academy`, status `paid`) are **not** removed on lapse.
- Checked on login and every `GET /api/auth/me`. Past-due membership rows are marked `cancelled`.

Edit prices: `functions/lib/pricing.js`.
