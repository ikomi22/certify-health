---
name: auth-design
description: Authentication flow for Certify Health — login page, middleware route protection, role-based redirect, demo buttons
metadata:
  type: project
---

# Auth — Design Spec

**Date:** 2026-06-07
**Status:** Approved

---

## What we're building

Login page, route protection middleware, and role-based redirect for the Certify Health demo. Two user roles: `worker` (redirects to `/dashboard`) and `admin` (redirects to `/facility`). Demo buttons allow one-click login without typing credentials — essential for the ministry meeting.

---

## Visual Design

**Deep Forest** direction:

| Token | Value | Usage |
|---|---|---|
| Background | `#052e16` | Full page background |
| Logo mark | `#16a34a` | Square icon, CTA button, demo button borders |
| Subtitle | `#4ade80` | Facility name below logo |
| Card | `#f9fafb` | Login form container |

Logo: green square (`#16a34a`) with white inner mark, rounded corners. Above it: "Certify Health" in white bold, facility name in `#4ade80` below.

Card contains:
1. "Sign in to your account" heading
2. Email field
3. Password field
4. Green "Sign in" button
5. Divider: "or use a demo account"
6. "Demo: Healthcare Worker" — outline button (green border/text)
7. "Demo: Facility Admin" — outline button (green border/text)

Mobile-first: card fills available width with padding. Desktop: card max-width ~400px, centred.

---

## Architecture

### Approach

Middleware-based route protection using `@supabase/ssr`. All auth logic centralised in `middleware.ts` — no per-page auth checks.

### Files

```
middleware.ts                    new — project root
lib/supabase/middleware.ts       new — Supabase client for middleware context
app/login/page.tsx               new — client component, login form + demo buttons
app/login/actions.ts             new — server action: signIn → read role → redirect
app/page.tsx                     modify — replace default page with redirect to /login
```

---

## Data Flow

### Every request

1. `middleware.ts` runs on every request
2. Creates Supabase client via `lib/supabase/middleware.ts` (cookie-aware for edge)
3. Calls `supabase.auth.getUser()` — refreshes session token in cookie if needed (no DB query — reads JWT)
4. **If protected route** (`/dashboard/**`, `/facility/**`, `/module/**`) **with no session** → redirect to `/login`
5. All other requests pass through

Middleware never queries the database — session check only. A logged-in user who navigates back to `/login` sees the form; they can use demo buttons to switch accounts. Acceptable for a demo.

### Login

1. User submits form (or clicks demo button) — calls server action `signIn(email, password)`
2. Server action: `supabase.auth.signInWithPassword({ email, password })`
3. On success: query `profiles` table for `role` field
4. `role === 'worker'` → `redirect('/dashboard')`
5. `role === 'admin'` → `redirect('/facility')`
6. On error: return `{ error: 'Invalid email or password' }` — displayed inline on form

### Demo buttons

- "Demo: Healthcare Worker" → calls `signIn('adaeze.okonkwo@fmcasaba.gov.ng', 'CertifyDemo2026!')`
- "Demo: Facility Admin" → calls `signIn('matron.ibrahim@fmcasaba.gov.ng', 'CertifyDemo2026!')`

Credentials hardcoded in the client component — acceptable for a demo build.

---

## Middleware Route Config

Protected paths (redirect to `/login` if no session):

```
/dashboard
/dashboard/:path*
/facility
/facility/:path*
/module
/module/:path*
```

Public paths (always accessible):

```
/login
/
/_next/static/:path*
/_next/image/:path*
/favicon.ico
```

---

## Error Handling

- Wrong credentials → inline error message below the form: "Invalid email or password"
- Loading state on submit → disable buttons and show "Signing in..." on the main button
- No other error states needed for the demo

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Worker (Adaeze Okonkwo) | adaeze.okonkwo@fmcasaba.gov.ng | CertifyDemo2026! |
| Admin (Hauwa Ibrahim) | matron.ibrahim@fmcasaba.gov.ng | CertifyDemo2026! |

---

## Out of Scope

- Password reset / forgot password flow
- Email verification
- OAuth / social login
- Session timeout handling
- Multi-role users
