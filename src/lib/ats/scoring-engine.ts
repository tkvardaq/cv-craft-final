import type { CV, Sector } from "@/lib/schemas/cv";
import { flattenCvText } from "@/lib/utils";

// Sector keyword database with weights
export interface SectorKeyword {
  keyword: string;
  weight: number;
  mandatory?: boolean;
}

const SECTOR_KEYWORDS: Record<string, SectorKeyword[]> = {
  nhs: [
    { keyword: "safeguarding", weight: 2.0, mandatory: true },
    { keyword: "equality and diversity", weight: 2.0, mandatory: true },
    { keyword: "nmc registration", weight: 1.5 },
    { keyword: "patient care", weight: 1.2 },
    { keyword: "infection control", weight: 1.2 },
    { keyword: "hcpc", weight: 1.5 },
    { keyword: "clinical governance", weight: 1.2 },
    { keyword: "band 5", weight: 1.0 },
    { keyword: "band 6", weight: 1.0 },
    { keyword: "band 7", weight: 1.0 },
    { keyword: "multi-disciplinary", weight: 1.2 },
    { keyword: "care quality commission", weight: 1.2 },
    { keyword: "cqc", weight: 1.2 },
    { keyword: "nhs", weight: 1.0 },
    { keyword: "patient safety", weight: 1.2 },
    { keyword: "clinical audit", weight: 1.0 },
    { keyword: "evidence-based practice", weight: 1.0 },
    { keyword: "person-centred care", weight: 1.0 },
  ],
  "civil-service": [
    { keyword: "changing and improving", weight: 1.5 },
    { keyword: "making effective decisions", weight: 1.5 },
    { keyword: "communicating and influencing", weight: 1.5 },
    { keyword: "delivering at pace", weight: 1.5 },
    { keyword: "seeing the big picture", weight: 1.5 },
    { keyword: "working together", weight: 1.5 },
    { keyword: "developing self and others", weight: 1.5 },
    { keyword: "managing a quality service", weight: 1.5 },
    { keyword: "leadership", weight: 1.5 },
    { keyword: "policy development", weight: 1.2 },
    { keyword: "stakeholder engagement", weight: 1.2 },
    { keyword: "ministerial correspondence", weight: 1.0 },
    { keyword: "line management", weight: 1.0 },
    { keyword: "project delivery", weight: 1.2 },
    { keyword: "g7", weight: 1.0 },
    { keyword: "seo", weight: 1.0 },
    { keyword: "heo", weight: 1.0 },
    { keyword: "strategy", weight: 1.0 },
    { keyword: "governance", weight: 1.0 },
  ],
  tech: [
    { keyword: "agile", weight: 1.2 },
    { keyword: "scrum", weight: 1.0 },
    { keyword: "aws", weight: 1.2 },
    { keyword: "azure", weight: 1.2 },
    { keyword: "python", weight: 1.2 },
    { keyword: "javascript", weight: 1.2 },
    { keyword: "typescript", weight: 1.2 },
    { keyword: "react", weight: 1.2 },
    { keyword: "node.js", weight: 1.2 },
    { keyword: "ci/cd", weight: 1.2 },
    { keyword: "stakeholder management", weight: 1.2 },
    { keyword: "incident management", weight: 1.0 },
    { keyword: "devops", weight: 1.0 },
    { keyword: "microservices", weight: 1.0 },
    { keyword: "docker", weight: 1.0 },
    { keyword: "kubernetes", weight: 1.0 },
    { keyword: "git", weight: 1.0 },
    { keyword: "api", weight: 1.0 },
    { keyword: "database", weight: 1.0 },
    { keyword: "sql", weight: 1.0 },
  ],
  finance: [
    { keyword: "fca", weight: 1.5 },
    { keyword: "aml", weight: 1.5 },
    { keyword: "kyc", weight: 1.5 },
    { keyword: "financial modelling", weight: 1.2 },
    { keyword: "acca", weight: 1.2 },
    { keyword: "aca", weight: 1.2 },
    { keyword: "cima", weight: 1.2 },
    { keyword: "risk management", weight: 1.2 },
    { keyword: "stakeholder management", weight: 1.2 },
    { keyword: "ifrs", weight: 1.2 },
    { keyword: "regulatory reporting", weight: 1.2 },
    { keyword: "compliance", weight: 1.0 },
    { keyword: "audit", weight: 1.0 },
    { keyword: "budgeting", weight: 1.0 },
    { keyword: "forecasting", weight: 1.0 },
    { keyword: "investment", weight: 1.0 },
  ],
  general: [
    { keyword: "communication", weight: 1.0 },
    { keyword: "teamwork", weight: 1.0 },
    { keyword: "problem solving", weight: 1.0 },
    { keyword: "leadership", weight: 1.0 },
    { keyword: "time management", weight: 1.0 },
    { keyword: "customer service", weight: 1.0 },
    { keyword: "project management", weight: 1.0 },
    { keyword: "organisation", weight: 1.0 },
    { keyword: "adaptability", weight: 1.0 },
    { keyword: "attention to detail", weight: 1.0 },
  ],
};

