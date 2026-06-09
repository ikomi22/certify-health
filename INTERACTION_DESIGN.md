# INTERACTION_DESIGN.md — Certify Health Module Experience

**Version:** 1.0
**Purpose:** Defines the interactive component library and module experience design for all 7 training modules. Claude Code must read this entire document before touching any module code.

-----

## The Problem With The Current Build

The current modules are text pages with a quiz appended. This is not an e-learning experience — it is a document. The target standard is Articulate Rise: content broken into distinct interactive blocks, each requiring engagement before progression, with visual rhythm and active recall throughout.

This document defines exactly how to achieve that standard using React components built into the platform. No external e-learning tools. No iframes. Native components only.

-----

## Core Design Principle

**Every screen must require an action before progression.**

The learner should never be able to passively scroll through a module and click Continue without engaging with the content. At minimum, every section must have one moment where the learner must do something — click to reveal, answer a question, make a choice, drag an item — before the Continue button becomes active.

-----

## The Interaction Component Library

Build the following reusable components. Every module section uses one or more of these. They are the building blocks of every module experience.

-----

### Component 1: RevealCard

**What it does:** Content is hidden behind a card with a title. The learner clicks or taps to reveal the full content. Continue button only activates after all cards in the set have been opened.

**When to use:** Presenting a list of principles, steps, or definitions where each item deserves individual attention. Use instead of a bullet list.

**Visual behaviour:**

- Card starts in closed state — shows title and a “+” icon
- On tap: card expands with a smooth animation (200ms ease), content reveals, “+” becomes “−”
- Card border changes from grey to green when opened
- Continue button appears only when all cards have been opened at least once

**Example use:** Chain of Survival — four cards, one per link. Learner must open all four before continuing.

```
┌─────────────────────────────────────┐
│ 1. Early Recognition            [+] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 2. Early CPR                    [+] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 3. Early Defibrillation         [+] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 4. Post-Resuscitation Care      [+] │
└─────────────────────────────────────┘
                        [ Continue → ] ← disabled until all opened
```

-----

### Component 2: ScenarioChoice

**What it does:** Presents a realistic clinical scenario with 2–3 choices. Each choice leads to a consequence screen — not just right/wrong, but a description of what would actually happen. After seeing the consequence, the learner continues.

**When to use:** Once per module minimum. This is the most important component — it transforms passive reading into active clinical reasoning.

**Visual behaviour:**

- Scenario text displayed in a distinct card with amber left border (signals: this is a situation, not information)
- 2–3 choice buttons below
- On selection: choice highlights, consequence panel slides in below (not a new page)
- Consequence shows: outcome label (Correct / Incorrect / Partially Correct), explanation paragraph, what should have happened if incorrect
- “Continue →” only appears after a choice has been made and consequence read
- No retry on scenarios — the point is reflection, not scoring

**Example use — BLS module:**

```
┌─ SCENARIO ──────────────────────────────────┐
│ You are on Medical Ward B when a patient    │
│ collapses. They are unresponsive and not    │
│ breathing normally. You are alone.          │
│                                             │
│ What is your first action?                  │
└─────────────────────────────────────────────┘

[ Call for help immediately              ]
[ Begin chest compressions               ]
[ Check for a pulse for up to 10 seconds ]

↓ after selection:

┌─ CORRECT ───────────────────────────────────┐
│ Calling for help first is correct. In a     │
│ hospital setting, activating the emergency  │
│ response (crash team) immediately ensures   │
│ defibrillation arrives as fast as possible. │
│ CPR alone cannot restart a heart in VF —    │
│ you need the team.                          │
└─────────────────────────────────────────────┘
                              [ Continue → ]
```

-----

### Component 3: OrderingActivity

**What it does:** Learner is presented with a set of steps or items out of order and must drag them (desktop) or tap to select sequence (mobile) into the correct order. Feedback given on submission.

**When to use:** Any content that is a sequence or process. Do not use a numbered list when you can use this instead.

**Visual behaviour:**

