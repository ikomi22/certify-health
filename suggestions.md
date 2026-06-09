# IMPROVEMENTS.md — Certify Health

**Version:** 1.1
**Status:** Ready to implement
**Priority:** Work through sections in order — do not skip ahead

-----

## Context

This document defines all improvements to be made to the Certify Health demo platform before it is presented to a government ministry contact. Read @docs/PRD.md before starting any task. Work through each section completely before moving to the next. Use [ ] checkboxes to track progress.

-----

## Section 1 — Critical Fixes (Do First)

These are broken or misleading things that must be resolved before anything else.

### 1.1 Remove false email claim

- [ ] On the healthcare worker dashboard, remove the line “A reminder has been sent to your email” from the overdue alert banner
- Replace with simply: “Complete this now to stay compliant”
- Do not add any other claims about notifications that have not been built

### 1.2 Fix staff compliance grid mobile headers

- [ ] The compliance grid column headers are being truncated on mobile — “alth”, “Mar” are visible instead of full names
- Ensure full competency names are always readable on the grid
- If full names cannot fit, use approved short codes: BLS, IPC, SGA, MMF, HSA, MHT, CPR
- Add a legend below the grid mapping short codes to full names
- The horizontal scroll behaviour can remain — just ensure headers are never cut mid-word

### 1.3 Replace logo placeholder

- [ ] Replace the white square placeholder icon on the login screen with a proper wordmark
- Design: “Certify Health” in clean, confident typography — use a health-appropriate sans-serif
- Use white text on the existing dark green background
- Keep it simple — no complex icon needed, a strong wordmark is sufficient
- Apply the same wordmark consistently across the nav bar and any other branded surfaces

-----

## Section 2 — Admin Dual Role & Navigation

The facility admin is also a healthcare worker. They have two distinct views and need clear navigation between them.

### 2.1 Admin role picker screen

- [ ] When a facility admin logs in, they should land on a role picker screen — not directly on the facility dashboard
- The role picker should present two clear options:
  - **My Compliance** — view your personal competency dashboard as a healthcare worker
  - **Facility Overview** — view the facility-wide compliance dashboard
- Design this screen cleanly — two large tappable cards, facility name at the top, the admin’s name and cadre visible
- This screen should feel like a deliberate choice, not a redirect

### 2.2 Persistent navigation between roles

- [ ] Once inside either view, provide persistent navigation to switch between the two
- A simple tab or toggle at the top of the screen — “My Compliance | Facility Overview”
- The active view should be clearly indicated
- Switching views should not require going back to the role picker every time

### 2.3 Admin personal compliance dashboard

- [ ] The admin’s personal compliance view should be identical in structure to the healthcare worker dashboard
- Same competency list, same status indicators, same module access
- The admin’s own competency record should be seeded realistically — include at least one expiring soon status to demonstrate the feature
- Their personal dashboard should show their name, cadre, ward, and facility exactly as it does for other workers

-----

## Section 3 — Module Rebuild (Most Important)

Every module currently uses a YouTube embed as its content. Replace all YouTube embeds with properly structured, instructionally designed content. This applies to all 7 modules.

### 3.1 Instructional design framework to apply to every module

Every module must be built using the following principles. Do not deviate from this structure.

**ADDIE Framework (governs overall module design):**

- **Analyse:** Each module opens with a brief needs statement — why this competency matters, what gap it addresses, what the learner will be able to do by the end
- **Design:** Content is broken into 3–5 sections with clear learning objectives per section
- **Develop:** Each section uses a mix of text, scenario-based examples, and at least one reflective question before the formal assessment
- **Implement:** The module is self-paced, mobile-first, completable in a single session
- **Evaluate:** A formal assessment (minimum 5 questions) with pass/fail logic and immediate feedback closes every module

**SAM (Successive Approximation Model) — apply to assessment design:**

- Questions are not purely knowledge recall — include at least 2 scenario-based questions per assessment that ask the learner to apply knowledge to a realistic clinical situation
- After each wrong answer, provide a brief explanation of why it was wrong before allowing retry
- Allow maximum 2 attempts before showing the correct answer with explanation

**Adult Learning Theory (Knowles’ Andragogy) — apply throughout:**

