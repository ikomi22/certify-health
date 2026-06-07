import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getModuleData } from "@/lib/module"
import { getVideoId } from "@/lib/module-videos"
import { ModuleView } from "@/components/module/module-view"
import { recordAttempt } from "./actions"

type Props = { params: { id: string } }

export default async function ModulePage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const moduleData = await getModuleData(params.id)
  if (!moduleData) redirect("/dashboard")

  const videoId = getVideoId(moduleData.competency.title)

  return (
    <ModuleView
      competency={moduleData.competency}
      questions={moduleData.questions}
      videoId={videoId}
      onRecordAttempt={recordAttempt}
    />
  )
}
