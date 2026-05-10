"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import type { CV } from "@/lib/schemas/cv";
import { generateId } from "@/lib/utils";

export function EducationSection() {
  const { register, control, formState: { errors } } = useFormContext<CV>();
  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  const addEducation = () => {
    append({
      id: generateId(),
      degree: "",
      institution: "",
      year: new Date().getFullYear(),
      grade: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-royal-gold/10 text-royal-gold flex items-center justify-center text-xs font-bold">5</span>
          Education
        </h3>
        <button
          type="button"
          onClick={addEducation}
          className="px-4 py-2 bg-royal-navy text-white rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all shadow-sm shadow-royal-navy/10"
        >
          + Add
        </button>
      </div>

      {fields.map((field, idx) => (
        <div key={field.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <span className="text-sm font-bold text-royal-navy">Qualification {idx + 1}</span>
            <button type="button" onClick={() => remove(idx)} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Degree / Qualification *</label>
              <input
                {...register(`education.${idx}.degree`)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="BSc Computer Science"
              />
              {errors.education?.[idx]?.degree && (
                <p className="text-xs text-red-500 mt-1">{errors.education[idx].degree?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Institution *</label>
              <input
                {...register(`education.${idx}.institution`)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="University of Manchester"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Year</label>
              <input
                type="number"
                {...register(`education.${idx}.year`, { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="2022"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Grade / Classification</label>
              <input
                {...register(`education.${idx}.grade`)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-royal-gold focus:border-transparent text-sm bg-white transition-all outline-none"
                placeholder="First Class Honours"
              />
            </div>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <button
          type="button"
          onClick={addEducation}
          className="w-full py-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-royal-gold hover:text-royal-gold hover:bg-royal-gold/5 transition-all text-sm font-medium"
        >
          + Add your education history
        </button>
      )}
    </div>
  );
}
