# Certify Health — Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all improvements from `suggestions.md` in order — critical fixes, admin dual-role navigation, full module content rebuild, UI polish, and seed data updates.

**Architecture:** Work through tasks in order (Tasks 1 → 7). Each task is independently deployable. The module rebuild (Tasks 4–6) is the largest section and must not be started until Tasks 1–3 are complete and committed.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase (Postgres), no new libraries.

**Reference:** Read `suggestions.md` at session start for the full spec. Read `docs/PRD.md` for context.

---

## File Map

| File | Change |
|------|--------|
| `components/dashboard/overdue-banner.tsx` | Remove false email claim |
| `components/facility/facility-dashboard.tsx` | Fix mobile headers (short codes + legend), add role nav |
| `app/login/page.tsx` | Replace white square placeholder with wordmark |
| `app/login/actions.ts` | Redirect admin to `/select-role` not `/facility` |
| `middleware.ts` | Add `/select-role` to protected routes |
| `app/select-role/page.tsx` | **Create** — admin role picker screen |
| `lib/dashboard.ts` | Expose `role` field in `WorkerDashboardData.profile` |
| `app/dashboard/page.tsx` | Show role nav toggle for admin users |
| `app/facility/page.tsx` | Pass `userId` to FacilityDashboard for role nav |
| `components/facility/facility-dashboard.tsx` | Add role nav toggle to header |
| `components/shared/role-nav.tsx` | **Create** — shared tab component |
| `lib/module.ts` | Fetch `module_sections` + expose `ModuleSection` type |
| `lib/module-content.ts` | **Create** — intro metadata + per-question explanations |
| `app/module/[id]/page.tsx` | Fetch profile + pass `sections`, `moduleIntro`, `workerName`, `facilityName` |
| `components/module/module-view.tsx` | Full rewrite — intro → sections → assessment (feedback) → result (cert) |
| `scripts/seed-all-modules.ts` | **Create** — sections + questions for all 7 modules |
| `scripts/seed-admin-compliance.ts` | **Create** — admin personal competency records |

---

## Task 1: Section 1 — Critical Fixes

**Files:** `components/dashboard/overdue-banner.tsx`, `components/facility/facility-dashboard.tsx`, `app/login/page.tsx`

- [ ] **Step 1.1: Fix overdue banner text**

In `components/dashboard/overdue-banner.tsx` line 33, change:
```tsx
// Before
"Complete them now to stay compliant. A reminder has been sent to your email."

// After
"Complete this now to stay compliant."
```

- [ ] **Step 1.2: Fix facility grid mobile headers**

In `components/facility/facility-dashboard.tsx`, replace the `<th>` rendering (currently line 172–176) that uses `c.title.split(" ")[0]` with short codes and replace the legend at the bottom (currently just RAG dot legend) with short code mapping.

Add this constant near the top of the file (after the RAG constant):
```tsx
const SHORT_CODE: Record<string, string> = {
  "Basic Life Support (BLS) — Theory": "BLS",
  "Infection Prevention and Control":   "IPC",
  "Safeguarding Awareness":             "SGA",
  "Medicines Management — Fundamentals":"MMF",
  "Health and Safety Awareness":        "HSA",
  "Manual Handling — Theory":           "MHT",
  "Cardiopulmonary Resuscitation (CPR) — Practical Preparation": "CPR",
}

function shortCode(title: string) {
  return SHORT_CODE[title] ?? title.slice(0, 3).toUpperCase()
}
```

Replace the `<th>` block:
```tsx
// Before
<th key={c.id} className="px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap text-center" title={c.title}>
  {c.title.split(" ")[0]}
</th>

// After
<th key={c.id} className="px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap text-center" title={c.title}>
  {shortCode(c.title)}
</th>
```

Replace the existing legend block at the bottom with a combined RAG + short code legend:
```tsx
{/* RAG legend */}
<div className="flex items-center gap-4 text-xs text-gray-400 px-1 flex-wrap">
  {Object.entries(RAG).map(([, v]) => (
    <span key={v.label} className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full inline-block ${v.dot}`} />
      {v.label}
    </span>
  ))}
</div>

{/* Short code legend */}
<div className="flex items-center gap-x-4 gap-y-1 text-xs text-gray-400 px-1 flex-wrap mt-2">
  {Object.entries(SHORT_CODE).map(([title, code]) => (
    <span key={code}><span className="font-medium text-gray-500">{code}</span> — {title}</span>
  ))}
</div>
```

- [ ] **Step 1.3: Replace login logo placeholder**

In `app/login/page.tsx`, replace the white square div (lines 36–40) with a wordmark:
```tsx
// Before
<div className="w-14 h-14 bg-brand rounded-xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_0_4px_rgba(22,163,74,0.2)]">
  <div className="w-7 h-7 bg-white rounded-md" />
</div>
<h1 className="text-white font-bold text-xl tracking-tight">
  Certify Health
</h1>

// After
<div className="mb-1">
  <span className="text-white font-extrabold text-3xl tracking-tight leading-none">
    Certify
  </span>
  <span className="text-[#4ade80] font-extrabold text-3xl tracking-tight leading-none ml-1.5">
    Health
  </span>
</div>
```

Also update `app/dashboard/page.tsx` line 28 (the nav header):
```tsx
// Before
<span className="text-white font-bold text-base tracking-tight">Certify Health</span>

// After
<span className="text-white font-bold text-base tracking-tight">
  Certify <span className="text-[#4ade80]">Health</span>
</span>
```

Apply the same wordmark pattern to `components/facility/facility-dashboard.tsx` header and any other branded surface that has a plain text logo.

- [ ] **Step 1.4: Commit**
```bash
git add components/dashboard/overdue-banner.tsx \
        components/facility/facility-dashboard.tsx \
        app/login/page.tsx \
        app/dashboard/page.tsx
