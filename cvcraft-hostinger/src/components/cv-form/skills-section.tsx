"use client";

import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { CV } from "@/lib/schemas/cv";

interface SkillsSectionProps {
  jdAnalysis?: {
    keywords: string[];
    summary: string;
  } | null;
}

export function SkillsSection({ jdAnalysis }: SkillsSectionProps) {
  const { watch, setValue } = useFormContext<CV>();
  const skills = watch("skills") || [];
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestedSkills = jdAnalysis?.keywords.filter(k => !skills.includes(k)) || [];

  const addSkill = () => {
    const input = inputRef.current;
    const val = input?.value?.trim();
    if (val && !skills.includes(val)) {
      setValue("skills", [...skills, val], { shouldDirty: true });
      if (input) input.value = "";
    }
  };

  const removeSkill = (skill: string) => {
    setValue("skills", skills.filter((s) => s !== skill), { shouldDirty: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
        <span className="h-6 w-6 rounded-full bg-royal-gold/10 text-royal-gold flex items-center justify-center text-xs font-bold">5</span>
        Key Skills
        <span className="text-[10px] font-bold text-royal-gold bg-royal-gold/10 px-2 py-0.5 rounded-full uppercase tracking-tight">
          Critical for ATS
        </span>
      </h3>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          aria-label="Add a skill"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white outline-none transition-all"
          placeholder="Type a skill and press Enter…"
          onKeyDown={handleKeyDown}
        />
        <button
          type="button"
          onClick={addSkill}
          className="px-6 py-2.5 bg-royal-navy text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-sm"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-royal-navy/5 text-royal-navy border border-royal-navy/10 rounded-xl text-sm font-bold group hover:bg-royal-navy hover:text-white transition-all cursor-default"
          >
            {skill}
            <button
              type="button"
              aria-label={`Remove ${skill}`}
              onClick={() => removeSkill(skill)}
              className="ml-1 text-royal-navy/30 group-hover:text-white/70 hover:text-white transition-colors"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {suggestedSkills.length > 0 && (
        <div className="mt-6 p-4 bg-royal-gold/5 rounded-2xl border border-royal-gold/10">
          <h4 className="text-xs font-bold text-royal-gold uppercase tracking-wider mb-3">Suggested for this Job</h4>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => setValue("skills", [...skills, skill], { shouldDirty: true })}
                className="px-3 py-1.5 bg-white border border-royal-gold/20 text-royal-gold rounded-lg text-xs font-medium hover:bg-royal-gold hover:text-white transition-all shadow-sm"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
