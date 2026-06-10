import type { InteractiveContent } from "./types"

const PrescriptionSvg = () => (
  <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ maxHeight: 240 }}>
    {/* Paper background */}
    <rect x="20" y="10" width="280" height="200" rx="4" fill="white" stroke="#d1d5db" strokeWidth="1.5" />
    {/* Header band */}
    <rect x="20" y="10" width="280" height="30" rx="4" fill="#f0fdf4" />
    <rect x="20" y="34" width="280" height="6" fill="#f0fdf4" />
    <text x="160" y="30" textAnchor="middle" fill="#166534" fontSize="11" fontWeight="bold">Federal Medical Centre, Asaba — Prescription</text>

    {/* Patient ID row */}
    <rect x="30" y="50" width="120" height="22" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
    <text x="90" y="65" textAnchor="middle" fill="#374151" fontSize="9">Patient: OKONKWO, A — #FMC-8842</text>

    {/* Drug name */}
    <rect x="30" y="82" width="180" height="22" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
    <text x="120" y="97" textAnchor="middle" fill="#1f2937" fontSize="10" fontWeight="bold">Amoxicillin</text>

    {/* Dose */}
    <rect x="30" y="114" width="80" height="22" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
    <text x="70" y="129" textAnchor="middle" fill="#1f2937" fontSize="10">500 mg</text>

    {/* Route */}
    <rect x="120" y="114" width="60" height="22" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
    <text x="150" y="129" textAnchor="middle" fill="#1f2937" fontSize="10">Oral</text>

    {/* Frequency */}
    <rect x="190" y="114" width="100" height="22" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
    <text x="240" y="129" textAnchor="middle" fill="#1f2937" fontSize="10">Three times daily</text>

    {/* Prescriber signature */}
    <rect x="30" y="155" width="140" height="30" rx="3" fill="#f9fafb" stroke="#e5e7eb" strokeWidth="1" />
    <text x="100" y="168" textAnchor="middle" fill="#6b7280" fontSize="8">Signature</text>
    <text x="100" y="180" textAnchor="middle" fill="#374151" fontSize="9" fontStyle="italic">Dr. E. Okafor — GMC 445892</text>
  </svg>
)

