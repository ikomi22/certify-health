import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log("Seeding Certify Health demo database...\n");

  // ── Facility ──────────────────────────────────────────────
  let facility;
  const { data: existingFacility } = await supabase
    .from("facilities")
    .select()
    .eq("name", "Federal Medical Centre, Asaba")
    .single();

  if (existingFacility) {
    facility = existingFacility;
    console.log(`✓ Facility already exists: ${facility.name}`);
  } else {
    const { data, error } = await supabase
      .from("facilities")
      .insert({ name: "Federal Medical Centre, Asaba", state: "Delta", lga: "Asaba" })
      .select()
      .single();
    if (error) throw new Error(`facility: ${error.message}`);
    facility = data;
    console.log(`✓ Facility created: ${facility.name} (${facility.id})`);
  }

  // ── Competencies ──────────────────────────────────────────
  const competencyData = [
    { title: "Basic Life Support (BLS) — Theory", description: "Core life support skills including CPR, AED use, and the chain of survival.", validity_months: 12, estimated_minutes: 45 },
    { title: "Infection Prevention and Control", description: "Standard precautions, hand hygiene, PPE use, and outbreak response.", validity_months: 12, estimated_minutes: 30 },
    { title: "Safeguarding Awareness", description: "Recognising and responding to abuse, neglect, and safeguarding concerns.", validity_months: 24, estimated_minutes: 25 },
    { title: "Medicines Management — Fundamentals", description: "Safe administration, storage, and documentation of medicines.", validity_months: 12, estimated_minutes: 35 },
    { title: "Health and Safety Awareness", description: "Workplace hazards, incident reporting, and fire safety procedures.", validity_months: 12, estimated_minutes: 20 },
    { title: "Manual Handling — Theory", description: "Principles of safe moving and handling to prevent musculoskeletal injury.", validity_months: 12, estimated_minutes: 25 },
  ];

  const { data: existingComps } = await supabase.from("competencies").select();
  let competencies;

  if (existingComps && existingComps.length > 0) {
    competencies = existingComps;
    console.log(`✓ ${competencies.length} competencies already exist`);
  } else {
    const { data, error } = await supabase.from("competencies").insert(competencyData).select();
    if (error) throw new Error(`competencies: ${error.message}`);
    competencies = data;
    console.log(`✓ ${competencies.length} competencies created`);
  }

  const byTitle = Object.fromEntries(competencies.map((c: any) => [c.title, c]));
  const bls = byTitle["Basic Life Support (BLS) — Theory"];

  // ── BLS module sections ───────────────────────────────────
  const { count: sectionCount } = await supabase
    .from("module_sections")
    .select("*", { count: "exact", head: true })
    .eq("competency_id", bls.id);

  if (sectionCount && sectionCount > 0) {
    console.log(`✓ BLS sections already exist`);
  } else {
    const sections = [
      {
        competency_id: bls.id,
        section_order: 1,
        title: "The Chain of Survival",
        body: `The Chain of Survival describes the sequence of actions that, when performed quickly and effectively, give a cardiac arrest victim the best chance of survival.\n\nThe four links are:\n\n1. **Early recognition and call for help** — Recognise cardiac arrest and activate emergency services immediately. Every minute without CPR reduces survival by 7–10%.\n\n2. **Early CPR** — High-quality cardiopulmonary resuscitation buys time by maintaining circulation to the brain and heart until a defibrillator is available.\n\n3. **Early defibrillation** — Most adult sudden cardiac arrests are caused by ventricular fibrillation (VF). Defibrillation is the only effective treatment for VF.\n\n4. **Post-resuscitation care** — After return of spontaneous circulation (ROSC), the patient requires specialised care to optimise recovery and prevent re-arrest.\n\nIn a hospital setting, a fifth link is often added: **prevention** — identifying deteriorating patients early using NEWS2 (National Early Warning Score) before cardiac arrest occurs.`,
      },
      {
        competency_id: bls.id,
        section_order: 2,
        title: "Scene Safety and Initial Assessment",
        body: `Before approaching any collapsed person, follow the DRS ABC approach:\n\n**D — Danger**\nCheck the scene is safe for you, bystanders, and the patient. Do not put yourself at risk.\n\n**R — Response**\nGently shake the patient's shoulders and shout: "Are you alright?" If no response, shout for help immediately.\n\n**S — Shout for help**\nCall out for assistance. In a clinical setting, activate the emergency buzzer or call 2222 (crash team). Send someone to retrieve the AED.\n\n**A — Airway**\nOpen the airway using the head-tilt chin-lift technique:\n- Place one hand on the forehead and tilt the head back\n- Lift the chin with two fingers of your other hand\n- Remove visible obstructions from the mouth — do not perform a blind finger sweep\n\n**B — Breathing**\nLook, listen, and feel for normal breathing for no more than 10 seconds.\n- Look for chest rise\n- Listen for breath sounds\n- Feel for air on your cheek\n\nOccasional gasps (agonal breathing) are NOT normal breathing — treat as cardiac arrest.\n\n**C — Circulation / CPR**\nIf not breathing normally, begin CPR immediately.`,
      },
      {
        competency_id: bls.id,
        section_order: 3,
        title: "Chest Compressions",
        body: `High-quality chest compressions are the most critical component of CPR. Poor technique dramatically reduces survival rates.\n\n**Positioning**\n- Place the heel of one hand on the centre of the chest (lower half of the sternum)\n- Place your other hand on top and interlace fingers\n- Keep arms straight, shoulders directly over your hands\n- Do not apply pressure to the ribs, upper abdomen, or bottom of the sternum\n\n**Rate**\n- 100–120 compressions per minute\n- This is roughly the tempo of "Stayin' Alive" by the Bee Gees\n\n**Depth**\n- Compress the chest 5–6 cm (approximately 2 inches) in adults\n- Allow full chest recoil after each compression — do not lean on the chest\n\n**Ratio**\n- 30 compressions : 2 rescue breaths (30:2)\n- Minimise interruptions — pause compressions for no more than 10 seconds when giving breaths\n\n**Fatigue**\nCompressor fatigue reduces effectiveness rapidly. Switch compressors every 2 minutes if help is available, with minimal interruption to compressions.\n\n**Compression-only CPR**\nIf you are unwilling or unable to give rescue breaths, continuous chest compressions alone are far better than no CPR.`,
      },
      {
        competency_id: bls.id,
        section_order: 4,
        title: "Airway Management and Rescue Breaths",
        body: `**Rescue breaths (mouth-to-mouth)**\n\nAfter every 30 compressions:\n1. Maintain head-tilt chin-lift\n2. Pinch the soft part of the patient's nose closed\n3. Take a normal breath and seal your lips around the patient's mouth\n4. Breathe out steadily over 1 second — watch for chest rise\n5. Allow the chest to fall, then give a second breath\n6. Return to compressions without delay\n\nIf the first breath does not cause chest rise, recheck the airway position before attempting a second breath. Do not attempt more than two breaths per cycle.\n\n**Pocket mask**\nIn clinical settings, a pocket mask or bag-valve-mask (BVM) should be used instead of mouth-to-mouth to provide a protective barrier and allow supplemental oxygen.\n\n**BVM technique**\n- Apply the mask firmly over the nose and mouth (E-C grip)\n- Squeeze the bag to deliver approximately 500–600 ml (enough to see chest rise)\n- Two-person BVM use improves seal and tidal volume delivery\n\n**Airway adjuncts**\n- Oropharyngeal airway (OPA/Guedel): used in unconscious patients without a gag reflex\n- Nasopharyngeal airway (NPA): tolerated by patients with a gag reflex\n\nDo not delay compressions to secure an advanced airway during basic life support.`,
      },
      {
        competency_id: bls.id,
        section_order: 5,
        title: "AED Use and Handover",
        body: `**Automated External Defibrillator (AED)**\n\nAn AED analyses the heart rhythm and delivers a shock if indicated. They are designed for use by untrained bystanders — follow the voice prompts.\n\n**Steps:**\n1. Power on the AED (open lid or press button)\n2. Attach pads as shown in the diagram — one below the right collarbone, one to the left side of the chest below the armpit\n3. Ensure no one is touching the patient while the AED analyses rhythm\n4. If a shock is advised — stand clear, ensure no one is touching, press the shock button\n5. Immediately resume CPR after the shock — 30:2 for 2 minutes, then allow AED to re-analyse\n6. If no shock is advised — resume CPR immediately\n\n**Safety**\n- Remove any medication patches from the chest before applying pads\n- Do not use an AED in standing water\n- Pads can be used over an implanted pacemaker — place the pad at least 8 cm away\n\n**Handover to the crash team**\nWhen the crash team arrives, give a clear SBAR handover:\n- **Situation:** Patient found in cardiac arrest\n- **Background:** Brief medical history if known\n- **Assessment:** Time of arrest, number of CPR cycles, shocks delivered\n- **Recommendation:** Continue resuscitation / consider reversible causes (4 Hs and 4 Ts)\n\nContinue CPR until the team is ready to take over — do not stop until explicitly instructed.`,
      },
    ];
    const { error } = await supabase.from("module_sections").insert(sections);
    if (error) throw new Error(`sections: ${error.message}`);
    console.log(`✓ ${sections.length} BLS module sections created`);
  }

  // ── BLS assessment questions ──────────────────────────────
  const { count: qCount } = await supabase
    .from("assessment_questions")
    .select("*", { count: "exact", head: true })
    .eq("competency_id", bls.id);

  if (qCount && qCount > 0) {
    console.log(`✓ BLS assessment questions already exist`);
  } else {
    const questions = [
      { competency_id: bls.id, question_order: 1, question: "What is the correct compression rate for adult CPR?", options: ["60–80 compressions per minute", "80–100 compressions per minute", "100–120 compressions per minute", "120–140 compressions per minute"], correct_index: 2 },
      { competency_id: bls.id, question_order: 2, question: "What is the correct compression depth for an adult?", options: ["2–3 cm", "3–4 cm", "5–6 cm", "7–8 cm"], correct_index: 2 },
      { competency_id: bls.id, question_order: 3, question: "What compression-to-breath ratio is used in adult CPR?", options: ["15:2", "30:2", "15:1", "30:1"], correct_index: 1 },
      { competency_id: bls.id, question_order: 4, question: "Agonal breathing in a collapsed patient means you should:", options: ["Place the patient in the recovery position", "Wait and monitor breathing for 30 seconds", "Treat as cardiac arrest and begin CPR", "Give oxygen and reassess in 5 minutes"], correct_index: 2 },
      { competency_id: bls.id, question_order: 5, question: "Which of the following is the correct order of the Chain of Survival?", options: ["Defibrillation → CPR → Call for help → Post-resuscitation care", "Call for help → CPR → Defibrillation → Post-resuscitation care", "CPR → Call for help → Defibrillation → Post-resuscitation care", "Call for help → Defibrillation → CPR → Post-resuscitation care"], correct_index: 1 },
      { competency_id: bls.id, question_order: 6, question: "Where should AED pads be placed on an adult?", options: ["Both pads on the left side of the chest", "One below the right collarbone, one to the left side below the armpit", "One on the upper chest, one on the lower abdomen", "Both pads on the upper chest"], correct_index: 1 },
      { competency_id: bls.id, question_order: 7, question: "How long should you check for normal breathing before starting CPR?", options: ["No more than 5 seconds", "No more than 10 seconds", "No more than 20 seconds", "No more than 30 seconds"], correct_index: 1 },
    ];
    const { error } = await supabase.from("assessment_questions").insert(questions);
    if (error) throw new Error(`questions: ${error.message}`);
    console.log(`✓ ${questions.length} BLS assessment questions created`);
  }

  // ── Staff ─────────────────────────────────────────────────
  const staff: Array<{
    email: string;
    full_name: string;
    cadre: string;
    ward: string;
    role: string;
    competency_statuses: Record<string, { status: string; completed_at?: string; expires_at?: string }>;
  }> = [
    {
      email: "adaeze.okonkwo@fmcasaba.gov.ng", full_name: "Adaeze Okonkwo", cadre: "Registered Nurse", ward: "Medical Ward B", role: "worker",
      competency_statuses: {
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-11-10", expires_at: "2026-11-10" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-09-05", expires_at: "2027-09-05" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-10-22", expires_at: "2026-10-22" },
        "Basic Life Support (BLS) — Theory": { status: "overdue", completed_at: "2024-04-15", expires_at: "2025-04-15" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "matron.ibrahim@fmcasaba.gov.ng", full_name: "Hauwa Ibrahim", cadre: "Registered Nurse", ward: "Administration", role: "admin",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-06-01", expires_at: "2026-06-01" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-06-01", expires_at: "2026-06-01" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-06-01", expires_at: "2027-06-01" },
        "Medicines Management — Fundamentals": { status: "complete", completed_at: "2025-06-01", expires_at: "2026-06-01" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-06-01", expires_at: "2026-06-01" },
        "Manual Handling — Theory": { status: "complete", completed_at: "2025-06-01", expires_at: "2026-06-01" },
      },
    },
    {
      email: "chidi.okafor@fmcasaba.gov.ng", full_name: "Chidi Okafor", cadre: "Registered Nurse", ward: "Surgical Ward A", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-08-12", expires_at: "2026-08-12" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-08-12", expires_at: "2026-08-12" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-08-12", expires_at: "2027-08-12" },
        "Medicines Management — Fundamentals": { status: "complete", completed_at: "2025-08-12", expires_at: "2026-08-12" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-08-12", expires_at: "2026-08-12" },
        "Manual Handling — Theory": { status: "complete", completed_at: "2025-08-12", expires_at: "2026-08-12" },
      },
    },
    {
      email: "blessing.eze@fmcasaba.gov.ng", full_name: "Blessing Eze", cadre: "Midwife", ward: "Maternity Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-07-20", expires_at: "2026-07-20" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-07-20", expires_at: "2026-07-20" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-07-20", expires_at: "2027-07-20" },
        "Medicines Management — Fundamentals": { status: "complete", completed_at: "2025-07-20", expires_at: "2026-07-20" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-07-20", expires_at: "2026-07-20" },
        "Manual Handling — Theory": { status: "complete", completed_at: "2025-07-20", expires_at: "2026-07-20" },
      },
    },
    {
      email: "funke.adeyemi@fmcasaba.gov.ng", full_name: "Funke Adeyemi", cadre: "Registered Nurse", ward: "Medical Ward A", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "overdue", completed_at: "2024-03-10", expires_at: "2025-03-10" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-09-14", expires_at: "2026-09-14" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-09-14", expires_at: "2027-09-14" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-09-14", expires_at: "2026-09-14" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "emeka.nwosu@fmcasaba.gov.ng", full_name: "Emeka Nwosu", cadre: "Registered Nurse", ward: "Emergency", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "overdue", completed_at: "2024-01-08", expires_at: "2025-01-08" },
        "Infection Prevention and Control": { status: "overdue", completed_at: "2024-05-20", expires_at: "2025-05-20" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "amina.bello@fmcasaba.gov.ng", full_name: "Amina Bello", cadre: "Midwife", ward: "Maternity Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "not_started" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-10-01", expires_at: "2026-10-01" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-10-01", expires_at: "2027-10-01" },
        "Medicines Management — Fundamentals": { status: "in_progress" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-10-01", expires_at: "2026-10-01" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "grace.okeke@fmcasaba.gov.ng", full_name: "Grace Okeke", cadre: "Midwife", ward: "Antenatal Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "overdue", completed_at: "2024-02-14", expires_at: "2025-02-14" },
        "Infection Prevention and Control": { status: "overdue", completed_at: "2024-02-14", expires_at: "2025-02-14" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-11-03", expires_at: "2027-11-03" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "tunde.afolabi@fmcasaba.gov.ng", full_name: "Tunde Afolabi", cadre: "Registered Nurse", ward: "Paediatric Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-05-30", expires_at: "2026-05-30" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-05-30", expires_at: "2026-05-30" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "in_progress" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-05-30", expires_at: "2026-05-30" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "ngozi.nnaji@fmcasaba.gov.ng", full_name: "Ngozi Nnaji", cadre: "CHEW", ward: "Outpatient", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "not_started" },
        "Infection Prevention and Control": { status: "not_started" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "ibrahim.musa@fmcasaba.gov.ng", full_name: "Ibrahim Musa", cadre: "CHEW", ward: "Outpatient", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "not_started" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-08-05", expires_at: "2026-08-05" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-08-05", expires_at: "2026-08-05" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "chioma.nze@fmcasaba.gov.ng", full_name: "Chioma Nze", cadre: "Registered Nurse", ward: "Surgical Ward B", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-12-01", expires_at: "2026-12-01" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-12-01", expires_at: "2026-12-01" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-12-01", expires_at: "2027-12-01" },
        "Medicines Management — Fundamentals": { status: "complete", completed_at: "2025-12-01", expires_at: "2026-12-01" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-12-01", expires_at: "2026-12-01" },
        "Manual Handling — Theory": { status: "overdue", completed_at: "2024-06-10", expires_at: "2025-06-10" },
      },
    },
    {
      email: "fatima.yusuf@fmcasaba.gov.ng", full_name: "Fatima Yusuf", cadre: "Midwife", ward: "Postnatal Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "overdue", completed_at: "2024-07-22", expires_at: "2025-07-22" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-11-15", expires_at: "2026-11-15" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-11-15", expires_at: "2026-11-15" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "kelechi.obiora@fmcasaba.gov.ng", full_name: "Kelechi Obiora", cadre: "Registered Nurse", ward: "Medical Ward A", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "in_progress" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-10-10", expires_at: "2026-10-10" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-10-10", expires_at: "2027-10-10" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-10-10", expires_at: "2026-10-10" },
        "Manual Handling — Theory": { status: "complete", completed_at: "2025-10-10", expires_at: "2026-10-10" },
      },
    },
    {
      email: "yetunde.ogundimu@fmcasaba.gov.ng", full_name: "Yetunde Ogundimu", cadre: "Registered Nurse", ward: "Emergency", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-04-18", expires_at: "2026-04-18" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-04-18", expires_at: "2026-04-18" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "complete", completed_at: "2025-04-18", expires_at: "2026-04-18" },
        "Health and Safety Awareness": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "patience.ojo@fmcasaba.gov.ng", full_name: "Patience Ojo", cadre: "CHEW", ward: "Paediatric Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "not_started" },
        "Infection Prevention and Control": { status: "overdue", completed_at: "2024-09-30", expires_at: "2025-09-30" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "uche.onwudiwe@fmcasaba.gov.ng", full_name: "Uche Onwudiwe", cadre: "Registered Nurse", ward: "Surgical Ward A", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "overdue", completed_at: "2024-11-05", expires_at: "2025-11-05" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2026-01-10", expires_at: "2027-01-10" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2026-01-10", expires_at: "2028-01-10" },
        "Medicines Management — Fundamentals": { status: "complete", completed_at: "2026-01-10", expires_at: "2027-01-10" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2026-01-10", expires_at: "2027-01-10" },
        "Manual Handling — Theory": { status: "complete", completed_at: "2026-01-10", expires_at: "2027-01-10" },
      },
    },
    {
      email: "mary.obi@fmcasaba.gov.ng", full_name: "Mary Obi", cadre: "Midwife", ward: "Maternity Ward", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "not_started" },
        "Infection Prevention and Control": { status: "not_started" },
        "Safeguarding Awareness": { status: "not_started" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "not_started" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "suleiman.garba@fmcasaba.gov.ng", full_name: "Suleiman Garba", cadre: "CHEW", ward: "Outpatient", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "not_started" },
        "Infection Prevention and Control": { status: "not_started" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-03-22", expires_at: "2027-03-22" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-03-22", expires_at: "2026-03-22" },
        "Manual Handling — Theory": { status: "not_started" },
      },
    },
    {
      email: "rose.okorie@fmcasaba.gov.ng", full_name: "Rose Okorie", cadre: "Registered Nurse", ward: "Medical Ward B", role: "worker",
      competency_statuses: {
        "Basic Life Support (BLS) — Theory": { status: "complete", completed_at: "2025-09-08", expires_at: "2026-09-08" },
        "Infection Prevention and Control": { status: "complete", completed_at: "2025-09-08", expires_at: "2026-09-08" },
        "Safeguarding Awareness": { status: "complete", completed_at: "2025-09-08", expires_at: "2027-09-08" },
        "Medicines Management — Fundamentals": { status: "not_started" },
        "Health and Safety Awareness": { status: "complete", completed_at: "2025-09-08", expires_at: "2026-09-08" },
        "Manual Handling — Theory": { status: "complete", completed_at: "2025-09-08", expires_at: "2026-09-08" },
      },
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const worker of staff) {
    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: worker.email,
      password: "CertifyDemo2026!",
      email_confirm: true,
    });

    if (authErr) {
      if (authErr.message.includes("already been registered")) {
        skipped++;
        continue;
      }
      throw new Error(`auth ${worker.email}: ${authErr.message}`);
    }

    const userId = authData.user.id;

    const { error: profErr } = await supabase.from("profiles").insert({
      id: userId,
      email: worker.email,
      full_name: worker.full_name,
      cadre: worker.cadre,
      ward: worker.ward,
      facility_id: facility.id,
      role: worker.role,
    });
    if (profErr) throw new Error(`profile ${worker.email}: ${profErr.message}`);

    const wcRows = Object.entries(worker.competency_statuses)
      .map(([title, rec]) => {
        const comp = byTitle[title];
        if (!comp) return null;
        return {
          user_id: userId,
          competency_id: comp.id,
          status: rec.status,
          completed_at: rec.completed_at ?? null,
          expires_at: rec.expires_at ?? null,
        };
      })
      .filter(Boolean);

    const { error: wcErr } = await supabase.from("worker_competencies").insert(wcRows);
    if (wcErr) throw new Error(`worker_competencies ${worker.email}: ${wcErr.message}`);

    created++;
    process.stdout.write(`  ${worker.full_name}\n`);
  }

  console.log(`\n✓ ${created} staff created, ${skipped} skipped (already exist)`);
  console.log("\nSeed complete.");
  console.log("\nDemo credentials (password: CertifyDemo2026!)");
  console.log("  Worker:  adaeze.okonkwo@fmcasaba.gov.ng");
  console.log("  Matron:  matron.ibrahim@fmcasaba.gov.ng");
}

seed().catch((err) => {
  console.error("\nSeed failed:", err.message);
  process.exit(1);
});
