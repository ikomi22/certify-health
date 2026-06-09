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
