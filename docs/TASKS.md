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
- [x] **BUG fixed: staff table columns truncated at 390px** — added `min-w-[640px]` to table so `overflow-x-auto` wrapper kicks in correctly.

---

## 10. Remaining Modules ✅

All 6 modules built in `lib/modules/` and wired into `getInteractiveContent()` in `components/module/module-view.tsx`.

- [x] Module 2: Infection Prevention and Control (`lib/modules/ipc.tsx`)
- [x] Module 3: Safeguarding Awareness (`lib/modules/safeguarding.tsx`)
- [x] Module 4: Medicines Management — Fundamentals (`lib/modules/medicines.tsx`)
- [x] Module 5: Health and Safety Awareness (`lib/modules/health-safety.tsx`)
- [x] Module 6: Manual Handling — Theory (`lib/modules/manual-handling.tsx`)
- [x] Module 7: CPR — Practical Preparation (`lib/modules/cpr.tsx`)

---

## 11. Seed Data — Gaps

- [x] Hauwa Ibrahim's personal competency record — IPC (complete, expires in 20 days), Safeguarding (complete), BLS (overdue), remaining 4 as not_started
- [ ] Review expiry dates across all staff — vary them, ensure at least 3 are expiring within 90 days

---

## 12. Responsive Check

- [x] Login page — confirmed at 390px
- [x] Worker dashboard — confirmed at 390px (screenshots verified)
- [x] Module view — confirmed at 390px
- [x] Facility dashboard — mobile table fix applied

---

## 13. Design & Polish

- [x] Fix facility dashboard staff table at mobile width (Section 9 bug)
- [x] Fix LabelledDiagram: `pulsedAll` in useEffect deps caused React cleanup to cancel completion timeout — Section 4 could never be completed. Replaced with `done` state.
- [x] Fix ScenarioChoice: buttons were near-invisible (ring-gray-200 on cream bg) — replaced with border-gray-300 + shadow-sm + explicit text-gray-800
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

1. **Page titles + loading states** (Section 13) — 30 min polish
2. **Certificate from dashboard** (Section 13) — small feature
3. **Deploy to Vercel** (Section 14) — connect repo, add env vars, verify URL
4. **Walkthrough test** (Section 15) — final gate before ministry demo

---

## Resolved Decisions

- **Certificate format:** Downloadable PDF via jsPDF
- **Facility dashboard export:** CSV download ✓
- **Login approach:** Role-based routing — workers → dashboard, admins → select-role picker
- **Platform name:** Certify Health
- **Module design standard:** `INTERACTION_DESIGN.md` — Articulate Rise-style, all 8 component types