git commit -m "fix: section 1 critical fixes — banner text, grid headers, wordmark"
```

---

## Task 2: Admin Role Picker

**Files:** `app/select-role/page.tsx` (create), `app/login/actions.ts`, `middleware.ts`

- [ ] **Step 2.1: Create `/select-role` page**

Create `app/select-role/page.tsx`:
```tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function SelectRolePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, cadre, role, facilities(name)")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") redirect("/dashboard")

  const facilityName = (profile.facilities as unknown as { name: string } | null)?.name ?? ""

  return (
    <main className="min-h-screen bg-[#052e16] flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-1">
          <span className="text-white font-extrabold text-3xl tracking-tight">Certify</span>
          <span className="text-[#4ade80] font-extrabold text-3xl tracking-tight ml-1.5">Health</span>
        </div>
        <p className="text-[#4ade80] text-sm mt-1">{facilityName}</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <p className="text-white/60 text-xs text-center mb-5">
          {profile.full_name} · {profile.cadre}
        </p>

        <Link
          href="/dashboard"
          className="block bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-green-50 transition-colors group"
        >
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">My Compliance</p>
          <p className="text-xs text-gray-500 mt-1">View your personal competency record and complete training modules</p>
        </Link>

        <Link
          href="/facility"
          className="block bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-green-50 transition-colors group"
        >
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Facility Overview</p>
          <p className="text-xs text-gray-500 mt-1">View staff compliance across the facility and identify training gaps</p>
        </Link>
      </div>
    </main>
  )
}
```

- [ ] **Step 2.2: Redirect admin to `/select-role` on login**

In `app/login/actions.ts`, change:
```typescript
// Before
if (profile.role === "admin") {
  redirect("/facility")
}

// After
if (profile.role === "admin") {
  redirect("/select-role")
}
```

Also update the middleware login redirect (line 19) — when an authenticated user hits `/login`, send admins to `/select-role`:

In `middleware.ts`:
```typescript
// Before
if (pathname === "/login" && user) {
  const url = request.nextUrl.clone()
  url.pathname = "/dashboard"
  return NextResponse.redirect(url)
}

// After — need to check role, but middleware can't easily check role without a DB call
// Simplest: redirect authenticated users from /login to /select-role always,
// and let /select-role redirect workers to /dashboard
if (pathname === "/login" && user) {
  const url = request.nextUrl.clone()
  url.pathname = "/select-role"
  return NextResponse.redirect(url)
}
```

Also add `/select-role` to the protected routes array:
```typescript
const PROTECTED = ["/dashboard", "/facility", "/module", "/select-role"]
```

Update `app/select-role/page.tsx` to handle both roles — if the user is a worker (not admin), redirect to `/dashboard`.

- [ ] **Step 2.3: Commit**
```bash
git add app/select-role/page.tsx app/login/actions.ts middleware.ts
git commit -m "feat: admin role picker screen and select-role routing"
```

---

## Task 3: Admin Navigation Toggle

**Files:** `components/shared/role-nav.tsx` (create), `lib/dashboard.ts`, `app/dashboard/page.tsx`, `app/facility/page.tsx`, `components/facility/facility-dashboard.tsx`

- [ ] **Step 3.1: Expose `role` in `getWorkerDashboard`**

In `lib/dashboard.ts`, update `WorkerDashboardData.profile` type and query:
```typescript
// Update type
export type WorkerDashboardData = {
  profile: {
    full_name: string
    cadre: string
    ward: string
    facility_name: string
    role: "worker" | "admin"  // add this
  }
  competencies: WorkerCompetency[]
}

// Update query (line ~36)
supabase
  .from("profiles")
  .select("full_name, cadre, ward, role, facilities(name)")  // add role
  .eq("id", userId)
  .single(),

// Update the return value (line ~85)
return {
  profile: {
    full_name: profileResult.data?.full_name ?? "",
    cadre: profileResult.data?.cadre ?? "",
    ward: profileResult.data?.ward ?? "",
    facility_name: facilities?.name ?? "",
    role: (profileResult.data?.role ?? "worker") as "worker" | "admin",  // add this
  },
  competencies,
}
```

- [ ] **Step 3.2: Create shared `RoleNav` component**

Create `components/shared/role-nav.tsx`:
```tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function RoleNav() {
  const pathname = usePathname()
  const onDashboard = pathname === "/dashboard"

  return (
    <div className="flex rounded-lg border border-white/20 overflow-hidden text-xs">
      <Link
        href="/dashboard"
        className={`px-3 py-1.5 transition-colors ${
          onDashboard ? "bg-white/20 text-white font-medium" : "text-white/60 hover:text-white"
        }`}
      >
        My Compliance
      </Link>
      <Link
        href="/facility"
        className={`px-3 py-1.5 transition-colors ${
          !onDashboard ? "bg-white/20 text-white font-medium" : "text-white/60 hover:text-white"
        }`}
      >
        Facility Overview
      </Link>
    </div>
  )
}
```

- [ ] **Step 3.3: Add `RoleNav` to worker dashboard header (admin only)**

In `app/dashboard/page.tsx`, import `RoleNav` and render it in the header when user is admin:
```tsx
import { RoleNav } from "@/components/shared/role-nav"

// In the header, replace the existing sign-out block with:
<div className="flex items-center gap-3">
  {profile.role === "admin" && <RoleNav />}
  <span className="text-white/70 text-xs hidden sm:block">{profile.full_name}</span>
  <form action={signOut}>
    <button type="submit" className="text-white/60 hover:text-white text-xs transition-colors">
      Sign out
    </button>
  </form>
</div>
```

- [ ] **Step 3.4: Add `RoleNav` to facility dashboard header**

In `app/facility/page.tsx`, fetch profile role and pass it:
```tsx
import { RoleNav } from "@/components/shared/role-nav"

// After fetching data, also fetch the admin's role
// getFacilityData already verifies admin role, so we can safely render RoleNav
// Pass a prop or simply always render RoleNav in FacilityDashboard (admin-only page)
```

In `components/facility/facility-dashboard.tsx`, add `RoleNav` import and render it in the header:
```tsx
import { RoleNav } from "@/components/shared/role-nav"

// In the header (line ~76), add RoleNav after the facility name:
<header className="bg-green-950 text-white px-4 py-5">
  <div className="flex items-center justify-between mb-1">
    <p className="text-xs text-green-400 font-medium uppercase tracking-wider">Facility Dashboard</p>
    <RoleNav />
  </div>
  <h1 className="text-lg font-bold leading-snug">{data.facility_name}</h1>
</header>
```

- [ ] **Step 3.5: Commit**
```bash
git add components/shared/role-nav.tsx lib/dashboard.ts \
        app/dashboard/page.tsx app/facility/page.tsx \
        components/facility/facility-dashboard.tsx
git commit -m "feat: admin role navigation toggle between My Compliance and Facility Overview"
```

---

## Task 4: Module Data Layer

**Files:** `lib/module.ts`, `lib/module-content.ts` (create)

- [ ] **Step 4.1: Add `ModuleSection` type and fetch sections in `lib/module.ts`**

Replace the entire file:
```typescript
import { createClient } from "@/lib/supabase/server"

export type AssessmentQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  question_order: number
}

export type ModuleSection = {
  id: string
  section_order: number
  title: string
  body: string
}

export type ModuleData = {
  competency: {
    id: string
    title: string
    estimated_minutes: number
    description: string | null
    validity_months: number
  }
  sections: ModuleSection[]
  questions: AssessmentQuestion[]
}

