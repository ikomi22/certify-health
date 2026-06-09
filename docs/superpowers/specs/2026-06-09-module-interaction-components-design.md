# Module Interaction Component Library — Design Spec

**Version:** 1.0  
**Date:** 2026-06-09  
**Status:** Approved  

---

## Context

The current module experience is text pages with a quiz appended — passive consumption, not learning. This spec defines a reusable interactive component library that transforms every module into an active e-learning experience.

The target feel for the module environment is **distinctly warmer** than the clinical dashboard — more human, more engaging, still professional. Animations are expressive and purposeful. All components are mobile-first, built for 390px screens and Nigerian healthcare workers on smartphones.

---

## Module Environment (Shell)

The wrapper that all components live in. Applied to every module page.

- **Background:** `#fffbf5` (warm off-white) — distinguishes module experience from dashboard (`#f9fafb`)
- **Cards:** White surface, `shadow-sm ring-1 ring-black/5`, `rounded-2xl`
- **Section transitions:** New section slides in from right (`translateX(20px) → 0`, `opacity 0 → 1`, 250ms ease-out) on Continue press — feels like turning a page. Full-width sweep on mobile
- **Continue button:** Full-width, green, `rounded-xl`, `→` arrow shifts right on hover. Absent (not disabled) until unlock condition met — slides in from below when it appears
- **ProgressBar:** Fixed below header. Gradient fill (`from-green-500 to-emerald-400`). Section marker dots above bar — visited filled green, current pulsing, future grey. Shows `Section X of Y` label

---

## Component 1: RevealCard

**Purpose:** Forces individual attention on each item in a list. Continue locked until all cards opened.

**Behaviour:**
- Cards load with staggered entrance — 50ms delay between each (desktop only; skip on mobile to avoid lag on lower-end devices)
- Closed: white card, `ring-1 ring-gray-200`, title `font-medium`, green `+` icon right-aligned
- On tap: height expands (250ms ease-out), `+` rotates 45° to `×` (CSS transform), green left border (`border-l-4 border-green-500`) slides in, content fades in (150ms, slight delay)
- Once all cards opened: Continue fades up from below (`translateY(8px) → 0`)

**Props:** `cards: { title: string; content: string }[]`

**Mobile:** Staggered entrance disabled. Tap targets `min-h-[44px]`. No changes to interaction model.

---

## Component 2: KnowledgeCheck

**Purpose:** Inline processing check after content sections. Not scored. Immediate feedback.

**Behaviour:**
- Options rendered as pill-shaped buttons, `min-h-[44px]`
- Correct: button flashes `bg-green-50 → bg-green-100`, `✓` scales in (150ms spring), one-sentence explanation in `text-sm text-green-700`
- Incorrect: selected option `bg-red-50` with shake animation (3 horizontal nudges, 300ms), correct option highlights `bg-green-100` with `✓`, explanation shown
- Continue appears immediately after feedback — no retry required

**Props:** `question: string; options: { text: string; correct: boolean; explanation: string }[]`

**Mobile:** Full-width pill buttons. Tap targets enforced.

---

## Component 3: ScenarioChoice

**Purpose:** Clinical scenario with consequence feedback. The core active reasoning component — one per module minimum.

**Behaviour:**
- Scenario card: `bg-amber-50`, `border-l-4 border-amber-500`, `SCENARIO` label in `text-amber-600 text-xs font-semibold tracking-widest`
- Choice buttons: full-width, white, `ring-1 ring-gray-200`, `rounded-xl`. Letter labels (`A`, `B`, `C`) in `text-gray-400`. Hover: `shadow-md translateY(-1px)` (150ms)
- On selection: chosen button fills amber, others dim to `opacity-50`. Consequence panel slides down (250ms) from 10px above with fade
- Consequence panel: strong left border — green/red/amber by outcome. `CORRECT / INCORRECT / PARTIALLY CORRECT` in bold uppercase. Explanation below
- Correct consequence header gets a single shimmer sweep (CSS `@keyframes`, 600ms, one pass)
- Continue appears 500ms after consequence renders — enforces a reading beat
- No retry — reflection, not scoring

**Props:** `scenario: string; choices: { text: string; outcome: 'correct' | 'incorrect' | 'partial'; consequence: string }[]`

**Mobile:** Full-width buttons already ideal. Consequence panel slides in below without modal. No changes needed.

---

## Component 4: OrderingActivity

**Purpose:** Learner sequences steps or items into correct order. Uses drag on desktop, arrow buttons on mobile.

**Behaviour:**
- Cards: white, `rounded-xl`, `ring-1 ring-gray-200`, `p-4`, `≡` drag handle left-aligned in `text-gray-400`
- **Desktop:** HTML5 Drag and Drop API. Dragging card: `opacity-75 scale-105`. Drop targets show green insertion line on hover
- **Mobile:** Up `↑` / Down `↓` arrow buttons on right side of each card, `min-h-[44px]` each. Detected via `'ontouchstart' in window`. No drag on mobile
- "Check Order" button: outlined style until at least one reorder made
- On submit — correct items animate green sequentially (80ms stagger, left-to-right), `✓` scales in per card — feels like a lock clicking into place. Incorrect items turn red simultaneously, then after 400ms show `"Should be position N"` in `text-sm text-red-600`
- Unlimited attempts. Continue activates after correct order achieved or correct answer seen

**Props:** `items: { id: string; text: string }[]; correctOrder: string[]`

**Mobile:** Arrow buttons replace drag entirely. Large tap targets. No touch drag attempted.

---

## Component 5: ReflectivePrompt

