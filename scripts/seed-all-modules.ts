import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type SectionInput = { section_order: number; title: string; body: string }
type QuestionInput = {
  question: string
  options: string[]
  correct_index: number
  question_order: number
}
type ModuleInput = { title: string; sections: SectionInput[]; questions: QuestionInput[] }

const MODULES: ModuleInput[] = [
  // --- Module 1: BLS ---
  {
    title: "Basic Life Support (BLS) — Theory",
    sections: [], // already seeded
    questions: [
      {
        question: "What is the correct rate for chest compressions in adult CPR?",
        options: ["60–80 per minute", "80–100 per minute", "100–120 per minute", "120–140 per minute"],
        correct_index: 2,
        question_order: 1,
      },
      {
        question: "How deep should chest compressions be in an adult patient?",
        options: ["2–3 cm", "3–4 cm", "5–6 cm", "7–8 cm"],
        correct_index: 2,
        question_order: 2,
      },
      {
        question: "What is the correct ratio of chest compressions to rescue breaths in adult CPR?",
        options: ["15:2", "30:2", "20:2", "10:1"],
        correct_index: 1,
        question_order: 3,
      },
      {
        question: "A patient is found unresponsive and making occasional gasps. What is the correct interpretation?",
        options: [
          "The patient is breathing and does not need CPR",
          "This is agonal breathing — treat as cardiac arrest",
          "Give oxygen only and monitor",
          "Wait 30 seconds to assess further",
        ],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "You are alone and an AED arrives during CPR. What should you do?",
        options: [
          "Stop CPR, attach the AED pads, and wait for the machine to analyse",
          "Continue CPR until a second rescuer arrives to attach the AED",
          "Attach the AED pads while continuing compressions, then pause for analysis",
          "Delay AED use until the team arrives",
        ],
        correct_index: 2,
        question_order: 5,
      },
      {
        question: "Scenario: You are passing the medical ward when you see a patient slumped in a chair and unresponsive. There are no other staff in sight. What is your FIRST action?",
        options: [
          "Begin chest compressions immediately",
          "Check for a pulse for up to 60 seconds",
          "Shout for help and check for normal breathing (no more than 10 seconds)",
          "Run to the nurses station to call for a crash team",
        ],
        correct_index: 2,
        question_order: 6,
      },
    ],
  },

  // --- Module 2: IPC ---
  {
    title: "Infection Prevention and Control",
    sections: [
      {
        section_order: 1,
        title: "Why IPC Matters",
        body: `Healthcare-associated infections (HAIs) cause significant patient harm worldwide — and they are largely preventable.\n\nIn Nigeria, HAIs contribute to extended hospital stays, increased treatment costs, and preventable deaths. Resource constraints in many facilities make effective IPC practice even more critical: when isolation rooms are limited and PPE must be used carefully, technique becomes your primary line of defence.\n\nKey facts:\n- The WHO estimates that 1 in 10 patients in low- and middle-income countries acquires an HAI during hospital care\n- Surgical site infections, bloodstream infections, and pneumonia are the most common HAIs in Nigerian hospitals\n- Proper hand hygiene alone can reduce HAI rates by up to 50%\n\nAs a healthcare professional, your IPC practice protects your patients, your colleagues, and yourself. Every contact is a potential transmission event — and every contact is also an opportunity to break the chain of infection.`,
      },
      {
        section_order: 2,
        title: "Standard Precautions and Hand Hygiene",
        body: `Standard precautions are the foundation of IPC. They apply to ALL patients in ALL settings, regardless of diagnosis or perceived infection risk.\n\nStandard precautions include:\n- Hand hygiene\n- Personal protective equipment (PPE)\n- Safe handling and disposal of sharps\n- Safe handling of clinical waste\n- Environmental cleaning and decontamination\n- Respiratory hygiene and cough etiquette\n\nWHO 5 Moments for Hand Hygiene:\n1. Before touching a patient\n2. Before a clean or aseptic procedure\n3. After body fluid exposure\n4. After touching a patient\n5. After touching a patient's surroundings\n\nHand hygiene technique:\n- Alcohol-based hand rub (ABHR): 6-step technique, 20–30 seconds\n- Soap and water: 6-step technique, 40–60 seconds\n- Use soap and water when hands are visibly soiled, and after caring for patients with C. difficile or Norovirus\n\nPPE selection:\n- Gloves: when contact with blood, body fluids, or non-intact skin is anticipated\n- Apron/gown: when clothing may become contaminated\n- Surgical mask: when within 1 metre of a patient with respiratory symptoms\n- Eye protection: when splashing is anticipated`,
      },
      {
        section_order: 3,
        title: "Transmission-Based Precautions",
        body: `When standard precautions are insufficient for a patient with a known or suspected infection, transmission-based precautions are applied in addition.\n\nContact precautions (e.g. MRSA, C. difficile, wound infections)\n- Single room if available\n- Gloves and gown on entry\n- Dedicated equipment (stethoscope, BP cuff) kept in the room\n- Hand hygiene on exit\n\nDroplet precautions (e.g. influenza, meningococcal disease)\n- Single room or cohort nursing\n- Surgical mask when within 1 metre\n- Patient wears a surgical mask when being transported\n\nAirborne precautions (e.g. tuberculosis, chickenpox, measles)\n- Negative pressure room where available\n- FFP2/FFP3 respirator (not a surgical mask) for staff\n- Door kept closed\n- Patient movement restricted; patient wears surgical mask when outside room\n\nReflective prompt: Think about a patient you have cared for who required isolation. Were the correct precautions in place throughout their care? Were there any gaps that in hindsight could have been avoided?`,
      },
      {
        section_order: 4,
        title: "Waste Management, Sharps Safety, and Clinical Scenario",
        body: `Clinical waste categories and colour coding (Nigeria):\n- Yellow: infectious/clinical waste (body parts, contaminated dressings)\n- Yellow with black stripe: cytotoxic waste\n- Black: domestic/general waste\n- White/clear: sharps containers\n\nClinical waste should never be placed in general waste bags. Overfull waste containers are a sharps injury risk — seal and replace at 75% full.\n\nSharps safety:\n- Never re-sheath a needle by hand — use a single-handed technique or a safety device if available\n- Dispose of sharps immediately at the point of use\n- Never pass sharps hand-to-hand — place them in a safe zone first\n- If a sharps injury occurs: encourage bleeding, wash with soap and water, report immediately and follow your facility's needlestick protocol\n\nClinical Scenario:\nA patient is admitted to your ward with a productive cough, night sweats, and weight loss. A chest X-ray shows cavitating lesions. Tuberculosis is suspected. Walk through the precautions you would apply:\n1. Initiate airborne precautions immediately — do not wait for confirmation\n2. Place the patient in a single room with the door closed\n3. All staff entering must wear an FFP2/FFP3 respirator — not a surgical mask\n4. Inform the infection control team\n5. Contact trace — identify other patients and staff who may have been exposed before isolation`,
      },
    ],
    questions: [
      {
        question: "According to the WHO, at which moment should hand hygiene be performed BEFORE touching a patient?",
        options: [
          "After touching their surroundings",
          "Before touching the patient — Moment 1",
          "Only if the patient is known to be infectious",
          "After completing a clinical procedure",
        ],
        correct_index: 1,
        question_order: 1,
      },
      {
        question: "Standard precautions apply to which patients?",
        options: [
          "Only patients with a confirmed infection",
          "Only patients in isolation",
          "All patients regardless of diagnosis or infection status",
          "Only patients requiring invasive procedures",
        ],
        correct_index: 2,
        question_order: 2,
      },
      {
        question: "Which type of precaution requires an FFP2 or FFP3 respirator (not a surgical mask)?",
        options: ["Contact precautions", "Droplet precautions", "Standard precautions", "Airborne precautions"],
        correct_index: 3,
        question_order: 3,
      },
      {
        question: "When should soap and water be used instead of alcohol-based hand rub?",
        options: [
          "Before every patient contact",
          "When hands are visibly soiled or after caring for a patient with C. difficile",
          "Only when ABHR is not available",
          "Soap and water and ABHR are always interchangeable",
        ],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "What should you do immediately after sustaining a needlestick injury?",
        options: [
          "Apply a tourniquet and wait for occupational health",
          "Encourage bleeding, wash with soap and water, and report immediately",
          "Apply alcohol hand rub to the wound site",
          "Complete an incident form before seeking treatment",
        ],
        correct_index: 1,
        question_order: 5,
      },
      {
        question: "Scenario: You are preparing to cannulate a patient who has suspected MRSA but is awaiting swab results. What precautions should you apply?",
        options: [
          "Standard precautions only — wait for confirmed results before escalating",
          "Contact precautions immediately — gloves and apron, dedicated equipment",
          "Airborne precautions — MRSA is transmitted by the respiratory route",
          "No additional precautions — MRSA is only a risk during wound care",
        ],
        correct_index: 1,
        question_order: 6,
      },
    ],
  },

  // --- Module 3: Safeguarding ---
  {
    title: "Safeguarding Awareness",
    sections: [
      {
        section_order: 1,
        title: "What Safeguarding Means in Healthcare",
        body: `Safeguarding means protecting people's right to live in safety, free from abuse and neglect. In a healthcare setting, this duty extends to every patient — not just those who are obviously vulnerable.\n\nSafeguarding applies to:\n- Adults who may be at risk of abuse due to age, illness, disability, or social circumstances\n- Children and young people in the care environment or accompanying patients\n- People who lack capacity to make decisions about their own safety\n\nAs a healthcare professional, you have a duty of care to your patients. This includes noticing signs that something may be wrong, taking action, and reporting concerns through the correct channels.\n\nSafeguarding in Nigeria operates within a framework that includes the Child Rights Act (2003), the Violence Against Persons Prohibition Act (2015), and institutional policies at facility level. Your responsibility exists regardless of whether formal systems are functioning well — inaction is never a neutral choice.`,
      },
      {
        section_order: 2,
        title: "Recognising Abuse and Neglect",
        body: `Abuse can take many forms. Healthcare workers are often among the first — and sometimes the only — professionals who see patients regularly enough to notice changes.\n\nPhysical abuse\n- Unexplained or poorly explained bruising, burns, or injuries\n- Injuries inconsistent with the stated cause\n- Bruising in areas rarely injured accidentally (inner arms, torso, back of legs, neck)\n- Repeated presentations with injuries\n\nEmotional and psychological abuse\n- Unexplained withdrawal, low self-esteem, or fear in the presence of a specific person\n- Patient is prevented from speaking alone with healthcare staff\n- A carer or family member who speaks for the patient and answers all questions\n\nFinancial abuse\n- Patient appears poorly nourished or unclean despite having family support\n- Unusual anxiety about money or possessions\n- Signs of misuse of a patient's funds or assets\n\nNeglect\n- Pressure sores that could have been prevented with adequate care\n- Severe dehydration or malnutrition in a cared-for person\n- Lack of essential medical aids (glasses, hearing aids, medication)\n\nReflective prompt: Think of a patient in your care recently. Were there any signs you noticed — or questions you did not ask — that might have been worth following up?`,
      },
      {
        section_order: 3,
        title: "Your Responsibilities and Reporting",
        body: `If you have a safeguarding concern, you must act. Inaction is not neutrality — it allows harm to continue.\n\nWhat to do when you have a concern:\n1. Do not ignore it. Your instinct matters — if something feels wrong, it may well be\n2. Document what you have observed factually — stick to what you saw or heard, not your interpretation\n3. Report to your line manager or the designated safeguarding lead at your facility — do not investigate alone\n4. Do not confront the alleged abuser\n5. Do not promise the patient confidentiality — explain that you may need to share information to keep them safe\n\nConfidentiality in safeguarding:\nPatient confidentiality is not absolute. Information can and must be shared without consent when:\n- There is a serious risk of harm to the patient or others\n- A crime has been committed or is likely to be committed\n- A child is at risk\n\nDo not let fear of breaking confidentiality prevent you from acting. The duty to protect outweighs the duty of confidentiality in these circumstances.`,
      },
      {
        section_order: 4,
        title: "Safeguarding in the Nigerian Context and Clinical Scenario",
        body: `Safeguarding in Nigeria involves navigating cultural norms around family authority, gender dynamics, and community ties. These factors do not change your duty, but they do shape how you approach it.\n\nCultural considerations:\n- In many Nigerian families, decisions about a patient's care are made collectively — but this does not mean an individual patient has no right to safety or privacy\n- Spousal or parental authority over a patient's choices does not extend to allowing abuse or neglect\n- Concerns about community shame or "family matters" being kept private should not prevent appropriate reporting\n- The presence of many family members can sometimes make it harder to speak with a patient alone — this is a reason to make time for a private conversation, not a reason to abandon it\n\nClinical Scenario:\nAn elderly patient has been admitted three times in four months with falls and minor injuries. Each time, a family member provides an explanation. On this admission, you notice the patient appears frightened when the family member is present and becomes calmer when they leave the room. You manage to speak with the patient alone briefly, and they say "I don't want to cause problems."\n\nWhat do you do?\n1. Document your observations factually in the patient's notes\n2. Report your concern to your ward manager or safeguarding lead — do not wait for proof\n3. Do not pressure the patient to make a statement, but explain that you are there to help keep them safe\n4. Follow your facility's safeguarding pathway`,
      },
    ],
    questions: [
      {
        question: "Which of the following is a recognised indicator of physical abuse?",
        options: [
          "A patient who is quiet and cooperative",
          "Unexplained bruising on the inner arms, torso, or back of the legs",
          "A patient who always has family members present",
          "A patient who declines certain foods",
        ],
        correct_index: 1,
        question_order: 1,
      },
      {
        question: "Can you share a patient's information without their consent in a safeguarding situation?",
        options: [
          "No — patient confidentiality is absolute",
          "Yes — information can be shared when there is a serious risk of harm to the patient or others",
          "Only with the patient's family's permission",
          "Only after obtaining legal advice",
        ],
        correct_index: 1,
        question_order: 2,
      },
      {
        question: "If you have a safeguarding concern about a patient, what should you do first?",
        options: [
          "Investigate the situation yourself before involving others",
          "Confront the person you suspect of causing harm",
          "Document your observations and report to your ward manager or safeguarding lead",
          "Wait until you have definitive proof before taking action",
        ],
        correct_index: 2,
        question_order: 3,
      },
      {
        question: "Which of the following describes financial abuse?",
        options: [
          "A patient spending their own money on items their family disapproves of",
          "A carer misusing a patient's funds, pressuring them to sign over assets, or stealing from them",
          "A patient refusing to pay their medical bills",
          "A family argument about how to spend money",
        ],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "Scenario: A patient's family member insists on speaking for the patient and refuses to leave during your assessment. The patient appears anxious. What is your priority?",
        options: [
          "Accept the family member's presence — cultural norms must be respected",
          "Make time to speak with the patient privately and document your observations",
          "Complete the assessment quickly and escalate later",
          "Ask the family member to explain the patient's condition",
        ],
        correct_index: 1,
        question_order: 5,
      },
    ],
  },

  // --- Module 4: Medicines Management ---
  {
    title: "Medicines Management — Fundamentals",
    sections: [
      {
        section_order: 1,
        title: "The Five Rights of Medicines Administration",
        body: `Every medicine administration carries the risk of harm if done incorrectly. The Five Rights provide a systematic check that must be applied before giving any medication to any patient.\n\nThe Five Rights are:\n1. Right Patient — verify identity using at least two identifiers (name and date of birth, or hospital number)\n2. Right Drug — confirm the medicine name against the prescription; be aware of look-alike, sound-alike drugs\n3. Right Dose — confirm the dose is appropriate for this patient; consider weight, renal function, age\n4. Right Route — confirm the route (oral, IV, IM, SC, topical) matches the prescription and is appropriate\n5. Right Time — confirm the frequency and timing; check when the last dose was given\n\nA sixth right is increasingly recognised: the Right Documentation — record administration immediately after giving, not before.\n\nThe Five Rights are not a one-time check — they must be applied at every step: when preparing the drug, at the bedside before administration, and immediately after.`,
      },
      {
        section_order: 2,
        title: "Reading Prescriptions and Identifying Errors",
        body: `Prescriptions in Nigerian hospitals may be written by hand or electronically. Both carry risk — handwritten prescriptions risk illegibility and misinterpretation, and electronic systems can carry over errors from copy-and-paste.\n\nCommon prescription errors to watch for:\n- Illegible handwriting — always clarify if in doubt; never guess\n- Unusual dose — a dose significantly higher or lower than typical for that drug and indication should be questioned\n- Wrong route — particularly dangerous for intrathecal vs intravenous routes\n- Missing allergy documentation — always check the patient's allergy status\n- Ambiguous units — "U" for units can be misread as a zero; "IU" for international units can be misread as "IV"\n\nCommon abbreviations:\n- OD — once daily\n- BD — twice daily\n- TDS — three times daily\n- QDS — four times daily\n- PRN — as needed\n- IV — intravenous\n- IM — intramuscular\n- SC — subcutaneous\n- PO — by mouth (oral)\n\nIf you cannot read a prescription clearly, or if anything about it seems unusual, query it with the prescriber before administering. You are never obliged to administer a drug you are uncertain about.`,
      },
      {
        section_order: 3,
        title: "High-Risk Medications",
        body: `Certain medicines carry a disproportionate risk of patient harm if administered incorrectly. These are called high-alert or high-risk medicines and require additional checks before administration.\n\nInsulin\n- Dose errors can cause life-threatening hypoglycaemia\n- Always requires an independent double-check by a second nurse before administration\n- Never drawn up in advance or left unattended\n- Confirm blood glucose reading and prescribed dose before injecting\n\nOpioids (morphine, pethidine, tramadol)\n- Controlled drugs — must be stored in a double-locked cabinet\n- Counted and signed for by two nurses at every drug round\n- Monitor for respiratory depression, especially after first dose or dose increase\n- Never administer without a current pain assessment\n\nAnticoagulants (heparin, warfarin)\n- Dose depends on regular blood tests (INR for warfarin, APTT for heparin)\n- Administer only after reviewing current results — administer a dose based on old results could cause major bleeding\n- Bleeding risk: check for signs of unexpected bruising, haematuria, melaena\n\nConcentrated electrolytes (potassium chloride, concentrated sodium)\n- Must never be given undiluted by bolus injection\n- Must only be administered in diluted form via controlled infusion\n- Storage should be segregated from other IV fluids to prevent administration errors`,
      },
      {
        section_order: 4,
        title: "Documentation, Adverse Reactions, and Clinical Scenario",
        body: `Documentation is not bureaucracy — it is a safety mechanism. Accurate records prevent duplicate doses, allow handover teams to continue safe care, and provide a legal record of your practice.\n\nRules for medication documentation:\n- Sign for a drug immediately after administration — never in advance\n- If a drug is not given, record the reason using the correct code (e.g., patient refused, drug unavailable, held on medical advice)\n- Never alter a record retrospectively without clearly marking it as a late entry\n- Transcription errors (copying a prescription incorrectly onto the administration record) are a significant cause of harm — check every entry\n\nRecognising and responding to adverse drug reactions (ADRs):\n- An ADR is any harmful or unintended response to a medicine\n- Common signs: rash, urticaria, nausea, vomiting, hypotension, altered consciousness\n- Anaphylaxis is a medical emergency: administer IM adrenaline (epinephrine) without delay if suspected\n- Report ADRs using your facility's incident reporting system and where possible to the national pharmacovigilance centre\n\nClinical Scenario:\nYou are preparing to administer the morning insulin dose to a diabetic patient. The prescription reads "Actrapid 40 units SC." The patient weighs 55 kg and their morning blood glucose was 6.2 mmol/L. The dose appears unusually high for a blood glucose that is already within a normal range.\n\nWhat do you do?\n1. Do not administer the dose\n2. Re-check the prescription for errors — could "40 units" be a misread of "4 units"?\n3. Contact the prescriber immediately and query the dose\n4. Document your query and the prescriber's response\n5. Administer only once a revised or confirmed prescription is issued`,
      },
    ],
    questions: [
      {
        question: "What are the Five Rights of medicines administration?",
        options: [
          "Right patient, right drug, right dose, right route, right time",
          "Right patient, right drug, right dose, right nurse, right time",
          "Right patient, right drug, right dose, right time, right documentation",
          "Right drug, right dose, right route, right time, right documentation",
        ],
        correct_index: 0,
        question_order: 1,
      },
      {
        question: "A prescription reads a dose that appears unusually high for the patient's weight. What should you do?",
        options: [
          "Administer it — the prescriber is responsible for the dose",
          "Halve the dose as a precaution",
          "Query the dose with the prescriber before administering",
          "Omit the dose and inform the patient",
        ],
        correct_index: 2,
        question_order: 2,
      },
      {
        question: "Which medication requires an independent double-check by a second nurse before every administration?",
        options: ["Paracetamol", "Amoxicillin", "Insulin", "Metronidazole"],
        correct_index: 2,
        question_order: 3,
      },
      {
        question: "What does PRN mean on a prescription?",
        options: ["Per routine nursing", "Proceed as required now", "As needed", "Post-renal nutrition"],
        correct_index: 2,
        question_order: 4,
      },
      {
        question: "Where must controlled drugs be stored?",
        options: [
          "In the medication trolley with the other drugs",
          "In a locked cupboard in the ward sister's office",
          "In a double-locked cabinet",
          "In the patient's bedside locker for convenience",
        ],
        correct_index: 2,
        question_order: 5,
      },
      {
        question: "Scenario: A patient develops urticaria and has difficulty breathing shortly after you administer a new antibiotic. What is your immediate priority?",
        options: [
          "Administer an antihistamine and monitor for 30 minutes",
          "Stop the infusion and call the prescriber",
          "Treat as suspected anaphylaxis — call for emergency help and administer IM adrenaline",
          "Complete the infusion and document the reaction afterwards",
        ],
        correct_index: 2,
        question_order: 6,
      },
    ],
  },

  // --- Module 5: Health and Safety ---
  {
    title: "Health and Safety Awareness",
    sections: [
      {
        section_order: 1,
        title: "Your Rights and Responsibilities",
        body: `Health and safety in the workplace is a shared responsibility — not something that happens to you, but something you actively participate in.\n\nYour employer's duties include:\n- Providing a safe working environment and equipment\n- Conducting risk assessments for hazardous tasks\n- Providing appropriate training for your role\n- Investigating accidents and near-misses\n- Providing personal protective equipment at no cost to you\n\nYour responsibilities include:\n- Following safe systems of work and using PPE correctly\n- Reporting hazards, accidents, and near-misses\n- Cooperating with investigations and not tampering with evidence\n- Not putting yourself or others at unnecessary risk\n- Taking reasonable care of your own health and safety\n\nIn Nigeria, workplace health and safety is governed by the Factories Act, the Workmen's Compensation Act, and facility-specific policies. Whether or not enforcement is consistent, your obligations as a professional remain.`,
      },
      {
        section_order: 2,
        title: "Hazard Identification in Clinical Settings",
        body: `A hazard is anything with the potential to cause harm. Healthcare environments contain a wide range of hazards that must be identified and managed.\n\nBiological hazards\n- Exposure to blood, body fluids, and infectious agents\n- The most significant occupational health risk in clinical settings\n- Managed through standard precautions, PPE, and immunisation\n\nChemical hazards\n- Cleaning agents, disinfectants, cytotoxic drugs, latex\n- Managed through correct storage, handling procedures, and PPE\n- Material Safety Data Sheets (MSDS) should be available for all chemicals used\n\nPhysical hazards\n- Slips, trips, and falls (wet floors, cluttered corridors, poor lighting)\n- Sharps injuries\n- Noise and radiation\n\nErgonomic hazards\n- Repetitive movements, awkward postures, manual handling\n- A leading cause of musculoskeletal injury in healthcare workers\n\nPsychosocial hazards\n- Violence and aggression from patients or visitors\n- Stress, burnout, and fatigue\n- These are occupational health issues, not personal failings — report them\n\nReflective prompt: What hazards did you encounter in the last week at work? Were they managed appropriately?`,
      },
      {
        section_order: 3,
        title: "Risk Assessment Basics",
        body: `Risk assessment is the process of identifying hazards and evaluating the risk they pose, so that appropriate controls can be put in place.\n\nThe five-step framework:\n\n1. Identify the hazard\nWhat could cause harm? Walk through the area or task and look systematically.\n\n2. Decide who might be harmed and how\nConsider staff, patients, visitors, and contractors. Consider specific vulnerabilities (pregnant staff, workers with health conditions).\n\n3. Evaluate the risks and decide on controls\nHow likely is harm to occur? How severe would it be? Controls should be applied in this order of preference: eliminate > substitute > engineer out > administrative controls > PPE.\n\n4. Record your findings\nDocument what you found and what you did about it. This provides a legal record and helps monitor changes over time.\n\n5. Review and update\nRisk assessments are not one-off documents. Review them when circumstances change, after an incident, or at least annually.\n\nAs a ward-level staff member, you may not conduct formal risk assessments yourself, but you are expected to understand the process and contribute to it when asked.`,
      },
      {
        section_order: 4,
        title: "Incident Reporting and Clinical Scenario",
        body: `Incident reporting is one of the most important safety activities in healthcare — and one of the most underused.\n\nWhat should be reported:\n- Any accident or injury to a patient, staff member, or visitor\n- Near-misses: events that almost caused harm but did not\n- Dangerous occurrences: events with significant harm potential\n- Hazardous conditions you cannot remedy yourself\n\nWhy near-misses matter:\nNear-misses reveal that something in the system is not working as intended. Reporting them allows the problem to be fixed before someone is harmed. Research consistently shows that major incidents are preceded by multiple unreported near-misses.\n\nHow to report:\n- Use your facility's incident report form\n- Be factual: what happened, when, where, who was involved, what was done\n- Do not assign blame in the initial report — focus on the event\n- Submit promptly — within the same shift if possible\n\nClinical Scenario:\nYou arrive on your ward and notice a wet floor outside the sluice room. A yellow warning sign is folded in the corner but has not been placed over the wet area. Staff and patients are walking through the wet zone.\n\nWhat is your immediate action?\n1. Place the wet floor sign immediately — do not leave the hazard unguarded while you find someone else\n2. Identify and address the source of the water if safe to do so\n3. Report the hazard to your line manager\n4. Document the hazard and your actions on an incident form`,
      },
    ],
    questions: [
      {
        question: "Which category of hazard poses the greatest occupational health risk in clinical settings?",
        options: ["Chemical hazards", "Biological hazards", "Physical hazards", "Ergonomic hazards"],
        correct_index: 1,
        question_order: 1,
      },
      {
        question: "What are the five steps of a risk assessment?",
        options: [
          "Identify hazard, assess severity, implement PPE, train staff, review annually",
          "Identify hazard, decide who might be harmed, evaluate risks and controls, record findings, review and update",
          "Spot the risk, report it, investigate it, eliminate it, document it",
          "Identify hazard, isolate the area, retrain staff, review with management, close the risk",
        ],
        correct_index: 1,
        question_order: 2,
      },
      {
        question: "Why is it important to report near-misses?",
        options: [
          "It is required by the hospital's legal team",
          "Near-misses reveal system weaknesses before harm occurs",
          "To identify staff who made errors",
          "Near-misses that cause no harm do not need to be reported",
        ],
        correct_index: 1,
        question_order: 3,
      },
      {
        question: "Which of the following is your responsibility as a healthcare worker under health and safety law?",
        options: [
          "Conducting formal risk assessments for your ward",
          "Following safe systems of work, using PPE, and reporting hazards",
          "Providing PPE to other staff members",
          "Investigating all incidents that occur on your shift",
        ],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "Scenario: You see a fire exit being propped open by a medical equipment trolley on your ward. What should you do?",
        options: [
          "Leave it — the trolley will be moved when staff finish using it",
          "Remove the obstruction, restore the fire exit, and report it to your manager",
          "Document it in the patient notes",
          "Call the fire brigade immediately",
        ],
        correct_index: 1,
        question_order: 5,
      },
    ],
  },

  // --- Module 6: Manual Handling ---
  {
    title: "Manual Handling — Theory",
    sections: [
      {
        section_order: 1,
        title: "Why Manual Handling Matters",
        body: `Musculoskeletal disorders (MSDs) caused by manual handling are the leading cause of work-related illness among healthcare workers globally — and among Nigerian nurses in particular.\n\nThe scale of the problem:\n- Back injury is the most common reason for long-term sickness absence in nursing\n- Many injuries accumulate gradually over years of poor technique, becoming apparent only after the damage is done\n- A significant proportion of nurses retire early or change careers due to chronic back pain\n\nManual handling in healthcare includes:\n- Lifting, lowering, pushing, pulling, carrying, or supporting patients\n- Moving equipment, supplies, or linen\n- Repositioning patients in bed or chairs\n\nThe consequences of poor technique extend beyond you:\n- An injured healthcare worker cannot provide care\n- Sudden technique failures (sudden lifts, drops) can injure patients\n- Rushed or short-staffed handling leads to risk-taking that causes injury\n\nPrevention is always better than injury management. This module gives you the knowledge to protect yourself and your patients through correct technique and decision-making.`,
      },
      {
        section_order: 2,
        title: "Legislation and Principles",
        body: `Manual handling in healthcare is governed by both legislation and professional guidance.\n\nKey principles:\n- Avoid manual handling of patients where practicable — use equipment instead\n- Assess risk before every handling task\n- Use the minimum force necessary\n- Work with other staff — never attempt patient moves alone\n- Use equipment provided — hoists, slide sheets, transfer boards\n- Never lift a patient manually who cannot weight-bear\n\nEmployer duties:\n- Provide appropriate manual handling equipment\n- Ensure adequate staffing levels for safe handling\n- Provide training on manual handling technique\n- Conduct and review risk assessments for handling tasks\n\nYour duties:\n- Follow safe handling procedures\n- Use equipment provided\n- Report defective equipment immediately\n- Report any musculoskeletal pain or injury early — before it becomes severe\n- Never put your body at risk to avoid inconveniencing a patient or colleague`,
      },
      {
        section_order: 3,
        title: "The TILE Framework",
        body: `Before any manual handling task, apply the TILE risk assessment framework:\n\nT — Task\nWhat are you doing? Does the task involve holding a load at a distance from the body, twisting, stooping, or repetitive movements? Can the task be redesigned to reduce risk?\n\nI — Individual\nWho is doing it? Do they have sufficient strength, fitness, and training for this task? Are there any health conditions, pregnancy, or recent injuries that affect capacity? Is the individual working alone?\n\nL — Load\nWhat is being moved? For patients: consider their weight, their ability to cooperate, any tubes, drains, or lines, their level of consciousness. Is the load unstable or unpredictable?\n\nE — Environment\nWhat is the space like? Is there enough room to move safely? Is the floor wet, uneven, or cluttered? Is the bed at the right height? Is lighting adequate?\n\nTILE is not a form — it is a way of thinking. Apply it before every patient move, not just for formal documented assessments.\n\nIf the TILE assessment reveals significant risk, stop and address it before proceeding. Identify what additional resources, equipment, or staff are needed.`,
      },
      {
        section_order: 4,
        title: "Safe Technique and Clinical Scenario",
        body: `Safe moving and handling technique principles:\n\nStable base of support\n- Feet hip-width apart, one foot slightly forward\n- Bend at the hips and knees, not the back\n- Keep the spine in neutral alignment — no twisting\n- Hold the load close to your body\n- Pivot with your feet, not your spine, to change direction\n\nWhen repositioning a patient in bed (two or more handlers):\n1. Assess the patient first — their weight, ability to assist, any contraindications\n2. Adjust the bed to the correct working height (waist height for standing tasks)\n3. Use slide sheets to reduce friction where appropriate\n4. Brief the patient — explain what you are about to do\n5. Coordinate the move with your colleague — one person leads\n6. Move smoothly and avoid jerking\n\nNever-do-alone situations:\n- Any patient who cannot weight-bear\n- Any patient who has unpredictable movements (e.g. seizure history)\n- Any patient who is significantly heavier than normal handling guidelines\n- Any patient move from a position on the floor\n\nClinical Scenario:\nYou are working the night shift and need to reposition a post-operative patient in bed. You are the only nurse currently available on the ward. The patient weighs approximately 90 kg and is conscious but unable to assist significantly due to pain.\n\nWhat is your decision-making process?\n1. Apply TILE — the task requires repositioning; the individual (you alone) is insufficient; the load (90 kg, limited cooperation) is high risk; the environment is the ward bed\n2. TILE assessment outcome: this task cannot safely be done alone\n3. Call for assistance — another nurse from an adjacent ward, a healthcare assistant, or a member of the medical team on the ward\n4. Ensure the patient is safe in their current position while you wait\n5. Do not attempt the move alone, even if the patient is uncomfortable`,
      },
    ],
    questions: [
      {
        question: "What does TILE stand for in manual handling risk assessment?",
        options: [
          "Task, Individuals, Load, Equipment",
          "Task, Individual, Load, Environment",
          "Training, Individual, Lifting, Equipment",
          "Task, Instruction, Load, Ergonomics",
        ],
        correct_index: 1,
        question_order: 1,
      },
      {
        question: "Is it acceptable to manually lift a patient alone if they cannot weight-bear?",
        options: [
          "Yes, if the patient is light enough",
          "Yes, if there is no equipment available",
          "No — all patient moves where weight-bearing is not possible require two staff or appropriate equipment",
          "Yes, if the patient gives consent",
        ],
        correct_index: 2,
        question_order: 2,
      },
      {
        question: "What is the correct posture when performing a manual handling task?",
        options: [
          "Bend at the waist, keeping legs straight",
          "Wide stance, feet hip-width apart, knees slightly bent, spine neutral",
          "Stand with feet together and twist to move the load",
          "Keep the load at arm's length to protect the back",
        ],
        correct_index: 1,
        question_order: 3,
      },
      {
        question: "When must a hoist be used for patient handling?",
        options: [
          "Only when the patient weighs over 100 kg",
          "Only when requested by the patient",
          "When a patient cannot weight-bear, or when manual handling would put staff at significant risk",
          "Only when two nurses are available",
        ],
        correct_index: 2,
        question_order: 4,
      },
      {
        question: "Scenario: You need to move a patient from their bed to a chair. While preparing, you realise the hoist battery is dead and there is no charged replacement immediately available. What should you do?",
        options: [
          "Proceed with a manual lift using two nurses",
          "Ask the patient to stand and pivot, even if they are partially weight-bearing",
          "Delay the transfer until a charged hoist is available; ensure the patient is safe and comfortable",
          "Use a standard chair to push the patient across the floor",
        ],
        correct_index: 2,
        question_order: 5,
      },
    ],
  },

  // --- Module 7: CPR ---
  {
    title: "Cardiopulmonary Resuscitation (CPR) — Practical",
    sections: [
      {
        section_order: 1,
        title: "What the Practical Assessment Tests",
        body: `This module cannot replace a practical CPR sign-off. Its purpose is to prepare you for your practical assessment and ensure you understand what assessors look for.\n\nThe practical CPR assessment tests your ability to:\n- Recognise a simulated cardiac arrest quickly and correctly\n- Respond safely (scene safety, call for help)\n- Perform high-quality chest compressions at the correct rate and depth\n- Deliver effective rescue breaths (or explain compression-only CPR)\n- Use an AED safely and correctly\n- Communicate clearly in a simulated team scenario\n\nWhy this matters beyond the assessment:\nThe practical assessment exists because CPR is a perishable skill. Research shows that technique degrades significantly within 6–12 months of training without refresher practice. The goal of this module is not to help you pass a test — it is to ensure that when you face a real cardiac arrest, your response is automatic, correct, and effective.\n\nMost common reasons for assessment failure:\n- Compression depth too shallow (under 5 cm)\n- Compression rate too fast (above 120/min) or too slow (below 100/min)\n- Insufficient chest recoil between compressions\n- Long pauses in compressions (over 10 seconds)\n- Failure to check for normal breathing correctly\n- Failure to shout for help before beginning CPR`,
      },
      {
        section_order: 2,
        title: "Adult CPR Technique Review",
        body: `This section reviews the critical performance standards for adult CPR.\n\nRecognition (must be done within 10 seconds):\n- Unresponsive to voice and touch\n- Absent or abnormal breathing (gasps, agonal breathing)\n- Do not delay CPR to check for a pulse — this causes harmful compression pauses\n\nChest compressions:\n- Position: heel of hand on the lower half of the sternum; second hand on top; fingers interlaced\n- Rate: 100–120 per minute (set a mental metronome)\n- Depth: 5–6 cm — this is deeper than most people expect\n- Recoil: allow the chest to fully recoil after each compression — do not lean\n- Interruptions: no pause should exceed 10 seconds\n\nRescue breaths:\n- Head tilt–chin lift to open airway\n- 1-second delivery — watch for visible chest rise\n- If the first breath does not go in, re-tilt and retry once only — do not interrupt compressions for more than 10 seconds\n\nCommon errors to avoid:\n- Compressions that are too shallow (most common)\n- Bouncing or jabbing movements (reduces depth and recoil)\n- Leaning on the chest during recoil (prevents refilling)\n- Excessive pause after each breath before resuming compressions`,
      },
      {
        section_order: 3,
        title: "Paediatric CPR Differences",
        body: `The principles of CPR are the same for all ages, but the technique differs for infants and children.\n\nInfants (under 1 year):\n- Check for response: tap the foot (do not shake the head)\n- Breathing check: look, listen, feel — same 10-second limit\n- Compressions: use two fingers (index and middle) on the centre of the chest\n- Compression depth: one-third of the chest depth (approximately 4 cm)\n- Rate: 100–120 per minute (same as adults)\n- Ratio: 30:2 for single rescuer; 15:2 for two-rescuer paediatric CPR\n- Breaths: gentle puffs — only enough to see the chest rise\n\nChildren (1 year to puberty):\n- Compressions: one or two hands (depending on size of child)\n- Compression depth: one-third of the chest depth\n- Rate: 100–120 per minute\n- Ratio: 30:2 for single rescuer; 15:2 for two-rescuer paediatric CPR\n\nKey differences from adult:\n- Two-finger technique (infants) instead of heel of hand\n- Depth is relative to chest size, not an absolute figure\n- 15:2 ratio in two-rescuer paediatric CPR (not 30:2)\n- AED use: paediatric pads/mode for under 8 years if available\n\nIf you are in doubt about the size of the child, use adult technique — the risk of over-treatment is lower than the risk of under-treatment.`,
      },
      {
        section_order: 4,
        title: "Two-Rescuer CPR, Role Clarity, and Clinical Scenario",
        body: `In a hospital setting, resuscitation should rarely be a single-rescuer effort. Effective team CPR requires clear communication and defined roles.\n\nTwo-rescuer CPR roles:\n- Compressor: performs chest compressions; changes every 2 minutes to prevent fatigue\n- Ventilator: manages the airway and delivers rescue breaths; can also operate the AED\n- Team leader (if present): directs the resuscitation, delegates tasks, calls time, makes decisions\n\nHandover between compressors:\n- Announce the handover: "Changing compressors — ready, now"\n- Maintain the 30:2 rhythm; the swap should take less than 5 seconds\n- The incoming compressor takes over without interrupting the count\n\nAED operation in a team:\n- Attach pads without interrupting compressions\n- When the AED is ready to analyse, announce "Stand clear" — everyone stops contact with the patient\n- Resume compressions immediately after shock delivery; do not wait to check for pulse\n- Compressions continue during charging in some protocols — follow your facility's guidance\n\nClinical Scenario:\nYou are performing chest compressions during a cardiac arrest on your ward. The team leader asks you to hand over to a colleague who has just arrived. You have been compressing for approximately 90 seconds.\n\nDescribe exactly what you do:\n1. Announce: "Ready to hand over — [colleague's name], are you ready?"\n2. On confirmation, complete the current compression set\n3. At a natural pause (e.g. before the next two breaths), say "Changing now"\n4. Your colleague places hands on the chest immediately and takes over\n5. You move to the head end to assist with airway management or prepare the defibrillator\n6. Entire handover should take under 5 seconds with no prolonged pause in compressions`,
      },
    ],
    questions: [
      {
        question: "What is the most common reason candidates fail a practical CPR assessment?",
        options: [
          "Incorrect hand position",
          "Compression depth too shallow (under 5 cm)",
          "Not calling for help",
          "Breathing technique errors",
        ],
        correct_index: 1,
        question_order: 1,
      },
      {
        question: "How often should compressors switch during two-rescuer CPR?",
        options: ["Every 5 minutes", "Every 2 minutes", "Every 10 minutes", "Only when the compressor asks to stop"],
        correct_index: 1,
        question_order: 2,
      },
      {
        question: "When performing CPR on an infant, which technique should be used for chest compressions?",
        options: [
          "Heel of one hand on the sternum",
          "Both hands interlaced",
          "Two fingers (index and middle) on the centre of the chest",
          "Palm of one hand only",
        ],
        correct_index: 2,
        question_order: 3,
      },
      {
        question: "What is the maximum acceptable pause in chest compressions?",
        options: ["5 seconds", "10 seconds", "15 seconds", "20 seconds"],
        correct_index: 1,
        question_order: 4,
      },
      {
        question: "In two-rescuer CPR with a child, what is the correct compression-to-breath ratio?",
        options: ["30:2", "15:2", "20:2", "10:1"],
        correct_index: 1,
        question_order: 5,
      },
      {
        question: "Scenario: You are in a team resuscitation and the AED announces it is ready to analyse. What is the immediate action for ALL team members?",
        options: [
          "Continue compressions while the AED analyses",
          "Stand clear — no one touches the patient during analysis",
          "The ventilator continues airway management while the compressor stops",
          "Only the person operating the AED needs to stand back",
        ],
        correct_index: 1,
        question_order: 6,
      },
    ],
  },
]

