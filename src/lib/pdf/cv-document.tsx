"use client";

import {
  Document,
} from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas/cv";
import { getTemplate, type TemplateId } from "./templates";

interface CVDocumentProps {
  cv: CV;
  isPremium?: boolean;
  templateId?: TemplateId;
}

export function CVDocument({ cv, templateId = "professional" }: CVDocumentProps) {
  const template = getTemplate(templateId);
  const TemplateComponent = template.component;

  return (
    <Document 
      title={`${cv.personal.firstName}_${cv.personal.lastName}_Resume`}
      author="CvCRAFT.uk"
      creator="CvCRAFT AI Resume Builder"
    >
      <TemplateComponent cv={cv} />
    </Document>
  );
}
