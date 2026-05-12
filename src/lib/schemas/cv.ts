import { z } from "zod";

export const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().default(""),
  linkedin: z.string().default(""),
});

export const experienceSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().default(""),
  startDate: z.string().min(1, "Start date is required"), // YYYY-MM
  endDate: z.union([z.string(), z.literal("Present")]).default("Present"),
  bullets: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.number().min(1900).max(2100),
  grade: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().default(""),
  link: z.string().optional(),
});

export const awardSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Award name is required"),
  issuer: z.string().default(""),
  year: z.number().min(1900).max(2100),
});

export const cvSchema = z.object({
  title: z.string().default("Untitled Resume"),
  personal: personalSchema,
  professionalSummary: z.string().default(""),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  awards: z.array(awardSchema).default([]),
  skills: z.array(z.string()).default([]),
  certifications: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  targetJobDescription: z.string().default(""),
  templateId: z.enum([
    "modern", 
    "professional", 
    "minimalist", 
    "executive", 
    "creative", 
    "academic", 
    "functional", 
    "graduate", 
    "premium-gold",
    "obsidian"
  ]).default("professional"),
});

export type CV = z.infer<typeof cvSchema>;
export type Personal = z.infer<typeof personalSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Award = z.infer<typeof awardSchema>;

export const emptyCv: CV = {
  title: "Untitled Resume",
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
  },
  professionalSummary: "",
  experience: [],
  education: [],
  projects: [],
  awards: [],
  skills: [],
  certifications: [],
  languages: [],
  targetJobDescription: "",
  templateId: "professional",
};

export const SECTORS = [
  "general",
  "nhs",
  "civil-service",
  "tech",
  "finance",
] as const;

export type Sector = (typeof SECTORS)[number];
