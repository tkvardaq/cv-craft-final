import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CV } from "@/lib/schemas/cv"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export function formatDate(date: string | Date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export function flattenCvText(cv: Partial<CV>): string {
  const parts = [
    cv.personal ? `${cv.personal.firstName ?? ""} ${cv.personal.lastName ?? ""}` : "",
    cv.professionalSummary,
    ...(cv.experience?.map((experience) => `${experience.title} ${experience.company} ${experience.location} ${experience.bullets?.join(" ")}`) || []),
    ...(cv.education?.map((education) => `${education.degree} ${education.institution} ${education.grade ?? ""}`) || []),
    ...(cv.skills || []),
    ...(cv.languages || []),
    ...(cv.certifications || []),
  ];
  return parts.filter(Boolean).join(" ");
}
