// app/module/[id]/page.tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getModuleData } from "@/lib/module"
import { getModuleIntro } from "@/lib/module-content"
import { ModuleView } from "@/components/module/module-view"
import { recordAttempt } from "./actions"

type Props = { params: { id: string } }

export default async function ModulePage({ params }: Props) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [moduleData, profileResult] = await Promise.all([
    getModuleData(params.id),
    supabase
      .from("profiles")
      .select("full_name, facilities(name)")
      .eq("id", user.id)
      .single(),
  ])

  if (!moduleData) redirect("/dashboard")

  const moduleIntro = getModuleIntro(moduleData.competency.title)
  const workerName = profileResult.data?.full_name ?? ""

  return (
    <ModuleView
      competency={moduleData.competency}
      sections={moduleData.sections}
      questions={moduleData.questions}
      moduleIntro={moduleIntro}
      workerName={workerName}
      onRecordAttempt={recordAttempt}
    />
  )
}
