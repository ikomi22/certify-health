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

  useEffect(() => {
    if (!showConsequence) return
    const t = setTimeout(() => {
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
