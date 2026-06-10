// components/module/module-view.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import type { AssessmentQuestion, ModuleSection } from "@/lib/module"
import type { ModuleIntro } from "@/lib/module-content"
import type { InteractiveContent } from "@/lib/modules/types"
import { blsTheoryContent } from "@/lib/modules/bls-theory"
import { ipcContent } from "@/lib/modules/ipc"
import { safeguardingContent } from "@/lib/modules/safeguarding"
import { medicinesContent } from "@/lib/modules/medicines"
import { healthSafetyContent } from "@/lib/modules/health-safety"
import { manualHandlingContent } from "@/lib/modules/manual-handling"
import { cprContent } from "@/lib/modules/cpr"
import { ProgressBar } from "@/components/modules/ProgressBar"
import { SectionRenderer } from "@/components/modules/SectionRenderer"
import { CompletionScreen } from "@/components/modules/CompletionScreen"

function getInteractiveContent(title: string): InteractiveContent | null {
  switch (title) {
    case "Basic Life Support (BLS) — Theory":           return blsTheoryContent
    case "Infection Prevention and Control":             return ipcContent
    case "Safeguarding Awareness":                       return safeguardingContent
    case "Medicines Management — Fundamentals":          return medicinesContent
    case "Health and Safety Awareness":                  return healthSafetyContent
    case "Manual Handling — Theory":                     return manualHandlingContent
    case "Cardiopulmonary Resuscitation (CPR) — Practical Preparation": return cprContent
    default:                                             return null
  }
}

const PASS_THRESHOLD = 80

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

  const interactive = getInteractiveContent(competency.title)
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