export async function getModuleData(competencyId: string): Promise<ModuleData | null> {
  const supabase = createClient()

  const [compResult, sectionsResult, questionsResult] = await Promise.all([
    supabase
      .from("competencies")
      .select("id, title, estimated_minutes, description, validity_months")
      .eq("id", competencyId)
      .single(),
    supabase
      .from("module_sections")
      .select("id, section_order, title, body")
      .eq("competency_id", competencyId)
      .order("section_order"),
    supabase
      .from("assessment_questions")
      .select("id, question, options, correct_index, question_order")
      .eq("competency_id", competencyId)
      .order("question_order"),
  ])

  if (!compResult.data) return null

  return {
    competency: compResult.data,
    sections: (sectionsResult.data ?? []) as ModuleSection[],
    questions: (questionsResult.data ?? []) as AssessmentQuestion[],
  }
}
```

- [ ] **Step 4.2: Create `lib/module-content.ts`**

This file provides intro metadata (objectives, why_matters) and per-question explanations for all 7 modules. Explanations are indexed by `question_order` (1-based, matching the seed data).

```typescript
type ModuleIntro = {
  objectives: string[]
  why_matters: string
  explanations: Record<number, string>  // keyed by question_order, text shown after wrong answer
}

const CONTENT: Record<string, ModuleIntro> = {
  "Basic Life Support (BLS) — Theory": {
    objectives: [
      "Recognise cardiac arrest and activate the emergency response without delay",
      "Perform high-quality CPR at the correct rate, depth, and ratio",
      "Describe the role of an AED and the steps for safe use",
    ],
    why_matters: "Cardiac arrest can happen anywhere — including on your ward. Every minute without CPR reduces survival by 7–10%. As a healthcare professional, you are often the first person on scene. This module gives you the knowledge to act decisively and correctly when it matters most.",
    explanations: {
      1: "The correct rate is 100–120 compressions per minute — fast enough to maintain circulation but not so fast that compressions become shallow.",
      2: "Chest compressions should be 5–6 cm deep in adults. Insufficient depth fails to circulate blood effectively.",
      3: "The ratio of compressions to rescue breaths is 30:2 — 30 compressions followed by 2 breaths, repeated continuously.",
      4: "Agonal breathing (occasional gasps) is NOT normal breathing and should be treated as cardiac arrest.",
      5: "You should not delay CPR to search for or attach an AED — compressions must continue while a second rescuer retrieves it.",
      6: "The Chain of Survival begins with early recognition and calling for help — acting immediately is the most important link.",
    },
  },

  "Infection Prevention and Control": {
    objectives: [
      "Apply standard precautions consistently in all clinical interactions",
      "Select and use appropriate PPE for different transmission risks",
      "Describe correct hand hygiene technique using the WHO 5 Moments",
    ],
    why_matters: "Healthcare-associated infections (HAIs) cause patient harm that is largely preventable. In Nigerian healthcare settings, resource constraints make effective IPC practice even more critical — your technique is often the primary defence. This module ensures your practice meets international standards.",
    explanations: {
      1: "The WHO identifies 5 moments for hand hygiene: before patient contact, before aseptic procedure, after body fluid exposure, after patient contact, and after touching patient surroundings.",
      2: "Standard precautions apply to ALL patients regardless of diagnosis — you cannot tell from appearance who may be infectious.",
      3: "Contact precautions require gloves and gown when entering the patient's room or care environment.",
      4: "Alcohol-based hand rub is effective against most pathogens, but soap and water must be used when hands are visibly soiled or after caring for a patient with C. difficile.",
      5: "Sharps must be disposed of immediately at the point of use — never recap a needle by hand.",
      6: "The correct colour for clinical/infectious waste in Nigerian facilities is yellow — this waste requires high-temperature incineration.",
    },
  },

  "Safeguarding Awareness": {
    objectives: [
      "Identify indicators of abuse or neglect in adults and children",
      "Describe your duty to report safeguarding concerns and who to report to",
      "Apply safeguarding principles sensitively in a Nigerian healthcare context",
    ],
    why_matters: "Safeguarding is everyone's responsibility in healthcare. Vulnerable patients — including elderly adults, children, and those with disabilities — depend on healthcare workers to notice when something is wrong and act on it. Inaction is never neutral: it allows harm to continue.",
    explanations: {
      1: "Unexplained bruising, especially in areas rarely injured accidentally (inner arms, torso, neck), is a recognised indicator of physical abuse.",
      2: "Confidentiality is not absolute in safeguarding — information can be shared without consent when there is a serious risk of harm to the patient or others.",
      3: "You should report concerns to your ward manager or designated safeguarding lead — never investigate alone or confront an alleged abuser directly.",
      4: "Financial abuse includes theft, misuse of funds, or pressure to sign over assets — it is as serious as physical abuse.",
      5: "Cultural or family explanations do not override safeguarding concerns — your duty to the patient is primary.",
    },
  },

  "Medicines Management — Fundamentals": {
    objectives: [
      "Apply the Five Rights of medicines administration in every drug round",
      "Identify and query prescriptions with errors or unusual dosages",
      "Describe the extra precautions required for high-risk medicines",
    ],
    why_matters: "Medication errors are one of the most common causes of preventable patient harm globally. A single error — the wrong drug, wrong dose, or wrong patient — can be fatal. Rigorous adherence to the Five Rights is not bureaucracy: it is what keeps patients safe.",
    explanations: {
      1: "The Five Rights are: right patient, right drug, right dose, right route, right time. All five must be verified before every administration.",
      2: "If a prescribed dose appears unusual for the patient's weight or condition, you must query it with the prescriber before administering — never administer without clarification.",
      3: "Insulin is a high-alert medication requiring a two-nurse independent check before administration — dose errors can cause fatal hypoglycaemia.",
      4: "PRN (pro re nata) means 'as needed' — the drug may only be given when the specified condition is met, not routinely.",
      5: "Controlled drugs must be counted and signed for by two nurses at every handover and must be stored in a double-locked cabinet.",
      6: "An adverse drug reaction must be reported using the facility incident report form and, where applicable, to the national pharmacovigilance system.",
    },
  },

  "Health and Safety Awareness": {
    objectives: [
      "Identify the main categories of hazard in a clinical workplace",
      "Describe how to conduct a basic risk assessment using the five-step framework",
      "Report incidents and near-misses correctly and explain why reporting matters",
    ],
    why_matters: "Healthcare workers face a higher rate of workplace injury than most other professions. Many injuries are preventable. Understanding hazards, assessing risks, and reporting incidents protects you, your colleagues, and your patients — and contributes to a safety culture that improves care over time.",
    explanations: {
      1: "Biological hazards include exposure to bloodborne pathogens, bodily fluids, and infectious agents — the most significant occupational health risk in clinical settings.",
      2: "The five steps of risk assessment are: identify the hazard, decide who might be harmed and how, evaluate the risks and decide on controls, record your findings, review and update.",
      3: "Near-misses must be reported — they reveal system weaknesses before harm occurs. Many major incidents are preceded by multiple unreported near-misses.",
      4: "Your employer has a legal duty to provide a safe workplace, but you have a corresponding duty to follow safe procedures and report hazards you cannot remedy yourself.",
      5: "Fire exits must remain unobstructed at all times — propping them open or blocking them with equipment is a serious safety violation.",
    },
  },

  "Manual Handling — Theory": {
    objectives: [
      "Apply the TILE framework to assess manual handling risk before any task",
      "Describe safe moving and handling principles for patient repositioning",
      "Identify when solo handling is inappropriate and assistance or equipment is required",
    ],
    why_matters: "Musculoskeletal injuries from manual handling are the leading cause of sickness absence among Nigerian nurses. Many injuries accumulate over years of poor technique and become career-ending. Learning to handle patients safely protects your long-term health as much as it protects your patients.",
    explanations: {
      1: "TILE stands for Task, Individual, Load, Environment — all four factors must be assessed before any manual handling task.",
      2: "You should never attempt to manually lift a patient alone — all patient moves require at least two staff or the use of appropriate equipment.",
      3: "The safest base of posture is a wide stance with feet hip-width apart, knees slightly bent, and spine in a neutral (not twisted) position.",
      4: "Hoist equipment must be used for any patient who cannot weight-bear — no manual lift is safe as a substitute for proper equipment.",
      5: "You must not twist your spine while carrying a load — pivot with your feet instead to change direction.",
    },
  },

  "Cardiopulmonary Resuscitation (CPR) — Practical Preparation": {
    objectives: [
      "Describe the critical performance standards assessed in a CPR practical sign-off",
      "Identify the most common errors in CPR technique and how to avoid them",
      "Explain the differences in CPR technique between adults, children, and infants",
    ],
    why_matters: "A theoretical pass in BLS is not the same as competent CPR. This module prepares you for your practical assessment by focusing on what assessors look for and where candidates commonly fail. Treat it as preparation for real resuscitation, not just an exam.",
    explanations: {
      1: "Compression depth of less than 5 cm is the most common reason for failure in CPR assessments — inadequate depth fails to circulate blood effectively.",
      2: "You should switch compressors every 2 minutes to prevent fatigue-related deterioration in compression quality.",
      3: "For infants, use two fingers (not the heel of the hand) for chest compressions, and compress to one-third of the chest depth.",
      4: "Compressions should not be interrupted for more than 10 seconds — even during defibrillation analysis, minimise the pause.",
      5: "In two-rescuer CPR, the ratio remains 30:2 with adult patients — do not switch to 15:2 (which is only used for paediatric two-rescuer CPR).",
      6: "Clear communication between rescuers is an assessed competency — announce when you are taking over compressions and confirm the handover.",
    },
  },
}

