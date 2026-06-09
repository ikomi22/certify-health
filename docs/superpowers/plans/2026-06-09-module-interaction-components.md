# Module Interaction Component Library — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the passive text+quiz module experience with 8 interactive React components that make learners engage before progressing, built to the "Clinical Warmth" design spec.

**Architecture:** 8 standalone components in `/components/modules/`, each accepting content via props and calling `onComplete()` when their unlock condition is met. A `SectionRenderer` composes blocks per section and manages completion state. `ModuleView` is updated to use interactive content when available, falling back to existing text sections.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, jsPDF (new), TypeScript. No additional component libraries.

---

## File Map

**Create:**
- `lib/modules/types.ts` — shared types for all interactive content
- `lib/modules/bls-theory.tsx` — BLS module interactive content data
- `components/modules/ProgressBar.tsx`
- `components/modules/RevealCard.tsx`
- `components/modules/KnowledgeCheck.tsx`
- `components/modules/ScenarioChoice.tsx`
- `components/modules/OrderingActivity.tsx`
- `components/modules/ReflectivePrompt.tsx`
- `components/modules/LabelledDiagram.tsx`
- `components/modules/CompletionScreen.tsx`
- `components/modules/SectionRenderer.tsx`

**Modify:**
- `tailwind.config.ts` — add custom animation keyframes
- `components/module/module-view.tsx` — add `interactiveContent` prop, updated section phase and result phase
- `app/module/[id]/page.tsx` — import and pass `interactiveContent` for BLS

---

### Task 1: Install jsPDF + add animation keyframes

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Install jsPDF**

```bash
npm install jspdf
npm install --save-dev @types/jspdf
```

Expected: installs without errors. `package.json` now includes `"jspdf"` in dependencies.

- [ ] **Step 2: Add animation keyframes to tailwind.config.ts**

Replace the entire file:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          DEFAULT: "#16a34a",
          light: "#22c55e",
          dark: "#15803d",
        },
      },
      animation: {
        fadeIn: "fadeIn 150ms ease-out",
        shake: "shake 300ms ease-in-out",
        slideInRight: "slideInRight 250ms ease-out",
        scaleIn: "scaleIn 350ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shimmer: "shimmer 600ms ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-5px)" },
          "40%": { transform: "translateX(5px)" },
          "60%": { transform: "translateX(-5px)" },
          "80%": { transform: "translateX(5px)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: no TypeScript or config errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json tailwind.config.ts
git commit -m "feat: install jsPDF, add animation keyframes to Tailwind config"
```

---

### Task 2: Define shared types

**Files:**
- Create: `lib/modules/types.ts`

- [ ] **Step 1: Create the types file**

```ts
// lib/modules/types.ts
import type { ReactNode } from "react"

export type RevealCardBlock = {
  type: "reveal-cards"
  cards: { title: string; content: string }[]
}

export type KnowledgeCheckOption = {
  text: string
  correct: boolean
  explanation: string
}

export type KnowledgeCheckBlock = {
  type: "knowledge-check"
  question: string
  options: KnowledgeCheckOption[]
}

export type ScenarioChoiceItem = {
  text: string
  outcome: "correct" | "incorrect" | "partial"
  consequence: string
}

export type ScenarioChoiceBlock = {
  type: "scenario-choice"
  scenario: string
  choices: ScenarioChoiceItem[]
}

export type OrderingItem = {
  id: string
  text: string
}

export type OrderingActivityBlock = {
  type: "ordering-activity"
  items: OrderingItem[]
  correctOrder: string[]
}

export type ReflectivePromptBlock = {
  type: "reflective-prompt"
  question: string
  minimumChars?: number
}

export type DiagramHotspot = {
  id: string
  x: number
  y: number
  label: string
  description: string
}

export type LabelledDiagramBlock = {
  type: "labelled-diagram"
  svg: ReactNode
  hotspots: DiagramHotspot[]
}

export type TextBlock = {
  type: "text"
  content: string
}

export type SectionBlock =
  | RevealCardBlock
  | KnowledgeCheckBlock
  | ScenarioChoiceBlock
  | OrderingActivityBlock
  | ReflectivePromptBlock
  | LabelledDiagramBlock
  | TextBlock

export type InteractiveSection = {
  title: string
  blocks: SectionBlock[]
}

export type InteractiveContent = {
  sections: InteractiveSection[]
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run build
```

Expected: clean build with no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/modules/types.ts
git commit -m "feat: add shared types for interactive module content"
```

---

### Task 3: ProgressBar component

**Files:**
- Create: `components/modules/ProgressBar.tsx`

- [ ] **Step 1: Create ProgressBar**

```tsx
// components/modules/ProgressBar.tsx
"use client"

type Props = {
  currentSection: number
  totalSections: number
  moduleName: string
}

export function ProgressBar({ currentSection, totalSections, moduleName }: Props) {
  const pct = Math.round((currentSection / totalSections) * 100)

  return (
    <div className="bg-white border-b border-gray-100 px-4 py-2.5">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 truncate max-w-[55%]">{moduleName}</p>
          <p className="text-xs text-gray-500 shrink-0">
            Section {currentSection} of {totalSections}
          </p>
        </div>
        <div className="flex gap-1 mb-1.5">
          {Array.from({ length: totalSections }).map((_, i) => {
            const n = i + 1
            return (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  n < currentSection
                    ? "bg-green-500"
                    : n === currentSection
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-200"
                }`}
              />
            )
          })}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add components/modules/ProgressBar.tsx
git commit -m "feat: add ProgressBar component with gradient fill and section dots"
```

---

### Task 4: RevealCard component

**Files:**
- Create: `components/modules/RevealCard.tsx`

- [ ] **Step 1: Create RevealCard**

```tsx
// components/modules/RevealCard.tsx
"use client"

import { useState, useEffect, useCallback } from "react"

type Card = { title: string; content: string }

type Props = {
  cards: Card[]
  onComplete: () => void
}

