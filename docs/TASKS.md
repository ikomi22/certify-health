# TASKS.md — Healthcare Competency Platform Demo MVP

Track build progress here. Check off each item as it is completed.

---

## 1. Project Setup

- [x] Initialise Next.js 14 project with TypeScript and App Router
- [x] Configure Tailwind CSS
- [x] Set up project folder structure (`/app`, `/components`, `/lib`, `/docs`, `/public`)
- [x] Add `.env.local` and ensure it is in `.gitignore`
- [ ] Initialise git repository with initial commit

---

## 2. Supabase Setup

- [ ] Create Supabase project
- [ ] Configure Supabase Auth (email/password)
- [ ] Create database schema:
  - [ ] `users` — id, email, full_name, cadre, ward, facility_id, role
  - [ ] `facilities` — id, name, state, lga
  - [ ] `competencies` — id, title, description, validity_months, estimated_minutes
  - [ ] `worker_competencies` — id, user_id, competency_id, status, completed_at, expires_at
  - [ ] `module_sections` — id, competency_id, title, body, order
  - [ ] `assessment_questions` — id, competency_id, question, options (jsonb), correct_index, order
  - [ ] `assessment_attempts` — id, user_id, competency_id, score, passed, taken_at
- [ ] Set row-level security policies (workers see only their own records; admin sees facility)
- [ ] Add Supabase client to `/lib/supabase.ts`

---

## 3. Seed Data

- [ ] Seed facility: Federal Medical Centre, Asaba, Delta State
- [ ] Seed 6 competencies:
  - [ ] Basic Life Support (BLS) — Theory
  - [ ] Infection Prevention and Control
  - [ ] Safeguarding Awareness
  - [ ] Medicines Management — Fundamentals
  - [ ] Health and Safety Awareness
  - [ ] Manual Handling — Theory
- [ ] Seed demo worker account: Adaeze Okonkwo (Registered Nurse, Medical Ward B)
  - [ ] 3 competencies complete, 1 overdue (BLS), 2 not started
- [ ] Seed 15–20 staff members across Registered Nurse, Midwife, and CHEW cadres
  - [ ] Mix of Igbo, Yoruba, and Hausa names
  - [ ] BLS and Infection Control have the most gaps across staff
  - [ ] At least 2–3 workers fully compliant
- [ ] Seed BLS Theory module content (5 sections):
  - [ ] Section 1 — Chain of Survival
  - [ ] Section 2 — Scene Safety and Initial Assessment
  - [ ] Section 3 — Chest Compressions (rate, depth, ratio)
  - [ ] Section 4 — Airway Management and Rescue Breaths
  - [ ] Section 5 — AED Use and Handover
- [ ] Seed BLS Theory assessment questions (5–10 multiple choice)

---

## 4. Authentication

- [ ] Login page (`/app/login`) — email + password form
- [ ] Redirect worker to `/dashboard` on login
- [ ] Redirect admin/matron to `/facility` on login
- [ ] Protect routes — unauthenticated users redirected to `/login`
- [ ] Session handling via Supabase Auth helpers for Next.js

---

## 5. Worker Dashboard (`/dashboard`)

- [ ] Header: worker name, cadre, facility, ward
- [ ] Summary row: X of 6 complete, Y overdue, Z not started
- [ ] Competency list with per-item status badge (Complete / In Progress / Overdue / Not Started)
- [ ] Per-item: last completed date and expiry date
- [ ] CTA button: "Start" or "Continue" linking to module view
- [ ] Overdue items visually distinct (red indicator)
- [ ] Data fetched from Supabase via `/lib` — no hardcoded values in component

---

## 6. Module View (`/module/[id]`)

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
- [ ] Login page — tested at 390px

---

## 10. Design & Polish

- [ ] Inter font loaded via Next.js
- [ ] Primary colour: green (#16a34a) applied consistently
- [ ] No lorem ipsum anywhere in the demo
- [ ] Loading states on data-fetching views
- [ ] Empty state handled (no blank screens)
- [ ] Page titles set correctly in metadata

---

## 11. Deployment

- [ ] Connect repo to Vercel
- [ ] Add environment variables to Vercel (Supabase URL, anon key)
- [ ] Confirm production build passes (`npm run build`)
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
