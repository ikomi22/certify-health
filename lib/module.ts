import { createClient } from "@/lib/supabase/server"

export type AssessmentQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  question_order: number
}

export type ModuleData = {
  competency: {
    id: string
    title: string
    estimated_minutes: number
    description: string | null
    validity_months: number
  }
  questions: AssessmentQuestion[]
}

export async function getModuleData(competencyId: string): Promise<ModuleData | null> {
  const supabase = createClient()

  const [compResult, questionsResult] = await Promise.all([
    supabase
      .from("competencies")
      .select("id, title, estimated_minutes, description, validity_months")
      .eq("id", competencyId)
      .single(),
    supabase
      .from("assessment_questions")
      .select("id, question, options, correct_index, question_order")
      .eq("competency_id", competencyId)
      .order("question_order"),
  ])

  if (!compResult.data) return null

  return {
    competency: compResult.data,
    questions: (questionsResult.data ?? []) as AssessmentQuestion[],
  }
}
