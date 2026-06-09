// lib/modules/bls-theory.tsx
import type { InteractiveContent } from "./types"

const AedSvg = () => (
  <svg
    viewBox="0 0 280 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full"
    style={{ maxHeight: 220 }}
  >
    {/* Device body */}
    <rect x="70" y="20" width="140" height="160" rx="16" fill="#f0fdf4" stroke="#86efac" strokeWidth="2" />
    {/* Screen */}
    <rect x="90" y="40" width="100" height="70" rx="8" fill="#dcfce7" />
    <text x="140" y="72" textAnchor="middle" fill="#166534" fontSize="16" fontFamily="monospace" fontWeight="bold">AED</text>
    <text x="140" y="94" textAnchor="middle" fill="#15803d" fontSize="10" fontFamily="monospace">READY</text>
    {/* Power button */}
    <circle cx="192" cy="40" r="16" fill="#16a34a" stroke="white" strokeWidth="2" />
    <text x="192" y="47" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">⏻</text>
    {/* Shock button */}
    <rect x="90" y="130" width="100" height="34" rx="10" fill="#ea580c" />
    <text x="140" y="152" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">SHOCK</text>
    {/* Left pad cable */}
    <line x1="70" y1="110" x2="26" y2="110" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
    <rect x="6" y="90" width="22" height="38" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
    <text x="17" y="113" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">L</text>
    {/* Right pad cable */}
    <line x1="210" y1="110" x2="252" y2="110" stroke="#d97706" strokeWidth="2" strokeDasharray="4 3" />
    <rect x="252" y="90" width="22" height="38" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
    <text x="263" y="113" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">R</text>
  </svg>
)