export const medicinesContent: InteractiveContent = {
  sections: [
    {
      title: "The 5 Rights of Medicines Administration",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Right Patient",
              content:
                "Verify the patient's identity using at least two identifiers — name and date of birth, or name and hospital number. Ask the patient to state their name where possible. Never rely on bed number or visual recognition alone. Check the identity against the prescription and the patient's wristband.",
            },
            {
              title: "Right Drug",
              content:
                "Confirm the drug name matches exactly on the prescription and the medicine label — generic names and brand names differ. If you are unfamiliar with the drug, look it up before administering. Never assume. Abbreviations on prescriptions should be treated with caution — clarify any ambiguity with the prescriber.",
            },
            {
              title: "Right Dose",
              content:
                "Calculate the dose independently before drawing it up. If the calculated dose seems unusual — significantly higher or lower than the normal therapeutic range — stop and verify with the prescriber. High-risk drugs such as insulin and opioids require a double-check with a second registered professional before administration.",
            },
            {
              title: "Right Route",
              content:
                "Ensure the medicine is formulated for the prescribed route. Never give an oral preparation intravenously. If a route changes (e.g. oral to IV), a new prescription is required. Check the patient can tolerate the route — a patient who is vomiting cannot reliably absorb oral medicines.",
            },
            {
              title: "Right Time",
              content:
                "Administer at the prescribed time or as close to it as clinically practical. Time-critical medicines — including insulin, antibiotics, and anti-epileptics — must not be delayed. Document administration immediately after giving — not before, and not from memory at the end of a shift.",
            },
          ],
        },
      ],
    },
    {
      title: "Reading Prescriptions",
      blocks: [
        {
          type: "labelled-diagram",
          svg: PrescriptionSvg,
          hotspots: [
            {
              id: "patient_id",
              x: 28,
              y: 42,
              label: "Patient Identifier",
              description:
                "Full name and a unique identifier (hospital number or date of birth). This is your first check — confirm this matches the patient's wristband before doing anything else.",
            },
            {
              id: "drug_name",
              x: 28,
              y: 58,
              label: "Drug Name",
              description:
                "The generic (non-proprietary) name should be used wherever possible. If you see a brand name, verify it against the generic equivalent. Any illegibility must be clarified with the prescriber — do not interpret unclear writing.",
            },
            {
              id: "dose",
              x: 28,
              y: 74,
              label: "Dose",
              description:
                "The quantity per administration. Check this against the normal therapeutic range for this drug and this patient's weight/age where relevant. An unusually round number (e.g. 100mg morphine) is a red flag requiring verification.",
            },
            {
              id: "route",
              x: 53,
              y: 74,
              label: "Route",
              description:
                "How the medicine enters the body — oral, IV, IM, sublingual, topical. Ensure the formulation you are about to give matches the prescribed route. Oral preparations given IV can be fatal.",
            },
            {
              id: "frequency",
              x: 81,
              y: 74,
              label: "Frequency",
              description:
                "How often the dose is given. Standard abbreviations: OD (once daily), BD (twice daily), TDS/TID (three times daily), QDS (four times daily). PRN means 'as required' — confirm minimum interval before repeating.",
            },
            {
              id: "signature",
              x: 28,
              y: 88,
              label: "Prescriber Signature",
              description:
                "A valid prescription must be signed by an authorised prescriber. In Nigeria, prescriptions require the prescriber's name, signature, registration number, and date. An unsigned prescription cannot legally be dispensed or administered.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question: "A prescription is written for 'morphine 100mg oral.' What should you do?",
          options: [
            {
              text: "Administer as prescribed — the prescriber has clinical authority",
              correct: false,
              explanation: "The prescriber has authority to prescribe, but you have a professional duty to question prescriptions that fall outside safe parameters. 100mg oral morphine is far above the normal therapeutic range for an opioid-naive adult.",
            },
            {
              text: "Stop and contact the prescriber to verify — 100mg is far above the normal oral dose",
              correct: true,
              explanation: "100mg oral morphine for an opioid-naive patient would be a potentially fatal overdose. The normal starting dose is 5–10mg. Always verify before administering any dose that significantly exceeds the expected therapeutic range.",
            },
            {
              text: "Administer 10mg and document that the dose was adjusted",
              correct: false,
              explanation: "You cannot alter a prescription. If you believe it is incorrect, contact the prescriber to issue a corrected prescription. Administering a different dose to what is prescribed — even a safer one — is incorrect practice.",
            },
            {
              text: "Ask a colleague if they think it looks right",
              correct: false,
              explanation: "A colleague's reassurance does not make an unsafe prescription safe. The correct action is to contact the prescribing clinician directly for clarification.",
            },
          ],
        },
      ],
    },
    {
      title: "High-Risk Medications",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Insulin",
              content:
                "Insulin errors are among the most common causes of serious medication harm. Risk factors: incorrect type (rapid vs long-acting), incorrect dose units ('units' must be written in full — never 'U', which can be misread as zero), incorrect timing relative to meals, and failure to double-check. Always use an insulin-specific syringe. Two registered professionals must check insulin before administration.",
            },
            {
              title: "Opioids",
              content:
                "Morphine, pethidine, tramadol, codeine. Risk: respiratory depression, especially in opioid-naive patients, those with renal impairment, or those taking other sedating drugs. Monitor respiratory rate and sedation score after each dose. PRN opioids must not be given at minimum intervals without reassessment. Controlled drug protocols require two-person verification and stock recording.",
            },
            {
              title: "Anticoagulants",
              content:
                "Heparin and warfarin — narrow therapeutic range, significant bleeding risk. Heparin requires weight-based dosing and regular APTT monitoring. Warfarin dose is adjusted against INR. Both interact extensively with other medicines and food. Always check most recent INR/APTT before administering. Antidotes (protamine for heparin, vitamin K for warfarin) must be available.",
            },
          ],
        },
        {
          type: "reflective-prompt",
          question:
            "Think about the last time you administered a high-risk medication. What verification steps did you follow — and were they fully sufficient? What would you do differently?",
        },
      ],
    },
    {
      title: "Documentation and Reporting",
      blocks: [
        {
          type: "ordering-activity",
          items: [
            { id: "notify", text: "Notify the prescriber and senior nurse immediately" },
            { id: "assess", text: "Assess the patient — check for signs of harm" },
            { id: "document", text: "Document the error accurately in the patient's notes" },
            { id: "incident", text: "Complete an incident report form" },
            { id: "followup", text: "Arrange monitoring and any required treatment" },
          ],
          correctOrder: ["assess", "notify", "document", "incident", "followup"],
        },
        {
          type: "knowledge-check",
          question: "You realise you administered the wrong dose 30 minutes ago. The patient appears well. What do you do first?",
          options: [
            {
              text: "Wait to see if the patient develops symptoms before reporting",
              correct: false,
              explanation: "Waiting is never the correct response to a known medication error. The patient may appear well now but develop harm later. Report immediately so appropriate monitoring and any treatment can be initiated.",
            },
            {
              text: "Complete the incident form before telling anyone",
              correct: false,
              explanation: "Incident documentation is important but not the first step. Clinical assessment and notification of the prescriber and senior nurse take priority — the patient's safety comes first.",
            },
            {
              text: "Assess the patient, then notify the prescriber and senior nurse",
              correct: true,
              explanation: "Assess the patient immediately for signs of harm, then notify the prescriber and senior nurse. Documentation and incident reporting follow — but patient safety comes first.",
            },
            {
              text: "Administer the correct dose now to compensate",
              correct: false,
              explanation: "Never attempt to self-correct a medication error with an additional dose without instruction from the prescriber. This can cause further harm and makes accurate clinical management impossible.",
            },
          ],
        },
      ],
    },
    {
      title: "Clinical Scenario",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "You are about to administer the evening medications. A prescription reads 'metformin 5000mg oral once daily.' The patient is a 62-year-old with type 2 diabetes who is otherwise well. The usual therapeutic dose of metformin is 500–2000mg per day. What do you do?",
          choices: [
            {
              text: "Administer as prescribed — the doctor must have a reason for the higher dose",
              outcome: "incorrect",
              consequence:
                "Administering without query would expose the patient to serious risk. 5000mg of metformin far exceeds the maximum recommended daily dose of 2000–3000mg and is likely a prescribing error (an extra zero). The patient's safety is your responsibility — you cannot administer a prescription you have reason to believe is incorrect.",
            },
            {
              text: "Withhold the dose and contact the prescriber to verify before giving anything",
              outcome: "correct",
              consequence:
                "Correct. Withhold the dose and contact the prescriber to clarify. Present your concern clearly: 'The prescription reads 5000mg which is above the maximum therapeutic dose — can you confirm or correct?' Document that the dose was withheld pending clarification. Do not administer until you have a verified, corrected prescription.",
            },
            {
              text: "Administer 2000mg instead and note the change",
              outcome: "incorrect",
              consequence:
                "You cannot alter a prescription and administer a different dose. Even if 2000mg would be clinically reasonable, the correct action is to contact the prescriber for a corrected prescription. Administering an unverified, self-adjusted dose is incorrect practice regardless of intent.",
            },
          ],
        },
      ],
    },
  ],
}
