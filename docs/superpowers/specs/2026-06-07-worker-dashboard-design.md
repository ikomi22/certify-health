---
title: Worker Dashboard
date: 2026-06-07
status: approved
---

# Worker Dashboard — Design Spec

## Overview

The `/dashboard` route is the landing view for a logged-in healthcare worker. It shows their identity, an at-a-glance competency summary, and a card-per-competency list with status and action buttons.

Route is protected by middleware — unauthenticated users are redirected to `/login`.

---

## Layout

### 1. Top Bar
Dark background (`#052e16`). Left: "Certify Health" logo/wordmark. Right: worker full name + Sign Out button. Matches the login page branding for visual continuity.

### 2. Worker Identity Strip
Light gray (`#f9fafb`) strip below the top bar. Displays: full name, cadre (e.g. Registered Nurse), ward (e.g. Medical Ward B), facility (e.g. Federal Medical Centre, Asaba). Secondary/muted text. Reads as a subheader, not a hero.

### 3. Green Hero Summary Card
Bold green gradient card (`#16a34a` → `#052e16`), white text. Headline: "X of 6 competencies complete". Three pill badges: `N complete` / `N overdue` / `N not started`.

### 4. Competency List
White page background. Section heading: "Your Competencies". Each competency is a white card with:

- **Left border colour** signals status:
  - Red (`#ef4444`) — overdue
  - Green (`#16a34a`) — complete
  - Amber (`#f59e0b`) — in progress
  - Gray (`#d1d5db`) — not started
- **Title** (bold) + estimated time (muted, e.g. "30 min")
- **Status badge** top-right: Overdue / Complete / In Progress / Not Started
- **Date line**: "Expired DD MMM YYYY", "Expires DD MMM YYYY", or "Not yet started"
- **CTA button** at the bottom — only on actionable items:
  - Overdue / Not Started → "Start Module →" (solid green)
  - In Progress → "Continue →" (solid green)
  - Complete → no button (or optional "View Certificate" — out of scope for this build)

Completed items appear after active/overdue/not-started items in the list. Sort order: overdue first, then not started, then in progress, then complete.

---

## Data

### Query — `lib/dashboard.ts`

Single server-side function `getWorkerDashboard(userId: string)` that returns:

```ts
{
  profile: {
    full_name: string
    cadre: string
    ward: string
    facility_name: string
  }
  competencies: Array<{
    id: string
    title: string
    estimated_minutes: number
    status: 'not_started' | 'in_progress' | 'complete' | 'overdue'
    completed_at: string | null
    expires_at: string | null
  }>
}
```

Joins: `profiles` → `facilities` (for facility name), `competencies` LEFT JOIN `worker_competencies` (so competencies with no record yet still appear with status `not_started`).

### Sign Out

Server action in `app/dashboard/actions.ts` — calls `supabase.auth.signOut()` then redirects to `/login`.

---

## File Structure

```
app/
  dashboard/
    page.tsx          ← server component: calls getWorkerDashboard, renders layout
    actions.ts        ← signOut server action
components/
  dashboard/
    summary-card.tsx  ← green hero summary card
    competency-card.tsx ← single competency card
lib/
  dashboard.ts        ← getWorkerDashboard query
```

---

## Out of Scope

- Certificate download (deferred to certificate task)
- "View Certificate" button on complete items
- Loading skeleton (add if time permits — not blocking)
