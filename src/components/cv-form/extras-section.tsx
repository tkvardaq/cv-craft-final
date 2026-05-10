"use client";

import { useFormContext } from "react-hook-form";
import type { CV } from "@/lib/schemas/cv";

export function ExtrasSection() {
  const { watch, setValue } = useFormContext<CV>();
  const certifications = watch("certifications") || [];
  const languages = watch("languages") || [];

  const addItem = (field: "certifications" | "languages") => {
    const input = document.getElementById(`new-${field}-input`) as HTMLInputElement;
    const val = input?.value?.trim();
    const current = field === "certifications" ? certifications : languages;
    if (val && !current.includes(val)) {
      setValue(field, [...current, val]);
      if (input) input.value = "";
    }
  };

  const removeItem = (field: "certifications" | "languages", idx: number) => {
    const current = field === "certifications" ? certifications : languages;
    setValue(field, current.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-royal-navy">Certifications</h3>
        <div className="flex gap-2">
          <input 
            id="new-certifications-input" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white outline-none transition-all" 
            placeholder="PRINCE2, NMC Pin…" 
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("certifications"))} 
          />
          <button 
            type="button" 
            onClick={() => addItem("certifications")} 
            className="px-6 py-2.5 bg-royal-navy text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-sm"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {certifications.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-royal-gold/10 text-royal-gold border border-royal-gold/20 rounded-lg text-sm font-bold group">
              {c}
              <button type="button" onClick={() => removeItem("certifications", i)} className="ml-1 text-royal-gold/40 hover:text-red-500 transition-colors">×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="space-y-3 pt-4 border-t border-slate-50">
        <h3 className="text-lg font-bold text-royal-navy">Languages</h3>
        <div className="flex gap-2">
          <input 
            id="new-languages-input" 
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white outline-none transition-all" 
            placeholder="English (Native)…" 
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("languages"))} 
          />
          <button 
            type="button" 
            onClick={() => addItem("languages")} 
            className="px-6 py-2.5 bg-royal-navy text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-sm"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((l, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-royal-navy/5 text-royal-navy border border-royal-navy/10 rounded-lg text-sm font-bold group">
              {l}
              <button type="button" onClick={() => removeItem("languages", i)} className="ml-1 text-royal-navy/40 hover:text-red-500 transition-colors">×</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