export function RevealCard({ cards, onComplete }: Props) {
  const [opened, setOpened] = useState<Set<number>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile("ontouchstart" in window)
  }, [])

  const handleComplete = useCallback(onComplete, [onComplete])

  useEffect(() => {
    if (opened.size === cards.length) handleComplete()
  }, [opened.size, cards.length, handleComplete])

  function open(index: number) {
    setOpened((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {cards.map((card, i) => {
        const isOpen = opened.has(i)
        return (
          <div
            key={i}
            className={`bg-white rounded-2xl ring-1 overflow-hidden transition-all duration-200 ${
              isOpen ? "ring-green-400 border-l-4 border-green-500" : "ring-gray-200"
            }`}
            style={!isMobile ? { animationDelay: `${i * 50}ms` } : undefined}
          >
            <button
              onClick={() => open(i)}
              className="w-full flex items-center justify-between p-5 text-left min-h-[52px]"
            >
              <span className="font-medium text-gray-900 text-sm pr-3">{card.title}</span>
              <span
                className={`text-green-600 font-light text-2xl leading-none shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-sm text-gray-700 leading-relaxed animate-fadeIn">
                {card.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 3: Commit**

```bash
git add components/modules/RevealCard.tsx
git commit -m "feat: add RevealCard component — all-cards-opened gates Continue"
```

---

### Task 5: KnowledgeCheck component

**Files:**
- Create: `components/modules/KnowledgeCheck.tsx`

- [ ] **Step 1: Create KnowledgeCheck**

```tsx
// components/modules/KnowledgeCheck.tsx
"use client"

import { useState } from "react"
import type { KnowledgeCheckOption } from "@/lib/modules/types"

type Props = {
  question: string
  options: KnowledgeCheckOption[]
  onComplete: () => void
}

export function KnowledgeCheck({ question, options, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [shake, setShake] = useState(false)

  function choose(index: number) {
    if (answered) return
    setSelected(index)
    setAnswered(true)

    if (!options[index].correct) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
    }

    onComplete()
  }

  function buttonClass(i: number) {
    const base =
      "w-full text-left text-sm px-4 py-3.5 rounded-xl border transition-all min-h-[44px]"
    if (!answered) {
      return `${base} border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm active:scale-[0.99]`
    }
    if (options[i].correct) {
      return `${base} border-green-500 bg-green-50 text-green-900 font-medium`
    }
    if (i === selected) {
      return `${base} border-red-400 bg-red-50 text-red-800 ${shake ? "animate-shake" : ""}`
    }
    return `${base} border-gray-100 text-gray-400`
  }

  const answeredOption = answered && selected !== null ? options[selected] : null
  const correctOption = options.find((o) => o.correct)

  return (
    <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-5 space-y-4">
      <p className="text-sm font-semibold text-gray-800 leading-relaxed">{question}</p>
      <div className="space-y-2.5">
        {options.map((opt, i) => (
          <button key={i} onClick={() => choose(i)} className={buttonClass(i)} disabled={answered}>
            <span className="text-gray-400 mr-2 text-xs">
              {String.fromCharCode(65 + i)}.
            </span>
            {opt.text}
            {answered && options[i].correct && (
              <span className="ml-2 text-green-600 animate-scaleIn inline-block">✓</span>
            )}
          </button>
        ))}
      </div>
      {answered && (
        <div
          className={`rounded-xl p-4 text-sm animate-fadeIn ${
            answeredOption?.correct ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          <p className="font-semibold mb-1">
            {answeredOption?.correct ? "Correct" : "Not quite"}
          </p>
          <p className="leading-relaxed">
            {answeredOption?.correct ? answeredOption.explanation : correctOption?.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/KnowledgeCheck.tsx
git commit -m "feat: add KnowledgeCheck component with shake, letter labels, instant feedback"
```

---

### Task 6: ScenarioChoice component

**Files:**
- Create: `components/modules/ScenarioChoice.tsx`

- [ ] **Step 1: Create ScenarioChoice**

```tsx
// components/modules/ScenarioChoice.tsx
"use client"

import { useState, useEffect } from "react"
import type { ScenarioChoiceItem } from "@/lib/modules/types"

type Props = {
  scenario: string
  choices: ScenarioChoiceItem[]
  onComplete: () => void
}

const OUTCOME_STYLES = {
  correct: {
    wrapper: "bg-green-50 border-green-500",
    label: "text-green-800",
    badge: "CORRECT",
  },
  incorrect: {
    wrapper: "bg-red-50 border-red-500",
    label: "text-red-800",
    badge: "INCORRECT",
  },
  partial: {
    wrapper: "bg-amber-50 border-amber-500",
    label: "text-amber-800",
    badge: "PARTIALLY CORRECT",
  },
}

export function ScenarioChoice({ scenario, choices, onComplete }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [showConsequence, setShowConsequence] = useState(false)
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    if (!showConsequence) return
    const t = setTimeout(() => {
      setCanContinue(true)
      onComplete()
    }, 500)
    return () => clearTimeout(t)
  }, [showConsequence, onComplete])

  function choose(index: number) {
    if (selected !== null) return
    setSelected(index)
    setShowConsequence(true)
  }

  const choice = selected !== null ? choices[selected] : null
  const style = choice ? OUTCOME_STYLES[choice.outcome] : null

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl p-5">
        <p className="text-amber-600 text-xs font-semibold tracking-widest mb-2">SCENARIO</p>
        <p className="text-sm font-medium text-gray-800 leading-relaxed italic">{scenario}</p>
      </div>

      <div className="space-y-2.5">
        {choices.map((c, i) => {
          const isSelected = selected === i
          const isDimmed = selected !== null && !isSelected
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-4 rounded-xl ring-1 text-sm transition-all min-h-[52px] ${
                isSelected
                  ? "ring-amber-400 bg-amber-50"
                  : isDimmed
                  ? "ring-gray-100 opacity-50"
                  : "ring-gray-200 bg-white hover:shadow-md hover:-translate-y-px"
              }`}
            >
              <span className="text-gray-400 text-xs mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {c.text}
            </button>
          )
        })}
      </div>

      {showConsequence && choice && style && (
        <div
          className={`border-l-4 rounded-r-2xl p-5 animate-fadeIn ${style.wrapper}`}
        >
          <p
            className={`text-xs font-bold tracking-widest mb-2 ${style.label} ${
              choice.outcome === "correct"
                ? "bg-[length:200%_auto] bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"
                : ""
            }`}
          >
            {style.badge}
          </p>
          <p className={`text-sm leading-relaxed ${style.label}`}>{choice.consequence}</p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/ScenarioChoice.tsx
git commit -m "feat: add ScenarioChoice component with consequence reveal and shimmer"
```

---

### Task 7: OrderingActivity component

**Files:**
- Create: `components/modules/OrderingActivity.tsx`

- [ ] **Step 1: Create OrderingActivity**

```tsx
// components/modules/OrderingActivity.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import type { OrderingItem } from "@/lib/modules/types"

type Props = {
  items: OrderingItem[]
  correctOrder: string[]
  onComplete: () => void
}

type ItemState = {
  id: string
  text: string
  state: "default" | "correct" | "incorrect"
  correctPosition?: number
}

export function OrderingActivity({ items, correctOrder, onComplete }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [order, setOrder] = useState<OrderingItem[]>(items)
  const [checked, setChecked] = useState(false)
  const [hasReordered, setHasReordered] = useState(false)
  const [itemStates, setItemStates] = useState<ItemState[]>([])
  const [complete, setComplete] = useState(false)

  const dragIndex = useRef<number | null>(null)

  useEffect(() => {
    setIsMobile("ontouchstart" in window)
  }, [])

  function moveUp(index: number) {
    if (index === 0) return
    const next = [...order]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    setOrder(next)
    setHasReordered(true)
  }

  function moveDown(index: number) {
    if (index === order.length - 1) return
    const next = [...order]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    setOrder(next)
    setHasReordered(true)
  }

  // Desktop drag handlers
  function onDragStart(index: number) {
    dragIndex.current = index
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return
    const next = [...order]
    const dragged = next.splice(dragIndex.current, 1)[0]
    next.splice(index, 0, dragged)
    dragIndex.current = index
    setOrder(next)
    setHasReordered(true)
  }

  function checkOrder() {
    const states: ItemState[] = order.map((item, i) => {
      const isCorrect = item.id === correctOrder[i]
      const correctPos = correctOrder.indexOf(item.id) + 1
      return {
        id: item.id,
        text: item.text,
        state: isCorrect ? "correct" : "incorrect",
        correctPosition: isCorrect ? undefined : correctPos,
      }
    })
    setItemStates(states)
    setChecked(true)

    const allCorrect = states.every((s) => s.state === "correct")
    if (allCorrect) {
      setComplete(true)
      onComplete()
    }
  }

  function showAnswer() {
    const correct = correctOrder.map((id) => order.find((o) => o.id === id)!)
    setOrder(correct)
    setItemStates(
      correct.map((item) => ({ id: item.id, text: item.text, state: "correct" }))
    )
    setChecked(true)
    setComplete(true)
    onComplete()
  }

  const displayItems = checked
    ? itemStates.map((s) => order.find((o) => o.id === s.id) ?? order[0])
    : order

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {displayItems.map((item, i) => {
          const state = checked ? itemStates[i]?.state ?? "default" : "default"
          return (
            <div
              key={item.id}
              draggable={!isMobile && !checked}
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => !checked && onDragOver(e, i)}
              className={`flex items-center gap-3 bg-white rounded-xl ring-1 p-4 transition-all ${
                state === "correct"
                  ? "ring-green-400 bg-green-50 animate-fadeIn"
                  : state === "incorrect"
                  ? "ring-red-400 bg-red-50"
                  : "ring-gray-200 cursor-grab active:cursor-grabbing"
              }`}
            >
              {!isMobile && !checked && (
                <span className="text-gray-300 text-lg select-none">≡</span>
              )}
              <span className="text-sm text-gray-800 flex-1 leading-snug">{item.text}</span>
              {isMobile && !checked && (
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => moveUp(i)}
                    disabled={i === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    disabled={i === displayItems.length - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                  >
                    ↓
                  </button>
                </div>
              )}
              {state === "correct" && (
                <span className="text-green-600 text-sm font-bold animate-scaleIn">✓</span>
              )}
              {state === "incorrect" && (
                <span className="text-red-500 text-xs shrink-0">✗</span>
              )}
            </div>
          )
        })}
      </div>

      {checked && itemStates.some((s) => s.state === "incorrect") && (
        <div className="space-y-1 animate-fadeIn">
          {itemStates
            .filter((s) => s.state === "incorrect")
            .map((s) => (
              <p key={s.id} className="text-xs text-red-600 px-1">
                "{s.text.substring(0, 40)}..." — should be position {s.correctPosition}
              </p>
            ))}
        </div>
      )}

      {!complete && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={checkOrder}
            disabled={!hasReordered}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              hasReordered
                ? "border border-green-600 text-green-700 hover:bg-green-50"
                : "border border-gray-200 text-gray-300 cursor-not-allowed"
            }`}
          >
            Check Order
          </button>
          {checked && (
            <button
              onClick={showAnswer}
              className="py-3 px-4 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Show answer
            </button>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/OrderingActivity.tsx
git commit -m "feat: add OrderingActivity — drag on desktop, arrows on mobile, staggered feedback"
```

---

### Task 8: ReflectivePrompt component

**Files:**
- Create: `components/modules/ReflectivePrompt.tsx`

- [ ] **Step 1: Create ReflectivePrompt**

```tsx
// components/modules/ReflectivePrompt.tsx
"use client"

import { useState, useRef } from "react"

type Props = {
  question: string
  minimumChars?: number
  onComplete: () => void
}

export function ReflectivePrompt({ question, minimumChars = 20, onComplete }: Props) {
  const [value, setValue] = useState("")
  const [labelPulsed, setLabelPulsed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const count = value.length
  const metMinimum = count >= minimumChars

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value
    if (!labelPulsed && v.length === 1) {
      setLabelPulsed(true)
    }
    setValue(v)
    if (v.length >= minimumChars && !completed) {
      setCompleted(true)
      onComplete()
    }
  }

  function handleFocus() {
    textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }

  return (
    <div className="bg-amber-50/60 ring-1 ring-amber-200/60 rounded-2xl p-5 space-y-4">
      <p
        className={`text-amber-600 text-xs font-semibold tracking-widest transition-all ${
          labelPulsed ? "animate-pulse" : ""
        }`}
        onAnimationEnd={() => setLabelPulsed(false)}
      >
        REFLECT
      </p>
      <p className="text-sm font-medium text-gray-700 italic leading-relaxed">{question}</p>
      <div className="space-y-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          rows={4}
          placeholder="Type your reflection here — your response is private and not assessed"
          className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-300 min-h-[120px]"
        />
        <p
          className={`text-xs text-right transition-colors ${
            metMinimum ? "text-green-600" : "text-red-400"
          }`}
        >
          {count} / {minimumChars} characters
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/ReflectivePrompt.tsx
git commit -m "feat: add ReflectivePrompt — 20-char minimum, label pulse on first keystroke"
```

---

### Task 9: LabelledDiagram component

**Files:**
- Create: `components/modules/LabelledDiagram.tsx`

- [ ] **Step 1: Create LabelledDiagram**

```tsx
// components/modules/LabelledDiagram.tsx
"use client"

import { useState, useEffect, useCallback } from "react"
import type { DiagramHotspot } from "@/lib/modules/types"

type Props = {
  svg: React.ReactNode
  hotspots: DiagramHotspot[]
  onComplete: () => void
}

export function LabelledDiagram({ svg, hotspots, onComplete }: Props) {
  const [visited, setVisited] = useState<Set<string>>(new Set())
  const [active, setActive] = useState<string | null>(null)
  const [pulsedAll, setPulsedAll] = useState(false)

  const handleComplete = useCallback(onComplete, [onComplete])

  useEffect(() => {
    if (visited.size === hotspots.length && !pulsedAll) {
      setPulsedAll(true)
      handleComplete()
      // Clear the pulse effect after 1 second
      const t = setTimeout(() => setPulsedAll(false), 1000)
      return () => clearTimeout(t)
    }
  }, [visited.size, hotspots.length, pulsedAll, handleComplete])

  function tap(id: string) {
    setVisited((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
    setActive((prev) => (prev === id ? null : id))
  }

  const activeHotspot = hotspots.find((h) => h.id === active)
  const allVisited = visited.size === hotspots.length

  return (
    <div className="space-y-3">
      <div className="relative bg-white rounded-2xl ring-1 ring-gray-200 overflow-hidden">
        {svg}
        {hotspots.map((h) => {
          const isVisited = visited.has(h.id)
          const isActive = active === h.id
          return (
            <button
              key={h.id}
              onClick={() => tap(h.id)}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center"
              aria-label={h.label}
            >
              {/* Outer ring: shows on unvisited dots (gentle pulse) or all dots on completion (bright pulse) */}
              {(!isVisited || pulsedAll) && (
                <span
                  className={`absolute inline-flex h-5 w-5 rounded-full opacity-60 animate-ping ${
                    pulsedAll ? "bg-green-500" : "bg-green-400"
                  }`}
                />
              )}
              <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow" />
            </button>
          )
        })}

        {activeHotspot && (
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 animate-fadeIn border-t border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-sm text-gray-900">{activeHotspot.label}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {activeHotspot.description}
                </p>
              </div>
              <button
                onClick={() => setActive(null)}
                className="text-gray-400 hover:text-gray-600 shrink-0 text-lg leading-none"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <p
        className={`text-xs text-right transition-colors ${
          allVisited ? "text-green-600 font-medium" : "text-gray-400"
        }`}
      >
        {allVisited
          ? `All explored ✓`
          : `${visited.size} of ${hotspots.length} explored`}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/LabelledDiagram.tsx
git commit -m "feat: add LabelledDiagram — overlay panel on tap, completion pulse, mobile-safe"
```

---

### Task 10: CompletionScreen component

**Files:**
- Create: `components/modules/CompletionScreen.tsx`

- [ ] **Step 1: Create CompletionScreen**

```tsx
// components/modules/CompletionScreen.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  workerName: string
  moduleName: string
  completionDate: string
  expiryDate: string
  specialNote?: string
}

export function CompletionScreen({
  workerName,
  moduleName,
  completionDate,
  expiryDate,
  specialNote,
}: Props) {
  const router = useRouter()
  const [generating, setGenerating] = useState(false)

  async function downloadCertificate() {
    setGenerating(true)
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

      // Border
      doc.setDrawColor(22, 163, 74)
      doc.setLineWidth(2)
      doc.rect(10, 10, 277, 190)

      // Wordmark
      doc.setFont("helvetica", "bold")
      doc.setFontSize(26)
      doc.setTextColor(22, 163, 74)
      doc.text("Certify Health", 148.5, 38, { align: "center" })

      // Subtitle
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(107, 114, 128)
      doc.text("Certificate of Completion", 148.5, 50, { align: "center" })

      // Divider
      doc.setDrawColor(220, 252, 231)
      doc.setLineWidth(0.5)
      doc.line(40, 60, 257, 60)

      // Worker name
      doc.setFontSize(26)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(17, 24, 39)
      doc.text(workerName, 148.5, 85, { align: "center" })

      // Has successfully completed
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(107, 114, 128)
      doc.text("has successfully completed", 148.5, 98, { align: "center" })

      // Module name
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(22, 101, 52)
      doc.text(moduleName, 148.5, 114, { align: "center" })

      // Divider
      doc.setDrawColor(220, 252, 231)
      doc.line(40, 128, 257, 128)

      // Dates
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(107, 114, 128)
      doc.text("Completed", 100, 143, { align: "center" })
      doc.setTextColor(17, 24, 39)
      doc.setFont("helvetica", "bold")
      doc.text(completionDate, 100, 153, { align: "center" })

      doc.setFont("helvetica", "normal")
      doc.setTextColor(107, 114, 128)
      doc.text("Valid until", 197, 143, { align: "center" })
      doc.setTextColor(17, 24, 39)
      doc.setFont("helvetica", "bold")
      doc.text(expiryDate, 197, 153, { align: "center" })

      // Footer
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(156, 163, 175)
      doc.text(
        "This certificate was issued by Certify Health in accordance with NHS-aligned competency standards",
        148.5,
        190,
        { align: "center" }
      )

      doc.save(`${moduleName.replace(/\s+/g, "-").toLowerCase()}-certificate.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 space-y-8 animate-fadeIn">
      {/* Checkmark */}
      <div className="relative flex items-center justify-center">
        <div className="w-28 h-28 md:w-32 md:h-32 bg-green-100 rounded-full animate-scaleIn flex items-center justify-center">
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            className="overflow-visible"
          >
            <polyline
              points="12,28 24,40 44,18"
              stroke="#16a34a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 100,
                strokeDashoffset: 100,
                animation: "drawCheck 400ms ease-out 300ms forwards",
              }}
            />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Module Complete</h2>
        <p className="text-sm text-gray-500">{workerName} · {moduleName}</p>
      </div>

      {/* Dates */}
      <div className="flex gap-8 text-center">
        <div>
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{completionDate}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Valid until</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{expiryDate}</p>
        </div>
      </div>

      {specialNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm text-center">
          <p className="text-sm text-amber-800 leading-relaxed">{specialNote}</p>
        </div>
      )}

      {/* Actions */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={downloadCertificate}
          disabled={generating}
          className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold text-sm py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating…
            </>
          ) : (
            "Download Certificate"
          )}
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full border border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-gray-50 font-medium text-sm py-4 rounded-xl transition-colors"
        >
          Return to Dashboard →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/CompletionScreen.tsx
git commit -m "feat: add CompletionScreen — SVG checkmark draw, jsPDF certificate, animated entry"
```

---

### Task 11: SectionRenderer component

**Files:**
- Create: `components/modules/SectionRenderer.tsx`

- [ ] **Step 1: Create SectionRenderer**

```tsx
// components/modules/SectionRenderer.tsx
"use client"

import { useState, useCallback } from "react"
import type { InteractiveSection, SectionBlock } from "@/lib/modules/types"
import { RevealCard } from "./RevealCard"
import { KnowledgeCheck } from "./KnowledgeCheck"
import { ScenarioChoice } from "./ScenarioChoice"
import { OrderingActivity } from "./OrderingActivity"
import { ReflectivePrompt } from "./ReflectivePrompt"
import { LabelledDiagram } from "./LabelledDiagram"

type Props = {
  section: InteractiveSection
  isLast: boolean
  onSectionComplete: () => void
}

function initCompleted(blocks: SectionBlock[]): Set<number> {
  const s = new Set<number>()
  blocks.forEach((b, i) => {
    if (b.type === "text") s.add(i)
  })
  return s
}

export function SectionRenderer({ section, isLast, onSectionComplete }: Props) {
  const [completed, setCompleted] = useState<Set<number>>(() =>
    initCompleted(section.blocks)
  )
  const allComplete = completed.size === section.blocks.length

  const markComplete = useCallback((index: number) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }, [])

  function renderBlock(block: SectionBlock, index: number) {
    const complete = () => markComplete(index)

    switch (block.type) {
      case "text":
        return (
          <div className="bg-white rounded-2xl ring-1 ring-gray-200 p-5">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {block.content}
            </p>
          </div>
        )
      case "reveal-cards":
        return <RevealCard cards={block.cards} onComplete={complete} />
      case "knowledge-check":
        return (
          <KnowledgeCheck
            question={block.question}
            options={block.options}
            onComplete={complete}
          />
        )
      case "scenario-choice":
        return (
          <ScenarioChoice
            scenario={block.scenario}
            choices={block.choices}
            onComplete={complete}
          />
        )
      case "ordering-activity":
        return (
          <OrderingActivity
            items={block.items}
            correctOrder={block.correctOrder}
            onComplete={complete}
          />
        )
      case "reflective-prompt":
        return (
          <ReflectivePrompt
            question={block.question}
            minimumChars={block.minimumChars}
            onComplete={complete}
          />
        )
      case "labelled-diagram":
        return (
          <LabelledDiagram
            svg={block.svg}
            hotspots={block.hotspots}
            onComplete={complete}
          />
        )
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
      {section.blocks.map((block, i) => (
        <div key={i}>{renderBlock(block, i)}</div>
      ))}
      {allComplete && (
        <button
          onClick={onSectionComplete}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-2 group animate-fadeIn"
        >
          {isLast ? "Begin Assessment" : "Continue"}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add components/modules/SectionRenderer.tsx
git commit -m "feat: add SectionRenderer — composes blocks, tracks completion, gates Continue"
```

---

### Task 12: BLS module interactive content

**Files:**
- Create: `lib/modules/bls-theory.tsx`

- [ ] **Step 1: Create the AED SVG component (inline in file)**

- [ ] **Step 2: Create BLS content file**

```tsx
// lib/modules/bls-theory.tsx
import type { InteractiveContent } from "./types"

const AedSvg = () => (
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full"
    style={{ maxHeight: 220 }}
  >
    {/* Device body */}
    <rect x="70" y="20" width="140" height="160" rx="16" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
    {/* Screen */}
    <rect x="90" y="40" width="100" height="70" rx="8" fill="#dcfce7" />
    <text x="140" y="72" textAnchor="middle" fill="#166534" fontSize="16" fontFamily="monospace" fontWeight="bold">AED</text>
    <text x="140" y="94" textAnchor="middle" fill="#15803d" fontSize="10" fontFamily="monospace">READY</text>
    {/* Power button */}
    <circle cx="192" cy="40" r="16" fill="#16a34a" stroke="white" strokeWidth="2" />
    <text x="192" y="47" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">⏻</text>
    {/* Shock button */}
    <rect x="90" y="130" width="100" height="34" rx="10" fill="#ea580c" />
    <text x="140" y="152" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">SHOCK</text>
    {/* Left pad cable */}
    <line x1="70" y1="110" x2="26" y2="110" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
    <rect x="6" y="90" width="22" height="38" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
    <text x="17" y="113" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">L</text>
    {/* Right pad cable */}
    <line x1="210" y1="110" x2="252" y2="110" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
    <rect x="252" y="90" width="22" height="38" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
    <text x="263" y="113" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">R</text>
  </svg>
)

export const blsTheoryContent: InteractiveContent = {
  sections: [
    {
      title: "The Chain of Survival",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "1. Early Recognition",
              content:
                "Identify cardiac arrest immediately: the patient is unresponsive and not breathing normally. Every minute without treatment reduces survival by 7–10%. Shout for attention as you approach.",
            },
            {
              title: "2. Early CPR",
              content:
                "High-quality CPR circulates oxygenated blood to the brain and heart, buying critical time. Start compressions immediately — do not wait for equipment or additional staff before beginning.",
            },
            {
              title: "3. Early Defibrillation",
              content:
                "Most sudden cardiac arrests are caused by ventricular fibrillation — a chaotic rhythm only correctable with a defibrillation shock. Attach the AED as soon as it arrives without stopping compressions.",
            },
            {
              title: "4. Post-Resuscitation Care",
              content:
                "After return of spontaneous circulation (ROSC), the patient needs critical care, airway management, and investigation of the underlying cause to prevent re-arrest.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question:
            "Which link in the chain is most time-critical in an out-of-hospital cardiac arrest?",
          options: [
            {
              text: "Early Recognition",
              correct: false,
              explanation:
                "Recognition is critical but delay in defibrillation has the steepest effect on survival rates.",
            },
            {
              text: "Early Defibrillation",
              correct: true,
              explanation:
                "Survival rates fall by 10% for every minute without defibrillation in ventricular fibrillation. CPR buys time but cannot restore a normal rhythm.",
            },
            {
              text: "Post-Resuscitation Care",
              correct: false,
              explanation:
                "Post-resuscitation care is essential after ROSC — it cannot help during the arrest itself.",
            },
            {
              text: "Early CPR",
              correct: false,
              explanation:
                "CPR is vital, but its primary role is to maintain circulation until defibrillation is available.",
            },
          ],
        },
      ],
    },
    {
      title: "Recognising Cardiac Arrest",
      blocks: [
        {
          type: "text",
          content:
            "When a patient collapses, you must assess quickly and decisively.\n\nUnresponsiveness is the first sign. Shout the patient's name and squeeze their shoulders firmly. If there is no response, assume the worst and act immediately.\n\nNormal breathing means the chest rises and falls regularly, without effort or distress. Check for no more than 10 seconds — looking, listening, and feeling for air movement.\n\nAgonal breathing appears as infrequent, irregular gasps or snoring sounds. This is a brainstem reflex and is NOT normal breathing. Do not be reassured by it — treat the patient as if they are in cardiac arrest.",
        },
        {
          type: "knowledge-check",
          question: "A patient is making occasional gasping sounds. Is this normal breathing?",
          options: [
            {
              text: "Yes — gasping shows the patient can breathe independently",
              correct: false,
              explanation:
                "Agonal gasping is not independent breathing. It is a brainstem reflex that can occur even in cardiac arrest.",
            },
            {
              text: "No — this is agonal breathing, treat as cardiac arrest",
              correct: true,
              explanation:
                "Agonal breathing must not delay your response. Treat it as cardiac arrest and begin CPR immediately.",
            },
            {
              text: "Only if gasps occur more than once every 5 seconds",
              correct: false,
              explanation:
                "There is no frequency threshold — any atypical breathing in an unresponsive patient should be treated as cardiac arrest.",
            },
            {
              text: "It depends on whether the patient is conscious",
              correct: false,
              explanation:
                "If the patient is unresponsive, consciousness is already absent. Gasping is not normal breathing.",
            },
          ],
        },
      ],
    },
    {
      title: "CPR Technique",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Compression Rate",
              content:
                "Deliver compressions at 100–120 per minute. Use the rhythm of 'Stayin' Alive' by the Bee Gees to pace yourself. Too slow fails to circulate blood; too fast prevents full chest recoil.",
            },
            {
              title: "Compression Depth",
              content:
                "Compress the chest 5–6 cm in adults — approximately one-third of its depth. Place the heel of your dominant hand on the centre of the chest, interlock fingers, keep arms straight, and use your body weight.",
            },
            {
              title: "Hand Position and Ratio",
              content:
                "Never allow your fingers to press on the ribs — interlock and lift them. After every 30 compressions, give 2 rescue breaths. Tilt the head back, lift the chin, and give each breath over 1 second watching for chest rise.",
            },
          ],
        },
        {
          type: "ordering-activity",
          items: [
            { id: "compressions", text: "Begin 30 chest compressions" },
            { id: "breathing", text: "Check for normal breathing (no more than 10 seconds)" },
            { id: "airway", text: "Open the airway using head-tilt chin-lift" },
            { id: "shout", text: "Shout for help and call the crash team" },
            { id: "breaths", text: "Give 2 rescue breaths" },
            { id: "check", text: "Check patient response (shout name and squeeze shoulders)" },
          ],
          correctOrder: ["check", "shout", "airway", "breathing", "compressions", "breaths"],
        },
      ],
    },
    {
      title: "AED and Team Resuscitation",
      blocks: [
        {
          type: "labelled-diagram",
          svg: <AedSvg />,
          hotspots: [
            {
              id: "power",
              x: 68,
              y: 20,
              label: "Power Button",
              description:
                "Press once to turn on. The AED will give clear audio instructions throughout — follow them exactly without rushing.",
            },
            {
              id: "shock",
              x: 50,
              y: 74,
              label: "Shock Button",
              description:
                "Press only when the AED instructs. Shout 'Stand clear!' first and ensure no one is touching the patient.",
            },
            {
              id: "pad-left",
              x: 6,
              y: 55,
              label: "Left Pad Placement",
              description:
                "Place below the left collarbone, to the right of the sternum (below the clavicle, left of centre).",
            },
            {
              id: "pad-right",
              x: 94,
              y: 55,
              label: "Right Pad Placement",
              description:
                "Place on the left side of the chest, below and to the left of the armpit (mid-axillary line).",
            },
          ],
        },
        {
          type: "reflective-prompt",
          question:
            "Where is the nearest AED to where you currently work? If you don't know, what will you do after completing this module?",
        },
      ],
    },
    {
      title: "Clinical Scenario",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "You are working on Medical Ward B when a patient collapses beside their bed. They are unresponsive and not breathing normally. You are alone on the ward at this moment.",
          choices: [
            {
              text: "Call for help and activate the crash team immediately",
              outcome: "correct",
              consequence:
                "In a hospital setting, calling for help first ensures the crash team and defibrillator arrive as quickly as possible. CPR alone cannot restart a heart in ventricular fibrillation — you need the team. Begin CPR once help is called, or immediately if no one responds.",
            },
            {
              text: "Begin chest compressions immediately",
              outcome: "incorrect",
              consequence:
                "While CPR is critical, calling for help first in a hospital ensures the crash team and AED arrive sooner. Without the team, you will be doing CPR alone indefinitely. In out-of-hospital arrests the order changes — but on a ward, call first.",
            },
            {
              text: "Check for a pulse for up to 10 seconds before deciding",
              outcome: "incorrect",
              consequence:
                "Pulse checks are unreliable under stress and cause dangerous delays. If the patient is unresponsive and not breathing normally, treat as cardiac arrest. Do not spend time feeling for a pulse — act.",
            },
          ],
        },
      ],
    },
  ],
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: clean — the JSX in the `.tsx` file is valid.

- [ ] **Step 4: Commit**

```bash
git add lib/modules/bls-theory.tsx
git commit -m "feat: add BLS Theory interactive content — 5 sections, all 6 component types"
```

---

### Task 13: Update ModuleView + wire module page

**Files:**
- Modify: `components/module/module-view.tsx`
- Modify: `app/module/[id]/page.tsx`

- [ ] **Step 1: Update module-view.tsx**

Replace the entire file:

```tsx
// components/module/module-view.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import type { AssessmentQuestion, ModuleSection } from "@/lib/module"
import type { ModuleIntro } from "@/lib/module-content"
import type { InteractiveContent } from "@/lib/modules/types"
import { ProgressBar } from "@/components/modules/ProgressBar"
import { SectionRenderer } from "@/components/modules/SectionRenderer"
import { CompletionScreen } from "@/components/modules/CompletionScreen"

const PASS_THRESHOLD = 80

// CPR module gets a special note on the completion screen
const CPR_NOTE =
  "You have completed the CPR Practical Preparation module. Your next step is to book a practical sign-off session with a certified assessor. Present this certificate as evidence of your theory preparation."

type Phase = "intro" | "section" | "assessment" | "result"

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
  interactiveContent?: InteractiveContent | null
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
  interactiveContent,
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
  const [expiryDate, setExpiryDate] = useState<string | null>(null)
  const [completedAnswers, setCompletedAnswers] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)

  const interactive = interactiveContent ?? null
  const sectionCount = interactive ? interactive.sections.length : sections.length
  const hasSections = interactive ? interactive.sections.length > 0 : sections.length > 0
  const isLastSection = currentSection === sectionCount - 1
  const question = questions[currentQ]
  const isLastQuestion = currentQ === questions.length - 1
  const section = sections[currentSection]

  const isCheckedCorrect =
    checkedAnswer !== null && question !== undefined && checkedAnswer === question.correct_index
  const isForced = attemptsOnCurrent >= 2
  const explanation = question && moduleIntro?.explanations[question.question_order]

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
      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      const expiryBase = new Date()
      expiryBase.setMonth(expiryBase.getMonth() + competency.validity_months)
      const expiryStr = expiryBase.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })

      setScore(pct)
      setPassed(didPass)
      setCompletionDate(dateStr)
      setExpiryDate(expiryStr)
      setCompletedAnswers(updatedAnswers)
      setPhase("result")

      setSubmitting(true)
      try {
        await onRecordAttempt(competency.id, competency.validity_months, pct, didPass)
      } finally {
        setSubmitting(false)
      }
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
    advanceQuestion(checkedAnswer)
  }

  function handleTryAgain() {
    setSelected(null)
    setCheckedAnswer(null)
    setShowFeedback(false)
  }

  const correctCount =
    passed !== null
      ? completedAnswers.filter((ans, i) => ans === questions[i].correct_index).length
      : 0

  const isCprModule = competency.title.toLowerCase().includes("cpr")
  const bgClass = interactive ? "bg-[#fffbf5]" : "bg-gray-50"

  return (
    <div className={`min-h-screen ${bgClass} print:bg-white`}>
      {/* Normal UI */}
      <div className="print:hidden">
        {/* Header */}
        <header className="bg-green-950 text-white px-4 py-4">
          <Link href="/dashboard" className="text-sm text-green-300 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-base font-semibold mt-2 leading-snug">{competency.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-green-400">{competency.estimated_minutes} min estimated</p>
            {phase === "assessment" && (
              <p className="text-xs text-green-400">
                Question {currentQ + 1} of {questions.length}
              </p>
            )}
          </div>
          {phase === "assessment" && (
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4ade80] rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>
          )}
        </header>

        {/* Interactive progress bar — shown during interactive section phase */}
        {interactive && phase === "section" && (
          <ProgressBar
            currentSection={currentSection + 1}
            totalSections={sectionCount}
            moduleName={competency.title}
          />
        )}

        <main className="max-w-xl mx-auto px-4 py-6 space-y-4">

          {/* Intro phase */}
          {phase === "intro" && (
            <div className="space-y-4">
              {moduleIntro ? (
                <>
                  <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">What you will learn</h2>
                    <ul className="space-y-2">
                      {moduleIntro.objectives.map((obj, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                    <h2 className="text-sm font-semibold text-green-800 mb-2">Why this matters</h2>
                    <p className="text-sm text-green-700 leading-relaxed">{moduleIntro.why_matters}</p>
                  </div>
                </>
              ) : competency.description ? (
                <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-5">
                  <p className="text-sm text-gray-600">{competency.description}</p>
                </div>
              ) : null}
              <button
                onClick={hasSections ? startSections : startAssessment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-4 rounded-xl transition-colors"
              >
                Begin →
              </button>
            </div>
          )}

          {/* Interactive section phase */}
          {phase === "section" && interactive && (
            <div key={currentSection} className="animate-slideInRight">
              <SectionRenderer
                section={interactive.sections[currentSection]}
                isLast={isLastSection}
                onSectionComplete={() => {
                  if (isLastSection) {
                    startAssessment()
                  } else {
                    setCurrentSection((s) => s + 1)
                  }
                }}
              />
            </div>
          )}

          {/* Fallback text section phase */}
          {phase === "section" && !interactive && section && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-xs text-gray-400 mb-2">
                  Section {currentSection + 1} of {sections.length}
                </p>
                <h2 className="text-base font-semibold text-gray-900 mb-4">{section.title}</h2>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.body}
                </div>
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
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-5 space-y-5">
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

              <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                {question.question}
              </p>

              <div className="space-y-2.5">
                {question.options.map((opt, i) => {
                  let style =
                    "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  if (showFeedback) {
                    if (i === question.correct_index) {
                      style = "border-green-600 bg-green-50 text-green-900 font-medium"
                    } else if (i === checkedAnswer && !isCheckedCorrect) {
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
                      className={`w-full text-left text-sm px-4 py-3 rounded-xl border transition-colors ${style}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {showFeedback && (
                <div
                  className={`rounded-xl p-3 text-sm ${
                    isCheckedCorrect ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                  }`}
                >
                  <p className="font-medium">
                    {isCheckedCorrect
                      ? "Correct"
                      : isForced
                      ? "The correct answer is highlighted above."
                      : "Not quite."}
                  </p>
                  {explanation && (
                    <p className="mt-1 text-xs leading-relaxed">{explanation}</p>
                  )}
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
                  className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
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

          {/* Result phase — pass */}
          {phase === "result" && passed === true && completionDate && expiryDate && (
            <CompletionScreen
              workerName={workerName}
              moduleName={competency.title}
              completionDate={completionDate}
              expiryDate={expiryDate}
              specialNote={isCprModule ? CPR_NOTE : undefined}
            />
          )}

          {/* Result phase — fail */}
          {phase === "result" && passed === false && score !== null && (
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 text-center space-y-4">
              <div className="text-4xl font-bold text-red-500">{score}%</div>
              <div>
                <p className="text-base font-semibold text-gray-900">Not quite there</p>
                <p className="text-sm text-gray-500 mt-1">
                  {correctCount} of {questions.length} correct — you need {PASS_THRESHOLD}% to pass. Review the module and try again.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={startAssessment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Try Again
                </button>
                {hasSections && (
                  <button
                    onClick={() => {
                      setCurrentSection(0)
                      setPhase("section")
                    }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                  >
                    Review module content
                  </button>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update app/module/[id]/page.tsx**

Replace the entire file:

```tsx
// app/module/[id]/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getModuleData } from "@/lib/module"
import { getModuleIntro } from "@/lib/module-content"
import { ModuleView } from "@/components/module/module-view"
import { recordAttempt } from "./actions"
import { blsTheoryContent } from "@/lib/modules/bls-theory"

function getInteractiveContent(title: string) {
  const map: Record<string, typeof blsTheoryContent> = {
    "Basic Life Support (BLS) — Theory": blsTheoryContent,
  }
  return map[title] ?? null
}

type Props = { params: { id: string } }

export default async function ModulePage({ params }: Props) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
  const interactiveContent = getInteractiveContent(moduleData.competency.title)
  const workerName = profileResult.data?.full_name ?? ""
  const facilityName =
    (profileResult.data?.facilities as unknown as { name: string } | null)?.name ?? ""

  return (
    <ModuleView
      competency={moduleData.competency}
      sections={moduleData.sections}
      questions={moduleData.questions}
      moduleIntro={moduleIntro}
      workerName={workerName}
      facilityName={facilityName}
      interactiveContent={interactiveContent}
      onRecordAttempt={recordAttempt}
    />
  )
}
```

- [ ] **Step 3: Run lint + build**

```bash
npm run lint && npm run build
```

Expected: no errors. If TypeScript complains about unused `facilityName`, that's OK — it was in the original.

- [ ] **Step 4: Start dev server and verify BLS module at 390px**

```bash
npm run dev
```

Open http://localhost:3000, log in as Adaeze Okonkwo, open the BLS module. In browser dev tools, set viewport to 390px width.

Verify:
- Warm `#fffbf5` background on module screen
- ProgressBar appears below header in section phase
- Section 1: four RevealCards stagger in, Continue locked until all opened
- Section 1: KnowledgeCheck shows letter labels, correct gets green + explanation, wrong shakes
- Section 2: Text renders, KnowledgeCheck works
- Section 3: RevealCards work, OrderingActivity shows arrow buttons on mobile (390px)
- Section 4: LabelledDiagram shows AED with pulsing hotspots, overlay panel appears on tap
- Section 4: ReflectivePrompt shows amber styling, REFLECT label, character counter
- Section 5: ScenarioChoice shows SCENARIO label, consequence panel slides in
- Assessment: unchanged behaviour
- Pass: CompletionScreen shows with checkmark animation
- Pass: "Download Certificate" generates a PDF

- [ ] **Step 5: Commit**

```bash
git add components/module/module-view.tsx app/module/[id]/page.tsx
git commit -m "feat: wire interactive component library into module view for BLS Theory"
```

---

## Verification Summary

End-to-end test path:
1. Log in as Adaeze Okonkwo (worker account)
2. Open Basic Life Support (BLS) — Theory
3. Walk through all 5 sections, engaging every component
4. Complete the assessment with ≥80%
5. Verify CompletionScreen, checkmark animation, and PDF download
6. Return to dashboard — confirm competency shows as Complete

Mobile check: repeat steps 1–6 in browser at 390px width. OrderingActivity must show arrow buttons. All tap targets must be reachable without pinch-zooming.
