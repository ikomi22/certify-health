import type { InteractiveContent } from "./types"

const HazardRoomSvg = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ maxHeight: 220 }}>
    {/* Floor */}
    <rect x="20" y="20" width="280" height="160" rx="4" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1.5" />
    {/* Walls */}
    <rect x="20" y="20" width="280" height="16" fill="#e5e7eb" />
    <text x="160" y="32" textAnchor="middle" fill="#6b7280" fontSize="9">Clinical Bay — Ward 3B</text>

    {/* Bed */}
    <rect x="200" y="50" width="80" height="50" rx="4" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" />
    <rect x="200" y="50" width="80" height="14" rx="4" fill="#bfdbfe" />
    <text x="240" y="80" textAnchor="middle" fill="#1d4ed8" fontSize="8">Patient Bed</text>

    {/* Wet floor — puddle near door */}
    <ellipse cx="60" cy="155" rx="28" ry="12" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1" strokeDasharray="3 2" />
    <text x="60" y="158" textAnchor="middle" fill="#1e40af" fontSize="7">wet</text>

    {/* Sharps container — overfull */}
    <rect x="40" y="90" width="24" height="34" rx="4" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
    <text x="52" y="112" textAnchor="middle" fill="#92400e" fontSize="7">FULL</text>
    {/* sharps sticking out */}
    <line x1="52" y1="90" x2="52" y2="78" stroke="#dc2626" strokeWidth="1.5" />
    <line x1="46" y1="90" x2="44" y2="80" stroke="#dc2626" strokeWidth="1.5" />

    {/* Trailing cable */}
    <path d="M 140 40 Q 140 100 100 120 Q 80 130 80 160" stroke="#f97316" strokeWidth="2.5" strokeDasharray="5 3" fill="none" />
    <text x="130" y="90" fill="#c2410c" fontSize="7">cable</text>

    {/* Unlabelled chemical bottle */}
    <rect x="155" y="110" width="20" height="32" rx="4" fill="#faf5ff" stroke="#7c3aed" strokeWidth="1.5" />
    <rect x="158" y="108" width="14" height="6" rx="2" fill="#7c3aed" />
    <text x="165" y="130" textAnchor="middle" fill="#5b21b6" fontSize="6">??</text>

    {/* Blocked fire exit */}
    <rect x="270" y="120" width="26" height="50" rx="2" fill="#fecaca" stroke="#dc2626" strokeWidth="1.5" />
    <text x="283" y="140" textAnchor="middle" fill="#dc2626" fontSize="8" fontWeight="bold">EXIT</text>
    {/* Box blocking */}
    <rect x="265" y="140" width="32" height="26" rx="2" fill="#d1fae5" stroke="#16a34a" strokeWidth="1" />
    <text x="281" y="156" textAnchor="middle" fill="#065f46" fontSize="7">boxes</text>
  </svg>
)

