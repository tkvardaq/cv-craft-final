"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type CV, type Sector, emptyCv } from "@/lib/schemas/cv";
import { type TemplateId } from "@/lib/pdf/templates";

interface CvState {
  cv: CV;
  sector: Sector;
  score: number | null;
  missingKeywords: string[];
  formatWarnings: string[];
  isPremium: boolean;
  credits: number;
  isLoading: boolean;
  selectedTemplate: TemplateId;

  // Actions
  setCv: (cv: CV) => void;
  updateCv: (partial: Partial<CV>) => void;
  setSector: (sector: Sector) => void;
  setScore: (score: number, missingKeywords: string[], formatWarnings: string[]) => void;
  setIsPremium: (isPremium: boolean) => void;
  setCredits: (credits: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  setTemplate: (templateId: TemplateId) => void;
  reset: () => void;
}

export const useCvStore = create<CvState>()(
  persist(
    (set) => ({
      cv: emptyCv,
      sector: "general",
      score: null,
      missingKeywords: [],
      formatWarnings: [],
      isPremium: false,
      credits: 3,
      isLoading: false,
      selectedTemplate: "professional",

      setCv: (cv) => set({ cv }),
      updateCv: (partial) =>
        set((state) => ({ cv: { ...state.cv, ...partial } })),
      setSector: (sector) => set({ sector }),
      setScore: (score, missingKeywords, formatWarnings) =>
        set({ score, missingKeywords, formatWarnings }),
      setIsPremium: (isPremium) => set({ isPremium }),
      setCredits: (credits) => set({ credits }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setTemplate: (selectedTemplate) => set({ selectedTemplate }),
      reset: () =>
        set({
          cv: emptyCv,
          sector: "general",
          score: null,
          missingKeywords: [],
          formatWarnings: [],
        }),
    }),
    {
      name: "cvcraft-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist UI/preference state. CV data, premium status, and credits
      // are sourced from the server to avoid stale local copies.
      partialize: (state) => ({
        sector: state.sector,
        selectedTemplate: state.selectedTemplate,
      }),
      skipHydration: true,
    }
  )
);