**Purpose:** Active processing moment. Not assessed, not saved. Signals a gear-shift from consuming to thinking.

**Behaviour:**
- Container: `bg-amber-50/60`, `ring-1 ring-amber-200/60`, no hard border — visually softer than content cards
- `REFLECT` label: `text-amber-600 text-xs font-semibold tracking-widest` — consistent with ScenarioChoice label treatment
- Question: italic, `font-medium text-gray-700`
- Textarea: full-width, `rounded-xl border border-gray-200 p-4 min-h-[120px]`
- Placeholder: `"Type your reflection here — your response is private and not assessed"`
- Character counter: right-aligned below textarea. Below 20 chars: `text-red-400`. At/above 20: fades to `text-green-500`
- Continue button: absent until 20-char minimum met, then slides in from below
- On first keystroke: `REFLECT` label pulses once — one beat, acknowledges the learner has started

**Props:** `question: string; minimumChars?: number` (default 20)

**Mobile:** `scrollIntoView({ behavior: 'smooth' })` on textarea focus — keeps input visible above keyboard. Character counter stays visible just above keyboard.

---

## Component 6: LabelledDiagram

**Purpose:** Spatial content with tappable hotspots. Learner explores all hotspots before continuing.

**Behaviour:**
- SVG: `width="100%" viewBox="..."` — fluid scaling, no horizontal scroll
- Container: `rounded-2xl overflow-hidden ring-1 ring-gray-200`
- Hotspots: `animate-ping` outer ring (`bg-green-500/20`), solid inner dot (`bg-green-500`). Invisible tap zone minimum 44px regardless of visual dot size
- On tap: panel slides up from bottom of diagram (`bg-white/95 backdrop-blur-sm`, overlays bottom 35%). Title `font-semibold`, description `text-sm text-gray-600`. `×` closes panel. Hotspot stops pulsing, fills solid green (visited)
- Progress: `"N of N explored"` in `text-xs text-gray-400` below diagram. On completion: `"All explored ✓"` in `text-green-600`
- When last hotspot visited: all solid green dots pulse once in unison. Continue slides in

**Props:** `svg: ReactNode; hotspots: { id: string; x: number; y: number; label: string; description: string }[]`

**Mobile:** Overlay panel within diagram — no scroll needed to read label. Critical for small screens.

---

## Component 7: ProgressBar

**Purpose:** Persistent orientation — learner always knows where they are.

**Behaviour:**
- Fixed below module header, always visible
- Gradient fill: `from-green-500 to-emerald-400`
- Section marker dots above bar: visited filled green, current pulsing, future grey
- Label: `Section X of Y` right-aligned

**Props:** `currentSection: number; totalSections: number; moduleName: string`

**Mobile:** Module name truncated if needed. Compact height. Always visible.

---

## Component 8: CompletionScreen

**Purpose:** Emotional peak of the module. Certificate download + dashboard return.

**Entry animation sequence (plays once on mount):**
1. Background fades to `bg-green-50/40` (300ms)
2. Green circle (`bg-green-100 rounded-full`) scales from 0 (350ms spring) — 120px desktop, 96px mobile
3. SVG `✓` draws via `stroke-dashoffset` animation (400ms ease-out) — hand-drawn feel
4. "Module Complete" heading fades and rises (250ms, 100ms delay after checkmark)
5. Worker name, module name, dates fade in as group (200ms, 150ms delay)
6. Buttons fade in last (200ms)

**Certificate download:** `jsPDF`, client-side. Button shows spinner during 1–2s generation, then triggers browser download. Thin green border, "Certify Health" wordmark, worker name large `font-bold`, clean white space — looks like a real credential.

**On mount:** Supabase update fires immediately (competency → complete, today's date, calculated expiry). "Return to Dashboard" button calls `router.push('/dashboard')` only — no second update.

**Props:** `workerName: string; moduleName: string; completionDate: Date; expiryDate: Date`

**Mobile:** Buttons stacked full-width. Circle 96px. All animation timings unchanged.

---

## File Structure

```
/components/modules/
  RevealCard.tsx
  KnowledgeCheck.tsx
  ScenarioChoice.tsx
  OrderingActivity.tsx
  ReflectivePrompt.tsx
  LabelledDiagram.tsx
  ProgressBar.tsx
  CompletionScreen.tsx
```

Module content data lives in `/lib/modules/[module-id].ts` as structured objects. The module renderer (`/app/module/[id]/page.tsx`) reads the data and renders the correct component per section block. Continue state is managed locally per component; the renderer listens for completion events.

---

## Design Tokens (Module Environment)

| Token | Value | Usage |
|---|---|---|
| Background | `#fffbf5` | Module page background |
| Card surface | `white` + `shadow-sm ring-1 ring-black/5` | All cards |
| Border radius | `rounded-2xl` | All cards and containers |
| Green primary | `#16a34a` | Correct, complete, Continue |
| Green gradient | `from-green-500 to-emerald-400` | Progress bar fill |
| Amber | `#d97706` | Scenarios, reflect, warnings |
| Red | `#dc2626` | Incorrect, overdue |
| Shake animation | 3 nudges, 300ms | Wrong answer feedback |
| Section transition | `translateX(20px)→0`, 250ms ease-out | Section advance |

---

## Mobile Rules (Global)

- All tap targets minimum 44px height
- Staggered entrance animations disabled on mobile
- OrderingActivity uses arrow buttons, not drag
- LabelledDiagram label panel overlays diagram (no scroll)
- ReflectivePrompt scrolls textarea into view on focus
- Continue button always full-width
- No horizontal scroll anywhere
- Test every component at 390px before marking complete
