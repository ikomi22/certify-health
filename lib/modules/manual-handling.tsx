import type { InteractiveContent } from "./types"

const PostureSvg = () => (
  <svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" style={{ maxHeight: 240 }}>
    {/* Background */}
    <rect x="0" y="0" width="320" height="220" fill="#f0fdf4" />

    {/* Floor line */}
    <line x1="40" y1="185" x2="280" y2="185" stroke="#d1d5db" strokeWidth="2" />

    {/* Figure — simplified person lifting a box */}
    {/* Head */}
    <circle cx="160" cy="42" r="16" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
    {/* Torso — straight/neutral spine */}
    <line x1="160" y1="58" x2="160" y2="130" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
    {/* Left arm down to box */}
    <line x1="160" y1="80" x2="130" y2="130" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
    {/* Right arm down to box */}
    <line x1="160" y1="80" x2="190" y2="130" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
    {/* Left leg — bent knee */}
    <line x1="160" y1="130" x2="140" y2="160" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
    <line x1="140" y1="160" x2="130" y2="185" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
    {/* Right leg — bent knee */}
    <line x1="160" y1="130" x2="180" y2="160" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
    <line x1="180" y1="160" x2="190" y2="185" stroke="#374151" strokeWidth="3" strokeLinecap="round" />

    {/* Box (load close to body) */}
    <rect x="130" y="130" width="60" height="50" rx="4" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="160" y="160" textAnchor="middle" fill="#1d4ed8" fontSize="9">Load</text>

    {/* Feet indicators */}
    <ellipse cx="130" cy="187" rx="14" ry="5" fill="#d1d5db" />
    <ellipse cx="190" cy="187" rx="14" ry="5" fill="#d1d5db" />
  </svg>
)