export const healthSafetyContent: InteractiveContent = {
  sections: [
    {
      title: "Rights and Responsibilities",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Your Employer's Duties",
              content:
                "Your employer must provide: a safe working environment so far as is reasonably practicable, safe equipment and systems of work, adequate information and training to work safely, supervision appropriate to your role, and procedures for reporting hazards and incidents. In Nigeria, this is governed by the Factories Act and associated regulations.",
            },
            {
              title: "Your Duties as an Employee",
              content:
                "You must: take reasonable care of your own health and safety and that of others affected by your actions, cooperate with your employer on health and safety matters, use equipment and safety devices provided, and report hazards, near misses, and incidents promptly. You cannot lawfully be penalised for raising a genuine health and safety concern.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question: "Which of the following is YOUR responsibility as an employee under health and safety law?",
          options: [
            {
              text: "Providing personal protective equipment for all staff",
              correct: false,
              explanation: "Providing PPE is the employer's responsibility. As an employee, your duty is to use PPE correctly when it is provided.",
            },
            {
              text: "Reporting hazards and near misses to your employer",
              correct: true,
              explanation: "Reporting hazards and near misses is explicitly an employee duty under health and safety law — and essential for preventing future incidents.",
            },
            {
              text: "Conducting formal risk assessments for all ward activities",
              correct: false,
              explanation: "Formal risk assessment is an employer responsibility, typically carried out by managers or safety officers. As an employee, you contribute by reporting hazards and cooperating with assessments.",
            },
            {
              text: "Ensuring all visitors to the ward follow safety rules",
              correct: false,
              explanation: "While you can remind visitors of ward rules, you are not legally responsible for enforcing visitor compliance. Focus on your own safe practice and reporting hazards to those with authority to act.",
            },
          ],
        },
      ],
    },
    {
      title: "Hazard Identification",
      blocks: [
        {
          type: "labelled-diagram",
          svg: HazardRoomSvg,
          hotspots: [
            {
              id: "wet_floor",
              x: 19,
              y: 82,
              label: "Wet Floor",
              description:
                "Slip risk — immediate action required. Place a wet floor warning sign if available. Report to the housekeeping team. Do not leave a known slip hazard unattended without warning others.",
            },
            {
              id: "sharps",
              x: 15,
              y: 52,
              label: "Overfull Sharps Container",
              description:
                "A sharps container must be sealed and replaced when it reaches the fill line — never overfilled. Projecting sharps cause needlestick injuries. Seal and replace immediately; report if containers are not being changed frequently enough.",
            },
            {
              id: "cable",
              x: 44,
              y: 62,
              label: "Trailing Cable",
              description:
                "Trip hazard — route cables securely along walls or use cable covers. Trailing leads near beds or walkways cause falls in staff, patients, and visitors. Report and manage immediately.",
            },
            {
              id: "chemical",
              x: 53,
              y: 68,
              label: "Unlabelled Chemical",
              description:
                "Any chemical bottle without a clear label must be treated as unknown and potentially hazardous. Do not use it. Segregate and report to the ward manager. All chemical containers must be labelled with contents, hazard warnings, and storage requirements.",
            },
            {
              id: "exit",
              x: 88,
              y: 78,
              label: "Blocked Fire Exit",
              description:
                "Fire exits must be kept clear at all times — obstructing them is a serious fire safety breach. Clear the obstruction immediately and report to the fire safety officer. In the event of a fire, a blocked exit could cost lives.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question: "Which of these hazards poses the most immediate risk of serious injury?",
          options: [
            {
              text: "Unlabelled chemical bottle",
              correct: false,
              explanation: "An unlabelled chemical is a significant hazard but requires direct contact to cause harm. The overfull sharps container poses more immediate risk to anyone who passes it.",
            },
            {
              text: "Overfull sharps container with protruding needles",
              correct: true,
              explanation: "Protruding sharps create an immediate needlestick risk for any staff member or patient who passes. Needlestick injuries can transmit hepatitis B, hepatitis C, and HIV. This must be addressed instantly.",
            },
            {
              text: "Trailing cable across the walkway",
              correct: false,
              explanation: "Trailing cables are a significant trip hazard — especially for patients who are unsteady. However, a sharps container with projecting needles presents a more immediate and severe injury risk.",
            },
            {
              text: "Blocked fire exit",
              correct: false,
              explanation: "A blocked fire exit is a critical life safety issue in the event of a fire — but fire may not be imminent. Protruding sharps represent an immediate, continuous risk requiring instant action.",
            },
          ],
        },
      ],
    },
    {
      title: "Risk Assessment",
      blocks: [
        {
          type: "ordering-activity",
          items: [
            { id: "review", text: "Review — check controls are working and re-assess if conditions change" },
            { id: "identify", text: "Identify the hazard — what could cause harm?" },
            { id: "control", text: "Implement control measures — eliminate, reduce, or manage the risk" },
            { id: "assess", text: "Assess the risk — who could be harmed and how seriously?" },
          ],
          correctOrder: ["identify", "assess", "control", "review"],
        },
        {
          type: "reflective-prompt",
          question:
            "Name one hazard in your current workplace that you have noticed but that has not been addressed. What is stopping it from being fixed, and what steps could you take to move it forward?",
        },
      ],
    },
    {
      title: "Incident Reporting",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "What to Report",
              content:
                "All accidents causing injury to staff, patients, or visitors. Equipment failures that could cause harm. Hazardous conditions that were identified and not yet controlled. Near misses — incidents where harm nearly occurred. Occupational health concerns including needlestick injuries, chemical exposures, and stress-related illness.",
            },
            {
              title: "Why Near-Miss Reporting Matters",
              content:
                "A near miss is an event that almost caused harm but did not. Near-miss data is the most valuable source of information for preventing future serious incidents — far more so than after-the-fact accident investigation. Organisations with high near-miss reporting rates have fewer serious accidents. Never discourage reporting by treating it as blame.",
            },
            {
              title: "How to Report",
              content:
                "Complete your facility's incident report form (paper or electronic) as soon as possible after the event. Be factual and specific — include the time, location, what happened, who was involved, and what action was taken. Do not edit or soften reports for fear of consequences. Report to your line manager immediately for any injury or near miss involving patient harm.",
            },
          ],
        },
        {
          type: "scenario-choice",
          scenario:
            "You enter a patient's bay and notice a large wet patch on the floor from an overflowing patient wash bowl. Three members of staff and two mobile patients are about to walk through the area. There is no wet floor sign available on the ward at this moment. What do you do?",
          choices: [
            {
              text: "Wait until you can find a wet floor sign before doing anything",
              outcome: "incorrect",
              consequence:
                "Waiting increases the likelihood of a fall. When no sign is available, you must take immediate physical action — stand in the area, warn people verbally, or use an improvised barrier. The absence of the correct equipment does not remove your duty to act.",
            },
            {
              text: "Warn staff and patients verbally, block the area physically, and report to find a sign and clean-up",
              outcome: "correct",
              consequence:
                "Correct. Immediate verbal warning and physical barrier come first to prevent injury. Then report to a manager or housekeeping team to obtain the sign, clean the spill, and document the incident. After the event, completing an incident report creates a record that may prompt investigation into why signs were unavailable.",
            },
            {
              text: "Report it to the nurse in charge and let them decide what to do",
              outcome: "incorrect",
              consequence:
                "Delegating upward is not sufficient when people are in immediate danger. You have a duty to take immediate protective action within your capability — warning others and physically preventing entry into the area — before or while reporting to a manager.",
            },
          ],
        },
      ],
    },
  ],
}
