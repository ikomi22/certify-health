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
