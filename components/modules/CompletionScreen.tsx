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
  onRetake?: () => void
}

export function CompletionScreen({
  workerName,
  moduleName,
  completionDate,
  expiryDate,
  specialNote,
  onRetake,
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

      const slug = moduleName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      doc.save(`${slug}-certificate.pdf`)
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
        {onRetake && (
          <button
            onClick={onRetake}
            className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            Retake module
          </button>
        )}
      </div>
    </div>
  )
}