- Items displayed as draggable cards in randomised order
- On desktop: drag and drop reordering
- On mobile: tap item to select, tap target position to place (simpler than touch drag)
- “Check Order” button submits
- Correct items turn green, incorrect turn red with correct position shown
- Must achieve correct order (or see correct answer) before Continue activates
- Allow unlimited attempts

**Example use — IPC module:** Put the WHO 5 Moments of Hand Hygiene in the correct order.

```
┌──────────────────────────────┐
│  ≡  Before touching patient  │  ← draggable
└──────────────────────────────┘
┌──────────────────────────────┐
│  ≡  After body fluid exposure│
└──────────────────────────────┘
┌──────────────────────────────┐
│  ≡  Before clean procedure   │
└──────────────────────────────┘
        [ Check Order ]
```

-----

### Component 4: ReflectivePrompt

**What it does:** Poses a reflective question and requires the learner to type a brief response (minimum 20 characters) before continuing. Response is not assessed — it is purely for active processing. Response is not saved or submitted anywhere.

**When to use:** Once per module, in the middle section. Signals: this is not about right answers, it is about your own practice.

**Visual behaviour:**

- Distinct visual treatment — softer background, different from content cards
- Question in italics
- Open text input below
- Character counter showing minimum not yet reached
- Continue activates once minimum is met
- Placeholder text: “Type your reflection here — your response is private and not assessed”

**Example use — Safeguarding module:**

```
┌─ REFLECT ───────────────────────────────────┐
│                                             │
│ Think about your current ward or facility.  │
│ If a patient showed signs of neglect, who   │
│ would you report to — and do you know the   │
│ correct process?                            │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Type your reflection here...            │ │
│ └─────────────────────────────────────────┘ │
│                          12 / 20 characters │
└─────────────────────────────────────────────┘
```

-----

### Component 5: LabelledDiagram

**What it does:** An image or simple SVG diagram with numbered hotspots. Learner taps each hotspot to reveal a label and brief explanation. Continue activates after all hotspots explored.

**When to use:** For content that has a spatial or visual component — anatomy, equipment, positioning.

**Visual behaviour:**

- Hotspots shown as pulsing green circles on the image
- Tap to reveal: circle expands, label and 1–2 sentence explanation appears in a panel below the image
- Visited hotspots change from pulsing to solid
- Continue only after all hotspots visited

**Example use — Manual Handling module:** Simple diagram of correct spinal position during lifting, with 4 hotspots (spine neutral, knees bent, load close, feet shoulder-width).

**Note:** For the demo, use simple SVG diagrams — not photographs. SVGs can be built entirely in code.

-----

### Component 6: KnowledgeCheck (inline, non-scored)

**What it does:** A single multiple choice question mid-section. Not part of the formal assessment. Immediate feedback. Learner can see the correct answer immediately if wrong.

**When to use:** After each major content section as a processing check before the learner moves on. Faster and lighter than the formal assessment questions.

**Visual behaviour:**

- Smaller visual footprint than assessment questions
- Correct: green highlight, tick, one sentence explanation
- Incorrect: red highlight, cross, correct answer highlighted green, one sentence explanation
- Continue available immediately after feedback shown — no retry required

-----

### Component 7: ProgressBar (persistent)

**What it does:** Shows the learner exactly where they are in the module at all times.

**Visual behaviour:**

- Fixed at top of module screen, below the header
- Shows: module name (truncated if needed) | Section X of Y | filled progress bar
- Progress bar fills proportionally as sections are completed
- Completed sections shown as filled/solid, current section shown as active, future sections shown as empty
- Never hidden, never removed during the module experience

```
Basic Life Support (BLS) — Theory          Section 2 of 5
[████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  40%
```

-----

### Component 8: CompletionScreen

**What it does:** The final screen after passing the assessment. Marks the module complete, shows the certificate, updates the dashboard.

**Must include:**

- Large green checkmark animation on arrival (CSS only, no library needed)
- “Module Complete” heading
- Worker name, module name, completion date, expiry date
- Certificate download button — generates and downloads a real PDF with these details
- “Return to Dashboard →” button
- On arrival at this screen: competency status in database updates to Complete automatically

**Certificate PDF must contain:**

