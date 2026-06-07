"use client"

import { useState } from "react"
import Link from "next/link"
import type { AssessmentQuestion, ModuleSection } from "@/lib/module"
import type { ModuleIntro } from "@/lib/module-content"

const PASS_THRESHOLD = 80

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
  facilityName,
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
  const [completedAnswers, setCompletedAnswers] = useState<number[]>([])
  const [submitting, setSubmitting] = useState(false)

  const hasSections = sections.length > 0
  const question = questions[currentQ]
  const isLastQuestion = currentQ === questions.length - 1
  const isLastSection = currentSection === sections.length - 1
  const section = sections[currentSection]

  const isCheckedCorrect = checkedAnswer !== null && question !== undefined && checkedAnswer === question.correct_index
  const isForced = attemptsOnCurrent >= 2
  const explanation = question && moduleIntro?.explanations[question.question_order]

  const expiryDate =
    completionDate
      ? new Date(
          new Date().setMonth(new Date().getMonth() + competency.validity_months)
        ).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : null

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

      setScore(pct)
      setPassed(didPass)
      setCompletionDate(dateStr)
      setCompletedAnswers(updatedAnswers)
      setPhase("result")

      setSubmitting(true)
      await onRecordAttempt(competency.id, competency.validity_months, pct, didPass)
      setSubmitting(false)
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

  function printCertificate() {
    window.print()
  }

  const correctCount =
    passed !== null
      ? completedAnswers.filter((ans, i) => ans === questions[i].correct_index).length
      : 0

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Certificate — only visible when printing */}
      <div className="hidden print:block p-12 max-w-2xl mx-auto">
        <div className="border-4 border-green-700 p-10 text-center space-y-6">
          <div>
            <span className="font-extrabold text-3xl text-green-900 tracking-tight">Certify</span>
            <span className="font-extrabold text-3xl text-green-600 tracking-tight ml-1.5">Health</span>
          </div>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Certificate of Competency</p>
          <p className="text-xl font-semibold text-gray-900">{workerName}</p>
          <p className="text-sm text-gray-500">has successfully completed</p>
          <p className="text-lg font-bold text-green-800">{competency.title}</p>
          <p className="text-sm text-gray-500">{facilityName}</p>
          <div className="flex justify-center gap-12 pt-4 text-sm text-gray-600">
            <div>
              <p className="font-medium">Completed</p>
              <p>{completionDate}</p>
            </div>
            <div>
              <p className="font-medium">Valid until</p>
              <p>{expiryDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Normal UI — hidden when printing */}
      <div className="print:hidden">
        {/* Header */}
        <header className="bg-green-950 text-white px-4 py-4">
          <Link href="/dashboard" className="text-sm text-green-300 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-base font-semibold mt-2 leading-snug">{competency.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs text-green-400">{competency.estimated_minutes} min estimated</p>
            {phase === "section" && hasSections && (
              <p className="text-xs text-green-400">
                Section {currentSection + 1} of {sections.length}
              </p>
            )}
            {phase === "assessment" && (
              <p className="text-xs text-green-400">
                Question {currentQ + 1} of {questions.length}
              </p>
            )}
          </div>
          {(phase === "section" || phase === "assessment") && (
            <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4ade80] rounded-full transition-all"
                style={{
                  width:
                    phase === "section"
                      ? `${((currentSection + 1) / sections.length) * 50}%`
                      : `${50 + ((currentQ + 1) / questions.length) * 50}%`,
                }}
              />
            </div>
          )}
        </header>

        <main className="max-w-xl mx-auto px-4 py-6 space-y-4">

          {/* Intro phase */}
          {phase === "intro" && (
            <div className="space-y-4">
              {moduleIntro ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm p-5">
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
                  <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                    <h2 className="text-sm font-semibold text-green-800 mb-2">Why this matters</h2>
                    <p className="text-sm text-green-700 leading-relaxed">{moduleIntro.why_matters}</p>
                  </div>
                </>
              ) : competency.description ? (
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <p className="text-sm text-gray-600">{competency.description}</p>
                </div>
              ) : null}
              <button
                onClick={hasSections ? startSections : startAssessment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
              >
                Begin →
              </button>
            </div>
          )}

          {/* Section phase */}
          {phase === "section" && section && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm p-5">
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

              <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                {question.question}
              </p>

              <div className="space-y-2.5">
                {question.options.map((opt, i) => {
                  let style = "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
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
                      className={`w-full text-left text-sm px-4 py-3 rounded-lg border transition-colors ${style}`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {showFeedback && (
                <div
                  className={`rounded-lg p-3 text-sm ${
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
                  {isLastQuestion
                    ? submitting
                      ? "Saving…"
                      : "See Results"
                    : "Next →"}
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
                    ? `${correctCount} of ${questions.length} correct — pass confirmed`
                    : `You need ${PASS_THRESHOLD}% to pass. Review the module and try again.`}
                </p>
              </div>

              {passed && completionDate && expiryDate && (
                <div className="flex justify-center gap-8 text-sm py-2">
                  <div>
                    <p className="text-xs text-gray-400">Completed</p>
                    <p className="font-medium text-gray-700">{completionDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Valid until</p>
                    <p className="font-medium text-gray-700">{expiryDate}</p>
                  </div>
                </div>
              )}

              {passed ? (
                <div className="space-y-2">
                  <button
                    onClick={printCertificate}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                  >
                    Download Certificate
                  </button>
                  <Link
                    href="/dashboard"
                    className="block w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              ) : (
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
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
