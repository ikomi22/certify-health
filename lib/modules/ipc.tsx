import type { InteractiveContent } from "./types"

const WasteBinsSvg = () => (
  <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ maxHeight: 200 }}>
    {/* Yellow bin */}
    <rect x="10" y="60" width="56" height="100" rx="6" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
    <rect x="10" y="54" width="56" height="14" rx="4" fill="#ca8a04" />
    <text x="38" y="65" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">YELLOW</text>
    <text x="38" y="100" textAnchor="middle" fill="#92400e" fontSize="8">Clinical</text>
    <text x="38" y="112" textAnchor="middle" fill="#92400e" fontSize="8">Waste</text>

    {/* Black bin */}
    <rect x="86" y="60" width="56" height="100" rx="6" fill="#f3f4f6" stroke="#374151" strokeWidth="1.5" />
    <rect x="86" y="54" width="56" height="14" rx="4" fill="#374151" />
    <text x="114" y="65" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">BLACK</text>
    <text x="114" y="100" textAnchor="middle" fill="#374151" fontSize="8">Domestic</text>
    <text x="114" y="112" textAnchor="middle" fill="#374151" fontSize="8">Waste</text>

    {/* Orange bin */}
    <rect x="162" y="60" width="56" height="100" rx="6" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.5" />
    <rect x="162" y="54" width="56" height="14" rx="4" fill="#ea580c" />
    <text x="190" y="65" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">ORANGE</text>
    <text x="190" y="100" textAnchor="middle" fill="#9a3412" fontSize="8">Infectious</text>
    <text x="190" y="112" textAnchor="middle" fill="#9a3412" fontSize="8">Waste</text>

    {/* Purple bin */}
    <rect x="238" y="60" width="56" height="100" rx="6" fill="#faf5ff" stroke="#7c3aed" strokeWidth="1.5" />
    <rect x="238" y="54" width="56" height="14" rx="4" fill="#7c3aed" />
    <text x="266" y="65" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">PURPLE</text>
    <text x="266" y="100" textAnchor="middle" fill="#5b21b6" fontSize="8">Cytotoxic</text>
    <text x="266" y="112" textAnchor="middle" fill="#5b21b6" fontSize="8">Waste</text>

    {/* Sharps box label on yellow */}
    <rect x="16" y="130" width="44" height="20" rx="3" fill="#fde047" />
    <text x="38" y="144" textAnchor="middle" fill="#78350f" fontSize="7.5" fontWeight="bold">+ SHARPS</text>
  </svg>
)

