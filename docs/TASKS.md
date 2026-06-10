# TASKS.md — Healthcare Competency Platform Demo MVP

Track build progress here. Check off each item as it is completed.

**Session discipline:** Read `CLAUDE.md` + this file at the start of every session. Update checkboxes and commit at the end.

---

## 1. Project Setup ✅

- [x] Initialise Next.js 14 project with TypeScript and App Router
- [x] Configure Tailwind CSS
- [x] Set up project folder structure (`/app`, `/components`, `/lib`, `/docs`, `/public`)
- [x] Add `.env.local` and ensure it is in `.gitignore`
- [x] Initialise git repository with initial commit

---

## 2. Supabase Setup ✅

- [x] Create Supabase project
- [x] Run docs/schema.sql in Supabase SQL editor
- [x] Copy Supabase URL + anon key into .env.local
- [x] Add Supabase client to `/lib/supabase/` (client.ts + server.ts)

---

## 3. Seed Data ✅

- [x] Seed facility: Federal Medical Centre, Asaba, Delta State
- [x] Seed 7 competencies (incl. CPR — Practical Preparation)
- [x] Seed demo worker: Adaeze Okonkwo (Registered Nurse, Medical Ward B)
- [x] Seed 20 staff members across Registered Nurse, Midwife, CHEW cadres
- [x] Seed BLS Theory module sections and assessment questions (7 MCQ)
- [x] Seed assessment questions for all remaining 6 competencies

---

## 4. Authentication ✅

- [x] Login page (`/app/login`) — Deep Forest design, email + password form
- [x] Demo buttons — one-click login as Adaeze (worker) or Hauwa Ibrahim (admin)
- [x] Worker → `/dashboard`, admin → `/select-role` on login
- [x] Role picker screen (`/select-role`) — My Compliance vs Facility Overview
- [x] Persistent role toggle nav — tab switch between views without returning to picker
- [x] Route protection — unauthenticated users redirected to `/login`

**Demo credentials:** adaeze.okonkwo@fmcasaba.gov.ng / matron.ibrahim@fmcasaba.gov.ng — password: `CertifyDemo2026!`

---

## 5. Worker Dashboard (`/dashboard`) ✅

- [x] Header: worker name, cadre, facility, ward
- [x] Summary row: X of 7 complete, Y overdue, Z not started
- [x] Competency list — status badge, last completed date, expiry date
- [x] Overdue banner: "Complete this now to stay compliant" (no false email claim)
- [x] CTA: "Start Module →" links to module view

---

## 6. BLS Theory Module — Interactive ✅

Rebuilt from YouTube embed to full interactive component library per `INTERACTION_DESIGN.md`.

- [x] Module intro screen — learning objectives, why this matters, Begin button
- [x] Section progress bar — "Section X of 5", fills as sections complete
- [x] Section 1: Chain of Survival — RevealCard (4 cards) + KnowledgeCheck
- [x] Section 2: Recognising Cardiac Arrest — Text + KnowledgeCheck
- [x] Section 3: CPR Technique — RevealCard (3 cards) + OrderingActivity
- [x] Section 4: AED and Team Resuscitation — LabelledDiagram (SVG) + ReflectivePrompt
- [x] Section 5: Clinical Scenario — ScenarioChoice (3 options)
- [x] All sections gate Continue until interaction complete
- [x] Assessment — 7 MCQ, 80% pass, feedback per question, max 2 attempts then reveal
- [x] CompletionScreen — animated checkmark, score, PDF certificate download (jsPDF)
- [x] Fail screen — score shown, retake or review content

**Key files:** `lib/modules/bls-theory.tsx`, `lib/modules/types.ts`, `components/module/module-view.tsx`, `components/modules/`

---

## 7. Interactive Component Library ✅

All 8 components built in `components/modules/`:

