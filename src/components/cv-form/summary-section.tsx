"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import type { CV } from "@/lib/schemas/cv";

export function SummarySection() {
  const { control, getValues, setValue } = useFormContext<CV>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const values = getValues();
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: values.experience,
          skills: values.skills,
          targetJd: values.targetJobDescription,
        }),
      });
      const data = await response.json();
      if (data.summary) {
        setValue("professionalSummary", data.summary, { shouldDirty: true });
      }
    } catch (error) {
      console.error("Failed to generate summary", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-royal-navy">Professional Summary</h3>
          <p className="text-sm text-slate-500">Highlight your top achievements and expertise.</p>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={generateSummary}
          disabled={isGenerating}
          className="border-royal-gold/30 text-royal-gold hover:bg-royal-gold/5 flex items-center gap-2"
        >
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          AI Generate
        </Button>
      </div>

      <FormField
        control={control}
        name="professionalSummary"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Senior Software Engineer with 8+ years of experience..." 
                className="min-h-[200px] bg-slate-50/50 border-slate-200 focus:border-royal-gold focus:ring-royal-gold rounded-2xl resize-none leading-relaxed"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50 flex gap-3">
        <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Pro Tip:</strong> A great summary is 3-4 sentences long and contains at least 3 industry-specific keywords.
        </p>
      </div>
    </div>
  );
}