async function seedModule(mod: ModuleInput) {
  const { data: competency } = await supabase
    .from("competencies")
    .select("id")
    .eq("title", mod.title)
    .single()

  if (!competency) {
    console.log(`✗ Competency not found: ${mod.title}`)
    return
  }

  // Sections
  if (mod.sections.length > 0) {
    const { count } = await supabase
      .from("module_sections")
      .select("*", { count: "exact", head: true })
      .eq("competency_id", competency.id)

    if (count && count > 0) {
      console.log(`✓ Sections already exist for: ${mod.title}`)
    } else {
      const { error } = await supabase.from("module_sections").insert(
        mod.sections.map((s) => ({ ...s, competency_id: competency.id }))
      )
      if (error) {
        console.log(`✗ Section insert error for ${mod.title}: ${error.message}`)
      } else {
        console.log(`✓ Seeded ${mod.sections.length} sections for: ${mod.title}`)
      }
    }
  } else {
    console.log(`→ Skipping sections for: ${mod.title} (none defined)`)
  }

  // Questions
  const { count: qCount } = await supabase
    .from("assessment_questions")
    .select("*", { count: "exact", head: true })
    .eq("competency_id", competency.id)

  if (qCount && qCount > 0) {
    console.log(`✓ Questions already exist for: ${mod.title}`)
  } else {
    const { error } = await supabase.from("assessment_questions").insert(
      mod.questions.map((q) => ({ ...q, competency_id: competency.id }))
    )
    if (error) {
      console.log(`✗ Question insert error for ${mod.title}: ${error.message}`)
    } else {
      console.log(`✓ Seeded ${mod.questions.length} questions for: ${mod.title}`)
    }
  }
}

async function main() {
  console.log("Seeding all module content...\n")
  for (const mod of MODULES) {
    await seedModule(mod)
  }
  console.log("\nDone.")
}

main().catch(console.error)
