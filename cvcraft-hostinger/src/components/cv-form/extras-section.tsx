"use client";

import { useRef } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { CV } from "@/lib/schemas/cv";
import { generateId } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Award as AwardIcon, FolderGit2, GraduationCap, Languages as LanguagesIcon } from "lucide-react";

export function ExtrasSection() {
  const { register, control, watch, setValue, formState: { errors } } = useFormContext<CV>();
  
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: "projects"
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: "awards"
  });

  const certifications = watch("certifications") || [];
  const languages = watch("languages") || [];
  const certInputRef = useRef<HTMLInputElement>(null);
  const langInputRef = useRef<HTMLInputElement>(null);

  const addItem = (field: "certifications" | "languages") => {
    const input = field === "certifications" ? certInputRef.current : langInputRef.current;
    const val = input?.value?.trim();
    const current = field === "certifications" ? certifications : languages;
    if (val && !current.includes(val)) {
      setValue(field, [...current, val], { shouldDirty: true });
      if (input) input.value = "";
    }
  };

  const removeItem = (field: "certifications" | "languages", value: string) => {
    const current = field === "certifications" ? certifications : languages;
    setValue(field, current.filter((v) => v !== value), { shouldDirty: true });
  };

  return (
    <div className="space-y-10">
      {/* Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-royal-gold" />
            Projects
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendProject({ id: generateId(), name: "", description: "", link: "" })}
            className="text-xs border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Project
          </Button>
        </div>
        
        <div className="space-y-4">
          {projectFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-3 relative group">
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Name</label>
                  <Input
                    {...register(`projects.${index}.name`)}
                    placeholder="e.g. Portfolio Website"
                    className="bg-white border-slate-200 rounded-xl"
                  />
                  {errors.projects?.[index]?.name && (
                    <p className="text-[10px] text-red-500">{errors.projects[index]?.name?.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Link (Optional)</label>
                  <Input
                    {...register(`projects.${index}.link`)}
                    placeholder="https://github.com/..."
                    className="bg-white border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                <Textarea
                  {...register(`projects.${index}.description`)}
                  placeholder="Key features, technologies used, and your role..."
                  className="bg-white border-slate-200 rounded-xl resize-none h-20"
                />
              </div>
            </div>
          ))}
          {projectFields.length === 0 && (
            <p className="text-sm text-slate-400 italic text-center py-4">No projects added yet.</p>
          )}
        </div>
      </div>

      {/* Awards Section */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
            <AwardIcon className="h-5 w-5 text-royal-gold" />
            Awards & Honors
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendAward({ id: generateId(), name: "", issuer: "", year: new Date().getFullYear() })}
            className="text-xs border-royal-navy text-royal-navy hover:bg-royal-navy hover:text-white"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Award
          </Button>
        </div>
        
        <div className="space-y-4">
          {awardFields.map((field, index) => (
            <div key={field.id} className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 space-y-3 relative">
              <button
                type="button"
                onClick={() => removeAward(index)}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Award Name</label>
                  <Input
                    {...register(`awards.${index}.name`)}
                    placeholder="e.g. Employee of the Month"
                    className="bg-white border-slate-200 rounded-xl"
                  />
                  {errors.awards?.[index]?.name && (
                    <p className="text-[10px] text-red-500">{errors.awards[index]?.name?.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year</label>
                  <Input
                    type="number"
                    {...register(`awards.${index}.year`, { valueAsNumber: true })}
                    className="bg-white border-slate-200 rounded-xl"
                  />
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Issuer / Organization</label>
                  <Input
                    {...register(`awards.${index}.issuer`)}
                    placeholder="e.g. Google Cloud"
                    className="bg-white border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
          {awardFields.length === 0 && (
            <p className="text-sm text-slate-400 italic text-center py-4">No awards added yet.</p>
          )}
        </div>
      </div>

      {/* Certifications & Languages (Kept as tags for simplicity as per existing design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-royal-gold" />
            Certifications
          </h3>
          <div className="flex gap-2">
            <Input
              ref={certInputRef}
              aria-label="Add a certification"
              className="bg-white border-slate-200 rounded-xl text-sm"
              placeholder="PRINCE2, NMC Pin…"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("certifications"))}
            />
            <Button 
              type="button" 
              onClick={() => addItem("certifications")} 
              className="bg-royal-navy text-white rounded-xl shadow-sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-royal-gold/10 text-royal-gold border border-royal-gold/20 rounded-lg text-sm font-bold group">
                {c}
                <button type="button" aria-label={`Remove ${c}`} onClick={() => removeItem("certifications", c)} className="ml-1 text-royal-gold/40 hover:text-red-500 transition-colors">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-royal-navy flex items-center gap-2">
            <LanguagesIcon className="h-5 w-5 text-royal-gold" />
            Languages
          </h3>
          <div className="flex gap-2">
            <Input
              ref={langInputRef}
              aria-label="Add a language"
              className="bg-white border-slate-200 rounded-xl text-sm"
              placeholder="English (Native)…"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("languages"))}
            />
            <Button 
              type="button" 
              onClick={() => addItem("languages")} 
              className="bg-royal-navy text-white rounded-xl shadow-sm"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((l) => (
              <span key={l} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-royal-navy/5 text-royal-navy border border-royal-navy/10 rounded-lg text-sm font-bold group">
                {l}
                <button type="button" aria-label={`Remove ${l}`} onClick={() => removeItem("languages", l)} className="ml-1 text-royal-navy/40 hover:text-red-500 transition-colors">×</button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

