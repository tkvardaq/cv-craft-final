import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function flattenCvText(cv: Record<string, unknown>): string {
  const parts: string[] = [];

  function walk(obj: unknown) {
    if (typeof obj === "string") {
      parts.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(walk);
    } else if (obj && typeof obj === "object") {
      Object.values(obj).forEach(walk);
    }
  }

  walk(cv);
  return parts.join(" ").toLowerCase();
}
