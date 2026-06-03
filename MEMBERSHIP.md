# GIYA — two SKUs (locked)

## The problem we fixed

The **Business Insurance Series** is a **4–6 day live cohort**, not a year-long product. Charging an annual subscription *for the event alone* was the wrong SKU.

## Two SKUs only

| SKU | What it is | Billing | Examples |
|-----|------------|---------|----------|
| **1. Course** | Live cohort enrollment | **One-time** per seat / cohort | Business Insurance Series (4–6 days) |
| **2. GIYA Academy membership** | 12-month digital platform access | **Monthly or annual** recurring | Core, Professional, Complete |

You never sell “annual subscription” as a stand-in for the 4–6 day Series. You never sell the Series twice inside membership without saying so.

## Business Insurance Series (Course SKU)

- **ID:** `bi_series`
- **Format:** 4–6 day live intensive
- **Price:** one-time founding / standard (see `functions/lib/pricing.js`)
- **Founding:** limited **cohort seats** (not 12-month access)
- **Includes:** live sessions, materials, replay window per cohort (configure dates in ops)

## GIYA Academy membership (Membership SKU)

12-month access to digital academy: modules, calculators, scripts, tools, certification track (by tier).

| Tier ID | Name | BI Series seat included? | Digital benefits |
|---------|------|--------------------------|------------------|
| `preview` | Preview | No | Free sampler |
| `basic` | **Core** | **No** — buy Course SKU separately | Modules 1–2, calculators, scripts |
| `advanced` | **Professional** | **Yes** — 1 BI Series enrollment bundled | Core + Module 3, BIR, templates |
| `master` | **Complete** | **Yes** — 1 BI Series enrollment bundled | Full digital + case labs + certification |

Founding limits (100 / 30 / 10) apply to **membership benefit levels**, not to the live event duration.

## No double pay

| Situation | Pay |
|-----------|-----|
| Only want the live 4–6 day event | **Course** SKU only |
| Want 12-month tools, no live seat yet | **Core** membership only |
| Want live event + full digital for 12 months | **Professional** or **Complete** (includes BI Series) **or** Core + Course (two SKUs, stated clearly) |
| Elite (planned) | Separate All-Access SKU — not stacked on Complete + Course |

## GIYA Discover & Elite

- **Discover** — free; Preview + assessment (not a paid SKU).
- **Elite** — planned All-Access + mentorship; invitation-first.

## Checkout API

```json
{ "skuType": "membership", "tier": "advanced", "billingPeriod": "annual", "provider": "paymongo" }
```

```json
{ "skuType": "course", "courseId": "bi_series", "provider": "manual" }
```

## Technical

- `subscriptions.sku_type`: `membership` | `course`
- `subscriptions.course_id`: set for course checkouts
- Course rows use `billing_period = 'annual'` in DB for legacy CHECK; amount is **one-time** (see checkout code)
- `users.tier` = active **membership** digital level (admin may grant after course-only purchase)

Edit prices: `functions/lib/pricing.js`.
