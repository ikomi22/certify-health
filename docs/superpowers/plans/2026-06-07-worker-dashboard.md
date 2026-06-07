# Worker Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/dashboard` route — the worker's landing view showing their identity, a green hero summary card, and a per-competency card list with status and action buttons.

**Architecture:** Server component page fetches data via `lib/dashboard.ts`, passes typed props to two presentational server components (`SummaryCard`, `CompetencyCard`). Sign-out is a server action triggered via a plain HTML form. No client components required.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS, Supabase SSR (`lib/supabase/server.ts`), TypeScript

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `lib/dashboard.ts` | `getWorkerDashboard` query + shared types |
| Create | `lib/format.ts` | `formatDate` date helper |
| Create | `app/dashboard/actions.ts` | `signOut` server action |
| Create | `components/dashboard/summary-card.tsx` | Green hero summary card |
| Create | `components/dashboard/competency-card.tsx` | Single competency card |
| Create | `app/dashboard/page.tsx` | Server component — fetches data, renders layout |

---

## Task 1: Shared types and data layer

**Files:**
- Create: `lib/dashboard.ts`
- Create: `lib/format.ts`

- [ ] **Step 1: Create `lib/format.ts`**

```ts
export function formatDate(iso: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
```

- [ ] **Step 2: Create `lib/dashboard.ts`**

```ts
import { createClient } from "@/lib/supabase/server"

export type CompetencyStatus = "not_started" | "in_progress" | "complete" | "overdue"

export type WorkerCompetency = {
  id: string
  title: string
  estimated_minutes: number
  status: CompetencyStatus
  completed_at: string | null
  expires_at: string | null
}

export type WorkerDashboardData = {
  profile: {
    full_name: string
    cadre: string
    ward: string
    facility_name: string
  }
  competencies: WorkerCompetency[]
}

const STATUS_ORDER: Record<CompetencyStatus, number> = {
  overdue: 0,
  not_started: 1,
  in_progress: 2,
  complete: 3,
}

export async function getWorkerDashboard(userId: string): Promise<WorkerDashboardData> {
  const supabase = createClient()

  const [profileResult, competenciesResult, wcResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, cadre, ward, facilities(name)")
      .eq("id", userId)
      .single(),
    supabase
      .from("competencies")
      .select("id, title, estimated_minutes"),
    supabase
      .from("worker_competencies")
      .select("competency_id, status, completed_at, expires_at")
      .eq("user_id", userId),
  ])

  const wcMap = new Map(
    (wcResult.data ?? []).map((wc) => [wc.competency_id, wc])
  )

  const competencies: WorkerCompetency[] = (competenciesResult.data ?? [])
    .map((c) => {
      const wc = wcMap.get(c.id)
      return {
        id: c.id,
        title: c.title,
        estimated_minutes: c.estimated_minutes,
        status: (wc?.status ?? "not_started") as CompetencyStatus,
        completed_at: wc?.completed_at ?? null,
        expires_at: wc?.expires_at ?? null,
      }
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

  const facilities = profileResult.data?.facilities as { name: string } | null

  return {
    profile: {
      full_name: profileResult.data?.full_name ?? "",
      cadre: profileResult.data?.cadre ?? "",
      ward: profileResult.data?.ward ?? "",
      facility_name: facilities?.name ?? "",
    },
    competencies,
  }
}
```

- [ ] **Step 3: Verify types compile**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors related to these files (other build errors may exist — ignore for now).

- [ ] **Step 4: Commit**

```bash
git add lib/dashboard.ts lib/format.ts
git commit -m "feat: add worker dashboard data layer"
```

---

## Task 2: Sign-out server action

**Files:**
- Create: `app/dashboard/actions.ts`

- [ ] **Step 1: Create `app/dashboard/actions.ts`**

```ts
"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
```

- [ ] **Step 2: Verify with lint**

```bash
npm run lint 2>&1 | grep -A3 "dashboard/actions"
```

Expected: no output (no errors for this file).

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/actions.ts
git commit -m "feat: add sign-out server action"
```

---

## Task 3: Summary card component

**Files:**
- Create: `components/dashboard/summary-card.tsx`

- [ ] **Step 1: Create `components/dashboard/summary-card.tsx`**

```tsx
import type { WorkerCompetency } from "@/lib/dashboard"

type Props = {
  competencies: WorkerCompetency[]
}

