import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getWorkerDashboard } from "@/lib/dashboard"
import { SummaryCard } from "@/components/dashboard/summary-card"
import { CompetencyCard } from "@/components/dashboard/competency-card"
import { OverdueBanner } from "@/components/dashboard/overdue-banner"
import { checkAndSendOverdueReminder } from "@/lib/notifications"
import { signOut } from "./actions"
import { RoleNav } from "@/components/shared/role-nav"

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { profile, competencies } = await getWorkerDashboard(user.id)

  const overdueCount = competencies.filter((c) => c.status === "overdue").length
  const expiringSoonCount = competencies.filter((c) => c.expiring_soon).length

  // Fire-and-forget — never blocks render
  checkAndSendOverdueReminder(user.id).catch(() => {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-green-950 px-4 py-3 flex items-center justify-between">
        <span className="text-white font-bold text-base tracking-tight">
          Certify <span className="text-[#4ade80]">Health</span>
        </span>
        <div className="flex items-center gap-3">
          {profile.role === "admin" && <RoleNav />}
          <span className="text-white/70 text-xs hidden sm:block">{profile.full_name}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-white/60 hover:text-white text-xs transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Identity strip */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{profile.full_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {profile.cadre} · {profile.ward} · {profile.facility_name}
        </p>
      </div>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        <OverdueBanner overdueCount={overdueCount} expiringSoonCount={expiringSoonCount} />

        <SummaryCard competencies={competencies} />

        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your Competencies
          </h2>
          <div className="space-y-3">
            {competencies.map((c) => (
              <CompetencyCard key={c.id} competency={c} />
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
