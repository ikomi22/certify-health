export type ModuleIntro = {
  objectives: string[]
  why_matters: string
  explanations: Record<number, string>
}

const CONTENT: Record<string, ModuleIntro> = {
  "Basic Life Support (BLS) — Theory": {
    objectives: [
      "Recognise cardiac arrest and activate the emergency response without delay",
      "Perform high-quality CPR at the correct rate, depth, and ratio",
      "Describe the role of an AED and the steps for safe use",
    ],
    why_matters: "Cardiac arrest can happen anywhere — including on your ward. Every minute without CPR reduces survival by 7–10%. As a healthcare professional, you are often the first person on scene. This module gives you the knowledge to act decisively and correctly when it matters most.",
    explanations: {
      1: "The correct rate is 100–120 compressions per minute — fast enough to maintain circulation but not so fast that compressions become shallow.",
      2: "Chest compressions should be 5–6 cm deep in adults. Insufficient depth fails to circulate blood effectively.",
      3: "The ratio of compressions to rescue breaths is 30:2 — 30 compressions followed by 2 breaths, repeated continuously.",
      4: "Agonal breathing (occasional gasps) is NOT normal breathing and should be treated as cardiac arrest.",
      5: "You should not delay CPR to search for or attach an AED — compressions must continue while a second rescuer retrieves it.",
      6: "The Chain of Survival begins with early recognition and calling for help — acting immediately is the most important link.",
    },
  },

  "Infection Prevention and Control": {
    objectives: [
      "Apply standard precautions consistently in all clinical interactions",
      "Select and use appropriate PPE for different transmission risks",
      "Describe correct hand hygiene technique using the WHO 5 Moments",
    ],
    why_matters: "Healthcare-associated infections (HAIs) cause patient harm that is largely preventable. In Nigerian healthcare settings, resource constraints make effective IPC practice even more critical — your technique is often the primary defence. This module ensures your practice meets international standards.",
    explanations: {
      1: "The WHO identifies 5 moments for hand hygiene: before patient contact, before aseptic procedure, after body fluid exposure, after patient contact, and after touching patient surroundings.",
      2: "Standard precautions apply to ALL patients regardless of diagnosis — you cannot tell from appearance who may be infectious.",
      3: "Contact precautions require gloves and gown when entering the patient's room or care environment.",
      4: "Alcohol-based hand rub is effective against most pathogens, but soap and water must be used when hands are visibly soiled or after caring for a patient with C. difficile.",
      5: "Sharps must be disposed of immediately at the point of use — never recap a needle by hand.",
      6: "The correct colour for clinical/infectious waste in Nigerian facilities is yellow — this waste requires high-temperature incineration.",
    },
  },

  "Safeguarding Awareness": {
    objectives: [
      "Identify indicators of abuse or neglect in adults and children",
      "Describe your duty to report safeguarding concerns and who to report to",
      "Apply safeguarding principles sensitively in a Nigerian healthcare context",
    ],
    why_matters: "Safeguarding is everyone's responsibility in healthcare. Vulnerable patients — including elderly adults, children, and those with disabilities — depend on healthcare workers to notice when something is wrong and act on it. Inaction is never neutral: it allows harm to continue.",
    explanations: {
      1: "Unexplained bruising, especially in areas rarely injured accidentally (inner arms, torso, neck), is a recognised indicator of physical abuse.",
      2: "Confidentiality is not absolute in safeguarding — information can be shared without consent when there is a serious risk of harm to the patient or others.",
      3: "You should report concerns to your ward manager or designated safeguarding lead — never investigate alone or confront an alleged abuser directly.",
      4: "Financial abuse includes theft, misuse of funds, or pressure to sign over assets — it is as serious as physical abuse.",
      5: "Cultural or family explanations do not override safeguarding concerns — your duty to the patient is primary.",
    },
  },

  "Medicines Management — Fundamentals": {
    objectives: [
      "Apply the Five Rights of medicines administration in every drug round",
      "Identify and query prescriptions with errors or unusual dosages",
      "Describe the extra precautions required for high-risk medicines",
    ],
    why_matters: "Medication errors are one of the most common causes of preventable patient harm globally. A single error — the wrong drug, wrong dose, or wrong patient — can be fatal. Rigorous adherence to the Five Rights is not bureaucracy: it is what keeps patients safe.",
    explanations: {
      1: "The Five Rights are: right patient, right drug, right dose, right route, right time. All five must be verified before every administration.",
      2: "If a prescribed dose appears unusual for the patient's weight or condition, you must query it with the prescriber before administering — never administer without clarification.",
      3: "Insulin is a high-alert medication requiring a two-nurse independent check before administration — dose errors can cause fatal hypoglycaemia.",
      4: "PRN (pro re nata) means 'as needed' — the drug may only be given when the specified condition is met, not routinely.",
      5: "Controlled drugs must be counted and signed for by two nurses at every handover and must be stored in a double-locked cabinet.",
      6: "An adverse drug reaction must be reported using the facility incident report form and, where applicable, to the national pharmacovigilance system.",
    },
  },

  "Health and Safety Awareness": {
    objectives: [
      "Identify the main categories of hazard in a clinical workplace",
      "Describe how to conduct a basic risk assessment using the five-step framework",
      "Report incidents and near-misses correctly and explain why reporting matters",
    ],
    why_matters: "Healthcare workers face a higher rate of workplace injury than most other professions. Many injuries are preventable. Understanding hazards, assessing risks, and reporting incidents protects you, your colleagues, and your patients — and contributes to a safety culture that improves care over time.",
    explanations: {
      1: "Biological hazards include exposure to bloodborne pathogens, bodily fluids, and infectious agents — the most significant occupational health risk in clinical settings.",
      2: "The five steps of risk assessment are: identify the hazard, decide who might be harmed and how, evaluate the risks and decide on controls, record your findings, review and update.",
      3: "Near-misses must be reported — they reveal system weaknesses before harm occurs. Many major incidents are preceded by multiple unreported near-misses.",
      4: "Your employer has a legal duty to provide a safe workplace, but you have a corresponding duty to follow safe procedures and report hazards you cannot remedy yourself.",
      5: "Fire exits must remain unobstructed at all times — propping them open or blocking them with equipment is a serious safety violation.",
    },
  },

  "Manual Handling — Theory": {
    objectives: [
      "Apply the TILE framework to assess manual handling risk before any task",
      "Describe safe moving and handling principles for patient repositioning",
      "Identify when solo handling is inappropriate and assistance or equipment is required",
    ],
    why_matters: "Musculoskeletal injuries from manual handling are the leading cause of sickness absence among Nigerian nurses. Many injuries accumulate over years of poor technique and become career-ending. Learning to handle patients safely protects your long-term health as much as it protects your patients.",
    explanations: {
      1: "TILE stands for Task, Individual, Load, Environment — all four factors must be assessed before any manual handling task.",
      2: "You should never attempt to manually lift a patient alone — all patient moves require at least two staff or the use of appropriate equipment.",
      3: "The safest base of posture is a wide stance with feet hip-width apart, knees slightly bent, and spine in a neutral (not twisted) position.",
      4: "Hoist equipment must be used for any patient who cannot weight-bear — no manual lift is safe as a substitute for proper equipment.",
      5: "You must not twist your spine while carrying a load — pivot with your feet instead to change direction.",
    },
  },

  "Cardiopulmonary Resuscitation (CPR) — Practical Preparation": {
    objectives: [
      "Describe the critical performance standards assessed in a CPR practical sign-off",
      "Identify the most common errors in CPR technique and how to avoid them",
      "Explain the differences in CPR technique between adults, children, and infants",
    ],
    why_matters: "A theoretical pass in BLS is not the same as competent CPR. This module prepares you for your practical assessment by focusing on what assessors look for and where candidates commonly fail. Treat it as preparation for real resuscitation, not just an exam.",
    explanations: {
      1: "Compression depth of less than 5 cm is the most common reason for failure in CPR assessments — inadequate depth fails to circulate blood effectively.",
      2: "You should switch compressors every 2 minutes to prevent fatigue-related deterioration in compression quality.",
      3: "For infants, use two fingers (not the heel of the hand) for chest compressions, and compress to one-third of the chest depth.",
      4: "Compressions should not be interrupted for more than 10 seconds — even during defibrillation analysis, minimise the pause.",
      5: "In two-rescuer CPR, the ratio remains 30:2 with adult patients — do not switch to 15:2 (which is only used for paediatric two-rescuer CPR).",
      6: "Clear communication between rescuers is an assessed competency — announce when you are taking over compressions and confirm the handover.",
    },
  },
}

export function getModuleIntro(title: string): ModuleIntro | null {
  return CONTENT[title] ?? null
}