export function SummaryCard({ competencies }: Props) {
  const total = competencies.length
  const complete = competencies.filter((c) => c.status === "complete").length
  const overdue = competencies.filter((c) => c.status === "overdue").length
  const notStarted = competencies.filter((c) => c.status === "not_started").length

  return (
    <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #16a34a 0%, #052e16 100%)" }}>
      <p className="text-green-200 text-sm mb-1">Competency overview</p>
      <p className="text-2xl font-bold mb-4">
        {complete} of {total} complete
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
          {complete} complete
        </span>
        {overdue > 0 && (
          <span className="bg-red-400/30 text-red-100 text-xs font-medium px-3 py-1 rounded-full">
            {overdue} overdue
          </span>
        )}
        {notStarted > 0 && (
          <span className="bg-white/10 text-white/70 text-xs font-medium px-3 py-1 rounded-full">
            {notStarted} not started
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify with build**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors for this component.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/summary-card.tsx
git commit -m "feat: add SummaryCard component"
```

---

## Task 4: Competency card component

**Files:**
- Create: `components/dashboard/competency-card.tsx`

- [ ] **Step 1: Create `components/dashboard/competency-card.tsx`**

```tsx
import Link from "next/link"
import type { WorkerCompetency, CompetencyStatus } from "@/lib/dashboard"
import { formatDate } from "@/lib/format"

const BORDER: Record<CompetencyStatus, string> = {
  overdue: "border-l-red-500",
  complete: "border-l-green-600",
  in_progress: "border-l-amber-400",
  not_started: "border-l-gray-300",
}

const BADGE: Record<CompetencyStatus, string> = {
  overdue: "bg-red-100 text-red-800",
  complete: "bg-green-100 text-green-800",
  in_progress: "bg-amber-100 text-amber-800",
  not_started: "bg-gray-100 text-gray-500",
}

const LABEL: Record<CompetencyStatus, string> = {
  overdue: "Overdue",
  complete: "Complete",
  in_progress: "In Progress",
  not_started: "Not Started",
}

function dateLine(c: WorkerCompetency): string {
  if (c.status === "complete" && c.completed_at) {
    const exp = c.expires_at ? ` · Expires ${formatDate(c.expires_at)}` : ""
    return `Completed ${formatDate(c.completed_at)}${exp}`
  }
  if (c.status === "overdue" && c.expires_at) {
    return `Expired ${formatDate(c.expires_at)}`
  }
  if (c.status === "in_progress" && c.expires_at) {
    return `Expires ${formatDate(c.expires_at)}`
  }
  return "Not yet started"
}

type Props = {
  competency: WorkerCompetency
}

export function CompetencyCard({ competency: c }: Props) {
  const showCta = c.status !== "complete"
  const ctaLabel = c.status === "in_progress" ? "Continue →" : "Start Module →"

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${BORDER[c.status]} p-4 shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{c.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{c.estimated_minutes} min</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${BADGE[c.status]}`}>
          {LABEL[c.status]}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-2">{dateLine(c)}</p>
      {showCta && (
        <Link
          href={`/module/${c.id}`}
          className="mt-3 block w-full text-center bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify with build**

```bash
npm run build 2>&1 | head -30
```

Expected: no TypeScript errors for this component.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/competency-card.tsx
git commit -m "feat: add CompetencyCard component"
```

---

## Task 5: Dashboard page

**Files:**
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Create `app/dashboard/page.tsx`**

```tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getWorkerDashboard } from "@/lib/dashboard"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { CompetencyCard } from "@/components/dashboard/competency-card"
import { signOut } from "./actions"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { profile, competencies } = await getWorkerDashboard(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#052e16] px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-base tracking-tight">Certify Health</span>
        <div className="flex items-center gap-3">
          <span className="text-white/70 text-xs hidden sm:block">{profile.full_name}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-white/60 hover:text-white text-xs transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Identity strip */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {profile.cadre} · {profile.ward} · {profile.facility_name}
        </p>
      </div>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        <SummaryCard competencies={competencies} />

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your Competencies
          </h2>
          <div className="space-y-3">
            {competencies.map((c) => (
              <CompetencyCard key={c.id} competency={c} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Check `bg-brand` and `bg-brand-dark` are defined in Tailwind config**

```bash
cat tailwind.config.ts | grep -A10 "brand"
```

If no output, open `tailwind.config.ts` and add the brand colours to the `theme.extend.colors` block:

```ts
colors: {
  brand: "#16a34a",
  "brand-dark": "#15803d",
},
```

(The login page uses these — if the build worked before, they're already there.)

- [ ] **Step 3: Run full build**

```bash
npm run build 2>&1
```

Expected: build completes with no errors. Ignore any pre-existing warnings.

- [ ] **Step 4: Start dev server and verify manually**

```bash
npm run dev
```

Open http://localhost:3000 → redirects to /login → click "Demo: Healthcare Worker" → should land on /dashboard showing:
- Top bar with "Certify Health" and sign-out
- Identity strip: "Adaeze Okonkwo · Registered Nurse · Medical Ward B · Federal Medical Centre, Asaba"
- Green summary card: "X of 6 complete" with pill badges
- 6 competency cards sorted overdue-first

- [ ] **Step 5: Commit**

```bash
git add app/dashboard/page.tsx tailwind.config.ts
git commit -m "feat: build worker dashboard page"
```

---

## Done

After Task 5, the worker dashboard is complete. The `/dashboard` route shows real data from Supabase for Adaeze Okonkwo, with overdue items at the top and "Start Module →" links pointing to `/module/<id>` (the next feature to build).