export const manualHandlingContent: InteractiveContent = {
  sections: [
    {
      title: "Why Manual Handling Matters",
      blocks: [
        {
          type: "text",
          content:
            "Back injuries are the single most common occupational injury in healthcare globally, and manual handling is the leading cause. In Nigeria, musculoskeletal disorders account for a significant proportion of healthcare worker sick leave and early exit from the profession — yet most incidents are preventable.\n\nThe physical demands of patient care — repositioning, transfers, lifting — are unavoidable, but the risk of injury is manageable. Safe technique, appropriate equipment, and team-based approaches dramatically reduce injury rates.\n\nFor the individual worker, a back injury can mean months off work, chronic pain, and in severe cases, the end of a clinical career. For patients, an injured nurse means reduced care capacity for the whole ward.",
        },
        {
          type: "knowledge-check",
          question: "Back injuries from manual handling are most commonly caused by which of the following?",
          options: [
            {
              text: "Single catastrophic lifting incidents",
              correct: false,
              explanation: "While acute injuries do occur, the majority of manual handling back injuries accumulate over time through repeated poor technique, overloading, and inadequate rest — not a single event.",
            },
            {
              text: "Cumulative strain from repeated poor technique and overloading",
              correct: true,
              explanation: "Most manual handling back injuries develop gradually from repeated poor positioning, inadequate assessment, and overloading — not a single obvious incident. This is why sustained good technique matters.",
            },
            {
              text: "Failure to wear a back support belt",
              correct: false,
              explanation: "Back support belts are not recommended as standard practice in healthcare manual handling — evidence for their effectiveness is limited. Assessment, technique, and equipment use are the effective interventions.",
            },
            {
              text: "Patients who resist assistance",
              correct: false,
              explanation: "Patient resistance is a contributing factor in some incidents, but it does not cause the majority of manual handling injuries. Poor technique and inadequate assessment are the leading causes.",
            },
          ],
        },
      ],
    },
    {
      title: "The TILE Framework",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "T — Task",
              content:
                "What does the task involve? Assess: does it require twisting, bending, or reaching? Is it prolonged or repetitive? Does it involve sudden or unpredictable movement? Is it carried out in a confined space? Any task that involves sustained awkward posture or repetitive bending significantly increases injury risk.",
            },
            {
              title: "I — Individual",
              content:
                "Who is performing the task? Consider: does the person have any relevant health conditions (back problems, pregnancy, recent injury)? Have they been trained in safe technique? Are they physically capable for this specific task? Do they understand the risks? Match the person to the task — do not assign heavy handling to someone who has flagged a health concern.",
            },
            {
              title: "L — Load",
              content:
                "What is being moved? For a patient: their weight, level of dependency, ability to cooperate, presence of lines or attachments, and whether they are in pain or distressed. For objects: weight, size, stability, whether it has handles. A load that is unpredictable (a confused patient, an unbalanced container) presents greater risk than a stable load of the same weight.",
            },
            {
              title: "E — Environment",
              content:
                "Where is the task taking place? Check: is there enough space to adopt a safe posture? Is the floor dry and level? Is the lighting adequate? Is there equipment available and accessible? In a Nigerian ward context, crowded bays, limited space, and absent or unavailable hoists are common environmental risk factors that must be assessed before moving a patient.",
            },
          ],
        },
        {
          type: "knowledge-check",
          question: "A nurse with a recent back injury is asked to help move a bariatric patient. Which TILE factor is most relevant here?",
          options: [
            {
              text: "Task — because moving a bariatric patient is a complex task",
              correct: false,
              explanation: "The task complexity is relevant, but the most immediately relevant TILE factor given the nurse's recent injury is Individual — their current physical capacity to safely participate.",
            },
            {
              text: "Individual — the nurse's health condition directly affects their capacity for this task",
              correct: true,
              explanation: "Individual factors include the worker's health status. A nurse with a recent back injury should not be assigned to a heavy manual handling task without a specific risk assessment. An alternative team member or additional equipment should be arranged.",
            },
            {
              text: "Load — because the patient's weight is the primary concern",
              correct: false,
              explanation: "Load is always relevant in bariatric handling, but the immediate question here is whether this specific individual can safely participate given their health condition.",
            },
            {
              text: "Environment — because the ward layout may complicate the move",
              correct: false,
              explanation: "Environment matters, but the most pressing concern here is the individual worker's health status and capacity, not the ward layout.",
            },
          ],
        },
      ],
    },
    {
      title: "Safe Technique Principles",
      blocks: [
        {
          type: "labelled-diagram",
          svg: PostureSvg,
          hotspots: [
            {
              id: "spine",
              x: 50,
              y: 40,
              label: "Spine Neutral",
              description:
                "Maintain the natural S-curve of the spine throughout the movement. Do not bend from the waist. Bending the spine under load is the primary cause of disc injury — keep your back straight and upright.",
            },
            {
              id: "knees",
              x: 44,
              y: 72,
              label: "Knees Bent",
              description:
                "Use your leg muscles to lower and raise, not your back. Bend at the knees and hips, not at the waist. Your legs are stronger and less vulnerable than your lumbar spine.",
            },
            {
              id: "load",
              x: 50,
              y: 68,
              label: "Load Close to Body",
              description:
                "Keep the load as close to your centre of gravity as possible throughout the movement. The further the load is from your body, the greater the leverage force on your spine. Never reach out to pick up a load.",
            },
            {
              id: "base",
              x: 56,
              y: 88,
              label: "Stable Base",
              description:
                "Feet should be shoulder-width apart, with one foot slightly forward to give a stable, balanced platform. This allows you to shift weight and absorb movement without losing balance.",
            },
            {
              id: "movement",
              x: 50,
              y: 20,
              label: "Smooth Movement",
              description:
                "Move smoothly and avoid jerking, twisting, or sudden changes of direction while bearing a load. Always reposition your feet rather than twisting your spine if you need to change direction.",
            },
          ],
        },
        {
          type: "ordering-activity",
          items: [
            { id: "communicate", text: "Communicate with the patient — explain what you are about to do" },
            { id: "assess_patient", text: "Assess the patient — weight, dependency, cooperation, attachments" },
            { id: "assess_env", text: "Assess the environment — space, floor, equipment availability" },
            { id: "position", text: "Position yourself — stable base, load close, spine neutral" },
            { id: "move", text: "Move smoothly — using leg strength, no twisting" },
          ],
          correctOrder: ["assess_patient", "assess_env", "communicate", "position", "move"],
        },
      ],
    },
    {
      title: "When Not to Handle Alone",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Weight and Dependency Thresholds",
              content:
                "As a guide, a single handler should not lift more than approximately 25kg (for a fit adult worker in ideal conditions). Most patients in clinical settings require at least two handlers. Any patient who is unable to bear their own weight, is confused or uncooperative, or weighs above 120kg should be assessed for specialist equipment. These are guidelines — always use professional judgement.",
            },
            {
              title: "Patient Dependency Levels",
              content:
                "A fully dependent patient — unable to assist in any way — should almost never be moved manually by a single handler. Even partially dependent patients (who can bear some weight) may require two handlers depending on the task. Use a dependency level assessment to categorise each patient and plan moves accordingly.",
            },
            {
              title: "Equipment Requirements",
              content:
                "Hoists, slide sheets, transfer boards, and standing aids significantly reduce injury risk for both patient and handler. Where equipment is available, use it. If the appropriate equipment is not available, do not improvise an unsafe manual move — request the equipment or seek additional staff. Record equipment unavailability in the patient notes and report to management.",
            },
          ],
        },
        {
          type: "reflective-prompt",
          question:
            "Have you ever been asked to move a patient in a way that felt unsafe — perhaps alone, without equipment, or against your clinical judgement? What did you do, and what should have happened?",
        },
      ],
    },
    {
      title: "Clinical Scenario",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "It is 2am on a night shift. You are the only nurse on the bay. A post-operative patient woke up and slid down the bed during the night. They need repositioning up the bed. The patient is 95kg, is drowsy from post-operative analgesia, and cannot assist in the move. The hoist is in another bay. What do you do?",
          choices: [
            {
              text: "Reposition the patient manually using slide sheets — you can manage alone given the urgency",
              outcome: "incorrect",
              consequence:
                "A 95kg, fully drowsy, non-cooperative patient should not be moved by a single handler — even with slide sheets. The risk of injury to yourself and to the patient is significant. Urgency does not make an unsafe manual move safe.",
            },
            {
              text: "Call for assistance before moving and use the hoist from the other bay",
              outcome: "correct",
              consequence:
                "This is the correct approach. Ask another staff member to assist and retrieve the hoist. A short delay to mobilise safe equipment is preferable to a manual handling injury. Explain the situation to the patient and ensure they are comfortable and safe while you prepare. Document the decision and the reasons.",
            },
            {
              text: "Leave the patient and document that repositioning was not possible until morning",
              outcome: "incorrect",
              consequence:
                "Leaving a post-operative patient in an unsafe position until morning is not acceptable. The patient is at risk of pressure injury and airway compromise from poor positioning. The correct action is to call for help and use appropriate equipment — not to defer.",
            },
          ],
        },
      ],
    },
  ],
}