- [x] RevealCard — tap to expand, green border on open, Continue after all opened
- [x] KnowledgeCheck — inline MCQ, immediate feedback, Continue after answered
- [x] ScenarioChoice — amber scenario card, consequence panel, no retry
- [x] OrderingActivity — drag (desktop) / arrow buttons (mobile), Check Order, Show Answer
- [x] ReflectivePrompt — open text, 20 char minimum, not assessed
- [x] LabelledDiagram — pulsing hotspots, tap to reveal panel, Continue after all visited
- [x] ProgressBar — fixed below header, Section X of Y, proportional fill
- [x] CompletionScreen — SVG checkmark draw animation, PDF certificate, Return to Dashboard

---

## 8. Certificate ✅

- [x] PDF generated client-side via jsPDF on CompletionScreen
- [x] Contains: worker name, module name, completion date, expiry date, facility, green border
- [x] CPR module has custom completion note about practical sign-off
- [ ] Certificate accessible from dashboard (currently only from CompletionScreen)

---

## 9. Facility Dashboard (`/facility`) ✅

- [x] Facility name header, stat cards (total staff, fully compliant, overall rate)
- [x] Competency breakdown — progress bars sorted by most gaps
- [x] Staff table — name, cadre, RAG dot per competency
- [x] Filter by cadre and "Overdue only"
- [x] Short code legend (BLS, IPC, SGA, MMF, HSA, MHT, CPR)
- [x] Export CSV
- [ ] **BUG: staff table columns truncated at 390px** — only "BL" column visible, others cut off. Needs horizontal scroll or responsive collapse.

---

## 10. Remaining Modules — NOT STARTED

Per `INTERACTION_DESIGN.md`, 6 modules still need interactive content built. BLS is the template.

- [ ] Module 2: Infection Prevention and Control
- [ ] Module 3: Safeguarding Awareness
- [ ] Module 4: Medicines Management — Fundamentals
- [ ] Module 5: Health and Safety Awareness
- [ ] Module 6: Manual Handling — Theory
- [ ] Module 7: CPR — Practical Preparation

Each module: create `lib/modules/[slug].tsx` with sections per `INTERACTION_DESIGN.md` spec, wire into `getInteractiveContent()` in `components/module/module-view.tsx`.

---

## 11. Seed Data — Gaps

- [ ] Hauwa Ibrahim's personal competency record — seed at least 2 complete, 1 expiring soon, 1 not started so her "My Compliance" view is realistic
- [ ] Review expiry dates across all staff — vary them, ensure at least 3 are expiring within 90 days

---

## 12. Responsive Check

- [x] Login page — confirmed at 390px
- [x] Worker dashboard — confirmed at 390px (screenshots verified)
- [x] Module view — confirmed at 390px
- [ ] Facility dashboard — **broken at 390px** (staff table truncation, see section 9)

---

## 13. Design & Polish

- [ ] Fix facility dashboard staff table at mobile width (Section 9 bug)
- [ ] Page titles set in metadata (currently blank)
- [ ] Loading states on dashboard and facility (currently blank during Supabase fetch)
- [ ] Certificate accessible from worker dashboard (not just CompletionScreen)

---

## 14. Deployment

- [ ] Connect repo to Vercel
- [ ] Add environment variables to Vercel (Supabase URL, anon key)
- [x] Production build passes (`npm run build`)
- [ ] Verify deployed URL works end-to-end

---

## 15. Demo Walkthrough Test

- [ ] 90-second story: login as Adaeze → dashboard → BLS module → complete → facility dashboard
- [ ] No broken links or blank screens
- [ ] Data looks realistic throughout

---

## Priority Order for Remaining Sessions

1. **Fix facility table mobile** (Section 9/12/13) — 30 min, visible demo bug
2. **Seed Hauwa's compliance record** (Section 11) — 15 min
3. **Remaining modules** (Section 10) — one per session, IPC first
4. **Polish + deploy** (Sections 13, 14) — after modules done
5. **Walkthrough test** (Section 15) — final gate

---

## Resolved Decisions

- **Certificate format:** Downloadable PDF via jsPDF
- **Facility dashboard export:** CSV download ✓
- **Login approach:** Role-based routing — workers → dashboard, admins → select-role picker
- **Platform name:** Certify Health
- **Module design standard:** `INTERACTION_DESIGN.md` — Articulate Rise-style, all 8 component types
