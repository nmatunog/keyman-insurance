# GIYA Institute — Version 2 vision

**Tagline:** Guiding Advisors. Protecting Legacies.

A collaborative learning platform for financial advisors committed to excellence across:

- Wealth Management
- Business Insurance
- Health Planning
- Estate Conservation
- Succession Planning
- Practice Leadership

---

## Institute flywheel

```
Nilo (Founding Mentor)
        ↓
Builds GIYA
        ↓
Develops Fellows
        ↓
Fellows Contribute
        ↓
GIYA becomes a platform (not a single-person brand)
```

---

## Knowledge ecosystem

| Role | Who | What they do |
|------|-----|----------------|
| **Founding Mentor** | Nilo B. Matunog, PFA, RFP | Chief Mentor · Founder · Lead resource person |
| **GIYA Fellows** | Experienced practitioners | Discipline leads (e.g. Fellow – Business Insurance, Fellow – Estate Conservation) |
| **GIYA Contributors** | Emerging experts | Articles · case studies · research · templates |
| **GIYA Community** | Members · learners | Nurture path toward future Fellow status |

### Fellow disciplines (target roster)

- GIYA Fellow – Business Insurance *(Nilo — founding)*
- GIYA Fellow – Estate Conservation
- GIYA Fellow – Health Planning
- GIYA Fellow – Wealth Management
- GIYA Fellow – Practice Building
- *(additional Fellows over time)*

**Fellows page** eventually replaces a solo “About Nilo” story: **GIYA Fellows** as the face of the institute, with Nilo as first Fellow / Chief Mentor.

---

## Certification path (aspiration ladder)

| Level | Public designation | How earned (target) |
|-------|-------------------|---------------------|
| 1 | **GIYA Certified Advisor** | Assessment + community engagement + foundational learning |
| 2 | **GIYA Professional Advisor** | Professional membership + sustained practice development |
| 3 | **GIYA Legacy Consultant** | Completion of Master Class academies (advanced case work) |
| 4 | **GIYA Fellow** | Earned designation — discipline leadership & contribution (not purchased) |

People should aspire to **Fellow**, not only buy a course.

### Mapping to today (v1 product)

| V2 designation | Current implementation |
|----------------|------------------------|
| Certified Advisor (L1) | Readiness assessment tiers: Emerging / Developing / Strategic Advisor |
| Professional Advisor (L2) | **GIYA Professional** membership (₱999/mo) |
| Legacy Consultant (L3) | Post–Master Class label (copy + `graduateTitle` in pricing) |
| GIYA Fellow (L4) | Application & recognition (see Fellows page) |
| GIYA Elite (paid) | **GIYA Elite** membership (₱2,999/mo) — all Academies & coaching |

Internal DB keys (`preview`, `professional`, `elite`, survey `General`/`Warm`/…) stay stable; public labels evolve per this doc.

---

## Long-term information architecture

```
GIYA
├── Learn
├── Academies
├── Resource Library      ← Keyman, frameworks, templates (partially live)
├── Community
├── Fellows               ← multi-mentor roster (v2)
├── Events
├── Certification         ← formalized L1–L4 path (v2)
└── Mentor Network
```

### v1 → v2 URL mapping (planned)

| V2 section | Today |
|------------|--------|
| Learn | `/#platform`, readiness, pathways |
| Academies | `/#business-academy`, `/#academy-pricing` |
| Resource Library | `/keyman/`, bonus guides |
| Community | `/#community-signup`, `/#join` |
| Fellows | `/#founder` → evolve to `/fellows/` |
| Events | *(not built)* |
| Certification | assessment + pathways copy |
| Mentor Network | founder + future Fellows |

---

## Revenue model evolution

**Today**

```
Membership → Courses (Academies) → Mentoring (Fellow tier)
```

**Later**

```
Membership → Courses → Certification → Fellow programs
    → Corporate partnerships → Events → Conferences
```

Current funnel (steps 1–8) remains the **near-term** advisor journey; certification and Fellow programs deepen monetization without replacing free membership at the top.

See **`FUNNEL.md`** for live CTA order.

---

## Product principles (v2)

1. **Platform over personality** — GIYA scales through Fellows and Contributors, with Nilo as Founding Mentor.
2. **Contribution loop** — Fellows and Contributors publish; Community learns; certification recognizes depth.
3. **No rush to billing** — v1 rule holds: explore → membership → nurture before Professional / Academies / Fellow.
4. **Elite as paid top tier** — subscription (₱2,999/mo) after community and academy depth; **Fellow** recognizes contribution (earned).

---

## Implementation phases (suggested)

| Phase | Focus |
|-------|--------|
| **Now (v1)** | Funnel, Keyman, assessment, community, Professional, Business Academy, GIYA Elite subscription |
| **Live (v2 preview)** | `/fellows/`, `#certification`, `#fellows` homepage preview, `#contributors` + API + admin |
| **Next** | Resource Library hub, Certification tracker, Events, live Fellow roster beyond Chief Mentor |

---

## Related docs

- `FUNNEL.md` — official advisor journey (Keyman → … → Elite/Fellow)
- `ONBOARDING.md` — waitlist, community, sign-in → homepage
- `SUPABASE.md` — assessment tier keys vs public labels
