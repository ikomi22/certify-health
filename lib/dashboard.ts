import { createClient } from "@/lib/supabase/server"

export type CompetencyStatus = "not_started" | "in_progress" | "complete" | "overdue"

export type WorkerCompetency = {
  id: string
  title: string
  estimated_minutes: number
  status: CompetencyStatus
  completed_at: string | null
  expires_at: string | null
  expiring_soon: boolean
}

export type WorkerDashboardData = {
  profile: {
    full_name: string
    cadre: string
    ward: string
    facility_name: string
    role: "worker" | "admin"
  }
  competencies: WorkerCompetency[]
}

const STATUS_ORDER: Record<CompetencyStatus, number> = {
  overdue: 0,
  not_started: 1,
  in_progress: 2,
  complete: 3,
}

export async function getWorkerDashboard(userId: string): Promise<WorkerDashboardData> {
  const supabase = createClient()

  const [profileResult, competenciesResult, wcResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, cadre, ward, role, facilities(name)")
      .eq("id", userId)
      .single(),
    supabase
      .from("competencies")
      .select("id, title, estimated_minutes"),
    supabase
      .from("worker_competencies")
      .select("competency_id, status, completed_at, expires_at")
      .eq("user_id", userId),
  ])

  const wcMap = new Map(
    (wcResult.data ?? []).map((wc) => [wc.competency_id, wc])
  )

  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const competencies: WorkerCompetency[] = (competenciesResult.data ?? [])
    .map((c) => {
      const wc = wcMap.get(c.id)
      const status = (wc?.status ?? "not_started") as CompetencyStatus
      const expiresAt = wc?.expires_at ?? null
      const expiring_soon =
        status === "complete" && expiresAt !== null
          ? new Date(expiresAt) <= thirtyDaysFromNow
          : false
      return {
        id: c.id,
        title: c.title,
        estimated_minutes: c.estimated_minutes,
        status,
        completed_at: wc?.completed_at ?? null,
        expires_at: expiresAt,
        expiring_soon,
      }
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])

  const facilities = profileResult.data?.facilities as unknown as { name: string } | null

  return {
    profile: {
      full_name: profileResult.data?.full_name ?? "",
      cadre: profileResult.data?.cadre ?? "",
      ward: profileResult.data?.ward ?? "",
      facility_name: facilities?.name ?? "",
      role: (profileResult.data?.role ?? "worker") as "worker" | "admin",
    },
    competencies,
  }
}
