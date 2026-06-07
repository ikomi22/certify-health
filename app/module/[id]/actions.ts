"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function recordAttempt(
  competencyId: string,
  validityMonths: number,
  score: number,
  passed: boolean
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  await supabase.from("assessment_attempts").insert({
    user_id: user.id,
    competency_id: competencyId,
    score,
    passed,
  })

  if (passed) {
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setMonth(expiresAt.getMonth() + validityMonths)

    await supabase
      .from("worker_competencies")
      .upsert(
        {
          user_id: user.id,
          competency_id: competencyId,
          status: "complete",
          completed_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "user_id,competency_id" }
      )

    revalidatePath("/dashboard")
  }
}