- Every module must answer “why does this matter to me as a healthcare professional” within the first screen
- Use real clinical scenarios relevant to Nigerian healthcare settings — not generic Western hospital examples
- Connect each competency explicitly to professional registration and international practice standards where relevant
- Respect prior experience — avoid condescending tone, write for a qualified professional not a student

**Additional principles:**

- Active recall: include at least one reflective prompt mid-module (“Before continuing, think about a time you encountered this situation on the ward”)
- Spaced learning: modules are designed to be revisited annually — content should feel worth returning to, not disposable
- Progress visibility: always show “Section X of Y” — learners need to know where they are and how far they have to go

-----

### 3.2 Module structure template

Apply this structure to every module without exception:

```
1. Module intro screen
   - Module title
   - Estimated time
   - 2–3 learning objectives (what you will be able to do)
   - Why this matters (1 paragraph — connect to patient safety and professional practice)
   - "Begin →" button

2. Section screens (3–5 per module)
   - Section title and number (e.g. "Section 2 of 4")
   - Core content (300–500 words per section)
   - At least one real clinical scenario per module (not per section)
   - One reflective prompt in the middle section
   - "Continue →" button

3. Knowledge check screen (before formal assessment)
   - 1–2 quick questions to consolidate before the formal test
   - Immediate feedback on answers
   - Not scored — purely formative

4. Assessment screen
   - 5–7 questions minimum
   - Mix of knowledge recall and scenario-based questions
   - Immediate feedback per question with explanation
   - Pass mark: 80%
   - Maximum 2 attempts, then show correct answers with explanation

5. Completion screen
   - "Module Complete" confirmation
   - Competency marked as complete with today's date and expiry date
   - Certificate download prompt (PDF)
   - "Return to Dashboard →" button
```

-----

### 3.3 Module content — build all 7

Build full content for each module following the structure above. Seed content must be clinically accurate, written for qualified Nigerian healthcare professionals, and referenced to NHS and WHO standards where applicable.

**Module 1: Basic Life Support (BLS) — Theory**

- Section 1: What is BLS and why it saves lives — chain of survival, out-of-hospital cardiac arrest context in Nigeria
- Section 2: Recognising cardiac arrest — unresponsiveness, absence of normal breathing, when to act
- Section 3: CPR technique — compression rate (100–120/min), depth (5–6cm adults), ratio (30:2), hands position
- Section 4: AED use and team resuscitation — when to use, universal steps, two-rescuer CPR
- Scenario: A patient collapses on the medical ward. You are the first to arrive. Walk through your response.
- Assessment: 6 questions — 4 knowledge recall, 2 scenario-based

**Module 2: Infection Prevention and Control**

- Section 1: Why IPC matters — HAI rates in Nigeria, the cost of preventable infection
- Section 2: Standard precautions — hand hygiene (WHO 5 moments), PPE selection and use
- Section 3: Transmission-based precautions — contact, droplet, airborne — when each applies
- Section 4: Waste management and sharps safety — categories, colour coding, needlestick protocol
- Scenario: A patient is admitted with suspected tuberculosis. What precautions do you apply and in what order?
- Assessment: 6 questions — 4 knowledge recall, 2 scenario-based

**Module 3: Safeguarding Awareness**

- Section 1: What safeguarding means in a healthcare context — adults and children, duty of care
- Section 2: Recognising abuse and neglect — physical, emotional, financial, institutional — signs and indicators
- Section 3: Your responsibilities — who to report to, documentation, maintaining confidentiality appropriately
- Section 4: Safeguarding in the Nigerian context — cultural considerations, family involvement, community dynamics
- Scenario: An elderly patient repeatedly refuses to eat and has unexplained bruising. A family member insists everything is fine. What do you do?
- Assessment: 5 questions — 3 knowledge recall, 2 scenario-based

**Module 4: Medicines Management — Fundamentals**

- Section 1: The principles of safe medicines management — rights of medication administration (right patient, right drug, right dose, right route, right time)same issue.. and 
- Section 2: Reading prescriptions — common abbreviations, identifying errors, when to query
- Section 3: High-risk medications — insulin, opioids, anticoagulants — why they need extra care
- Section 4: Documentation and reporting — recording administration, adverse reactions, incident reporting
- Scenario: You are about to administer medication and notice the dose prescribed appears unusually high for the patient’s weight. What do you do?
- Assessment: 6 questions — 4 knowledge recall, 2 scenario-based

