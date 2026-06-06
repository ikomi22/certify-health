# CLAUDE.md — Healthcare Competency Platform

## Project Overview

This is a digital healthcare workforce competency platform targeting Nigerian healthcare workers and the Federal Ministry of Health. It enables continuous, trackable, affordable clinical training built to NHS-grade standards — accessible from a smartphone.

This is a demo/MVP build to present to a government ministry contact. It must look credible, feel simple, and tell a story on screen without needing explanation.

## Reference Documents

Always read these before making architectural or feature decisions:

- @docs/PRD.md — full product requirements, user personas, feature scope
- @docs/ARCHITECTURE.md — tech stack decisions and rationale (create if not present)

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Next.js API routes (keep it simple — no separate backend yet)
- **Database:** Supabase (Postgres) — auth + data
- **Auth:** Supabase Auth
- **Deployment:** Vercel

Do not introduce additional frameworks or libraries without asking first. Keep the stack minimal.

## Project Structure

```
/app              → Next.js app router pages
/components       → Reusable UI components
/lib              → Supabase client, utilities
/docs             → PRD, architecture, decisions
/public           → Static assets
```

## Code Rules

- Use TypeScript throughout — no plain JS files
- Use Tailwind for all styling — no CSS modules, no inline styles
- Components go in /components — no logic in page files beyond data fetching
- Keep components small and single-purpose
- Use server components by default — client components only when interactivity requires it
- All Supabase queries go through /lib — never call Supabase directly from components
- No hardcoded data in components — use seed files or Supabase

## Naming Conventions

- Files: kebab-case (user-profile.tsx)
- Components: PascalCase (UserProfile)
- Functions/variables: camelCase
- Database tables: snake_case

## What This Demo Must Show

The demo has one job — show a ministry contact what the platform looks like in use. Three views matter most:

1. **Worker dashboard** — a healthcare worker sees their competency profile, what’s complete, what’s overdue
1. **Module view** — what a training module actually looks like inside the platform
1. **Facility dashboard** — a matron or administrator sees their team’s compliance at a glance

Every design and build decision should serve these three views. Do not build beyond them without checking the PRD.

## Design Principles

- Mobile-first — assume the primary user is on a smartphone in Nigeria
- Clean and clinical — this is a professional tool, not a consumer app
- No clutter — every element on screen must earn its place
- Use green/teal as the primary colour — signals health, trust, growth
- English only for now — no i18n needed at this stage

## Demo Data

Seed the database with realistic Nigerian healthcare worker names, facilities, and competency records. Use Federal Medical Centre, Asaba as the demo facility. Include a mix of compliant and non-compliant workers to make the facility dashboard meaningful.

## What NOT to Build

- Do not build payment flows
- Do not build content authoring tools
- Do not build user registration flows beyond what’s needed to demo
- Do not build email/notification systems
- Do not build anything not in the PRD without asking first

## Commands

```bash
npm run dev        # local development
npm run build      # production build check
npm run lint       # lint before committing
```

## Session Discipline

- Start each session by reading @docs/PRD.md
- Use [ ] checkboxes in docs/TASKS.md to track progress
- When a session ends, update TASKS.md with what was completed
- Use /clear between distinct features — do not carry stale context