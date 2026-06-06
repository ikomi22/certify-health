# PRD — Healthcare Workforce Competency Platform

**Version:** 0.1 (Demo MVP)
**Author:** Michael
**Status:** In development
**Last updated:** June 2026

-----

## 1. Problem Statement

Nigerian healthcare workers currently receive structured training at two moments — when they first qualify, and when they are preparing to work abroad. In between, training happens ad hoc, on the ward, inconsistently, and without tracking or certification.

This was confirmed directly by senior nursing staff at Federal Medical Centre, Asaba, Delta State:

- Basic Life Support training is capped at ~20 people per session due to cost
- Nurses frequently pay out of pocket for mandatory competencies
- Most only pursue training when preparing to travel internationally

The Federal Ministry of Health has committed to training 120,000 frontline health workers and building a sustainable workforce development framework — but no facility-level system exists to maintain and track competency continuously after the initial training push.

This platform fills that gap.

-----

## 2. Goal of This Build

This is a **demo MVP** — not a production product. Its sole purpose is to show a Federal Ministry of Health contact what the platform looks and feels like in use.

**Success criteria for the demo:**

- A ministry contact can understand the platform’s purpose within 90 seconds
- The three core views (worker dashboard, module view, facility dashboard) are functional and realistic
- The demo uses believable Nigerian healthcare data — not placeholder lorem ipsum
- It runs reliably on a laptop browser during a meeting

-----

## 3. Users

### Primary User — The Healthcare Worker

**Who:** A registered nurse, midwife, community health worker, or allied health professional working in a Nigerian federal or state hospital.

**Context:**

- Motivated to upskill — especially if considering working abroad
- Limited time — works long shifts, may access training on a smartphone between duties
- Limited budget — cannot afford expensive in-person training courses
- Wants proof of competency — a certificate or record they can show an employer

**What they need from the platform:**

- See clearly which competencies they have completed and which are outstanding
- Start a training module quickly without friction
- Get a certificate on completion they can save or share
- Track their progress over time

-----

### Secondary User — The Matron / Facility Manager

**Who:** A senior nurse, matron, or hospital administrator responsible for a ward or facility.

**Context:**

- Responsible for the competency of their team but has no current visibility of it
- Manages 20–100+ staff across multiple cadres
- Reports upward to hospital management and potentially to state health authorities
- Currently relies on paper records or memory

**What they need from the platform:**

- See at a glance which staff are compliant and which have gaps
- Filter by competency type, cadre, or ward
- Export or share a compliance report

-----

### Tertiary User — Ministry / Government Contact

**Who:** A senior official at Federal or State Ministry of Health level.

**Context:**

- Needs to justify workforce training investment with evidence
- Wants to see scale — how many workers, which facilities, which competencies
- Does not use the platform day-to-day — sees reports and dashboards

**What they need from the platform:**

- Evidence that training is happening and being tracked
- Data they can use in policy documents or donor reports

-----

## 4. Core Features — Demo Scope

### 4.1 Worker Dashboard

The landing view for a logged-in healthcare worker.

**Must show:**

- Worker name, cadre (e.g. Registered Nurse), facility (e.g. FMC Asaba)
- Competency status overview — e.g. 4 of 6 complete, 1 overdue, 1 not started
- List of competencies with status indicators (complete / in progress / overdue / not started)
- A clear CTA to start or continue a module
- Date of last completion and expiry date per competency

**Competencies to include in demo:**

- Basic Life Support (BLS) — Theory
- Infection Prevention and Control
- Safeguarding Awareness
- Medicines Management — Fundamentals
- Health and Safety Awareness
- Manual Handling — Theory

-----

### 4.2 Module View

What the worker sees when they open a training module.

**Must show:**

- Module title and estimated completion time
- Progress indicator (e.g. Section 2 of 5)
- Content area — text + simple visuals (no video needed for demo)
- Multiple choice assessment at the end
- Completion confirmation screen with certificate download prompt

**Demo module:** Build one full working module — BLS Theory. Make it realistic with actual BLS content (chain of survival, compression ratios, airway management basics). This is the module that tells the story.

-----

### 4.3 Facility Dashboard

The view for a matron or administrator.

**Must show:**

- Facility name (Federal Medical Centre, Asaba)
- Overall compliance rate — e.g. 67% of staff current on all mandatory competencies
- Breakdown by competency — which ones have the most gaps
- Staff list with compliance status — filterable by cadre
- Visual indicator (red/amber/green) per staff member per competency

**Demo data:** Seed with ~15–20 realistic staff members, mix of compliant and non-compliant, across nurse, midwife, and CHEW cadres.

-----

## 5. Out of Scope — Demo Build

The following are explicitly not part of this build:

- Payment or subscription flows
- Content authoring / course builder
- User self-registration
- Email or SMS notifications
- Multi-facility or multi-state views
- Mobile app (responsive web only)
- Video content
- Live chat or support

-----

## 6. Tech Stack Rationale

|Decision  |Choice      |Reason                                                   |
|----------|------------|---------------------------------------------------------|
|Framework |Next.js 14  |Fast, full-stack, Vercel-native, good for demo deployment|
|Styling   |Tailwind CSS|Rapid UI, consistent design system                       |
|Database  |Supabase    |Auth + Postgres in one, free tier sufficient for demo    |
|Deployment|Vercel      |One-click deploy, shareable URL for ministry meeting     |
|Language  |TypeScript  |Reduces runtime errors, better for maintainability       |

-----

## 7. Design Direction

- **Colour:** Primary green (#16a34a or similar) — health, trust, growth
- **Typography:** Clean sans-serif — Inter or similar
- **Tone:** Professional and clinical — not consumer, not government-grey
- **Mobile-first:** All views must work on a 390px screen
- **Density:** Low — white space is a feature, not a waste
- **Language:** English only

-----

## 8. Demo Data Specification

**Facility:** Federal Medical Centre, Asaba, Delta State

**Demo worker account:**

- Name: Adaeze Okonkwo
- Cadre: Registered Nurse
- Ward: Medical Ward B
- Status: 3 complete, 1 overdue (BLS), 2 not started

**Facility staff seed (15–20 workers):**

- Mix of Registered Nurses, Midwives, CHEWs
- Mix of Nigerian names across Igbo, Yoruba, Hausa
- Realistic competency gaps — BLS and Infection Control should show the most gaps
- At least 2–3 workers fully compliant to show what good looks like

-----

## 9. Tasks Tracker

Track build progress in docs/TASKS.md using [ ] checkboxes.

Initial task list:

- [ ] Supabase project setup — auth + schema
- [ ] Seed database with demo data
- [ ] Worker dashboard — layout and data
- [ ] Module view — BLS Theory content and assessment
- [ ] Facility dashboard — compliance overview and staff list
- [ ] Responsive check — all views on mobile
- [ ] Deploy to Vercel — shareable demo URL
- [ ] Demo walkthrough test — 90 second story check

-----

## 10. Open Questions

- What should the platform be called? (Name TBD — working title only)
- Should the certificate be a downloadable PDF or a shareable link?
- Does the facility dashboard need an export function for the demo?
- Should we build a simple admin login separate from the worker login?