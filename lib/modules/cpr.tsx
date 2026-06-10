import type { InteractiveContent } from "./types"

export const cprContent: InteractiveContent = {
  sections: [
    {
      title: "What Assessors Look For",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Insufficient Compression Depth",
              content:
                "The most common reason for failing a practical CPR assessment. Adult compressions must reach 5–6cm — roughly one-third of the chest depth. Assessors will observe your hand position and the physical displacement of the chest wall. Shallow compressions do not generate adequate cardiac output. Use your body weight through straight, locked arms — not just arm strength.",
            },
            {
              title: "Rate Too Slow or Too Fast",
              content:
                "Target rate is 100–120 compressions per minute. Too slow (under 100) fails to maintain perfusion pressure. Too fast (over 120) prevents full chest recoil and reduces stroke volume. Assessors use a metronome or timer. Practise with a metronome before your session — most people underestimate how fast 100/min feels in real time.",
            },
            {
              title: "Excessive Interruptions",
              content:
                "The no-flow time — time when compressions are paused — must be minimised. Acceptable pauses are for rhythm check (under 10 seconds), ventilation (1 second per breath), and AED analysis. Pausing to reposition hands, to check for a pulse mid-sequence, or to switch rescuers without a proper handover all lose marks and, in a real arrest, cost lives.",
            },
            {
              title: "Incorrect Hand Position",
              content:
                "Heel of the dominant hand placed on the centre of the sternum (breastbone), not to the left. Fingers interlocked and lifted off the chest wall. Arms straight. Body weight directly over the hands. Incorrect position — too far left, pressing on ribs, fingers on the chest — causes rib fractures and reduces effectiveness. Assessors watch your hand position throughout.",
            },
          ],
        },
      ],
    },
    {
      title: "Adult CPR Step by Step",
      blocks: [
        {
          type: "ordering-activity",
          items: [
            { id: "aed", text: "Use AED as soon as it arrives — attach pads without stopping compressions" },
            { id: "safe", text: "Ensure the scene is safe before approaching" },
            { id: "compressions", text: "Begin 30 chest compressions" },
            { id: "response", text: "Check response — shout name and squeeze shoulders" },
            { id: "help", text: "Shout for help" },
            { id: "airway", text: "Open the airway — head-tilt chin-lift" },
            { id: "breaths", text: "Give 2 rescue breaths (1 second each)" },
            { id: "crash", text: "Call the crash team (or ask someone to call 999 in community)" },
            { id: "breathing", text: "Check for normal breathing — no more than 10 seconds" },
            { id: "continue", text: "Continue 30:2 cycles until team arrives or patient recovers" },
          ],
          correctOrder: ["safe", "response", "help", "airway", "breathing", "crash", "compressions", "breaths", "continue", "aed"],
        },
        {
          type: "knowledge-check",
          question: "How long should you take to check for breathing before starting compressions?",
          options: [
            {
              text: "Up to 30 seconds — to be thorough",
              correct: false,
              explanation: "30 seconds is far too long. Excessive time checking for breathing delays compressions and reduces survival. Check for no more than 10 seconds.",
            },
            {
              text: "No more than 10 seconds",
              correct: true,
              explanation: "Look, listen, and feel for no more than 10 seconds. If in doubt after 10 seconds, start CPR — acting on a false positive is far safer than delaying on a genuine cardiac arrest.",
            },
            {
              text: "Up to 60 seconds to check both pulse and breathing",
              correct: false,
              explanation: "Pulse checks by lay rescuers and even healthcare workers are unreliable under stress. Current guidelines do not recommend a pulse check for basic life support — assess breathing only, and act within 10 seconds.",
            },
            {
              text: "No time — begin compressions immediately without checking",
              correct: false,
              explanation: "You must open the airway and check for breathing before starting compressions — but this check should take no more than 10 seconds. Skipping it means you cannot give rescue breaths appropriately.",
            },
          ],
        },
      ],
    },
    {
      title: "Paediatric Differences",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Infant CPR (Under 1 Year)",
              content:
                "Use two fingers (index and middle) on the centre of the chest for compressions. Depth: one-third of the chest — approximately 4cm. Rate: 100–120/min. Rescue breaths: cover the infant's mouth AND nose with your mouth. Give gentle puffs — only enough to see the chest rise. Ratio: 30:2 for a lone rescuer; 15:2 for a two-rescuer team.",
            },
            {
              title: "Child CPR (1 Year to Puberty)",
              content:
                "Use one hand (or two if the child is larger) on the lower half of the sternum. Depth: at least one-third of the chest. Rate: 100–120/min. Rescue breaths: pinch the nose and cover the mouth as in adult technique. Ratio: 30:2 for a lone rescuer; 15:2 for a two-rescuer team.",
            },
            {
              title: "Key Differences from Adult",
              content:
                "In children, cardiac arrest is most commonly caused by respiratory failure (not primary cardiac event) — so rescue breaths are proportionally more important than in adults. Give 5 initial rescue breaths before starting compressions (in both infant and child). In adults, compression-first is the standard for a witnessed cardiac arrest.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question: "What compression to breath ratio is used for a lone rescuer performing CPR on a child?",
          options: [
            {
              text: "15:2 — the same as for a two-rescuer team",
              correct: false,
              explanation: "15:2 is the ratio for a two-rescuer paediatric resuscitation. A lone rescuer — whether adult or child patient — uses 30:2 to minimise interruptions to compressions.",
            },
            {
              text: "30:2 — the same as for adult CPR",
              correct: true,
              explanation: "A lone rescuer uses 30:2 for both adult and paediatric CPR. The 15:2 ratio applies to two-rescuer paediatric resuscitation. Initial 5 rescue breaths still precede the first compression cycle in children.",
            },
            {
              text: "Compressions only — no rescue breaths for children",
              correct: false,
              explanation: "Compressions-only CPR is sometimes advised for lay rescuers in adult cardiac arrest who are not trained in rescue breaths. For children, rescue breaths are important because respiratory failure is a common cause of arrest.",
            },
            {
              text: "50:2 — faster compression rate for smaller patients",
              correct: false,
              explanation: "50:2 is not a recognised CPR ratio. The standard for lone rescuer paediatric CPR is 30:2 at the same 100–120/min compression rate as adult CPR.",
            },
          ],
        },
      ],
    },
    {
      title: "Two-Rescuer CPR",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "You arrive at a resuscitation in progress. A colleague is performing compressions but is visibly fatigued — their depth has become shallow after approximately 3 minutes. You are fresh and ready to take over. How do you transition correctly?",
          choices: [
            {
              text: "Wait for the next rhythm check pause, then immediately take over compressions",
              outcome: "correct",
              consequence:
                "Correct. Transition at a scheduled rhythm check or ventilation pause to minimise the no-flow time. Announce clearly 'I'm taking over' so your colleague can step back without confusion. Position yourself without touching the patient until your colleague's hands are clear, then begin immediately. Aim for a handover interruption of under 5 seconds.",
            },
            {
              text: "Tap your colleague on the shoulder mid-compression cycle and replace their hands immediately",
              outcome: "incorrect",
              consequence:
                "Interrupting mid-cycle introduces an unplanned pause and risks confusion or double-handling. Handover should be at a planned pause point — rhythm check or after a ventilation cycle — with clear verbal communication so the transition is smooth and interruption is under 5 seconds.",
            },
            {
              text: "Ask the team leader to stop compressions for 15 seconds while you get into position",
              outcome: "incorrect",
              consequence:
                "A 15-second compression pause significantly reduces coronary perfusion pressure and worsens outcomes. Transitions between rescuers should take under 5 seconds. Position yourself before the pause — not during it.",
            },
          ],
        },
        {
          type: "reflective-prompt",
          question:
            "When did you last perform CPR — in a simulation or a real situation? What aspect felt least confident? What specifically will you focus on in your upcoming practical sign-off session?",
        },
      ],
    },
  ],
}
