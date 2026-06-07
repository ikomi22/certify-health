import { createClient } from "@/lib/supabase/server"

export type CompetencyStatus = "not_started" | "in_progress" | "complete" | "overdue"

export type StaffRow = {
  id: string
  full_name: string
  cadre: string
  ward: string
  competencies: Record<string, CompetencyStatus>
}

export type FacilityData = {
  facility_name: string
  competencies: Array<{ id: string; title: string }>
  staff: StaffRow[]
  compliance_rate: number
}

export async function getFacilityData(adminUserId: string): Promise<FacilityData | null> {
  const supabase = createClient()

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("facility_id, role, facilities(name)")
    .eq("id", adminUserId)
    .single()

  if (!adminProfile || adminProfile.role !== "admin") return null

  const facilityId = adminProfile.facility_id
  const facilityName = (adminProfile.facilities as unknown as { name: string } | null)?.name ?? ""

  const [staffResult, competenciesResult, wcResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, cadre, ward")
      .eq("facility_id", facilityId)
      .eq("role", "worker")
      .order("full_name"),
    supabase
      .from("competencies")
      .select("id, title")
      .order("title"),
    supabase
      .from("worker_competencies")
      .select("user_id, competency_id, status"),
  ])

  const staff = staffResult.data ?? []
  const competencies = competenciesResult.data ?? []
  const wcs = wcResult.data ?? []

  const wcMap = new Map<string, CompetencyStatus>()
  for (const wc of wcs) {
    wcMap.set(`${wc.user_id}:${wc.competency_id}`, wc.status as CompetencyStatus)
  }

  const staffRows: StaffRow[] = staff.map((s) => {
    const compMap: Record<string, CompetencyStatus> = {}
    for (const c of competencies) {
      compMap[c.id] = wcMap.get(`${s.id}:${c.id}`) ?? "not_started"
    }
    return {
      id: s.id,
      full_name: s.full_name,
      cadre: s.cadre,
      ward: s.ward,
      competencies: compMap,
    }
  })

  const totalPairs = staffRows.length * competencies.length
  const completePairs = staffRows.reduce((sum, s) => {
    return sum + Object.values(s.competencies).filter((v) => v === "complete").length
  }, 0)
  const compliance_rate = totalPairs > 0 ? Math.round((completePairs / totalPairs) * 100) : 0

  return {
    facility_name: facilityName,
    competencies,
    staff: staffRows,
    compliance_rate,
  }
}