export function getModuleIntro(title: string): ModuleIntro | null {
  return CONTENT[title] ?? null
}
```

- [ ] **Step 4.3: Update `app/module/[id]/page.tsx` to pass new props**

```tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getModuleData } from "@/lib/module"
import { getModuleIntro } from "@/lib/module-content"
import { ModuleView } from "@/components/module/module-view"
import { recordAttempt } from "./actions"

type Props = { params: { id: string } }

export default async function ModulePage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [moduleData, profileResult] = await Promise.all([
    getModuleData(params.id),
    supabase
      .from("profiles")
      .select("full_name, facilities(name)")
      .eq("id", user.id)
      .single(),
  ])

  if (!moduleData) redirect("/dashboard")

  const moduleIntro = getModuleIntro(moduleData.competency.title)
  const workerName = profileResult.data?.full_name ?? ""
  const facilityName = (profileResult.data?.facilities as unknown as { name: string } | null)?.name ?? ""

  return (
    <ModuleView
      competency={moduleData.competency}
      sections={moduleData.sections}
      questions={moduleData.questions}
      moduleIntro={moduleIntro}
      workerName={workerName}
      facilityName={facilityName}
      onRecordAttempt={recordAttempt}
    />
  )
}
```

- [ ] **Step 4.4: Commit**
```bash
git add lib/module.ts lib/module-content.ts app/module/[id]/page.tsx
git commit -m "feat: module data layer — sections, intro metadata, per-question explanations"
```

---

## Task 5: ModuleView Component Rebuild

**File:** `components/module/module-view.tsx`

This is a complete rewrite. Phases: `intro` → `section` → `assessment` → `result`.

Assessment feedback flow per question:
1. User selects an answer and clicks "Check Answer"
2. If correct: highlight green, show explanation, "Next →" button
3. If wrong (1st attempt): highlight red, show explanation from `moduleIntro.explanations[q.question_order]`, "Try Again" button
4. If wrong (2nd attempt): highlight correct answer in green, show explanation, forced "Next →"

Completion screen shows module name, completion date, expiry date, worker name, facility name, and a "Download Certificate" button that uses `window.print()`.

- [ ] **Step 5.1: Rewrite `components/module/module-view.tsx`**

```tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import type { AssessmentQuestion, ModuleSection } from "@/lib/module"
import type { ReturnType } from "@/lib/module-content"

const PASS_THRESHOLD = 80

type Phase = "intro" | "section" | "assessment" | "result"

type ModuleIntro = {
  objectives: string[]
  why_matters: string
  explanations: Record<number, string>
}

type Props = {
  competency: {
    id: string
    title: string
    estimated_minutes: number
    description: string | null
    validity_months: number
  }
  sections: ModuleSection[]
  questions: AssessmentQuestion[]
  moduleIntro: ModuleIntro | null
  workerName: string
  facilityName: string
  onRecordAttempt: (
    competencyId: string,
    validityMonths: number,
    score: number,
    passed: boolean
  ) => Promise<void>
}

