# GIYA onboarding flows

Official advisor journey order: see **`FUNNEL.md`** (Keyman → Assessment → Result → Free membership → Nurture → Professional → Academies → GIYA Elite).

## Two different sign-up paths

| Action | What it is | Login required? | Confirmation |
|--------|------------|-----------------|--------------|
| **Master Class waitlist** | Email capture on priority list | No | Email + `/welcome.html?type=masterclass` |
| **Free community** | Email capture on community list | No | Email + `/welcome.html?type=community` |
| **Free account (Register)** | Full user with password (Discover / `preview` tier) | Yes, after register | Active immediately if `source=community` or `welcome` |

Waitlist and community forms **do not** create a login. They only save to D1 `waitlist_signups` and send a Resend confirmation.

## Flow after waitlist submit

1. User submits email on homepage `#waitlist`
2. API `POST /api/waitlist/submit` → D1 + confirmation email
3. Browser redirects to **`/welcome.html?type=masterclass`**
4. User clicks **Explore GIYA** → **`/?welcome=1`**
5. Welcome banner suggests sections to visit (no payment)
6. After **3+ sections** viewed, optional soft CTA: “Compare plans” (dismissible)

## Flow after free community submit

Same as waitlist, but `type=community` and welcome page offers **Create free account** (optional).

## Flow after free account (register)

1. `POST /api/auth/register` with `source: community` → user `status: active`, tier `preview`
2. Redirect to login → then **`/?welcome=1`** (homepage top / safe sections — not `/account.html` or Academy catalog). Legacy `?account=1` is stripped on load. Do not use `#academy-pricing` on welcome links.
3. User explores homepage; billing only when they open Account or soft CTA

## Login behavior

- Default after login: **`/?welcome=1`** (explore home)
- Admin: `/admin/`
- Billing: `/account.html` only when user chooses Account in nav

## Email

Resend sends from `hello@joingiya.com` with links to explore and (for community) register.

## Admin

`/admin/` → **Waitlist & community signups** table (email CRM list).
