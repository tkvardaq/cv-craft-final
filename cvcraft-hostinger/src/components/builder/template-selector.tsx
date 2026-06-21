"use client";

import { templates, type TemplateId } from "@/lib/pdf/templates";
import { useCvStore } from "@/lib/store/cv-store";
import { cn } from "@/lib/utils";
import { Check, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import type { CV } from "@/lib/schemas/cv";

const PREMIUM_TEMPLATES: TemplateId[] = ["executive", "creative", "premium-gold", "obsidian"];

export function TemplateSelector() {
  const { selectedTemplate, setTemplate, isPremium } = useCvStore();
  const { setValue } = useFormContext<CV>();
  const router = useRouter();

  const handleSelect = (id: TemplateId) => {
    const isLocked = PREMIUM_TEMPLATES.includes(id) && !isPremium;
    
    if (isLocked) {
      toast.error("Premium Template", {
        description: "Upgrade to Premium to unlock this and 3 other elite templates.",
        action: {
          label: "Upgrade",
          onClick: () => router.push("/checkout"),
        },
      });
      return;
    }
    
    setTemplate(id);
    setValue("templateId", id, { shouldDirty: true, shouldValidate: true });
    toast.success(`Template changed to ${templates.find(t => t.id === id)?.name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Choose Template</h3>
        <span className="text-xs font-medium text-slate-500">{templates.length} Designs</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;
          const isLocked = PREMIUM_TEMPLATES.includes(template.id) && !isPremium;
          
          return (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className={cn(
                "group relative flex flex-col text-left rounded-xl border-2 transition-all duration-200 overflow-hidden",
                isSelected 
                  ? "border-royal-gold ring-2 ring-royal-gold/20" 
                  : "border-slate-100 hover:border-slate-200"
              )}
            >
              {/* Template Visual Preview */}
              <div className="aspect-[3/4] w-full bg-slate-50 flex items-center justify-center p-3 sm:p-4">
                <TemplateThumbnail templateId={template.id} />
              </div>

              {/* Info Area */}
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {template.name}
                  </span>
                  {isLocked && <Lock className="h-3 w-3 text-slate-400 shrink-0" />}
                  {isSelected && <Check className="h-3 w-3 text-royal-gold shrink-0" />}
                </div>
              </div>

              {/* Status Badge */}
              {PREMIUM_TEMPLATES.includes(template.id) && (
                <div className="absolute top-2 right-2">
                   <div className={cn(
                     "px-1.5 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold shadow-sm",
                     isPremium ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                   )}>
                     <Crown className="h-2.5 w-2.5" />
                     {isPremium ? "UNLOCKED" : "PREMIUM"}
                   </div>
                </div>
              )}

              {/* Selection Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-royal-gold/5 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {!isPremium && (
        <Button 
          variant="outline" 
          className="w-full border-royal-gold text-royal-gold hover:bg-royal-gold/5 font-bold"
          onClick={() => router.push("/checkout")}
        >
          <Crown className="mr-2 h-4 w-4" />
          Unlock All Premium Templates
        </Button>
      )}
    </div>
  );
}

function TemplateThumbnail({ templateId }: { templateId: TemplateId }) {
  // Common skeleton lines
  const Line = ({ w = "100%", h = "1.5px", c = "#e2e8f0", mt = "2px" }) => (
    <div style={{ width: w, height: h, backgroundColor: c, marginTop: mt, borderRadius: "1px" }} />
  );

  switch (templateId) {
    case "modern":
    case "creative":
      return (
        <div className="w-full h-full bg-white flex shadow-sm rounded-sm overflow-hidden border border-slate-200">
          <div className="w-[35%] bg-indigo-950 h-full p-2">
            <div className="w-6 h-6 rounded-full bg-white/20 mb-2" />
            <Line w="80%" c="#a5b4fc" />
            <Line w="60%" c="#a5b4fc" />
            <Line w="100%" c="#4f46e5" mt="6px" />
            <Line w="90%" c="#ffffff" mt="4px" />
            <Line w="70%" c="#ffffff" />
          </div>
          <div className="w-[65%] h-full p-2">
            <Line w="40%" h="2px" c="#1e1b4b" />
            <Line w="100%" c="#e2e8f0" mt="4px" />
            <Line w="90%" c="#e2e8f0" />
            <Line w="95%" c="#e2e8f0" />
            <Line w="40%" h="2px" c="#1e1b4b" mt="8px" />
            <Line w="100%" c="#e2e8f0" mt="4px" />
          </div>
        </div>
      );
    case "obsidian":
      return (
        <div className="w-full h-full bg-[#121212] flex shadow-sm rounded-sm overflow-hidden border border-[#2d2d2d] p-2 flex-col">
          <div className="flex gap-2 items-center mb-2">
            <div className="w-5 h-5 rounded-sm bg-[#2d2d2d]" />
            <div>
              <Line w="40px" c="#ffffff" h="2px" />
              <Line w="30px" c="#a1a1aa" mt="3px" />
            </div>
          </div>
          <Line w="100%" c="#2d2d2d" mt="4px" />
          <Line w="100%" c="#2d2d2d" />
          <Line w="80%" c="#2d2d2d" />
        </div>
      );
    case "premium-gold":
      return (
        <div className="w-full h-full bg-white shadow-sm rounded-sm overflow-hidden border border-[#d4af37] flex flex-col relative">
          <div className="h-2 w-full bg-[#d4af37]" />
          <div className="flex-1 p-2 border-x-4 border-white">
            <div className="flex flex-col items-center mb-3">
              <Line w="50%" c="#1e1b4b" h="2.5px" />
              <Line w="30%" c="#d4af37" mt="3px" />
            </div>
            <Line w="100%" c="#e2e8f0" mt="6px" />
            <Line w="90%" c="#e2e8f0" />
            <Line w="100%" c="#e2e8f0" />
          </div>
        </div>
      );
    case "academic":
    case "functional":
    case "professional":
      return (
        <div className="w-full h-full bg-white shadow-sm rounded-sm overflow-hidden border border-slate-200 p-2 flex flex-col items-center">
          <Line w="60%" c="#1e293b" h="3px" />
          <Line w="40%" c="#64748b" mt="3px" />
          <div className="w-full flex gap-1 mt-3 justify-center border-b border-slate-100 pb-2">
            <Line w="20%" c="#94a3b8" />
            <Line w="20%" c="#94a3b8" />
          </div>
          <div className="w-full mt-2">
            <Line w="30%" c="#1e293b" h="2px" />
            <Line w="100%" c="#e2e8f0" mt="4px" />
            <Line w="90%" c="#e2e8f0" />
          </div>
        </div>
      );
    case "graduate":
    case "minimalist":
    default:
      return (
        <div className="w-full h-full bg-white shadow-sm rounded-sm overflow-hidden border border-slate-200 flex flex-col">
          <div className="w-full h-6 bg-slate-100 p-2 border-b border-slate-200 flex items-center">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm -ml-1 border border-slate-200" />
            <div className="ml-2 flex-1">
              <Line w="60%" c="#334155" h="2px" />
              <Line w="40%" c="#94a3b8" mt="3px" />
            </div>
          </div>
          <div className="p-2 flex-1">
            <Line w="30%" c="#cbd5e1" h="2px" />
            <Line w="100%" c="#f1f5f9" mt="4px" />
            <Line w="90%" c="#f1f5f9" />
          </div>
        </div>
      );
  }
}
