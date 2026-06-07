"use client"

import { useState } from "react"

type Props = {
  overdueCount: number
  expiringSoonCount: number
}

export function OverdueBanner({ overdueCount, expiringSoonCount }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed || (overdueCount === 0 && expiringSoonCount === 0)) return null

  const isOverdue = overdueCount > 0

  return (
    <div
      className={`rounded-xl border px-4 py-3 flex items-start justify-between gap-3 ${
        isOverdue
          ? "bg-red-50 border-red-200"
          : "bg-amber-50 border-amber-200"
      }`}
    >
      <div>
        <p className={`text-sm font-semibold ${isOverdue ? "text-red-800" : "text-amber-800"}`}>
          {isOverdue
            ? `${overdueCount} ${overdueCount === 1 ? "competency" : "competencies"} overdue`
            : `${expiringSoonCount} ${expiringSoonCount === 1 ? "competency expires" : "competencies expire"} within 30 days`}
        </p>
        <p className={`text-xs mt-0.5 ${isOverdue ? "text-red-600" : "text-amber-600"}`}>
          {isOverdue
            ? overdueCount === 1
              ? "Complete this now to stay compliant."
              : "Complete these now to stay compliant."
            : "Renew now to avoid a gap in your competency record."}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className={`text-xl leading-none mt-0.5 ${
          isOverdue ? "text-red-300 hover:text-red-500" : "text-amber-300 hover:text-amber-500"
        } transition-colors`}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
