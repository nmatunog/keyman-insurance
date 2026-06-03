# GIYA membership & program access

Locked product model (June 2026). Customer-facing names; internal tier IDs unchanged in the database.

## One rule

**You never pay twice for the same Business Insurance content.** Program subscriptions unlock curriculum depth. Elite is a separate product (All-Access + inner circle), not a fourth BI Academy card.

## Three layers

| Layer | Name | Charge | What you get |
|-------|------|--------|----------------|
| 1 | **GIYA Discover** | Free | Assessment, webinars, community, BI Academy **Preview** |
| 2 | **Program access** | Per program (BI live now) | One subscription = one program’s benefits at chosen depth |
| 3 | **GIYA Elite** | Subscription when launched (invitation first) | **All-Access** to every live program at Complete depth + mentorship privileges |

## Business Insurance Academy (live)

Program ID: `business_insurance`. Checkout tiers:

| Internal ID | Public name | Founding slots | Benefit bundle |
|-------------|-------------|----------------|----------------|
| `preview` | Preview | — | Partial Module 1, 1 calculator, 1 script (same as Discover slice) |
| `basic` | **Core** | 100 | Full Modules 1–2, unlimited calculators, all pitch scripts |
| `advanced` | **Professional** | 30 | Core + Module 3, BIR tools, outreach templates |
| `master` | **Complete** | 10 | Professional + case labs, board decks, certification track |

Founding limits apply **per benefit level** (how much of the academy you unlock), not a separate “GIYA membership fee.”

## Specialist vs Elite (no double pay)

| Path | Who it’s for | Billing |
|------|----------------|---------|
| **Specialist** | Focus on Business Insurance (or one program later) | Subscribe to **Core**, **Professional**, or **Complete** for BI only |
| **Elite** | Advisors who want every program + inner circle | **GIYA Elite All-Access** (planned) — includes Complete-level access to all live Master Class programs + mentorship |

- Elite members **do not** also need BI Complete (or separate course fees).
- Specialist BI subscribers **do not** need a platform membership on top of their program sub.
- When Estate, Health, etc. launch: separate program subs remain available; **Elite All-Access** bundles them.

## GIYA Elite (differentiation)

Elite is **not** “Master tier with a different name.” It is:

1. **All-Access** — every live GIYA Master Class program at Complete depth (BI today; others as they ship).
2. **Inner circle** — mentorship circles, deal review, JV playbooks, priority on new programs.
3. **Invitation** — application / faculty approval before checkout (reduces clutter, signals exclusivity).

Until Elite billing is live: **Request Elite access** → waitlist only. BI Academy checkout unchanged.

## Future programs

- Each new Master Class (Estate, Health, Wealth, Leadership) gets its own **Core / Professional / Complete** (or equivalent) when launched.
- **Elite All-Access** supersedes buying each program separately for invited members.

## Site structure

1. Learning Pathways — Discover | Programs | Elite  
2. Business Insurance Academy — Preview + Core / Professional / Complete  
3. More GIYA programs — waitlist; not billed until live  
4. FAQ — no double pay  

## Technical notes

- `users.tier` = current **BI Academy depth** (until `program` entitlements exist).
- `subscriptions.is_founding` = founding rate for that benefit bundle.
- Elite SKU: add `tier: elite` + pricing when ready; do not conflate with `master`.

Edit prices: `functions/lib/pricing.js`.
