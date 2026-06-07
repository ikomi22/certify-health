import type { WorkerCompetency } from "@/lib/dashboard"

type Props = {
  competencies: WorkerCompetency[]
}

export function SummaryCard({ competencies }: Props) {
  const total = competencies.length
  const complete = competencies.filter((c) => c.status === "complete").length
  const overdue = competencies.filter((c) => c.status === "overdue").length
  const notStarted = competencies.filter((c) => c.status === "not_started").length

  return (
    <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #16a34a 0%, #052e16 100%)" }}>
      <p className="text-green-200 text-sm mb-1">Competency overview</p>
      <p className="text-2xl font-bold mb-4">
        {complete} of {total} complete
      </p>
      <div className="flex flex-wrap gap-2">
        <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
          {complete} complete
        </span>
        {overdue > 0 && (
          <span className="bg-red-400/30 text-red-100 text-xs font-medium px-3 py-1 rounded-full">
            {overdue} overdue
          </span>
        )}
        {notStarted > 0 && (
          <span className="bg-white/10 text-white/70 text-xs font-medium px-3 py-1 rounded-full">
            {notStarted} not started
          </span>
        )}
      </div>
    </div>
  )
}
