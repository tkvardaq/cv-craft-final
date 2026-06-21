import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash, randomUUID } from "crypto"
import type { CV } from "@/lib/schemas/cv"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hashString(str: string): string {
  return createHash("sha256").update(str).digest("hex");
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
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return randomUUID();
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


export function sanitizeUserText(input: unknown, maxLength: number, allowNewlines = false): string {
  if (typeof input !== "string") return "";
  let out = "";
  for (let i = 0; i < input.length && out.length < maxLength; i++) {
    const code = input.charCodeAt(i);
    if (allowNewlines && (code === 10 || code === 13)) {
      out += input[i];
      continue;
    }
    if (code < 32 || code === 127) {
      out += " ";
    } else {
      out += input[i];
    }
  }
  return out.trim();
}