export const ipcContent: InteractiveContent = {
  sections: [
    {
      title: "Why IPC Matters",
      blocks: [
        {
          type: "text",
          content:
            "Healthcare-associated infections (HAIs) affect approximately 10% of patients admitted to hospitals in low- and middle-income countries — and up to 70% of those infections involve drug-resistant organisms. In Nigeria, the burden is significant and largely preventable.\n\nThe WHO estimates that 40% of HAIs in healthcare settings are preventable through consistent application of standard precautions. In wards with high patient-to-staff ratios and constrained resources, this makes every individual's IPC practice disproportionately important.\n\nIPC is not a bureaucratic requirement — it is a direct intervention that determines whether your patients are harmed by the care they receive.",
        },
        {
          type: "knowledge-check",
          question: "What percentage of healthcare-associated infections are considered preventable?",
          options: [
            {
              text: "Around 10%",
              correct: false,
              explanation: "10% is the proportion of hospital patients affected by HAIs, not the preventable fraction.",
            },
            {
              text: "Around 40%",
              correct: true,
              explanation: "WHO evidence indicates approximately 40% of HAIs can be prevented with consistent application of standard precautions.",
            },
            {
              text: "Around 70%",
              correct: false,
              explanation: "70% refers to the proportion of HAIs involving drug-resistant organisms in some settings, not the preventable fraction.",
            },
            {
              text: "Around 25%",
              correct: false,
              explanation: "The WHO estimate is approximately 40% preventable with standard precautions consistently applied.",
            },
          ],
        },
      ],
    },
    {
      title: "Standard Precautions and Hand Hygiene",
      blocks: [
        {
          type: "ordering-activity",
          items: [
            { id: "before_patient", text: "Before touching the patient" },
            { id: "before_procedure", text: "Before a clean or aseptic procedure" },
            { id: "after_fluid", text: "After body fluid exposure risk" },
            { id: "after_patient", text: "After touching the patient" },
            { id: "after_environment", text: "After touching patient surroundings" },
          ],
          correctOrder: ["before_patient", "before_procedure", "after_fluid", "after_patient", "after_environment"],
        },
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Low Risk — No PPE Required",
              content:
                "Routine patient contact with intact skin, non-infectious patients: standard hand hygiene is sufficient. Gloves are not required for every patient contact — overuse leads to skin damage, reduced compliance, and false security.",
            },
            {
              title: "Medium Risk — Gloves and Apron",
              content:
                "Contact with blood, body fluids, mucous membranes, or non-intact skin. Changing wound dressings, handling catheters, obtaining blood samples. Remove and dispose immediately after the procedure.",
            },
            {
              title: "High Risk — Full PPE",
              content:
                "Aerosol-generating procedures or contact with patients on transmission-based precautions (especially airborne). Requires: gloves, apron or gown, surgical or FFP3 mask (depending on risk), eye protection. Don in the correct sequence — gown first, mask, eye protection, gloves last.",
            },
          ],
        },
      ],
    },
    {
      title: "Transmission-Based Precautions",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Contact Precautions",
              content:
                "For organisms spread by direct or indirect contact: MRSA, Clostridioides difficile, norovirus. Side-room isolation preferred. Gloves and apron for all contact. Dedicated patient equipment. Alcohol gel ineffective against C. diff — use soap and water.",
            },
            {
              title: "Droplet Precautions",
              content:
                "For pathogens in large respiratory droplets (travel less than 1 metre): influenza, meningococcal disease, mumps. Side-room or 1-metre spatial separation. Surgical mask when within 1 metre. Standard PPE for direct care.",
            },
            {
              title: "Airborne Precautions",
              content:
                "For pathogens in small droplet nuclei that remain suspended in air: tuberculosis, measles, chickenpox. Negative-pressure room required where available. FFP3 mask mandatory — surgical mask is not sufficient. Minimise entry to the room.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question: "A patient is admitted with suspected pulmonary tuberculosis. Which type of precaution is required?",
          options: [
            {
              text: "Contact precautions — gloves and apron",
              correct: false,
              explanation: "TB is spread via the airborne route, not contact. Gloves and apron alone are insufficient.",
            },
            {
              text: "Droplet precautions — surgical mask within 1 metre",
              correct: false,
              explanation: "TB droplet nuclei are smaller than standard droplets and remain airborne. A surgical mask does not provide sufficient protection.",
            },
            {
              text: "Airborne precautions — FFP3 mask, side room",
              correct: true,
              explanation: "Pulmonary TB requires airborne precautions: an FFP3 (or equivalent) respirator and a side room, ideally with negative pressure.",
            },
            {
              text: "No special precautions until diagnosis confirmed",
              correct: false,
              explanation: "Precautions must be applied at the point of suspicion, not confirmation. Waiting for test results risks transmission.",
            },
          ],
        },
      ],
    },
    {
      title: "Waste Management and Sharps",
      blocks: [
        {
          type: "labelled-diagram",
          svg: WasteBinsSvg,
          hotspots: [
            {
              id: "yellow",
              x: 19,
              y: 55,
              label: "Yellow — Clinical Waste",
              description:
                "Soiled dressings, gloves, aprons, and items contaminated with blood or body fluids. Sharps containers are also yellow-lidded. Incinerated or treated as hazardous waste.",
            },
            {
              id: "black",
              x: 45,
              y: 55,
              label: "Black — Domestic Waste",
              description:
                "Uncontaminated waste that poses no infection risk: paper, packaging, food waste from staff areas. Never mix clinical waste into a black bag.",
            },
            {
              id: "orange",
              x: 71,
              y: 55,
              label: "Orange — Infectious Waste",
              description:
                "Waste from patients with known or suspected infectious conditions — highly contaminated materials. Requires specialist disposal as Category B infectious substance.",
            },
            {
              id: "purple",
              x: 97,
              y: 55,
              label: "Purple — Cytotoxic Waste",
              description:
                "Any waste contaminated with cytotoxic or cytostatic medicines — chemotherapy agents. Requires specialist high-temperature incineration. Handle with additional PPE.",
            },
          ],
        },
        {
          type: "reflective-prompt",
          question:
            "Have you ever seen sharps disposed of incorrectly in your facility — or waste placed in the wrong bin? What did you do, or what would you do if it happened again?",
        },
      ],
    },
    {
      title: "Clinical Scenario",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "A new patient is admitted to your ward with a productive cough and night sweats. The doctor suspects pulmonary tuberculosis and orders a chest X-ray. The patient is placed in a shared bay with three other patients while awaiting the X-ray result. What should you do?",
          choices: [
            {
              text: "Move the patient to a side room immediately and apply airborne precautions",
              outcome: "correct",
              consequence:
                "Correct. TB precautions must be applied at the point of suspicion — not after confirmation. Waiting for X-ray results in a shared bay puts other patients and staff at risk. Airborne precautions (side room, FFP3 mask) are required whenever TB is suspected.",
            },
            {
              text: "Wait for the X-ray result before taking any action",
              outcome: "incorrect",
              consequence:
                "Waiting for diagnostic confirmation before applying precautions is incorrect. The time between suspicion and isolation is the period of highest transmission risk. IPC guidance requires action at suspicion, not confirmation.",
            },
            {
              text: "Apply droplet precautions — surgical mask and 1-metre distance",
              outcome: "incorrect",
              consequence:
                "Surgical masks and spatial separation are not adequate for TB. TB is an airborne pathogen requiring an FFP3 respirator and side-room isolation. Using the wrong level of precaution gives false reassurance.",
            },
          ],
        },
      ],
    },
  ],
}