export function ModuleView({
  competency,
  sections,
  questions,
  moduleIntro,
  workerName,
  facilityName,
  onRecordAttempt,
}: Props) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [currentSection, setCurrentSection] = useState(0)

  // Assessment state
  const [currentQ, setCurrentQ] = useState(0)
  const [finalAnswers, setFinalAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [checkedAnswer, setCheckedAnswer] = useState<number | null>(null)
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)

  // Result state
  const [score, setScore] = useState<number | null>(null)
  const [passed, setPassed] = useState<boolean | null>(null)
  const [completionDate, setCompletionDate] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const hasSections = sections.length > 0
  const question = questions[currentQ]
  const isLastQuestion = currentQ === questions.length - 1
  const isLastSection = currentSection === sections.length - 1
  const section = sections[currentSection]

  function startSections() {
    setCurrentSection(0)
    setPhase("section")
  }

  function startAssessment() {
    setCurrentQ(0)
    setFinalAnswers([])
    setSelected(null)
    setCheckedAnswer(null)
    setAttemptsOnCurrent(0)
    setShowFeedback(false)
    setPhase("assessment")
  }

  function checkAnswer() {
    if (selected === null || !question) return
    setCheckedAnswer(selected)
    setAttemptsOnCurrent((a) => a + 1)
    setShowFeedback(true)
  }

  async function advanceQuestion(answeredIndex: number) {
    const updatedAnswers = [...finalAnswers, answeredIndex]

    if (isLastQuestion) {
      const correct = updatedAnswers.filter(
        (ans, i) => ans === questions[i].correct_index
      ).length
      const pct = Math.round((correct / questions.length) * 100)
      const didPass = pct >= PASS_THRESHOLD

      setScore(pct)
      setPassed(didPass)
      setCompletionDate(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }))
      setPhase("result")

      setSubmitting(true)
      await onRecordAttempt(competency.id, competency.validity_months, pct, didPass)
      setSubmitting(false)
    } else {
      setFinalAnswers(updatedAnswers)
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setCheckedAnswer(null)
      setAttemptsOnCurrent(0)
      setShowFeedback(false)
    }
  }

  function handleNext() {
    if (checkedAnswer === null) return
    const isCorrect = checkedAnswer === question.correct_index
    const isForced = attemptsOnCurrent >= 2

    if (isCorrect || isForced) {
      advanceQuestion(checkedAnswer)
    }
  }

  function handleTryAgain() {
    setSelected(null)
    setCheckedAnswer(null)
    setShowFeedback(false)
  }

  const isCheckedCorrect = checkedAnswer !== null && checkedAnswer === question?.correct_index
  const isForced = attemptsOnCurrent >= 2
  const explanation = question && moduleIntro?.explanations[question.question_order]

  function printCertificate() {
    window.print()
  }

  const expiryDate = completionDate
    ? new Date(
        new Date().setMonth(new Date().getMonth() + competency.validity_months)
      ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Certificate — only visible when printing */}
      <div className="hidden print:block p-12 max-w-2xl mx-auto">
        <div className="border-4 border-green-700 p-10 text-center space-y-6">
          <div>
            <span className="font-extrabold text-3xl text-green-900 tracking-tight">Certify</span>
            <span className="font-extrabold text-3xl text-green-600 tracking-tight ml-1.5">Health</span>
          </div>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Certificate of Competency</p>
          <p className="text-xl font-semibold text-gray-900">{workerName}</p>
          <p className="text-sm text-gray-500">has successfully completed</p>
          <p className="text-lg font-bold text-green-800">{competency.title}</p>
          <p className="text-sm text-gray-500">{facilityName}</p>
          <div className="flex justify-center gap-12 pt-4 text-sm text-gray-600">
            <div>
              <p className="font-medium">Completed</p>
              <p>{completionDate}</p>
            </div>
            <div>
              <p className="font-medium">Valid until</p>
              <p>{expiryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Normal UI — hidden when printing */}
      <div className="print:hidden">
        <header className="bg-green-950 text-white px-4 py-4">
          <Link href="/dashboard" className="text-sm text-green-300 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-base font-semibold mt-2 leading-snug">{competency.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-green-400">{competency.estimated_minutes} min estimated</p>
            {phase === "section" && hasSections && (
              <p className="text-xs text-green-400">
                Section {currentSection + 1} of {sections.length}
              </p>
            )}
            {phase === "assessment" && (
              <p className="text-xs text-green-400">
                Question {currentQ + 1} of {questions.length}
              </p>
            )}
          </div>
          {/* Progress bar */}
          {(phase === "section" || phase === "assessment") && (
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4ade80] rounded-full transition-all"
                style={{
                  width: phase === "section"
                    ? `${((currentSection + 1) / sections.length) * 50}%`
                    : `${50 + ((currentQ + 1) / questions.length) * 50}%`,
                }}
              />
            </div>
          )}
        </header>

        <main className="max-w-xl mx-auto px-4 py-6 space-y-4">

          {/* Intro phase */}
          {phase === "intro" && (
            <div className="space-y-4">
              {moduleIntro && (
                <>
                  <div className="bg-white rounded-xl shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">What you will learn</h2>
                    <ul className="space-y-2">
                      {moduleIntro.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-green-600 font-bold mt-0.5">✓</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-green-800 mb-2">Why this matters</h2>
                    <p className="text-sm text-green-700 leading-relaxed">{moduleIntro.why_matters}</p>
                  </div>
                </>
              )}
              {!moduleIntro && competency.description && (
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <p className="text-sm text-gray-600">{competency.description}</p>
                </div>
              )}
              <button
                onClick={hasSections ? startSections : startAssessment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Begin →
              </button>
            </div>
          )}

          {/* Section phase */}
          {phase === "section" && section && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <p className="text-xs text-gray-400 mb-2">Section {currentSection + 1} of {sections.length}</p>
                <h2 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h2>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{section.body}</div>
              </div>
              <button
                onClick={() => {
                  if (isLastSection) {
                    startAssessment()
                  } else {
                    setCurrentSection((s) => s + 1)
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                {isLastSection ? "Begin Assessment →" : "Continue →"}
              </button>
            </div>
          )}

          {/* Assessment phase */}
          {phase === "assessment" && question && (
            <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Question {currentQ + 1} of {questions.length}</span>
                  <span>{PASS_THRESHOLD}% to pass</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-sm font-semibold text-gray-900 leading-relaxed">{question.question}</p>

              <div className="space-y-2.5">
                {question.options.map((opt, i) => {
                  let style = "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  if (showFeedback) {
                    if (i === question.correct_index) {
                      style = "border-green-600 bg-green-50 text-green-900 font-medium"
                    } else if (i === checkedAnswer && checkedAnswer !== question.correct_index) {
                      style = "border-red-400 bg-red-50 text-red-800"
                    } else {
                      style = "border-gray-100 text-gray-400"
                    }
                  } else if (selected === i) {
                    style = "border-green-600 bg-green-50 text-green-900 font-medium"
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => !showFeedback && setSelected(i)}
                      disabled={showFeedback}
                      className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-colors ${style}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {showFeedback && (
                <div className={`rounded-lg p-3 text-sm ${isCheckedCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
                  <p className="font-medium">{isCheckedCorrect ? "Correct" : isForced ? "The correct answer is highlighted above." : "Not quite."}</p>
                  {explanation && <p className="mt-1 text-xs leading-relaxed">{explanation}</p>}
                </div>
              )}

              {!showFeedback && (
                <button
                  onClick={checkAnswer}
                  disabled={selected === null}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Check Answer
                </button>
              )}

              {showFeedback && (isCheckedCorrect || isForced) && (
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  {isLastQuestion ? (submitting ? "Saving…" : "See Results") : "Next →"}
                </button>
              )}

              {showFeedback && !isCheckedCorrect && !isForced && (
                <button
                  onClick={handleTryAgain}
                  className="w-full border border-green-600 text-green-700 hover:bg-green-50 font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* Result phase */}
          {phase === "result" && score !== null && passed !== null && (
            <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-4">
              <div className={`text-4xl font-bold ${passed ? "text-green-600" : "text-red-500"}`}>
                {score}%
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  {passed ? "Module Complete" : "Not quite there"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {passed
                    ? `${Object.values(questions.reduce((acc, q, i) => { acc[i] = finalAnswers[i] === q.correct_index; return acc }, {} as Record<number, boolean>)).filter(Boolean).length} of ${questions.length} correct — pass confirmed`
                    : `You need ${PASS_THRESHOLD}% to pass. Review the module and try again.`}
                </p>
              </div>

              {passed && completionDate && expiryDate && (
                <div className="flex justify-center gap-8 text-sm py-2">
                  <div>
                    <p className="text-xs text-gray-400">Completed</p>
                    <p className="font-medium text-gray-700">{completionDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Valid until</p>
                    <p className="font-medium text-gray-700">{expiryDate}</p>
                  </div>
                </div>
              )}

              {passed ? (
                <div className="space-y-2">
                  <button
                    onClick={printCertificate}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    Download Certificate
                  </button>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={startAssessment}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    Try Again
                  </button>
                  {hasSections && (
                    <button
                      onClick={() => { setCurrentSection(0); setPhase("section") }}
                      className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                      Review module content
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
```

Note: The result phase score summary uses `finalAnswers` — ensure `advanceQuestion` correctly accumulates `finalAnswers` before setting `result` phase. Double-check the array state update in `advanceQuestion`: `finalAnswers` at the time of the last question submission should be `updatedAnswers` (local variable), not the stale state. The code above is correct: `updatedAnswers` is computed before any `setScore/setPassed/setPhase` calls.

- [ ] **Step 5.2: Commit**
```bash
git add components/module/module-view.tsx
git commit -m "feat: rewrite module view — intro, sections, assessment feedback, completion screen, certificate print"
```

---

## Task 6: Seed All 7 Modules

**File:** `scripts/seed-all-modules.ts` (create)

This script seeds module sections and assessment questions for all 7 modules. BLS already has sections seeded — the script checks and skips existing data. Run with `npx tsx scripts/seed-all-modules.ts`.

The full content spec for each module is in `suggestions.md` section 3.3. Implement the following structure faithfully:

- 4 sections per module (section_order 1–4)
- 1 clinical scenario embedded in the section body (usually section 4 or a dedicated section)
- 6 assessment questions for BLS, IPC, Medicines, CPR; 5 for Safeguarding, H&S, Manual Handling
- Match question explanations in `lib/module-content.ts` (they're keyed by `question_order`)

- [ ] **Step 6.1: Create `scripts/seed-all-modules.ts`**

Below is the template structure. Implement all 7 modules fully — do not leave any sections or questions empty or as TBD. The spec in `suggestions.md` section 3.3 provides the exact content for each.

```typescript
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type SectionInput = { section_order: number; title: string; body: string }
type QuestionInput = {
  question: string
  options: string[]
  correct_index: number
  question_order: number
}
type ModuleInput = { title: string; sections: SectionInput[]; questions: QuestionInput[] }

const MODULES: ModuleInput[] = [
  // Module 1: BLS — sections already seeded, only questions need checking
  {
    title: "Basic Life Support (BLS) — Theory",
    sections: [], // already seeded by scripts/seed.ts
    questions: [
      {
        question: "What is the correct rate for chest compressions in adult CPR?",
        options: ["60–80 per minute", "80–100 per minute", "100–120 per minute", "120–140 per minute"],
        correct_index: 2,
        question_order: 1,
      },
      {
        question: "How deep should chest compressions be in an adult patient?",
        options: ["2–3 cm", "3–4 cm", "5–6 cm", "7–8 cm"],
        correct_index: 2,
        question_order: 2,
      },
      {
        question: "What is the correct ratio of chest compressions to rescue breaths in adult CPR?",
        options: ["15:2", "30:2", "20:2", "10:1"],
        correct_index: 1,
        question_order: 3,
      },
      {
        question: "A patient is found unresponsive and making occasional gasps. What is the correct interpretation?",
        options: [
          "The patient is breathing and does not need CPR",
          "This is agonal breathing — treat as cardiac arrest",
          "Give oxygen only and monitor",
          "Wait 30 seconds to assess further",
        ],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "You are alone and an AED arrives during CPR. What should you do?",
        options: [
          "Stop CPR, attach the AED pads, and wait for the machine to analyse",
          "Continue CPR until a second rescuer arrives to attach the AED",
          "Attach the AED pads while continuing compressions, then pause for analysis",
          "Delay AED use until the team arrives",
        ],
        correct_index: 2,
        question_order: 5,
      },
      {
        question: "Scenario: You are passing the medical ward when you see a patient slumped in a chair and unresponsive. There are no other staff in sight. What is your FIRST action?",
        options: [
          "Begin chest compressions immediately",
          "Check for a pulse for up to 60 seconds",
          "Shout for help and check for normal breathing (no more than 10 seconds)",
          "Run to the nurses station to call for a crash team",
        ],
        correct_index: 2,
        question_order: 6,
      },
    ],
  },

  // Module 2: IPC
  {
    title: "Infection Prevention and Control",
    sections: [
      {
        section_order: 1,
        title: "Why IPC Matters",
        body: `Healthcare-associated infections (HAIs) cause significant patient harm worldwide — and they are largely preventable.\n\nIn Nigeria, HAIs contribute to extended hospital stays, increased treatment costs, and preventable deaths. Resource constraints in many facilities make effective IPC practice even more critical: when isolation rooms are limited and PPE must be used carefully, technique becomes your primary line of defence.\n\nKey facts:\n- The WHO estimates that 1 in 10 patients in low- and middle-income countries acquires an HAI during hospital care\n- Surgical site infections, bloodstream infections, and pneumonia are the most common HAIs in Nigerian hospitals\n- Proper hand hygiene alone can reduce HAI rates by up to 50%\n\nAs a healthcare professional, your IPC practice protects your patients, your colleagues, and yourself. Every contact is a potential transmission event — and every contact is also an opportunity to break the chain of infection.`,
      },
      {
        section_order: 2,
        title: "Standard Precautions and Hand Hygiene",
        body: `Standard precautions are the foundation of IPC. They apply to ALL patients in ALL settings, regardless of diagnosis or perceived infection risk.\n\n**Standard precautions include:**\n- Hand hygiene\n- Personal protective equipment (PPE)\n- Safe handling and disposal of sharps\n- Safe handling of clinical waste\n- Environmental cleaning and decontamination\n- Respiratory hygiene and cough etiquette\n\n**WHO 5 Moments for Hand Hygiene:**\n1. Before touching a patient\n2. Before a clean or aseptic procedure\n3. After body fluid exposure\n4. After touching a patient\n5. After touching a patient's surroundings\n\n**Hand hygiene technique:**\n- Alcohol-based hand rub (ABHR): 6-step technique, 20–30 seconds\n- Soap and water: 6-step technique, 40–60 seconds\n- Use soap and water when hands are visibly soiled, and after caring for patients with C. difficile or Norovirus\n\n**PPE selection:**\n- Gloves: when contact with blood, body fluids, or non-intact skin is anticipated\n- Apron/gown: when clothing may become contaminated\n- Surgical mask: when within 1 metre of a patient with respiratory symptoms\n- Eye protection: when splashing is anticipated`,
      },
      {
        section_order: 3,
        title: "Transmission-Based Precautions",
        body: `When standard precautions are insufficient for a patient with a known or suspected infection, transmission-based precautions are applied in addition.\n\n**Contact precautions** (e.g. MRSA, C. difficile, wound infections)\n- Single room if available\n- Gloves and gown on entry\n- Dedicated equipment (stethoscope, BP cuff) kept in the room\n- Hand hygiene on exit\n\n**Droplet precautions** (e.g. influenza, meningococcal disease)\n- Single room or cohort nursing\n- Surgical mask when within 1 metre\n- Patient wears a surgical mask when being transported\n\n**Airborne precautions** (e.g. tuberculosis, chickenpox, measles)\n- Negative pressure room where available\n- FFP2/FFP3 respirator (not a surgical mask) for staff\n- Door kept closed\n- Patient movement restricted; patient wears surgical mask when outside room\n\n**Reflective prompt:** Think about a patient you have cared for who required isolation. Were the correct precautions in place throughout their care? Were there any gaps that in hindsight could have been avoided?`,
      },
      {
        section_order: 4,
        title: "Waste Management, Sharps Safety, and Clinical Scenario",
        body: `**Clinical waste categories and colour coding (Nigeria):**\n- Yellow: infectious/clinical waste (body parts, contaminated dressings)\n- Yellow with black stripe: cytotoxic waste\n- Black: domestic/general waste\n- White/clear: sharps containers\n\nClinical waste should never be placed in general waste bags. Overfull waste containers are a sharps injury risk — seal and replace at 75% full.\n\n**Sharps safety:**\n- Never re-sheath a needle by hand — use a single-handed technique or a safety device if available\n- Dispose of sharps immediately at the point of use\n- Never pass sharps hand-to-hand — place them in a safe zone first\n- If a sharps injury occurs: encourage bleeding, wash with soap and water, report immediately and follow your facility's needlestick protocol\n\n**Clinical Scenario:**\nA patient is admitted to your ward with a productive cough, night sweats, and weight loss. A chest X-ray shows cavitating lesions. Tuberculosis is suspected. Walk through the precautions you would apply:\n1. Initiate airborne precautions immediately — do not wait for confirmation\n2. Place the patient in a single room with the door closed\n3. All staff entering must wear an FFP2/FFP3 respirator — not a surgical mask\n4. Inform the infection control team\n5. Contact trace — identify other patients and staff who may have been exposed before isolation`,
      },
    ],
    questions: [
      {
        question: "According to the WHO, at which moment should hand hygiene be performed BEFORE touching a patient?",
        options: [
          "After touching their surroundings",
          "Before touching the patient — Moment 1",
          "Only if the patient is known to be infectious",
          "After completing a clinical procedure",
        ],
        correct_index: 1,
        question_order: 1,
      },
      {
        question: "Standard precautions apply to which patients?",
        options: [
          "Only patients with a confirmed infection",
          "Only patients in isolation",
          "All patients regardless of diagnosis or infection status",
          "Only patients requiring invasive procedures",
        ],
        correct_index: 2,
        question_order: 2,
      },
      {
        question: "Which type of precaution requires an FFP2 or FFP3 respirator (not a surgical mask)?",
        options: ["Contact precautions", "Droplet precautions", "Standard precautions", "Airborne precautions"],
        correct_index: 3,
        question_order: 3,
      },
      {
        question: "When should soap and water be used instead of alcohol-based hand rub?",
        options: [
          "Before every patient contact",
          "When hands are visibly soiled or after caring for a patient with C. difficile",
          "Only when ABHR is not available",
          "Soap and water and ABHR are always interchangeable",
        ],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "What should you do immediately after sustaining a needlestick injury?",
        options: [
          "Apply a tourniquet and wait for occupational health",
          "Encourage bleeding, wash with soap and water, and report immediately",
          "Apply alcohol hand rub to the wound site",
          "Complete an incident form before seeking treatment",
        ],
        correct_index: 1,
        question_order: 5,
      },
      {
        question: "Scenario: You are preparing to cannulate a patient who has suspected MRSA but is awaiting swab results. What precautions should you apply?",
        options: [
          "Standard precautions only — wait for confirmed results before escalating",
          "Contact precautions immediately — gloves and apron, dedicated equipment",
          "Airborne precautions — MRSA is transmitted by the respiratory route",
          "No additional precautions — MRSA is only a risk during wound care",
        ],
        correct_index: 1,
        question_order: 6,
      },
    ],
  },

  // Modules 3–7: Follow the same structure.
  // Implement sections and questions for each module per suggestions.md section 3.3.
  // Use the section titles, scenario descriptions, and question types specified.
  // Match question_order values (1–5 or 1–6) to the explanations in lib/module-content.ts.
  //
  // Module 3: Safeguarding Awareness (5 questions, question_order 1–5)
  // Module 4: Medicines Management — Fundamentals (6 questions, question_order 1–6)
  // Module 5: Health and Safety Awareness (5 questions, question_order 1–5)
  // Module 6: Manual Handling — Theory (5 questions, question_order 1–5)
  // Module 7: Cardiopulmonary Resuscitation (CPR) — Practical Preparation (6 questions, question_order 1–6)
]

async function seedModule(mod: ModuleInput) {
  const { data: competency } = await supabase
    .from("competencies")
    .select("id")
    .eq("title", mod.title)
    .single()

  if (!competency) {
    console.log(`✗ Competency not found: ${mod.title}`)
    return
  }

  // Sections
  if (mod.sections.length > 0) {
    const { count } = await supabase
      .from("module_sections")
      .select("*", { count: "exact", head: true })
      .eq("competency_id", competency.id)

    if (count && count > 0) {
      console.log(`✓ Sections already exist for: ${mod.title}`)
    } else {
      const { error } = await supabase.from("module_sections").insert(
        mod.sections.map((s) => ({ ...s, competency_id: competency.id }))
      )
      if (error) console.log(`✗ Section insert error for ${mod.title}: ${error.message}`)
      else console.log(`✓ Seeded ${mod.sections.length} sections for: ${mod.title}`)
    }
  }

  // Questions
  const { count: qCount } = await supabase
    .from("assessment_questions")
    .select("*", { count: "exact", head: true })
    .eq("competency_id", competency.id)

  if (qCount && qCount > 0) {
    console.log(`✓ Questions already exist for: ${mod.title}`)
  } else {
    const { error } = await supabase.from("assessment_questions").insert(
      mod.questions.map((q) => ({ ...q, competency_id: competency.id }))
    )
    if (error) console.log(`✗ Question insert error for ${mod.title}: ${error.message}`)
    else console.log(`✓ Seeded ${mod.questions.length} questions for: ${mod.title}`)
  }
}

async function main() {
  console.log("Seeding all module content...\n")
  for (const mod of MODULES) {
    await seedModule(mod)
  }
  console.log("\nDone.")
}

main().catch(console.error)
```

- [ ] **Step 6.2: Fill in modules 3–7 content**

Implement the full section bodies and questions for modules 3–7, following the content spec in `suggestions.md` section 3.3 exactly. Each module needs:
- 4 `SectionInput` objects with substantive body text (300–500 words each)
- 1 clinical scenario embedded in the last section body (not a separate section)
- 5–6 `QuestionInput` objects matching the explanations already in `lib/module-content.ts`

- [ ] **Step 6.3: Run the seed script**
```bash
npx tsx scripts/seed-all-modules.ts
```
Expected output: `✓ Seeded N sections` and `✓ Seeded N questions` for each module (or `✓ already exist` for BLS).

- [ ] **Step 6.4: Commit**
```bash
git add scripts/seed-all-modules.ts
git commit -m "feat: seed module sections and assessment questions for all 7 competencies"
```

---

## Task 7: Seed Data Updates

**Files:** `scripts/seed-admin-compliance.ts` (create)

- [ ] **Step 7.1: Create `scripts/seed-admin-compliance.ts`**

This script seeds the admin user's personal competency records and updates existing seed data for date variety (at least 3 expiring-soon, at least 3 overdue workers).

```typescript
import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  // Find admin user
  const { data: admin } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .single()

  if (!admin) { console.log("No admin user found"); return }

  // Get all competencies
  const { data: comps } = await supabase.from("competencies").select("id, title")
  if (!comps) return

  const now = new Date()

  // Admin competency records: 2 complete, 1 expiring soon, 1 overdue, rest not started
  const compByTitle = Object.fromEntries(comps.map((c) => [c.title, c]))

  const adminRecords = [
    {
      user_id: admin.id,
      competency_id: compByTitle["Infection Prevention and Control"]?.id,
      status: "complete",
      completed_at: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000).toISOString(), // 300 days ago
      expires_at: new Date(now.getTime() + 65 * 24 * 60 * 60 * 1000).toISOString(),   // 65 days from now (expiring soon)
    },
    {
      user_id: admin.id,
      competency_id: compByTitle["Safeguarding Awareness"]?.id,
      status: "complete",
      completed_at: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(now.getTime() + 330 * 24 * 60 * 60 * 1000).toISOString(), // well in future
    },
    {
      user_id: admin.id,
      competency_id: compByTitle["Basic Life Support (BLS) — Theory"]?.id,
      status: "overdue",
      completed_at: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago (overdue)
    },
  ].filter((r) => r.competency_id)

  for (const record of adminRecords) {
    const { error } = await supabase
      .from("worker_competencies")
      .upsert(record, { onConflict: "user_id,competency_id" })
    if (error) console.log(`✗ ${error.message}`)
    else console.log(`✓ Admin competency record upserted`)
  }

  console.log("Done.")
}

main().catch(console.error)
```

- [ ] **Step 7.2: Run the script**
```bash
npx tsx scripts/seed-admin-compliance.ts
```

- [ ] **Step 7.3: Verify seed data**

Log in as the admin demo account (`matron.ibrahim@fmcasaba.gov.ng`) and navigate to `/dashboard`. Confirm:
- At least 1 "overdue" competency visible
- At least 1 "Expiring soon" amber badge visible
- At least 1 "complete" competency

- [ ] **Step 7.4: Commit**
```bash
git add scripts/seed-admin-compliance.ts
git commit -m "feat: seed admin personal competency records with realistic mixed statuses"
```

---

## Verification

After all tasks are complete, walk through the demo story end-to-end:

1. Open `/login` — confirm "Certify Health" wordmark in green/white, no white square
2. Click "Demo: Healthcare Worker" — lands on worker dashboard
   - Confirm overdue banner says "Complete this now to stay compliant" (no email mention)
   - Open a module → confirm intro screen with objectives and "Why this matters"
   - Step through sections → confirm "Section X of Y" and progress bar
   - Complete assessment → confirm per-question feedback on wrong answers
   - Pass → confirm completion screen with dates and "Download Certificate" button
   - Click "Download Certificate" → browser print dialog opens with certificate layout
3. Return to `/login`, click "Demo: Facility Admin" → lands on `/select-role`
   - Confirm two cards: "My Compliance" and "Facility Overview"
   - Click "My Compliance" → `/dashboard` with admin's personal competencies (overdue + expiring)
   - Confirm role nav toggle at top: "My Compliance | Facility Overview"
   - Click "Facility Overview" → `/facility`
   - Confirm role nav toggle present
   - Confirm grid headers show short codes (BLS, IPC, etc.)
   - Confirm short code legend below grid
4. Run `npm run build` — confirm no TypeScript errors
