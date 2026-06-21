"use client";

import { useForm, FormProvider, useWatch, type FieldPath } from "react-hook-form";
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
import { TemplateSelector } from "../builder/template-selector";
import { PDFDownloadButton } from "../builder/pdf-download-button";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, ArrowRight, Layout, Search, Eye, FileText } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useCvStore } from "@/lib/store/cv-store";
import { templates, type TemplateId } from "@/lib/pdf/templates";
import debounce from 'lodash/debounce';

const SECTIONS = ["personal", "summary", "experience", "education", "skills", "extras"];

export function CvBuilderForm({ initialId, initialTemplate, isPremium = false }: { initialId?: string; initialTemplate?: string; isPremium?: boolean }) {
  const [activeSection, setActiveSection] = useState("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState<{ keywords: string[]; summary: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cvId, setCvId] = useState<string | undefined>();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(!initialId);
  const router = useRouter();
  
  const setCv = useCvStore((s) => s.setCv);
  const setIsPremium = useCvStore((s) => s.setIsPremium);
  const setTemplate = useCvStore((s) => s.setTemplate);
  
  const methods = useForm<CV>({
    resolver: zodResolver(cvSchema),
    defaultValues: emptyCv,
    mode: "onChange"
  });

  const { control, trigger, handleSubmit, reset, register, getValues, setValue } = methods;
  const formValues = useWatch({ control }) as CV;
  const targetJobDescription = useWatch({ control, name: "targetJobDescription" });

  // Sync state with store (debounced)
  useEffect(() => {
    const handler = debounce((cv) => {
      setCv(cv);
    }, 300); // 300ms debounce

    handler(formValues);

    return () => handler.cancel();
  }, [formValues, setCv, isSaving]);

  useEffect(() => {
    setIsPremium(isPremium);
  }, [isPremium, setIsPremium]);

  useEffect(() => {
    const templateIds = new Set(templates.map((template) => template.id));
    if (initialTemplate && templateIds.has(initialTemplate as TemplateId)) {
      const templateId = initialTemplate as TemplateId;
      setTemplate(templateId);
      setValue("templateId", templateId, { shouldDirty: true });
    }
  }, [initialTemplate, setTemplate, setValue]);

  const lastSavedRef = useRef<string>(JSON.stringify(emptyCv));

  // Load initial data
  useEffect(() => {
    const loadCv = async () => {
      if (!initialId) {
        setIsInitialLoadComplete(true);
        return;
      }

      setIsInitialLoadComplete(false);
      try {
        const res = await fetch(`/api/cv?id=${initialId}`);
        if (!res.ok) {
          throw new Error("Failed to load CV");
        }
        const { data, id } = await res.json();
        if (data) {
          reset(data);
          setTemplate(data.templateId);
          lastSavedRef.current = JSON.stringify(data);
        }
        if (id) {
          setCvId(id);
        }
      } catch (err) {
        console.error("Failed to load CV", err);
      } finally {
        setIsInitialLoadComplete(true);
      }
    };
    loadCv();
  }, [initialId, reset, setTemplate]);

  const onSubmit = useCallback(async (data: CV) => {
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
        router.push(`/builder?id=${savedData.id}`);
      }
    } catch (error) {
      console.error("Failed to save CV", error);
    } finally {
      setIsSaving(false);
    }
  }, [cvId, router]);
  
  // Auto-save logic
  useEffect(() => {
    if (!isInitialLoadComplete || isSaving) {
      return;
    }

    const currentValues = JSON.stringify(formValues);
   
    // Only save if dirty and values have actually changed from last save
    if (!methods.formState.isDirty || currentValues === lastSavedRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      onSubmit(formValues);
      lastSavedRef.current = currentValues;
    }, 2000); // Save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formValues, isInitialLoadComplete, methods.formState.isDirty, onSubmit, isSaving]);

  // Track completed sections
  const completedSections = useMemo(() => {
    const completed: string[] = [];
    if (formValues.personal?.firstName && formValues.personal?.lastName && formValues.personal?.email) completed.push("personal");
    if (formValues.professionalSummary) completed.push("summary");
    if (formValues.experience?.length > 0) completed.push("experience");
    if (formValues.education?.length > 0) completed.push("education");
    if (formValues.skills?.length > 0) completed.push("skills");
    if (formValues.projects?.length > 0 || formValues.awards?.length > 0 || formValues.certifications?.length > 0 || formValues.languages?.length > 0) completed.push("extras");
    return completed;
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

  const nextSection = async () => {
    const currentIndex = SECTIONS.indexOf(activeSection);
    if (currentIndex < SECTIONS.length - 1) {
      const fieldsToValidate = getFieldsForSection(activeSection);
      const isValid = await trigger(fieldsToValidate);
      
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

  const getFieldsForSection = (section: string): FieldPath<CV>[] => {
    switch (section) {
      case "personal": return ["personal.firstName", "personal.lastName", "personal.email", "personal.phone"];
      case "summary": return ["professionalSummary"];
      case "experience": return ["experience"];
      case "education": return ["education"];
      case "skills": return ["skills"];
      case "extras": return ["projects", "awards", "certifications", "languages"];
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
                  <Input 
                    {...register("title")}
                    className="text-2xl font-bold text-royal-navy bg-transparent border-none p-0 focus-visible:ring-0 w-full placeholder:text-slate-300 shadow-none h-auto"
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

        {/* Right Sidebar: Preview & Analysis */}
        <div className={cn(
          "lg:col-span-4 space-y-8 sticky top-24 pb-12",
          showPreview ? "block" : "hidden lg:block"
        )}>
          {/* Main Preview Card */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-royal-navy flex items-center gap-2">
                <Eye className="w-5 h-5 text-royal-gold" />
                Live Preview
              </h3>
              <AtsScoreWidget jdAnalysis={jdAnalysis} isPremium={isPremium} />
            </div>
            
            <div className="aspect-[1/1.414] w-full relative group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner mb-6">
              <PDFPreview />
              <div className="absolute inset-0 bg-royal-navy/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <div className="space-y-4">
              <PDFDownloadButton />
              <p className="text-[10px] text-center text-slate-400">
                Premium PDF generation with full font embedding
              </p>
            </div>
          </div>

          {/* Template Selection */}
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
             <h3 className="font-bold text-royal-navy flex items-center gap-2 mb-6 text-lg">
                <Layout className="w-5 h-5 text-royal-gold" />
                Design Style
              </h3>
              <TemplateSelector />
          </div>

          {/* AI Tailoring (JD Analysis) */}
          <div className="bg-gradient-to-br from-royal-navy to-slate-900 p-8 rounded-[2rem] shadow-xl text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-royal-gold/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-royal-gold/20 transition-all duration-700" />
            
            <h4 className="font-bold flex items-center gap-3 mb-4 text-lg">
              <Search className="h-5 w-5 text-royal-gold" />
              AI Resume Tailor
            </h4>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              We&apos;ll analyze the job description to suggest improvements and score your CV.
            </p>
            
            <div className="space-y-4">
              <Textarea 
                {...register("targetJobDescription")}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus-visible:ring-1 focus-visible:ring-royal-gold outline-none h-32 placeholder:text-slate-500 text-white transition-all duration-300"
                placeholder="Paste the job description you're targeting..."
              />
              <Button 
                type="button"
                onClick={handleAnalyzeJd}
                disabled={isAnalyzing || !targetJobDescription}
                className="w-full bg-royal-gold hover:bg-royal-gold-dark text-royal-navy font-bold py-6 rounded-xl shadow-lg shadow-royal-gold/20 transition-all duration-300 active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Optimize for Job"
                )}
              </Button>
            </div>

            {jdAnalysis && (
              <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="h-px bg-white/10 w-full" />
                <div>
                  <div className="text-xs font-bold text-royal-gold uppercase tracking-wider mb-3">Matching Keywords</div>
                  <div className="flex flex-wrap gap-2">
                    {jdAnalysis.keywords.slice(0, 10).map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[11px] text-slate-300 border border-white/5 hover:border-royal-gold/30 hover:text-white transition-colors cursor-default">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
