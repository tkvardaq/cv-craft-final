"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cvSchema, emptyCv, type CV } from "@/lib/schemas/cv";
import { PersonalSection } from "./personal-section";
import { ExperienceSection } from "./experience-section";
import { EducationSection } from "./education-section";
import { SkillsSection } from "./skills-section";
import { SummarySection } from "./summary-section";
import { ExtrasSection } from "./extras-section";
import { SectionNav } from "./section-nav";
import { AtsScoreWidget } from "../builder/ats-score-widget";
import { PDFPreview } from "../pdf-preview/pdf-viewer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ArrowRight, Save, Layout, Search, Eye, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const SECTIONS = ["personal", "summary", "experience", "education", "skills", "extras"];

export function CvBuilderForm({ initialId, isPremium = false }: { initialId?: string; isPremium?: boolean }) {
  const [activeSection, setActiveSection] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState<{ keywords: string[]; summary: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvId, setCvId] = useState<string | undefined>(initialId);
  
  const methods = useForm<CV>({
    resolver: zodResolver(cvSchema),
    defaultValues: emptyCv,
    mode: "onChange"
  });

  const { watch, trigger, handleSubmit, reset, register, getValues } = methods;
  const formValues = watch();

  // Load initial data
  useEffect(() => {
    const loadCv = async () => {
      try {
        const url = cvId ? `/api/cv?id=${cvId}` : "/api/cv";
        const res = await fetch(url);
        const { data, id } = await res.json();
        if (data) {
          reset(data);
        }
        if (id) {
          setCvId(id);
        }
      } catch (err) {
        console.error("Failed to load CV", err);
      }
    };
    loadCv();
  }, [reset, cvId]);

  // Auto-save logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (methods.formState.isDirty) {
        onSubmit(formValues);
      }
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formValues, methods.formState.isDirty]);

  // Track completed sections
  useEffect(() => {
    const completed = [];
    if (formValues.personal?.firstName && formValues.personal?.lastName && formValues.personal?.email) completed.push("personal");
    if (formValues.professionalSummary) completed.push("summary");
    if (formValues.experience?.length > 0) completed.push("experience");
    if (formValues.education?.length > 0) completed.push("education");
    if (formValues.skills?.length > 0) completed.push("skills");
    setCompletedSections(completed);
  }, [formValues]);

  const handleAnalyzeJd = async () => {
    const jd = getValues("targetJobDescription");
    if (!jd) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jd }),
      });

      if (res.ok) {
        const data = await res.json();
        setJdAnalysis(data);
      }
    } catch (err) {
      console.error("Failed to analyze JD", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: CV) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: cvId }),
      });
      
      if (!response.ok) throw new Error("Failed to save");
      
      const { data: savedData } = await response.json();
      if (savedData?.id && !cvId) {
        setCvId(savedData.id);
        // Update URL without refreshing to reflect the new ID
        window.history.replaceState(null, "", `/builder?id=${savedData.id}`);
      }

      console.log("Saved CV successfully");
    } catch (error) {
      console.error("Failed to save CV", error);
    } finally {
      setIsSaving(false);
    }
  };


  const nextSection = async () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      const fieldsToValidate = getFieldsForSection(activeSection);
      const isValid = await trigger(fieldsToValidate as any);
      
      if (isValid) {
        setActiveSection(SECTIONS[currentIndex + 1]);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const prevSection = () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(SECTIONS[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getFieldsForSection = (section: string) => {
    switch (section) {
      case "personal": return ["personal.firstName", "personal.lastName", "personal.email", "personal.phone"];
      case "summary": return ["professionalSummary"];
      case "experience": return ["experience"];
      case "education": return ["education"];
      case "skills": return ["skills"];
      default: return [];
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col lg:hidden mb-6 gap-4">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
           <div className="flex gap-2">
             <Button 
               variant={!showPreview ? "default" : "outline"} 
               size="sm" 
               onClick={() => setShowPreview(false)}
               className={cn(!showPreview && "bg-royal-navy")}
             >
               <FileText className="mr-2 h-4 w-4" />
               Edit
             </Button>
             <Button 
               variant={showPreview ? "default" : "outline"} 
               size="sm" 
               onClick={() => setShowPreview(true)}
               className={cn(showPreview && "bg-royal-navy")}
             >
               <Eye className="mr-2 h-4 w-4" />
               Preview
             </Button>
           </div>
           <AtsScoreWidget jdAnalysis={jdAnalysis} isPremium={isPremium} compact />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-2 hidden lg:block sticky top-24">
          <SectionNav 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            completedSections={completedSections}
          />
        </div>

        {/* Main Form Area */}
        <div className={cn(
          "lg:col-span-6 min-w-0 transition-all duration-500",
          showPreview ? "hidden lg:block" : "block"
        )}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 min-h-[600px] transition-all duration-300">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-6">
                <div className="flex-1">
                  <input 
                    {...register("title")}
                    className="text-2xl font-bold text-royal-navy bg-transparent border-none p-0 focus:ring-0 w-full placeholder:text-slate-300"
                    placeholder="Resume Title (e.g. Software Engineer)"
                  />
                  <p className="text-slate-500 text-sm mt-1 capitalize">{activeSection.replace("-", " ")} Section</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md",
                    isSaving ? "bg-amber-100 text-amber-700 animate-pulse" : "bg-emerald-100 text-emerald-700"
                  )}>
                    {isSaving ? "Saving..." : "Draft Saved"}
                  </span>
                </div>
              </div>

              {activeSection === "personal" && <PersonalSection />}
              {activeSection === "summary" && <SummarySection />}
              {activeSection === "experience" && <ExperienceSection />}
              {activeSection === "education" && <EducationSection />}
              {activeSection === "skills" && <SkillsSection jdAnalysis={jdAnalysis} />}
              {activeSection === "extras" && <ExtrasSection />}
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={prevSection}
                disabled={activeSection === "personal"}
                className="text-slate-500 hover:text-royal-navy"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                {activeSection !== "extras" ? (
                  <Button 
                    type="button" 
                    onClick={nextSection}
                    className="bg-royal-navy hover:bg-opacity-90 text-white px-8"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-royal-gold hover:bg-royal-gold-dark text-white px-8 shadow-lg shadow-royal-gold/20"
                  >
                    {isSaving ? "Finishing..." : "Finalize CV"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Sidebar: Analysis & Live Preview */}
        <div className={cn(
          "lg:col-span-4 space-y-6 sticky top-24",
          showPreview ? "block" : "hidden lg:block"
        )}>
          <div className="flex flex-col gap-6">
            {/* Real-time PDF Preview */}
            <div className="aspect-[1/1.4] w-full">
              <PDFPreview cv={formValues} />
            </div>

            {/* Analysis Tools */}
            <div className="space-y-6">
              <AtsScoreWidget jdAnalysis={jdAnalysis} isPremium={isPremium} />
              
              <div className="bg-gradient-to-br from-royal-navy to-slate-800 p-6 rounded-3xl shadow-xl text-white">
                <h4 className="font-bold flex items-center gap-2 mb-4">
                  <Search className="h-4 w-4 text-royal-gold" />
                  Target Job
                </h4>
                <p className="text-xs text-white/70 mb-4 leading-relaxed">
                  Paste a job description to tailor your CV automatically.
                </p>
                <textarea 
                  {...register("targetJobDescription")}
                  className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-xs focus:ring-1 focus:ring-royal-gold outline-none h-32 placeholder:text-white/30 text-white"
                  placeholder="Paste job description here..."
                />
                <Button 
                  type="button"
                  onClick={handleAnalyzeJd}
                  disabled={isAnalyzing || !watch("targetJobDescription")}
                  className="w-full mt-4 bg-royal-gold hover:bg-royal-gold-dark text-white text-xs font-bold py-2 rounded-lg"
                >
                  {isAnalyzing ? <Loader2 className="h-3 w-3 animate-spin" /> : "Analyze Matching"}
                </Button>

                {jdAnalysis && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-[10px] font-bold text-royal-gold uppercase tracking-wider">Top Keywords</div>
                    <div className="flex flex-wrap gap-1">
                      {jdAnalysis.keywords.slice(0, 8).map((k, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white/10 rounded-md text-[10px] text-white/80 border border-white/5">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
