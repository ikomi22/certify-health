import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const QUESTIONS: Record<string, Array<{ question: string; options: string[]; correct_index: number }>> = {
  "Infection Prevention and Control": [
    {
      question: "According to the WHO, how long should effective hand washing with soap and water take?",
      options: ["10–15 seconds", "20–30 seconds", "40–60 seconds", "90 seconds"],
      correct_index: 2,
    },
    {
      question: "Standard precautions apply to:",
      options: ["Only patients with confirmed infections", "Patients who appear unwell", "All patients at all times, regardless of diagnosis", "Only patients on isolation precautions"],
      correct_index: 2,
    },
    {
      question: "Which of the following is NOT one of the WHO's 5 Moments for Hand Hygiene?",
      options: ["Before patient contact", "After removing gloves", "After contact with patient surroundings", "Before an aseptic task"],
      correct_index: 1,
    },
    {
      question: "When should you change gloves between tasks on the same patient?",
      options: ["Never — one pair per patient contact is sufficient", "Only if the gloves are visibly soiled", "Between different care activities on the same patient to prevent cross-contamination", "Only if the patient has a known infection"],
      correct_index: 2,
    },
    {
      question: "A patient has confirmed pulmonary tuberculosis. In addition to standard precautions, which transmission-based precaution is required?",
      options: ["Contact precautions", "Droplet precautions", "Airborne precautions", "No additional precautions are needed"],
      correct_index: 2,
    },
    {
      question: "Which item of PPE should be removed first when leaving an isolation room?",
      options: ["Mask", "Gloves", "Apron", "Eye protection"],
      correct_index: 1,
    },
  ],
  "Safeguarding Awareness": [
    {
      question: "Which of the following best describes 'adult safeguarding'?",
      options: [
        "Ensuring all adults receive regular health checks",
        "Protecting adults at risk from abuse, neglect, and exploitation",
        "Preventing adults from making their own decisions",
        "Monitoring adult patients during hospital stays only",
      ],
      correct_index: 1,
    },
    {
      question: "A patient confides in you that they are being financially abused by a family member. What should you do first?",
      options: [
        "Confront the family member directly",
        "Tell the patient to contact the police themselves",
        "Listen, reassure the patient, and report to your safeguarding lead",
        "Document it in the notes and take no further action",
      ],
      correct_index: 2,
    },
    {
      question: "Which of the following is NOT a recognised category of adult abuse?",
      options: ["Financial abuse", "Emotional abuse", "Professional negligence", "Domestic violence"],
      correct_index: 2,
    },
    {
      question: "If a patient discloses abuse to you, you should:",
      options: [
        "Promise to keep it confidential before they speak",
        "Interrupt frequently to gather as much detail as possible",
        "Listen carefully, not promise confidentiality, and report appropriately",
        "Record the disclosure verbatim before taking any other action",
      ],
      correct_index: 2,
    },
    {
      question: "Safeguarding is the responsibility of:",
      options: [
        "Only the safeguarding lead in each facility",
        "Social workers and senior clinical staff only",
        "Everyone who works with patients — safeguarding is everyone's business",
        "The Federal Ministry of Health",
      ],
      correct_index: 2,
    },
  ],
  "Medicines Management — Fundamentals": [
    {
      question: "Which of the following is one of the 'Five Rights' of safe medication administration?",
      options: ["Right form", "Right prescriber", "Right route", "Right storage temperature"],
      correct_index: 2,
    },
    {
      question: "Before administering any medication you should check:",
      options: [
        "That the medication is the cheapest available option",
        "The patient's identity, the prescription, drug, dose, route, and time",
        "That the pharmacy has approved the prescription in writing",
        "That the patient has eaten a full meal beforehand",
      ],
      correct_index: 1,
    },
    {
      question: "A medication error occurs. What should you do?",
      options: [
        "Monitor the patient and only report if they deteriorate",
        "Tell a colleague but do not document to avoid blame",
        "Report immediately to the responsible clinician, complete an incident form, and document in the patient record",
        "Administer an antidote and continue with the next task",
      ],
      correct_index: 2,
    },
    {
      question: "High-risk medicines such as insulin and anticoagulants require:",
      options: [
        "Administration by a doctor only",
        "Independent double-checking by two registered practitioners before administration",
        "Written consent from the patient before each dose",
        "Storage in a locked refrigerator at all times",
      ],
      correct_index: 1,
    },
    {
      question: "Which information must always appear on a medication prescription?",
      options: [
        "Patient's next of kin and insurance number",
        "Patient's name, date of birth, drug name, dose, route, frequency, and prescriber signature",
        "Ward name, bed number, and patient photograph",
        "Diagnosis and expected length of treatment only",
      ],
      correct_index: 1,
    },
    {
      question: "How should unused or expired medicines be disposed of?",
      options: [
        "Flushed down the sink or toilet",
        "Placed in the general waste bin",
        "Returned to pharmacy or disposed of per the facility's medicines waste policy",
        "Given back to the patient to take home",
      ],
      correct_index: 2,
    },
  ],
  "Health and Safety Awareness": [
    {
      question: "What does a risk assessment involve?",
      options: [
        "Identifying hazards, assessing the likelihood and severity of harm, and implementing controls",
        "Completing an incident report form after an injury has occurred",
        "Listing all equipment in a clinical area",
        "Checking that all staff have completed mandatory training",
      ],
      correct_index: 0,
    },
    {
      question: "Under health and safety law, employees have a duty to:",
      options: [
        "Carry out their own risk assessments without involving management",
        "Take reasonable care of their own health and safety and that of others affected by their work",
        "Report hazards only if they result in injury",
        "Refuse all tasks they consider unsafe without discussion",
      ],
      correct_index: 1,
    },
    {
      question: "Which of the following should be reported as a significant incident?",
      options: [
        "A staff member slips and sustains a fracture",
        "A patient asks for extra blankets",
        "A ward runs low on a non-essential supply",
        "A new staff member starts their first shift",
      ],
      correct_index: 0,
    },
    {
      question: "When should a near-miss be reported?",
      options: [
        "Only if someone was injured",
        "Never — near-misses do not cause harm",
        "Always — near-misses provide an opportunity to prevent future harm",
        "Only if the near-miss was witnessed by a senior staff member",
      ],
      correct_index: 2,
    },
    {
      question: "In the event of a fire, what is the correct order of action?",
      options: [
        "Extinguish, Evacuate, Alert, Contain",
        "Contain, Extinguish, Alert, Evacuate",
        "Alert, Contain, Evacuate, Extinguish",
        "Evacuate, Alert, Contain, Extinguish",
      ],
      correct_index: 2,
    },
  ],
  "Manual Handling — Theory": [
    {
      question: "What does the TILE acronym stand for in manual handling risk assessment?",
      options: [
        "Task, Individual, Load, Environment",
        "Technique, Injury, Lift, Equipment",
        "Task, Injury, Location, Equipment",
        "Training, Individual, Legislation, Environment",
      ],
      correct_index: 0,
    },
    {
      question: "What is the most common injury sustained from poor manual handling?",
      options: ["Shoulder dislocation", "Knee ligament damage", "Musculoskeletal injury to the lower back", "Wrist fracture"],
      correct_index: 2,
    },
    {
      question: "Before moving a patient, you should:",
      options: [
        "Move quickly to minimise disruption to the patient",
        "Assess the task, use appropriate equipment, and ensure enough trained staff are available",
        "Ask the patient to move themselves wherever possible, with no assessment needed",
        "Always use a hoist regardless of the patient's mobility level",
      ],
      correct_index: 1,
    },
    {
      question: "Which of the following is correct technique when lifting a load from the floor?",
      options: [
        "Keep legs straight, bend at the waist, and hold the load away from the body",
        "Bend the knees, keep the back straight, hold the load close to the body",
        "Twist the body to the side to avoid straining the back",
        "Lift quickly to reduce the time the back is under strain",
      ],
      correct_index: 1,
    },
    {
      question: "When should mechanical handling aids (e.g. a hoist) be used?",
      options: [
        "Only as a last resort when staff are unavailable",
        "Whenever a patient is unable to support their own weight fully",
        "Only for patients weighing more than 100 kg",
        "Only in surgical wards",
      ],
      correct_index: 1,
    },
  ],
};

async function seedQuestions() {
  console.log("Seeding assessment questions for remaining competencies...\n");

  const { data: competencies, error } = await supabase
    .from("competencies")
    .select("id, title");

  if (error) throw new Error(`fetch competencies: ${error.message}`);

  const byTitle = Object.fromEntries(competencies.map((c: any) => [c.title, c]));

  for (const [title, questions] of Object.entries(QUESTIONS)) {
    const comp = byTitle[title];
    if (!comp) {
      console.log(`  ✗ Competency not found: ${title}`);
      continue;
    }

    const { count } = await supabase
      .from("assessment_questions")
      .select("*", { count: "exact", head: true })
      .eq("competency_id", comp.id);

    if (count && count > 0) {
      console.log(`  ✓ ${title} — questions already exist (${count})`);
      continue;
    }

    const rows = questions.map((q, i) => ({
      competency_id: comp.id,
      question_order: i + 1,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
    }));

    const { error: insertErr } = await supabase
      .from("assessment_questions")
      .insert(rows);

    if (insertErr) throw new Error(`insert questions for ${title}: ${insertErr.message}`);
    console.log(`  ✓ ${title} — ${rows.length} questions added`);
  }

  console.log("\nDone.");
}

seedQuestions().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
