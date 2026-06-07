# TASKS.md — Healthcare Competency Platform Demo MVP

Track build progress here. Check off each item as it is completed.

---

## 1. Project Setup

- [x] Initialise Next.js 14 project with TypeScript and App Router
- [x] Configure Tailwind CSS
- [x] Set up project folder structure (`/app`, `/components`, `/lib`, `/docs`, `/public`)
- [x] Add `.env.local` and ensure it is in `.gitignore`
- [x] Initialise git repository with initial commit

---

## 2. Supabase Setup

- [x] Create Supabase project
- [x] Run docs/schema.sql in Supabase SQL editor
- [x] Copy Supabase URL + anon key into .env.local
- [x] Add Supabase client to `/lib/supabase/` (client.ts + server.ts)

---

## 3. Seed Data

- [x] Seed facility: Federal Medical Centre, Asaba, Delta State
- [x] Seed 6 competencies
- [x] Seed demo worker account: Adaeze Okonkwo (Registered Nurse, Medical Ward B)
- [x] Seed 20 staff members across Registered Nurse, Midwife, and CHEW cadres
- [x] Seed BLS Theory module content (5 sections)
- [x] Seed BLS Theory assessment questions (7 multiple choice)

---

## 4. Authentication ✅ COMPLETE (2026-06-07)

- [x] Login page (`/app/login`) — email + password form, Deep Forest design (#052e16 bg)
- [x] Demo buttons — one-click login as Adaeze (worker) or Hauwa Ibrahim (admin)
- [x] Redirect worker to `/dashboard` on login
- [x] Redirect admin/matron to `/facility` on login
- [x] Protect routes — unauthenticated users redirected to `/login`
- [x] Authenticated users redirected away from `/login` back to `/dashboard`
- [x] Session handling via Supabase Auth helpers for Next.js (`@supabase/ssr`)
- [x] Middleware-based route protection (`middleware.ts` at project root)

**Key files:** `middleware.ts`, `lib/supabase/middleware.ts`, `app/login/page.tsx`, `app/login/actions.ts`
**Demo credentials:** adaeze.okonkwo@fmcasaba.gov.ng / matron.ibrahim@fmcasaba.gov.ng — password: `CertifyDemo2026!`

---

## 5. Worker Dashboard (`/dashboard`) ✅ COMPLETE (2026-06-07)

- [x] Header: worker name, cadre, facility, ward
- [x] Summary row: X of 6 complete, Y overdue, Z not started
- [x] Competency list with per-item status badge (Complete / In Progress / Overdue / Not Started)
- [x] Per-item: last completed date and expiry date
- [x] CTA button: "Start" or "Continue" linking to module view
- [x] Overdue items visually distinct (red indicator)
- [x] Data fetched from Supabase via `/lib` — no hardcoded values in component

**Key files:** `app/dashboard/page.tsx`, `app/dashboard/actions.ts`, `lib/dashboard.ts`, `lib/format.ts`, `components/dashboard/summary-card.tsx`, `components/dashboard/competency-card.tsx`

---

## 6. Module View (`/module/[id]`) ← NEXT UP

- [ ] Module title and estimated completion time
- [ ] Section progress indicator (e.g. Section 2 of 5)
- [ ] Section content area — rendered from database (markdown or plain text)
- [ ] Navigation: Previous / Next section buttons
- [ ] On final section: transition to assessment
- [ ] Assessment — multiple choice questions, one at a time
- [ ] Score calculation on submission
- [ ] Pass/fail logic (pass threshold: 80%)
- [ ] Completion screen on pass: congratulations message + certificate download prompt
- [ ] Fail screen: score shown, option to retake
- [ ] On pass: update `worker_competencies` status to complete in Supabase

---

## 7. Certificate

- [ ] Decide format: PDF download or shareable link (confirm with Michael)
- [ ] Generate certificate on pass with: worker name, competency title, date, facility
- [ ] Certificate accessible from completion screen and from dashboard

---

## 8. Facility Dashboard (`/facility`)

- [ ] Facility name header: Federal Medical Centre, Asaba
- [ ] Overall compliance rate — % of staff current on all mandatory competencies
- [ ] Competency breakdown — bar or table showing gap count per competency
- [ ] Staff list table:
  - [ ] Columns: name, cadre, ward, per-competency status (RAG colour)
  - [ ] Filter by cadre (Registered Nurse / Midwife / CHEW)
  - [ ] Filter by competency
- [ ] RAG indicators per cell: green = complete, amber = expiring soon, red = overdue/missing
- [ ] Export button — download staff compliance table as CSV
- [ ] Data fetched from Supabase via `/lib`

---

## 9. Responsive Check

- [ ] Worker dashboard — tested at 390px (iPhone 14 viewport)
- [ ] Module view — tested at 390px
- [ ] Facility dashboard — tested at 390px (table scrollable or collapsed gracefully)
- [x] Login page — tested at 390px (mobile-first layout confirmed)

---

## 10. Design & Polish

- [x] Inter font loaded via Next.js
- [ ] Primary colour: green (#16a34a) applied consistently
- [ ] No lorem ipsum anywhere in the demo
- [ ] Loading states on data-fetching views
- [ ] Empty state handled (no blank screens)
- [ ] Page titles set correctly in metadata

---

## 11. Deployment

- [ ] Connect repo to Vercel
- [ ] Add environment variables to Vercel (Supabase URL, anon key)
- [x] Confirm production build passes (`npm run build`)
- [ ] Verify deployed URL works end-to-end
- [ ] Share URL with Michael for review

---

## 12. Demo Walkthrough Test

- [ ] Walk through demo story in under 90 seconds:
  1. Log in as Adaeze → worker dashboard shows her competency status
  2. Click into BLS module → progress through sections → complete assessment
  3. Log in as matron → facility dashboard shows team compliance at a glance
- [ ] No broken links or blank screens during walkthrough
- [ ] Data looks realistic — no placeholder text visible
- [ ] Works reliably on Chrome on a laptop

---

## Resolved Decisions

- **Certificate format:** Downloadable PDF
- **Facility dashboard export:** Yes — CSV download of staff compliance table (added to section 8)
- **Login approach:** Single login page with role-based routing — `role` field on user record redirects workers to `/dashboard` and admins/matrons to `/facility`
- **Platform name:** Certify Health