- Certify Health wordmark (top)
- “Certificate of Completion” heading
- Worker full name (large)
- “has successfully completed”
- Module name (large)
- Completion date
- Expiry date
- “This certificate was issued by Certify Health in accordance with NHS-aligned competency standards”
- Thin green border around the certificate

-----

## Module Section Map

This defines exactly which components to use in each section of each module. Build to this specification exactly — do not improvise component choices.

-----

### Module 1: Basic Life Support (BLS) — Theory

**Intro screen:** Learning objectives (3 bullet points) + Why this matters paragraph + Begin button

**Section 1 — The Chain of Survival**

- Component: RevealCard (4 cards — one per link in the chain)
- Component: KnowledgeCheck — “Which link in the chain is most time-critical in an out-of-hospital cardiac arrest?”

**Section 2 — Recognising Cardiac Arrest**

- Component: Text content (short — 3 paragraphs on unresponsiveness, absent normal breathing, agonal breathing)
- Component: KnowledgeCheck — “A patient is making occasional gasping sounds. Is this normal breathing?”

**Section 3 — CPR Technique**

- Component: RevealCard (3 cards — compression rate, compression depth, ratio and hand position)
- Component: OrderingActivity — put the steps of starting CPR in correct order (check response → call for help → 30 compressions → 2 rescue breaths → continue)

**Section 4 — AED and Team Resuscitation**

- Component: LabelledDiagram — simple SVG of AED with 4 hotspots (power button, pad placement left, pad placement right, shock button)
- Component: ReflectivePrompt — “Where is the nearest AED to where you currently work? If you don’t know, what will you do after completing this module?”

**Section 5 — Scenario**

- Component: ScenarioChoice (the ward collapse scenario — 3 choices)

**Assessment:** 6 questions — 4 knowledge recall, 2 scenario-based. 80% pass mark.

**Completion screen:** Certificate with 1-year expiry from completion date.

-----

### Module 2: Infection Prevention and Control

**Section 1 — Why IPC Matters**

- Component: Text content with 2 key statistics (HAI rates)
- Component: KnowledgeCheck — “What percentage of healthcare-associated infections are considered preventable?”

**Section 2 — Standard Precautions and Hand Hygiene**

- Component: OrderingActivity — put the WHO 5 Moments of Hand Hygiene in correct order
- Component: RevealCard (3 cards — PPE selection for different risk levels)

**Section 3 — Transmission-Based Precautions**

- Component: RevealCard (3 cards — contact, droplet, airborne — trigger conditions and required precautions)
- Component: KnowledgeCheck — “A patient is admitted with suspected pulmonary tuberculosis. Which type of precaution is required?”

**Section 4 — Waste Management and Sharps**

- Component: LabelledDiagram — waste segregation colour coding (yellow, black, orange, purple bins)
- Component: ReflectivePrompt — “Have you ever seen sharps disposed of incorrectly in your facility? What did you do or what would you do?”

**Section 5 — Scenario**

- Component: ScenarioChoice — TB admission, which precautions in which order

**Assessment:** 6 questions. 80% pass mark.

-----

### Module 3: Safeguarding Awareness

**Section 1 — What Safeguarding Means**

- Component: Text content
- Component: KnowledgeCheck — “Safeguarding applies to which of the following groups?”

**Section 2 — Recognising Abuse and Neglect**

- Component: RevealCard (5 cards — physical, emotional, financial, institutional, neglect — signs and indicators per type)

**Section 3 — Your Responsibilities**

- Component: OrderingActivity — steps when safeguarding concern identified (recognise → record → report → refer → review)
- Component: KnowledgeCheck — “You suspect a patient is being financially abused by a family member. The patient asks you not to tell anyone. What do you do?”

**Section 4 — Nigerian Context**

- Component: Text content — cultural considerations, family involvement, community dynamics, how these interact with safeguarding duties
- Component: ReflectivePrompt — “Think about a situation where cultural expectations might make it harder to raise a safeguarding concern. How would you navigate that?”

**Section 5 — Scenario**

- Component: ScenarioChoice — elderly patient, unexplained bruising, family insisting everything fine