export const blsTheoryContent: InteractiveContent = {
  sections: [
    {
      title: "The Chain of Survival",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "1. Early Recognition",
              content:
                "Identify cardiac arrest immediately: the patient is unresponsive and not breathing normally. Every minute without treatment reduces survival by 7–10%. Shout for attention as you approach.",
            },
            {
              title: "2. Early CPR",
              content:
                "High-quality CPR circulates oxygenated blood to the brain and heart, buying critical time. Start compressions immediately — do not wait for equipment or additional staff before beginning.",
            },
            {
              title: "3. Early Defibrillation",
              content:
                "Most sudden cardiac arrests are caused by ventricular fibrillation — a chaotic rhythm only correctable with a defibrillation shock. Attach the AED as soon as it arrives without stopping compressions.",
            },
            {
              title: "4. Post-Resuscitation Care",
              content:
                "After return of spontaneous circulation (ROSC), the patient needs critical care, airway management, and investigation of the underlying cause to prevent re-arrest.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question:
            "Which link in the chain is most time-critical in an out-of-hospital cardiac arrest?",
          options: [
            {
              text: "Early Recognition",
              correct: false,
              explanation:
                "Recognition is critical but delay in defibrillation has the steepest effect on survival rates.",
            },
            {
              text: "Early Defibrillation",
              correct: true,
              explanation:
                "Survival rates fall by 10% for every minute without defibrillation in ventricular fibrillation. CPR buys time but cannot restore a normal rhythm.",
            },
            {
              text: "Post-Resuscitation Care",
              correct: false,
              explanation:
                "Post-resuscitation care is essential after ROSC — it cannot help during the arrest itself.",
            },
            {
              text: "Early CPR",
              correct: false,
              explanation:
                "CPR is vital, but its primary role is to maintain circulation until defibrillation is available.",
            },
          ],
        },
      ],
    },
    {
      title: "Recognising Cardiac Arrest",
      blocks: [
        {
          type: "text",
          content:
            "When a patient collapses, you must assess quickly and decisively.\n\nUnresponsiveness is the first sign. Shout the patient's name and squeeze their shoulders firmly. If there is no response, assume the worst and act immediately.\n\nNormal breathing means the chest rises and falls regularly, without effort or distress. Check for no more than 10 seconds — looking, listening, and feeling for air movement.\n\nAgonal breathing appears as infrequent, irregular gasps or snoring sounds. This is a brainstem reflex and is NOT normal breathing. Do not be reassured by it — treat the patient as if they are in cardiac arrest.",
        },
        {
          type: "knowledge-check",
          question: "A patient is making occasional gasping sounds. Is this normal breathing?",
          options: [
            {
              text: "Yes — gasping shows the patient can breathe independently",
              correct: false,
              explanation:
                "Agonal gasping is not independent breathing. It is a brainstem reflex that can occur even in cardiac arrest.",
            },
            {
              text: "No — this is agonal breathing, treat as cardiac arrest",
              correct: true,
              explanation:
                "Agonal breathing must not delay your response. Treat it as cardiac arrest and begin CPR immediately.",
            },
            {
              text: "Only if gasps occur more than once every 5 seconds",
              correct: false,
              explanation:
                "There is no frequency threshold — any atypical breathing in an unresponsive patient should be treated as cardiac arrest.",
            },
            {
              text: "It depends on whether the patient is conscious",
              correct: false,
              explanation:
                "If the patient is unresponsive, consciousness is already absent. Gasping is not normal breathing.",
            },
          ],
        },
      ],
    },
    {
      title: "CPR Technique",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Compression Rate",
              content:
                "Deliver compressions at 100–120 per minute. Use the rhythm of 'Stayin' Alive' by the Bee Gees to pace yourself. Too slow fails to circulate blood; too fast prevents full chest recoil.",
            },
            {
              title: "Compression Depth",
              content:
                "Compress the chest 5–6 cm in adults — approximately one-third of its depth. Place the heel of your dominant hand on the centre of the chest, interlock fingers, keep arms straight, and use your body weight.",
            },
            {
              title: "Hand Position and Ratio",
              content:
                "Never allow your fingers to press on the ribs — interlock and lift them. After every 30 compressions, give 2 rescue breaths. Tilt the head back, lift the chin, and give each breath over 1 second watching for chest rise.",
            },
          ],
        },
        {
          type: "ordering-activity",
          items: [
            { id: "compressions", text: "Begin 30 chest compressions" },
            { id: "breathing", text: "Check for normal breathing (no more than 10 seconds)" },
            { id: "airway", text: "Open the airway using head-tilt chin-lift" },
            { id: "shout", text: "Shout for help and call the crash team" },
            { id: "breaths", text: "Give 2 rescue breaths" },
            { id: "check", text: "Check patient response (shout name and squeeze shoulders)" },
          ],
          correctOrder: ["check", "shout", "airway", "breathing", "compressions", "breaths"],
        },
      ],
    },
    {
      title: "AED and Team Resuscitation",
      blocks: [
        {
          type: "labelled-diagram",
          svg: AedSvg,
          hotspots: [
            {
              id: "power",
              x: 68,
              y: 20,
              label: "Power Button",
              description:
                "Press once to turn on. The AED will give clear audio instructions throughout — follow them exactly without rushing.",
            },
            {
              id: "shock",
              x: 50,
              y: 74,
              label: "Shock Button",
              description:
                "Press only when the AED instructs. Shout 'Stand clear!' first and ensure no one is touching the patient.",
            },
            {
              id: "pad-left",
              x: 6,
              y: 55,
              label: "Left Pad Placement",
              description:
                "Place below the left collarbone, to the right of the sternum (below the clavicle, left of centre).",
            },
            {
              id: "pad-right",
              x: 94,
              y: 55,
              label: "Right Pad Placement",
              description:
                "Place on the left side of the chest, below and to the left of the armpit (mid-axillary line).",
            },
          ],
        },
        {
          type: "reflective-prompt",
          question:
            "Where is the nearest AED to where you currently work? If you don't know, what will you do after completing this module?",
        },
      ],
    },
    {
      title: "Clinical Scenario",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "You are working on Medical Ward B when a patient collapses beside their bed. They are unresponsive and not breathing normally. You are alone on the ward at this moment.",
          choices: [
            {
              text: "Call for help and activate the crash team immediately",
              outcome: "correct",
              consequence:
                "In a hospital setting, calling for help first ensures the crash team and defibrillator arrive as quickly as possible. CPR alone cannot restart a heart in ventricular fibrillation — you need the team. Begin CPR once help is called, or immediately if no one responds.",
            },
            {
              text: "Begin chest compressions immediately",
              outcome: "incorrect",
              consequence:
                "While CPR is critical, calling for help first in a hospital ensures the crash team and AED arrive sooner. Without the team, you will be doing CPR alone indefinitely. In out-of-hospital arrests the order changes — but on a ward, call first.",
            },
            {
              text: "Check for a pulse for up to 10 seconds before deciding",
              outcome: "incorrect",
              consequence:
                "Pulse checks are unreliable under stress and cause dangerous delays. If the patient is unresponsive and not breathing normally, treat as cardiac arrest. Do not spend time feeling for a pulse — act.",
            },
          ],
        },
      ],
    },
  ],
}
