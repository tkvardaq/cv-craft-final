"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { useState } from "react";
import type { CV } from "@/lib/schemas/cv";
import { generateId } from "@/lib/utils";
import { useCvStore } from "@/lib/store/cv-store";

export function ExperienceSection() {
  const { register, control, getValues, setValue, formState: { errors } } = useFormContext<CV>();
  const { fields, append, remove } = useFieldArray({ control, name: "experience" });
  const sector = useCvStore((s) => s.sector);
  const isPremium = useCvStore((s) => s.isPremium);
  const credits = useCvStore((s) => s.credits);
  const setCredits = useCvStore((s) => s.setCredits);
  const [rewriting, setRewriting] = useState<string | null>(null);

  const addExperience = () => {
    append({
      id: generateId(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "Present",
      bullets: [""],
    });
  };

  const rewriteBullet = async (expIndex: number, bulletIndex: number, text: string, jobTitle: string) => {
    if (!isPremium && credits <= 0) {
      alert("Daily AI rewrite limit reached. Upgrade to Premium for unlimited rewrites.");
      return;
    }

    const key = `${expIndex}-${bulletIndex}`;
    setRewriting(key);

    try {
      const res = await fetch("/api/ai/rewrite-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          bulletText: text, 
          jobTitle, 
          sector,
          targetJd: getValues("targetJobDescription")
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Rewrite failed");
        return;
      }

      const data = await res.json();
      const currentExp = getValues(`experience.${expIndex}`);
      if (currentExp) {
        const newBullets = [...(currentExp.bullets || [])];
        newBullets[bulletIndex] = data.rewritten;
        setValue(`experience.${expIndex}.bullets`, newBullets, { shouldDirty: true, shouldValidate: true });
      }
      if (data.creditsRemaining >= 0) {
        setCredits(data.creditsRemaining);
      }
    } catch (err) {
      console.error("Rewrite error:", err);
      alert("Failed to rewrite. Please try again.");
    } finally {
      setRewriting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-royal-gold/10 text-royal-gold flex items-center justify-center text-xs font-bold">4</span>
          Work Experience
        </h3>
        <button
          type="button"
          onClick={addExperience}
          className="px-4 py-2 bg-royal-navy text-white rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all shadow-sm shadow-royal-navy/10"
        >
          + Add Role
        </button>
      </div>

      {fields.map((field, expIdx) => (
        <div key={field.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-slate-600">Role {expIdx + 1}</span>
            <button
              type="button"
              onClick={() => remove(expIdx)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Job Title *</label>
              <input
                {...register(`experience.${expIdx}.title`)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="Software Engineer"
              />
              {errors.experience?.[expIdx]?.title && (
                <p className="text-xs text-red-500 mt-1">{errors.experience[expIdx].title?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Company *</label>
              <input
                {...register(`experience.${expIdx}.company`)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="Acme Ltd"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
              <input
                {...register(`experience.${expIdx}.location`)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="London, UK"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Start</label>
                <input
                  type="month"
                  {...register(`experience.${expIdx}.startDate`)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">End</label>
                <input
                  {...register(`experience.${expIdx}.endDate`)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                  placeholder="Present"
                />
              </div>
            </div>
          </div>

          {/* Bullets */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-600">Achievements & Responsibilities</label>
            {(field.bullets || [""]).map((_, bulletIdx) => (
              <div key={bulletIdx} className="flex gap-2 items-start">
                <span className="text-slate-400 mt-2.5 text-xs">•</span>
                <textarea
                  {...register(`experience.${expIdx}.bullets.${bulletIdx}`)}
                  rows={2}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white resize-none outline-none transition-all"
                  placeholder="Describe your achievement using the STAR method…"
                />
                <button
                  type="button"
                  disabled={rewriting === `${expIdx}-${bulletIdx}`}
                  onClick={() => {
                    const val = getValues(`experience.${expIdx}.bullets.${bulletIdx}`) || "";
                    const title = getValues(`experience.${expIdx}.title`) || "";
                    if (val.trim()) rewriteBullet(expIdx, bulletIdx, val, title);
                  }}
                  className="mt-1 px-3 py-2 bg-gradient-to-br from-royal-navy to-slate-700 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-royal-navy/10 disabled:opacity-50 transition-all whitespace-nowrap flex items-center gap-1.5 border border-white/10"
                  title="AI STAR Rewrite"
                >
                  {rewriting === `${expIdx}-${bulletIdx}` ? "…" : "✨ Royal Edit"}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const currentBullets = getValues(`experience.${expIdx}.bullets`) || [];
                setValue(`experience.${expIdx}.bullets`, [...currentBullets, ""], { shouldDirty: true, shouldValidate: true });
              }}
              className="text-xs text-royal-gold hover:text-royal-gold-dark font-bold transition-colors mt-2 block"
            >
              + Add achievement
            </button>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <button
          type="button"
          onClick={addExperience}
          className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors text-sm"
        >
          + Add your first work experience
        </button>
      )}

      {!isPremium && (
        <p className="text-xs text-slate-400 text-center">
          {credits > 0 ? `${credits} AI rewrites remaining today` : "AI rewrite limit reached — upgrade for unlimited"}
        </p>
      )}
    </div>
  );
}