**Assessment:** 5 questions. 80% pass mark.

-----

### Module 4: Medicines Management — Fundamentals

**Section 1 — The 5 Rights**

- Component: RevealCard (5 cards — right patient, right drug, right dose, right route, right time — each with a “how to verify” note)

**Section 2 — Reading Prescriptions**

- Component: LabelledDiagram — annotated prescription form with 6 hotspots (patient identifier, drug name, dose, route, frequency, prescriber signature)
- Component: KnowledgeCheck — “A prescription is written for ‘morphine 100mg oral.’ What should you do?”

**Section 3 — High-Risk Medications**

- Component: RevealCard (3 cards — insulin, opioids, anticoagulants — why high risk, what extra steps required)
- Component: ReflectivePrompt — “Think about the last time you administered a high-risk medication. What verification steps did you follow — and were they sufficient?”

**Section 4 — Documentation and Reporting**

- Component: OrderingActivity — correct sequence for documenting medication administration and reporting an error
- Component: KnowledgeCheck — “You realise you administered the wrong dose 30 minutes ago. The patient appears well. What do you do first?”

**Section 5 — Scenario**

- Component: ScenarioChoice — unusually high dose on prescription, 3 options for what to do

**Assessment:** 6 questions. 80% pass mark.

-----

### Module 5: Health and Safety Awareness

**Section 1 — Rights and Responsibilities**

- Component: RevealCard (2 cards — employer duties, employee duties)
- Component: KnowledgeCheck — “Which of the following is YOUR responsibility as an employee under health and safety law?”

**Section 2 — Hazard Identification**

- Component: LabelledDiagram — clinical environment with 5 hazard hotspots (wet floor, sharps container overfull, trailing cable, unlabelled chemical bottle, blocked fire exit)
- Component: KnowledgeCheck — “Which of these hazards poses the most immediate risk of serious injury?”

**Section 3 — Risk Assessment**

- Component: OrderingActivity — 4 steps of risk assessment in correct order (identify hazard → assess risk → implement controls → review)
- Component: ReflectivePrompt — “Name one hazard in your current workplace that you have noticed but that has not been addressed. What is stopping it from being fixed?”

**Section 4 — Incident Reporting**

- Component: RevealCard (3 cards — what to report, why near-miss reporting matters, how to report)
- Component: ScenarioChoice — wet floor scenario, 3 options

**Assessment:** 5 questions. 80% pass mark.

-----

### Module 6: Manual Handling — Theory

**Section 1 — Why It Matters**

- Component: Text content with statistics on musculoskeletal injury in healthcare workers
- Component: KnowledgeCheck — “Back injuries from manual handling are most commonly caused by which of the following?”

**Section 2 — The TILE Framework**

- Component: RevealCard (4 cards — Task, Individual, Load, Environment — what to assess under each)
- Component: KnowledgeCheck — “A nurse with a recent back injury is asked to help move a bariatric patient. Which TILE factor is most relevant here?”

**Section 3 — Safe Technique Principles**

- Component: LabelledDiagram — correct manual handling posture (5 hotspots: spine neutral, knees bent, load close to body, stable base, smooth movement)
- Component: OrderingActivity — steps before moving a patient manually (assess the patient → assess the environment → communicate with patient → position yourself → move smoothly)

**Section 4 — When Not to Handle Alone**

- Component: RevealCard (3 cards — weight thresholds, patient dependency levels, equipment requirements)
- Component: ReflectivePrompt — “Have you ever been asked to move a patient in a way that felt unsafe? What did you do — and what should you have done?”

**Section 5 — Scenario**

- Component: ScenarioChoice — night shift, alone, post-operative patient needs repositioning

**Assessment:** 5 questions. 80% pass mark.

-----

### Module 7: CPR — Practical Preparation

**Important framing — add to intro screen:**

> “This module cannot replace a practical assessment. It is designed to prepare you so that when you attend your practical sign-off, you are confident, accurate, and ready to pass first time.”

**Section 1 — What Assessors Look For**

- Component: RevealCard (4 cards — common failure points: compression depth insufficient, rate too slow/fast, excessive interruptions, incorrect hand position)

