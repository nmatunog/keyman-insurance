# GIYA advisor funnel (official)

All product copy, CTAs, and onboarding should follow this order. Do not push billing before steps 1–5.

| Step | Stage | Primary CTA |
|------|--------|-------------|
| 1 | **Keyman Resource Center** | `/keyman/` |
| 2 | **GIYA Advisor Readiness Assessment** | `/readiness/assessment` |
| 3 | **Personalized result** | `/readiness/thank-you` (after submit) |
| 4 | **Free GIYA membership** | `/#community-signup` |
| 5 | **Nurture & engagement** | Bonus guides, email, `/#platform` |
| 6 | **GIYA Professional** | `/#giya-plans` (soft CTA after exploration) |
| 7 | **Academy purchases** | `/` (home first; use nav when ready) |
| 8 | **GIYA Elite** | ₱2,999/mo subscription — full ecosystem, all Academies & coaching |

## Implementation map

| Surface | Current step highlight |
|---------|----------------------|
| Homepage hero | Steps 1–2 CTAs + journey line |
| `readiness-assessment` landing | Step 2 + `FunnelLadder` |
| Thank-you page | Step 3 result; primary CTA step 4; accordions 4–8 |
| `welcome.html` | Step 4 confirmed; explore steps 1–2 |
| `assets/giya-onboarding.js` | Explore chips in funnel order |
| `functions/lib/readinessEmail.js` | Post-assessment: membership before paid tiers |
| `functions/lib/waitlistEmail.js` | Community confirm: Keyman → assessment → nurture |

## Rules

- **No purchase required** for steps 1–5.
- **Waitlist / Master Class** is nurture or academy interest, not step 4.
- **Login** is optional until the user wants saved progress.
- **Professional / Academies / Elite** only after meaningful exploration (soft CTA at 3+ sections).

See also `ONBOARDING.md` for waitlist vs community vs register flows.

**Version 2 (Institute platform):** see `VISION.md` — Fellows, Contributors, certification ladder, and long-term site IA.
