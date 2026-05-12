import { ModernTemplate } from "./modern";
import { ProfessionalTemplate } from "./professional";
import { MinimalistTemplate } from "./minimalist";
import { ExecutiveTemplate } from "./executive";
import { CreativeTemplate } from "./creative";
import { AcademicTemplate } from "./academic";
import { FunctionalTemplate } from "./functional";
import { GraduateTemplate } from "./graduate";
import { PremiumGoldTemplate } from "./premium-gold";
import { ObsidianTemplate } from "./obsidian";
import type { CV } from "@/lib/schemas/cv";

export type TemplateId = 
  | "modern" 
  | "professional" 
  | "minimalist" 
  | "executive" 
  | "creative" 
  | "academic" 
  | "functional" 
  | "graduate" 
  | "premium-gold"
  | "obsidian";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  component: React.ComponentType<{ cv: CV }>;
  previewUrl?: string;
}

export const templates: TemplateDefinition[] = [
  {
    id: "modern",
    name: "Modern Sidebar",
    description: "A sleek two-column layout that highlights your key information.",
    component: ModernTemplate,
  },
  {
    id: "professional",
    name: "Corporate Classic",
    description: "Traditional single-column layout optimized for recruiters.",
    component: ProfessionalTemplate,
  },
  {
    id: "minimalist",
    name: "Clean & Simple",
    description: "Maximum readability with a minimalist aesthetic.",
    component: MinimalistTemplate,
  },
  {
    id: "executive",
    name: "The Executive",
    description: "Premium high-contrast layout for senior professionals.",
    component: ExecutiveTemplate,
  },
  {
    id: "creative",
    name: "Modern Tech",
    description: "Bold sidebar design perfect for startups and agencies.",
    component: CreativeTemplate,
  },
  {
    id: "academic",
    name: "The Scholar",
    description: "Traditional serif layout optimized for research and academia.",
    component: AcademicTemplate,
  },
  {
    id: "functional",
    name: "Skills Focused",
    description: "Focuses on skills rather than chronological experience. Ideal for career changers.",
    component: FunctionalTemplate,
  },
  {
    id: "graduate",
    name: "Early Career",
    description: "Prioritizes education and projects. Clean, modern look for entry-level professionals.",
    component: GraduateTemplate,
  },
  {
    id: "premium-gold",
    name: "The Royal Gold",
    description: "Our most prestigious template. Gold accents and a high-contrast sidebar for a commanding presence.",
    component: PremiumGoldTemplate,
  },
  {
    id: "obsidian",
    name: "The Obsidian",
    description: "The ultimate dark-themed layout for tech leaders and creative visionaries.",
    component: ObsidianTemplate,
  },
];

export function getTemplate(id: TemplateId = "professional") {
  return templates.find((t) => t.id === id) || templates[1];
}
