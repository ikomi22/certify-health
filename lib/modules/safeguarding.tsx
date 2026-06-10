import type { InteractiveContent } from "./types"

export const safeguardingContent: InteractiveContent = {
  sections: [
    {
      title: "What Safeguarding Means",
      blocks: [
        {
          type: "text",
          content:
            "Safeguarding means protecting people's health, wellbeing, and human rights — ensuring they can live free from harm, abuse, and neglect. In a healthcare setting, it is not an optional add-on to clinical care. It is a core professional duty.\n\nSafeguarding applies to all patients, regardless of age or background. Children are protected under child protection frameworks. Adults — including elderly patients, people with disabilities, and anyone in a dependent relationship — are protected under adult safeguarding principles.\n\nAs a healthcare worker, you may be the first person outside the home to notice signs of abuse. That makes your awareness and action critical. You do not need certainty to act — you need reasonable concern.",
        },
        {
          type: "knowledge-check",
          question: "Safeguarding responsibilities apply to which of the following groups?",
          options: [
            {
              text: "Children under 18 only",
              correct: false,
              explanation: "Safeguarding applies to both children and vulnerable adults. Adults with disabilities, elderly patients, and those in dependent relationships all fall within safeguarding frameworks.",
            },
            {
              text: "Only patients who have reported abuse",
              correct: false,
              explanation: "Safeguarding does not require a patient to report abuse. Healthcare workers have a duty to act on reasonable concern, even if the patient has not disclosed anything.",
            },
            {
              text: "Children and vulnerable adults",
              correct: true,
              explanation: "Safeguarding covers both children and vulnerable adults — anyone who may be at risk of harm, abuse, or neglect in a dependent or caring relationship.",
            },
            {
              text: "Only patients admitted for safeguarding-related injuries",
              correct: false,
              explanation: "Safeguarding awareness must be maintained for all patient interactions, not only those presenting with known injuries.",
            },
          ],
        },
      ],
    },
    {
      title: "Recognising Abuse and Neglect",
      blocks: [
        {
          type: "reveal-cards",
          cards: [
            {
              title: "Physical Abuse",
              content:
                "Signs include unexplained bruising (especially in unusual locations — torso, back, buttocks), fractures inconsistent with the stated history, burns or marks with regular patterns, and injury at different healing stages. Be alert to explanations that change or do not match the injury.",
            },
            {
              title: "Emotional and Psychological Abuse",
              content:
                "Harder to identify physically. Look for a patient who appears fearful, withdrawn, or unable to speak without a carer's presence. A carer who answers for the patient, dismisses their concerns, or controls access to food, money, or communication may be causing psychological harm.",
            },
            {
              title: "Financial Abuse",
              content:
                "Unexpected changes in financial situation, unpaid bills despite adequate income, missing money or valuables, pressure from family members to sign financial documents, or a patient expressing anxiety about money they cannot explain. Older patients and those with cognitive impairment are most at risk.",
            },
            {
              title: "Institutional Abuse",
              content:
                "Occurs within care settings — hospitals, care homes, or residential facilities. Includes routine disregard for dignity (leaving patients unwashed, unfed, or in soiled clothing), use of inappropriate restraint, denial of privacy, or applying blanket restrictions not based on individual risk.",
            },
            {
              title: "Neglect",
              content:
                "Failure to meet basic needs — nutrition, hygiene, medical care. In clinical settings, watch for pressure ulcers in patients who should be repositioned, unexplained weight loss, dental decay, or extreme dehydration. Neglect can be active (deliberate) or passive (due to ignorance or resource constraint).",
            },
          ],
        },
      ],
    },
    {
      title: "Your Responsibilities",
      blocks: [
        {
          type: "ordering-activity",
          items: [
            { id: "review", text: "Review — follow up to ensure the concern was addressed" },
            { id: "report", text: "Report — inform your line manager or designated safeguarding lead" },
            { id: "recognise", text: "Recognise — identify indicators of potential abuse or neglect" },
            { id: "refer", text: "Refer — escalate to safeguarding team or external authority if needed" },
            { id: "record", text: "Record — document your observations accurately and factually" },
          ],
          correctOrder: ["recognise", "record", "report", "refer", "review"],
        },
        {
          type: "knowledge-check",
          question: "You suspect a patient is being financially abused by a family member. The patient asks you not to tell anyone. What do you do?",
          options: [
            {
              text: "Respect the patient's wish and take no further action",
              correct: false,
              explanation: "A patient's request for confidentiality cannot override your safeguarding duty when there is risk of harm. You must still report to your designated safeguarding lead.",
            },
            {
              text: "Report your concern to the safeguarding lead, explain you must do this even if the patient disagrees",
              correct: true,
              explanation: "You have a professional duty to raise safeguarding concerns even when the patient objects. Explain your obligations respectfully, and reassure the patient you will advocate for their best interests.",
            },
            {
              text: "Confront the family member directly",
              correct: false,
              explanation: "Confronting the alleged abuser directly risks escalating harm to the patient and is not your role. Concerns must be raised through the appropriate safeguarding channels.",
            },
            {
              text: "Document the concern and wait to see if it escalates",
              correct: false,
              explanation: "Waiting before reporting when a concern already exists increases the risk of ongoing harm. Document and report immediately — do not wait.",
            },
          ],
        },
      ],
    },
    {
      title: "Nigerian Context",
      blocks: [
        {
          type: "text",
          content:
            "In Nigeria, cultural expectations around family authority, elder respect, and community privacy can create additional complexity when safeguarding concerns arise.\n\nFamily members — even those causing harm — are often present continuously on wards and hold significant influence over a patient's decisions and disclosures. Older patients in particular may be reluctant to raise concerns about family members out of loyalty or fear of social consequences.\n\nCommunity dynamics can also affect what patients are willing to disclose. Shame, stigma around mental health or disability, and fear of legal consequences for the family may all deter disclosure.\n\nNone of these factors remove your duty to act on reasonable concern. Your role is to be a safe, non-judgmental person the patient can trust — and to escalate through formal channels when that concern reaches the threshold for action.",
        },
        {
          type: "reflective-prompt",
          question:
            "Think about a situation where cultural expectations might make it harder to raise a safeguarding concern in your ward or facility. How would you navigate that — and who would you turn to for support?",
        },
      ],
    },
    {
      title: "Clinical Scenario",
      blocks: [
        {
          type: "scenario-choice",
          scenario:
            "An elderly male patient, 78, is admitted with dehydration. During your assessment you notice several faded bruises on his upper arms. His adult son is present throughout and answers all your questions on the patient's behalf. When you ask the patient directly how the bruises occurred, he looks at his son before saying 'I fall sometimes'. The son quickly adds 'He's very unsteady — it happens all the time.' What do you do?",
          choices: [
            {
              text: "Accept the explanation, document the bruises, and continue routine care",
              outcome: "incorrect",
              consequence:
                "The combination of indicators — faded bruising in an unusual location, a carer answering for the patient, and a brief, checked response — represents a safeguarding concern that cannot be dismissed. Accepting the explanation without further action would be a failure of your duty.",
            },
            {
              text: "Document your observations, find an opportunity to speak with the patient alone, and report your concern to the safeguarding lead",
              outcome: "correct",
              consequence:
                "This is the correct approach. Document exactly what you observed — including the patient's verbal and non-verbal behaviour. Arrange a moment to speak with the patient without the son present. Report your concern to the designated safeguarding lead without delay. You do not need certainty — reasonable concern is sufficient to act.",
            },
            {
              text: "Confront the son directly about the bruises before involving anyone else",
              outcome: "incorrect",
              consequence:
                "Confronting a possible abuser directly and alone is unsafe and outside your role. It may alert them, increase risk to the patient, and compromise any subsequent investigation. Always escalate through formal channels.",
            },
          ],
        },
      ],
    },
  ],
}
