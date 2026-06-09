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
