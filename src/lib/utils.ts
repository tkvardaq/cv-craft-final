import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

export function flattenCvText(cv: any): string {
  const parts = [
    cv.personal?.fullName,
    cv.personal?.jobTitle,
    cv.summary,
    ...(cv.experience?.map((e: any) => `${e.title} ${e.company} ${e.location} ${e.description} ${e.bullets?.join(" ")}`) || []),
    ...(cv.education?.map((e: any) => `${e.degree} ${e.school} ${e.field}`) || []),
    ...(cv.skills?.map((s: any) => (typeof s === 'string' ? s : s.name)) || []),
    ...(cv.languages?.map((l: any) => (typeof l === 'string' ? l : l.name)) || []),
    cv.extras?.join(" ")
  ];
  return parts.filter(Boolean).join(" ");
}
