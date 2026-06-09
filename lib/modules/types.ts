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
