import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seedCpr() {
  console.log("Seeding CPR competency...\n");

  // ── Competency ───────────────────────────────────────────────
  let cpr: any;
  const { data: existing } = await supabase
    .from("competencies")
    .select()
    .eq("title", "Cardiopulmonary Resuscitation (CPR) — Practical")
    .single();

  if (existing) {
    cpr = existing;
    console.log("✓ CPR competency already exists");
  } else {
    const { data, error } = await supabase
      .from("competencies")
      .insert({
        title: "Cardiopulmonary Resuscitation (CPR) — Practical",
        description: "Hands-on CPR technique including chest compressions, rescue breaths, and AED operation in simulated clinical scenarios.",
        validity_months: 12,
        estimated_minutes: 30,
      })
      .select()
      .single();
    if (error) throw new Error(`competency: ${error.message}`);
    cpr = data;
    console.log(`✓ CPR competency created (${cpr.id})`);
  }

  // ── Assessment questions ──────────────────────────────────────
  const { count: qCount } = await supabase
    .from("assessment_questions")
    .select("*", { count: "exact", head: true })
    .eq("competency_id", cpr.id);

  if (qCount && qCount > 0) {
    console.log(`✓ CPR questions already exist (${qCount})`);
  } else {
    const questions = [
      {
        question_order: 1,
        question: "Where should you place your hands when performing chest compressions on an adult?",
        options: [
          "On the upper half of the sternum",
          "On the lower half of the sternum, in the centre of the chest",
          "On the left side of the chest over the heart",
          "On the lower abdomen, just below the ribcage",
        ],
        correct_index: 1,
      },
      {
        question_order: 2,
        question: "A defibrillator arrives while you are performing CPR. What should you do?",
        options: [
          "Stop CPR, attach the pads, and wait for the machine to analyse before doing anything else",
          "Continue CPR while a second rescuer attaches the pads, then pause only when the AED instructs",
          "Give two rescue breaths first, then attach the pads",
          "Only use the AED if the patient does not respond to five minutes of CPR",
        ],
        correct_index: 1,
      },
      {
        question_order: 3,
        question: "Which of the following indicates that CPR is being performed effectively?",
        options: [
          "The patient regains consciousness",
          "The patient's skin colour improves and you can feel a carotid pulse between compressions",
          "The chest rises visibly with each compression",
          "The patient begins to breathe normally",
        ],
        correct_index: 2,
      },
      {
        question_order: 4,
        question: "When is it appropriate to stop CPR?",
        options: [
          "After five minutes if there is no response",
          "When you are physically exhausted, with no one available to take over",
          "When a senior clinician makes the decision to stop, the patient shows signs of life, or a Do Not Resuscitate order is confirmed",
          "As soon as the defibrillator delivers a shock",
        ],
        correct_index: 2,
      },
      {
        question_order: 5,
        question: "A pregnant patient at 28 weeks is found in cardiac arrest. What modification is required during CPR?",
        options: [
          "Reduce compression depth to 3 cm to protect the foetus",
          "Manually displace the uterus to the left to relieve aortocaval compression",
          "Use a compression rate of 80 per minute rather than 100–120",
          "No modifications are required — standard adult CPR guidelines apply",
        ],
        correct_index: 1,
      },
      {
        question_order: 6,
        question: "What is 'hands-only CPR' and when is it recommended?",
        options: [
          "CPR using one hand only, recommended for children",
          "Continuous chest compressions without rescue breaths, recommended when the rescuer is unwilling or unable to give breaths",
          "CPR performed with gloves, recommended in all clinical settings",
          "A technique used only by trained paramedics",
        ],
        correct_index: 1,
      },
    ];

    const rows = questions.map((q) => ({ ...q, competency_id: cpr.id }));
    const { error } = await supabase.from("assessment_questions").insert(rows);
    if (error) throw new Error(`questions: ${error.message}`);
    console.log(`✓ ${rows.length} CPR questions created`);
  }

  // ── Worker competency records ─────────────────────────────────
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, role");

  if (!allProfiles) throw new Error("Could not fetch profiles");

  const statuses: Array<{ status: string; completed_at?: string; expires_at?: string }> = [
    { status: "complete",    completed_at: "2025-10-15", expires_at: "2026-10-15" },
    { status: "complete",    completed_at: "2025-11-20", expires_at: "2026-11-20" },
    { status: "complete",    completed_at: "2026-01-08", expires_at: "2027-01-08" },
    { status: "overdue",     completed_at: "2024-06-10", expires_at: "2025-06-10" },
    { status: "overdue",     completed_at: "2024-09-01", expires_at: "2025-09-01" },
    { status: "not_started" },
    { status: "not_started" },
    { status: "in_progress" },
  ];

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < allProfiles.length; i++) {
    const profile = allProfiles[i];
    const { count } = await supabase
      .from("worker_competencies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("competency_id", cpr.id);

    if (count && count > 0) {
      skipped++;
      continue;
    }

    let rec: { status: string; completed_at?: string; expires_at?: string };

    if (profile.email === "adaeze.okonkwo@fmcasaba.gov.ng") {
      rec = { status: "not_started" };
    } else if (profile.role === "admin") {
      rec = { status: "complete", completed_at: "2025-06-01", expires_at: "2026-06-01" };
    } else {
      rec = statuses[i % statuses.length];
    }

    const { error } = await supabase.from("worker_competencies").insert({
      user_id: profile.id,
      competency_id: cpr.id,
      status: rec.status,
      completed_at: rec.completed_at ?? null,
      expires_at: rec.expires_at ?? null,
    });

    if (error) throw new Error(`wc ${profile.email}: ${error.message}`);
    created++;
    process.stdout.write(`  ${profile.full_name} — ${rec.status}\n`);
  }

  console.log(`\n✓ ${created} worker records created, ${skipped} skipped`);
  console.log("\nCPR seed complete.");
}

seedCpr().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
