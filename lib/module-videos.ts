// YouTube video IDs per competency title.
// Find the ID in the video URL: youtube.com/watch?v=VIDEO_ID
// Leave blank ("") to show a "video not yet available" message.
const VIDEO_IDS: Record<string, string> = {
  "Basic Life Support (BLS) — Theory": "n7kqiAu2gC8",
  "Infection Prevention and Control": "0p-kJuRaBpY",
  "Safeguarding Awareness": "x51BzIV3vJY",
  "Medicines Management — Fundamentals": "zrOO00jLUHM",
  "Health and Safety Awareness": "S_GF3Kf3Nrs",
  "Manual Handling — Theory": "F_pSRZemyjw",
  "Cardiopulmonary Resuscitation (CPR) — Practical": "Plse2FOkV4Q",
}

export function getVideoId(competencyTitle: string): string | null {
  return VIDEO_IDS[competencyTitle] || null
}