const SOFT_SKILLS = [
  "communication",
  "teamwork",
  "problem solving",
  "time management",
  "leadership",
  "adaptability",
  "stakeholder management",
  "collaboration",
  "negotiation",
  "mentoring",
];

const UK_QUALIFICATIONS = [
  "degree", "bachelor", "master", "mba", "phd", "doctorate",
  "nmc", "cipd", "cima", "acca", "aca", "hcpc",
  "prince2", "itil", "pmp", "cfa", "frcs",
  "btec", "hnc", "hnd", "nvq", "pgce",
  "gcse", "a-level", "a level",
];

export interface AtsScoreResult {
  score: number;
  missingKeywords: string[];
  formatWarnings: string[];
  breakdown: {
    keywords: number;
    qualifications: number;
    titleAlignment: number;
    softSkills: number;
    formatCompliance: number;
  };
}

export function scoreCV(
  cv: CV,
  sector: Sector,
  targetTitle?: string
): AtsScoreResult {
  const text = flattenCvText(cv as unknown as Record<string, unknown>);
  const missingKeywords: string[] = [];
  const formatWarnings: string[] = [];

  // --- 1. KEYWORD MATCHING (35%) ---
  const sectorKws = [
    ...(SECTOR_KEYWORDS[sector] || []),
    ...(sector !== "general" ? SECTOR_KEYWORDS.general : []),
  ];
  const top30 = sectorKws.slice(0, 30);
  let keywordScore = 0;
  let totalWeight = 0;
  let mandatoryDeduction = 0;

  for (const kw of top30) {
    totalWeight += kw.weight;
    if (text.includes(kw.keyword.toLowerCase())) {
      keywordScore += kw.weight;
    } else {
      missingKeywords.push(kw.keyword);
      // NHS mandatory check
      if (sector === "nhs" && kw.mandatory) {
        mandatoryDeduction += 15;
      }
    }
  }

  const keywordPct =
    totalWeight > 0 ? (keywordScore / totalWeight) * 35 : 0;

  // --- 2. QUALIFICATIONS (25%) ---
  let qualFound = 0;
  for (const qual of UK_QUALIFICATIONS) {
    if (text.includes(qual.toLowerCase())) {
      qualFound++;
    }
  }
  const qualPct = Math.min(qualFound / 3, 1) * 25;

  // --- 3. TITLE ALIGNMENT (20%) ---
  let titlePct = 10; // Default 50% if no target
  if (targetTitle && cv.experience.length > 0) {
    const latestTitle = cv.experience[0].title.toLowerCase();
    const target = targetTitle.toLowerCase();
    const targetWords = target.split(/\s+/);
    const matchCount = targetWords.filter((w) =>
      latestTitle.includes(w)
    ).length;
    titlePct = (matchCount / targetWords.length) * 20;
  }

  // --- 4. SOFT SKILLS (15%) ---
  let softFound = 0;
  for (const skill of SOFT_SKILLS) {
    if (text.includes(skill.toLowerCase())) {
      softFound++;
    }
  }
  const softPct = Math.min(softFound / 4, 1) * 15;

  // --- 5. FORMAT COMPLIANCE (5%) ---
  let formatPct = 5;
  if (!cv.personal.firstName || !cv.personal.email) {
    formatWarnings.push("Missing essential contact information");
    formatPct -= 1;
  }
  if (!cv.professionalSummary || cv.professionalSummary.length < 50) {
    formatWarnings.push("Professional summary is missing or too short");
    formatPct -= 1;
  }
  if (cv.experience.length === 0) {
    formatWarnings.push("No work experience listed");
    formatPct -= 1;
  }
  if (cv.education.length === 0) {
    formatWarnings.push("No education listed");
    formatPct -= 1;
  }
  if (cv.skills.length === 0) {
    formatWarnings.push("Skills section is empty — critical for agency ATS (Bullhorn/JobAdder)");
    formatPct -= 1;
  }

  // Agency compliance: skills should be prominent
  if (sector === "general" || sector === "tech" || sector === "finance") {
    if (cv.skills.length < 3) {
      formatWarnings.push(
        "Add at least 3 key skills for better ATS ranking with recruitment agencies"
      );
    }
  }

  formatPct = Math.max(formatPct, 0);

  // --- COMBINE ---
  let rawScore = Math.round(keywordPct + qualPct + titlePct + softPct + formatPct);

  // Apply NHS mandatory deduction
  rawScore = Math.max(0, rawScore - mandatoryDeduction);

  const score = Math.min(100, Math.max(0, rawScore));

  return {
    score,
    missingKeywords,
    formatWarnings,
    breakdown: {
      keywords: Math.round(keywordPct),
      qualifications: Math.round(qualPct),
      titleAlignment: Math.round(titlePct),
      softSkills: Math.round(softPct),
      formatCompliance: Math.round(formatPct),
    },
  };
}
