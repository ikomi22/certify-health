import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  const { data: admin } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .single()

  if (!admin) { console.log("No admin user found"); return }

  const { data: comps } = await supabase.from("competencies").select("id, title")
  if (!comps) return

  const now = new Date()
  const compByTitle = Object.fromEntries(comps.map((c) => [c.title, c]))

  const adminRecords = [
    {
      user_id: admin.id,
      competency_id: compByTitle["Infection Prevention and Control"]?.id,
      status: "complete",
      completed_at: new Date(now.getTime() - 335 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: admin.id,
      competency_id: compByTitle["Safeguarding Awareness"]?.id,
      status: "complete",
      completed_at: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(now.getTime() + 330 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      user_id: admin.id,
      competency_id: compByTitle["Basic Life Support (BLS) — Theory"]?.id,
      status: "overdue",
      completed_at: new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ].filter((r) => r.competency_id)

  for (const record of adminRecords) {
    const { error } = await supabase
      .from("worker_competencies")
      .upsert(record, { onConflict: "user_id,competency_id" })
    if (error) console.log(`Error: ${error.message}`)
    else console.log(`Upserted: ${comps.find((c) => c.id === record.competency_id)?.title}`)
  }

  console.log("Done.")
}

main().catch(console.error)
