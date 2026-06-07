import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getFacilityData } from "@/lib/facility"
import { FacilityDashboard } from "@/components/facility/facility-dashboard"

export default async function FacilityPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const data = await getFacilityData(user.id)
  if (!data) redirect("/dashboard")

  return <FacilityDashboard data={data} />
}
