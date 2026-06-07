"use client"

import { useState } from "react"
import Link from "next/link"
import type { AssessmentQuestion } from "@/lib/module"
import type { ModuleIntro } from "@/lib/module-content"

const PASS_THRESHOLD = 80

type Phase = "video" | "assessment" | "result"

type Props = {
  competency: {
    id: string
    title: string
    estimated_minutes: number
    description: string | null
    validity_months: number
  }
  questions: AssessmentQuestion[]
  moduleIntro?: ModuleIntro | null
  sections?: import("@/lib/module").ModuleSection[]
  workerName?: string
  facilityName?: string
  onRecordAttempt: (
    competencyId: string,
    validityMonths: number,
    score: number,
    passed: boolean
  ) => Promise<void>
}

export function ModuleView({ competency, questions, onRecordAttempt }: Props) {
  const [phase, setPhase] = useState<Phase>("video")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [passed, setPassed] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const hasAssessment = questions.length > 0
  const question = questions[currentQ]
  const isLastQuestion = currentQ === questions.length - 1

  function startAssessment() {
    setPhase("assessment")
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
  }

  async function handleNext() {
    if (selected === null) return
    const updatedAnswers = [...answers, selected]

    if (isLastQuestion) {
      const correct = updatedAnswers.filter(
        (ans, i) => ans === questions[i].correct_index
      ).length
      const pct = Math.round((correct / questions.length) * 100)
      const didPass = pct >= PASS_THRESHOLD

      setScore(pct)
      setPassed(didPass)
      setPhase("result")

      setSubmitting(true)
      await onRecordAttempt(competency.id, competency.validity_months, pct, didPass)
      setSubmitting(false)
    } else {
      setAnswers(updatedAnswers)
      setCurrentQ((q) => q + 1)
      setSelected(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-950 text-white px-4 py-4">
        <Link href="/dashboard" className="text-sm text-green-300 hover:text-white transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="text-base font-semibold mt-2 leading-snug">{competency.title}</h1>
        <p className="text-xs text-green-400 mt-0.5">{competency.estimated_minutes} min estimated</p>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-4">

        {/* Video phase */}
        {phase === "video" && (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-center bg-gray-100 text-gray-400 text-sm" style={{ minHeight: 220 }}>
                Video content coming soon
              </div>
            </div>

            {competency.description && (
              <p className="text-sm text-gray-500 px-1">{competency.description}</p>
            )}

            {hasAssessment ? (
              <button
                onClick={startAssessment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Take Assessment →
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Back to Dashboard
              </Link>
            )}
          </>
        )}

        {/* Assessment phase */}
        {phase === "assessment" && question && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-5">
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

            <p className="text-sm font-semibold text-gray-900 leading-relaxed">{question.question}</p>

            <div className="space-y-2.5">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-colors ${
                    selected === i
                      ? "border-green-600 bg-green-50 text-green-900 font-medium"
                      : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={selected === null || submitting}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
            >
              {isLastQuestion ? "Submit" : "Next →"}
            </button>
          </div>
        )}

        {/* Result phase */}
        {phase === "result" && score !== null && passed !== null && (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center space-y-4">
            <div className={`text-4xl font-bold ${passed ? "text-green-600" : "text-red-500"}`}>
              {score}%
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">
                {passed ? "Module Complete" : "Not quite there"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {passed
                  ? "Your competency record has been updated."
                  : `You need ${PASS_THRESHOLD}% to pass. Watch the video again and retry.`}
              </p>
            </div>

            {passed ? (
              <Link
                href="/dashboard"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Back to Dashboard
              </Link>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={startAssessment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setPhase("video")}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                >
                  Rewatch video
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
