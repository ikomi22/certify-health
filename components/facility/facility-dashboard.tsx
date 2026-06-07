"use client"

import { useState, useMemo } from "react"
import type { FacilityData, CompetencyStatus } from "@/lib/facility"
import { RoleNav } from "@/components/shared/role-nav"

const RAG: Record<CompetencyStatus, { dot: string; label: string }> = {
  complete:    { dot: "bg-green-500",  label: "Complete" },
  in_progress: { dot: "bg-amber-400",  label: "In Progress" },
  overdue:     { dot: "bg-red-500",    label: "Overdue" },
  not_started: { dot: "bg-gray-300",   label: "Not Started" },
}

const SHORT_CODE: Record<string, string> = {
  "Basic Life Support (BLS) — Theory": "BLS",
  "Infection Prevention and Control":   "IPC",
  "Safeguarding Awareness":             "SGA",
  "Medicines Management — Fundamentals":"MMF",
  "Health and Safety Awareness":        "HSA",
  "Manual Handling — Theory":           "MHT",
  "Cardiopulmonary Resuscitation (CPR) — Practical Preparation": "CPR",
}

function shortCode(title: string) {
  return SHORT_CODE[title] ?? title.slice(0, 3).toUpperCase()
}

const CADRES = ["All", "Registered Nurse", "Midwife", "CHEW"] as const
type CadreFilter = typeof CADRES[number]

function overdueCount(s: { competencies: Record<string, CompetencyStatus> }) {
  return Object.values(s.competencies).filter((v) => v === "overdue").length
}

function gapCount(s: { competencies: Record<string, CompetencyStatus> }) {
  return Object.values(s.competencies).filter((v) => v !== "complete").length
}

function complianceColor(rate: number) {
  if (rate >= 80) return "text-green-600"
  if (rate >= 60) return "text-amber-500"
  return "text-red-500"
}

function exportCsv(data: FacilityData) {
  const headers = ["Name", "Cadre", "Ward", ...data.competencies.map((c) => c.title)]
  const rows = data.staff.map((s) => [
    s.full_name,
    s.cadre,
    s.ward,
    ...data.competencies.map((c) => RAG[s.competencies[c.id] ?? "not_started"].label),
  ])
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "staff-compliance.csv"
  a.click()
  URL.revokeObjectURL(url)
}

type Props = { data: FacilityData }

export function FacilityDashboard({ data }: Props) {
  const [cadre, setCadre] = useState<CadreFilter>("All")
  const [overdueOnly, setOverdueOnly] = useState(false)

  const filtered = useMemo(() => {
    let staff = cadre === "All" ? data.staff : data.staff.filter((s) => s.cadre === cadre)
    if (overdueOnly) staff = staff.filter((s) => overdueCount(s) > 0)
    return [...staff].sort((a, b) => gapCount(b) - gapCount(a))
  }, [data.staff, cadre, overdueOnly])

  const gapsByComp = useMemo(() => {
    return data.competencies.map((c) => {
      const nonComplete = data.staff.filter(
        (s) => (s.competencies[c.id] ?? "not_started") !== "complete"
      ).length
      return { ...c, gaps: nonComplete }
    }).sort((a, b) => b.gaps - a.gaps)
  }, [data])

  const fullyCompliant = data.staff.filter((s) =>
    Object.values(s.competencies).every((v) => v === "complete")
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-950 text-white px-4 py-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-green-400 font-medium uppercase tracking-wider">Facility Dashboard</p>
          <RoleNav />
        </div>
        <h1 className="text-lg font-bold leading-snug">{data.facility_name}</h1>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{data.staff.length}</p>
            <p className="text-xs text-gray-400 mt-0.5">Total Staff</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{fullyCompliant}</p>
            <p className="text-xs text-gray-400 mt-0.5">Fully Compliant</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className={`text-2xl font-bold ${complianceColor(data.compliance_rate)}`}>
              {data.compliance_rate}%
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Overall Rate</p>
          </div>
        </div>

        {/* Competency gap breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Competency Gaps</h2>
          <div className="space-y-2.5">
            {gapsByComp.map((c) => {
              const pct = Math.round(((data.staff.length - c.gaps) / data.staff.length) * 100)
              return (
                <div key={c.id}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span className="truncate pr-2">{c.title}</span>
                    <span className="flex-shrink-0 font-medium">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Staff table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-sm font-semibold text-gray-700">Staff Compliance</h2>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Cadre filter */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
                {CADRES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCadre(c)}
                    className={`px-3 py-1.5 transition-colors ${
                      cadre === c
                        ? "bg-green-600 text-white font-medium"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setOverdueOnly((v) => !v)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  overdueOnly
                    ? "border-red-400 bg-red-50 text-red-700 font-medium"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                Overdue only
              </button>
              <button
                onClick={() => exportCsv(data)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-2.5 font-medium text-gray-500 whitespace-nowrap">Name</th>
                  <th className="text-left px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap">Cadre</th>
                  {data.competencies.map((c) => (
                    <th key={c.id} className="px-3 py-2.5 font-medium text-gray-500 whitespace-nowrap text-center" title={c.title}>
                      {shortCode(c.title)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{s.full_name}</span>
                      {overdueCount(s) > 0 && (
                        <span className="ml-2 text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                          {overdueCount(s)} overdue
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{s.cadre}</td>
                    {data.competencies.map((c) => {
                      const status = s.competencies[c.id] ?? "not_started"
                      const rag = RAG[status]
                      return (
                        <td key={c.id} className="px-3 py-2.5 text-center">
                          <span
                            className={`inline-block w-2.5 h-2.5 rounded-full ${rag.dot}`}
                            title={rag.label}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No staff found for this filter.</p>
            )}
          </div>
        </div>

        {/* Legend */}
        {/* RAG legend */}
        <div className="flex items-center gap-4 text-xs text-gray-400 px-1 flex-wrap">
          {Object.entries(RAG).map(([, v]) => (
            <span key={v.label} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full inline-block ${v.dot}`} />
              {v.label}
            </span>
          ))}
        </div>

        {/* Short code legend */}
        <div className="flex items-center gap-x-4 gap-y-1 text-xs text-gray-400 px-1 flex-wrap mt-2">
          {Object.entries(SHORT_CODE).map(([title, code]) => (
            <span key={code}><span className="font-medium text-gray-500">{code}</span> — {title}</span>
          ))}
        </div>

      </main>
    </div>
  )
}
