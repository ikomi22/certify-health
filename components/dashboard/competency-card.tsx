import Link from "next/link"
import type { WorkerCompetency, CompetencyStatus } from "@/lib/dashboard"
import { formatDate } from "@/lib/format"

const BORDER: Record<CompetencyStatus, string> = {
  overdue: "border-l-red-500",
  complete: "border-l-green-600",
  in_progress: "border-l-amber-400",
  not_started: "border-l-gray-300",
}

const BADGE: Record<CompetencyStatus, string> = {
  overdue: "bg-red-100 text-red-800",
  complete: "bg-green-100 text-green-800",
  in_progress: "bg-amber-100 text-amber-800",
  not_started: "bg-gray-100 text-gray-500",
}

const LABEL: Record<CompetencyStatus, string> = {
  overdue: "Overdue",
  complete: "Complete",
  in_progress: "In Progress",
  not_started: "Not Started",
}

function dateLine(c: WorkerCompetency): string {
  if (c.status === "complete" && c.completed_at) {
    const exp = c.expires_at ? ` · Expires ${formatDate(c.expires_at)}` : ""
    return `Completed ${formatDate(c.completed_at)}${exp}`
  }
  if (c.status === "overdue") {
    return c.expires_at ? `Expired ${formatDate(c.expires_at)}` : "Expired"
  }
  if (c.status === "in_progress") {
    return c.expires_at ? `Expires ${formatDate(c.expires_at)}` : "In progress"
  }
  return "Not yet started"
}

function expiringSoonLabel(c: WorkerCompetency) {
  if (!c.expiring_soon) return null
  return (
    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
      Expiring soon
    </span>
  )
}

type Props = {
  competency: WorkerCompetency
}

export function CompetencyCard({ competency: c }: Props) {
  const showCta = c.status !== "complete"
  const ctaLabel = c.status === "in_progress" ? "Continue →" : "Start Module →"

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${BORDER[c.status]} p-4 shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{c.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{c.estimated_minutes} min</p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${BADGE[c.status]}`}>
          {LABEL[c.status]}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <p className="text-xs text-gray-400">{dateLine(c)}</p>
        {expiringSoonLabel(c)}
      </div>
      {showCta && (
        <Link
          href={`/module/${c.id}`}
          className="mt-3 block w-full text-center bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  )
}