**Module 5: Health and Safety Awareness**

- Section 1: Your rights and responsibilities — Health and Safety at Work, employer and employee duties
- Section 2: Hazard identification — biological, chemical, physical, ergonomic hazards in a clinical setting
- Section 3: Risk assessment basics — identify, assess, control, review
- Section 4: Incident reporting — why it matters, what to report, how near-miss reporting saves lives
- Scenario: You notice a wet floor near the nurses’ station that has been there for over an hour with no sign. What is your responsibility and what steps do you take?
- Assessment: 5 questions — 3 knowledge recall, 2 scenario-based

**Module 6: Manual Handling — Theory**

- Section 1: Why manual handling matters — musculoskeletal injury rates in healthcare workers, the real cost
- Section 2: Legislation and principles — manual handling regulations, employer and employee duties
- Section 3: Risk assessment for manual handling — TILE framework (Task, Individual, Load, Environment)
- Section 4: Safe techniques — principles of safe moving and handling, when to use equipment, never-do-alone situations
- Scenario: A post-operative patient needs to be repositioned in bed. You are working alone on a night shift. Walk through your decision-making process.
- Assessment: 5 questions — 3 knowledge recall, 2 scenario-based

**Module 7: Cardiopulmonary Resuscitation (CPR) — Practical Preparation**

- Note: This module cannot replace a practical sign-off. Frame it explicitly as preparation for practical assessment.
- Section 1: What the practical assessment tests — what assessors look for, common failure points
- Section 2: Adult CPR technique review — step by step, with emphasis on common errors (compression depth, rate, interruptions)
- Section 3: Paediatric CPR differences — infants vs children vs adults — key differences to know
- Section 4: Two-rescuer CPR and role clarity — who leads, who compresses, when to switch, communication
- Scenario: You are in a team resuscitation. The team leader asks you to take over compressions. The current rescuer has been compressing for 90 seconds. Describe what you do.
- Assessment: 6 questions — 4 knowledge recall, 2 scenario-based
- Completion screen note: “Well done. This module prepares you for your practical CPR assessment. Your next step is to book a practical sign-off session with a certified assessor.”

-----

## Section 4 — UI Polish

### 4.1 Expiring soon state

- [ ] Preserve the existing “Expiring soon” amber badge — this is working well and must not be removed
- Ensure it appears consistently across both the worker dashboard and the admin’s personal compliance view

### 4.2 Module progress indicator

- [ ] Ensure “Section X of Y” is visible and persistent throughout every module
- Display at the top of each section screen, clearly readable on mobile
- Include a simple progress bar beneath it showing overall module completion

### 4.3 Completion screen

- [ ] Build a proper completion screen for every module (currently missing or incomplete)
- Must show: module name, completion date, expiry date, certificate download button
- Certificate download can be a placeholder PDF for the demo — but the button must work and produce a downloadable file
- Competency status must update to “Complete” on the dashboard immediately after completion screen is reached

### 4.4 Assessment feedback

- [ ] After each incorrect answer, display a brief explanation (1–2 sentences) before allowing the learner to continue
- After passing, show a summary: X out of Y correct, pass confirmed
- After failing twice, show all correct answers with explanations before allowing return to module content

-----

## Section 5 — Seed Data Updates

### 5.1 Admin account personal compliance

- [ ] Ensure the demo facility admin account has a realistic personal competency record seeded
- Include: at least 2 complete, at least 1 expiring soon, at least 1 not started
- Their cadre should be Registered Nurse or Senior Nurse to reflect a matron-level role

### 5.2 Consistent dates

- [ ] Review all seed data completion and expiry dates for consistency
- Expiry dates should vary realistically — not all on the same date
- At least 3 staff members should have “expiring soon” status (within 90 days of current date)
- At least 3 staff members should have at least 1 overdue competency

-----

## Section 6 — Session Discipline

- Start each session by reading this file and @docs/PRD.md
- Work through sections in order — do not jump to Section 4 polish before Section 3 modules are complete
- After each section is complete, mark all checkboxes and update @docs/TASKS.md
- Use /clear between sections — do not carry context from module content writing into UI work
- The module content in Section 3.3 is clinically sensitive — do not improvise or simplify it. Write it accurately and in full.