import { createClient } from "@/lib/supabase/server"

export type AssessmentQuestion = {
  id: string
  question: string
  options: string[]
  correct_index: number
  question_order: number
}

export type ModuleSection = {
  id: string
  section_order: number
  title: string
  body: string
}

export type ModuleData = {
  competency: {
    id: string
    title: string
    estimated_minutes: number
    description: string | null
    validity_months: number
  }
  sections: ModuleSection[]
  questions: AssessmentQuestion[]
}

export async function getModuleData(competencyId: string): Promise<ModuleData | null> {
  const supabase = createClient()

  const [compResult, sectionsResult, questionsResult] = await Promise.all([
    supabase
      .from("competencies")
      .select("id, title, estimated_minutes, description, validity_months")
      .eq("id", competencyId)
      .single(),
    supabase
      .from("module_sections")
      .select("id, section_order, title, body")
      .eq("competency_id", competencyId)
      .order("section_order"),
    supabase
      .from("assessment_questions")
      .select("id, question, options, correct_index, question_order")
      .eq("competency_id", competencyId)
      .order("question_order"),
  ])

  if (!compResult.data) return null

  return {
    competency: compResult.data,
    sections: (sectionsResult.data ?? []) as ModuleSection[],
    questions: (questionsResult.data ?? []) as AssessmentQuestion[],
  }
}
