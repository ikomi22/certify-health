import { createClient } from "@/lib/supabase/server"
import { sendOverdueReminder } from "@/lib/email"

const COOLDOWN_HOURS = 24

export async function checkAndSendOverdueReminder(userId: string): Promise<void> {
  try {
    const supabase = createClient()

    const { data: overdueWcs } = await supabase
      .from("worker_competencies")
      .select("competency_id, competencies(title)")
      .eq("user_id", userId)
      .eq("status", "overdue")

    if (!overdueWcs || overdueWcs.length === 0) return

    const cutoff = new Date()
    cutoff.setHours(cutoff.getHours() - COOLDOWN_HOURS)

    const { data: recentLog } = await supabase
      .from("notification_log")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "overdue_reminder")
      .gte("sent_at", cutoff.toISOString())
      .limit(1)

    if (recentLog && recentLog.length > 0) return

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, facilities(name)")
      .eq("id", userId)
      .single()

    if (!profile) return

    const facilityName =
      (profile.facilities as unknown as { name: string } | null)?.name ?? "Certify Health"

    const overdueTitles = overdueWcs.map((wc) => ({
      title: (wc.competencies as unknown as { title: string } | null)?.title ?? "Unknown",
    }))

    await sendOverdueReminder(
      { full_name: profile.full_name, email: profile.email },
      overdueTitles,
      facilityName
    )

    await supabase.from("notification_log").insert({
      user_id: userId,
      type: "overdue_reminder",
    })
  } catch (err) {
    console.error("Notification check failed:", err)
  }
}
