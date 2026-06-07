import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function SelectRolePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, cadre, role, facilities(name)")
    .eq("id", user.id)
    .single()

  if (!profile) redirect("/login")
  // Workers don't need the picker — send them straight to their dashboard
  if (profile.role !== "admin") redirect("/dashboard")

  const facilityName = (profile.facilities as unknown as { name: string } | null)?.name ?? ""

  return (
    <main className="min-h-screen bg-[#052e16] flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mb-1">
          <span className="text-white font-extrabold text-3xl tracking-tight">Certify</span>
          <span className="text-[#4ade80] font-extrabold text-3xl tracking-tight ml-1.5">Health</span>
        </div>
        <p className="text-[#4ade80] text-sm mt-1">{facilityName}</p>
      </div>

      <div className="w-full max-w-sm space-y-3">
        <p className="text-white/60 text-xs text-center mb-5">
          {profile.full_name} · {profile.cadre}
        </p>

        <Link
          href="/dashboard"
          className="block bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-green-50 transition-colors group"
        >
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">My Compliance</p>
          <p className="text-xs text-gray-500 mt-1">View your personal competency record and complete training modules</p>
        </Link>

        <Link
          href="/facility"
          className="block bg-white rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] hover:bg-green-50 transition-colors group"
        >
          <p className="text-sm font-semibold text-gray-900 group-hover:text-green-700">Facility Overview</p>
          <p className="text-xs text-gray-500 mt-1">View staff compliance across the facility and identify training gaps</p>
        </Link>
      </div>
    </main>
  )
}