**Section 2 — Adult CPR Step by Step**

- Component: OrderingActivity — complete adult CPR sequence in correct order (safe approach → check response → shout for help → open airway → check breathing → call crash team → 30 compressions → 2 breaths → continue 30:2 → use AED when available)
- Component: KnowledgeCheck — “How long should you take to check for breathing before starting compressions?”

**Section 3 — Paediatric Differences**

- Component: RevealCard (3 cards — infant technique, child technique, key differences from adult)
- Component: KnowledgeCheck — “What compression to breath ratio is used for a lone rescuer performing CPR on a child?”

**Section 4 — Two-Rescuer CPR**

- Component: ScenarioChoice — you are asked to take over compressions in a team resuscitation, 3 options for how to transition correctly
- Component: ReflectivePrompt — “When did you last perform CPR — in practice or in a real situation? What felt least confident, and what will you focus on in your practical session?”

**Assessment:** 6 questions. 80% pass mark.

**Completion screen note — replace standard certificate message with:**

> “You have completed the CPR Practical Preparation module. Your next step is to book a practical sign-off session with a certified assessor. Present this certificate as evidence of your theory preparation.”

-----

## Visual Design Specification for Modules

Apply these design rules to all module components. Do not deviate.

**Colour usage:**

- Green (#16a34a) — correct answers, completed states, Continue button, progress bar fill
- Amber (#d97706) — scenarios, warnings, expiring soon states
- Red (#dc2626) — incorrect answers, overdue states
- Grey (#6b7280) — inactive states, not yet visited
- White cards on light grey (#f9fafb) background — all content sections

**Typography within modules:**

- Section titles: font-semibold, text-lg
- Body content: font-normal, text-base, line-height relaxed — never cramped
- Scenario text: font-medium, italic, slightly larger than body
- Assessment questions: font-semibold, text-base

**Spacing:**

- Generous padding inside all cards — minimum p-5 on mobile
- Clear visual separation between components — minimum mb-6 between blocks
- Continue button always at the bottom, full width on mobile

**Animation:**

- RevealCard expand: 200ms ease-in-out, height transition
- Correct/incorrect feedback: 150ms fade in
- Completion checkmark: scale from 0 to 1, 400ms ease-out, with a brief bounce
- No other animations — keep it clean and professional

**Mobile rules:**

- All components must work at 390px width
- Drag and drop on desktop becomes tap-to-select on mobile (detect touch capability)
- All tap targets minimum 44px height
- No horizontal scrolling within module content

-----

## Implementation Notes for Claude Code

1. Build each component as a standalone reusable React component in `/components/modules/`
1. Component names: RevealCard, ScenarioChoice, OrderingActivity, ReflectivePrompt, LabelledDiagram, KnowledgeCheck, ProgressBar, CompletionScreen
1. Each component accepts its content as props — content is defined in the module data file, not hardcoded in components
1. Module content lives in `/lib/modules/[module-id].ts` as a structured data object
1. The module renderer reads the data object and renders the appropriate component for each section block
1. Continue button state is managed locally in each component — parent module renderer listens for completion events
1. Assessment pass/fail logic lives in the module renderer — not in individual question components
1. Certificate PDF generation: use the `jsPDF` library — add to package.json. Generate client-side, no server call needed.
1. On CompletionScreen render: fire a Supabase update to mark the competency as complete with today’s date and calculated expiry date
1. Test every component on mobile before marking complete — use browser dev tools at 390px width minimum

-----

## Session Instructions for Claude Code

Start a fresh session for this work. Do not carry context from previous sessions.

Open with this prompt:
“Read @docs/INTERACTION_DESIGN.md in full before writing any code. We are building the module component library. Start with Component 1: RevealCard. Build it as a standalone React component, show me the rendered result, then wait for approval before moving to the next component.”

Build and approve one component at a time. Do not ask Claude Code to build all components in one session — it will cut corners. Approve each component visually before proceeding to the next.

Once all components are approved, start a new session to build Module 1 (BLS Theory) using the approved components. Then use the same approach for remaining modules.