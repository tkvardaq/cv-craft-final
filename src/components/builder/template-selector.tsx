"use client";

import { templates, type TemplateId } from "@/lib/pdf/templates";
import { useCvStore } from "@/lib/store/cv-store";
import { cn } from "@/lib/utils";
import { Check, Crown, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PREMIUM_TEMPLATES: TemplateId[] = ["executive", "creative", "premium-gold", "obsidian"];

export function TemplateSelector() {
  const { selectedTemplate, setTemplate, isPremium } = useCvStore();
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
              {/* Template Preview Placeholder */}
              <div className="aspect-[3/4] w-full bg-slate-50 flex items-center justify-center p-4">
                <div className="w-full h-full border border-slate-200 bg-white rounded shadow-sm overflow-hidden flex flex-col">
                   <div className="h-4 w-full bg-slate-100 border-b border-slate-50" />
                   <div className="p-2 space-y-1">
                      <div className="h-1 w-2/3 bg-slate-100 rounded" />
                      <div className="h-1 w-full bg-slate-100 rounded" />
                      <div className="h-1 w-full bg-slate-100 rounded" />
                   </div>
                </div>
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
