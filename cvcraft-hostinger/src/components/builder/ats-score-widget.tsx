"use client";

import { useFormContext } from "react-hook-form";
import type { CV } from "@/lib/schemas/cv";
import { useMemo, useState } from "react";
import { Target, CheckCircle2, AlertCircle, Crown, X, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { scoreCV } from "@/lib/ats/scoring-engine";

interface AtsScoreWidgetProps {
  jdAnalysis?: {
    keywords: string[];
    summary: string;
  } | null;
  compact?: boolean;
  isPremium?: boolean;
}

export function AtsScoreWidget({ jdAnalysis, compact, isPremium = false }: AtsScoreWidgetProps) {
  const { watch } = useFormContext<CV>();
  const cv = watch();
  const [reportOpen, setReportOpen] = useState(false);

  // Compute full ATS detailed result for premium modal
  const detailedResult = useMemo(() => {
    if (!isPremium) return null;
    return scoreCV(cv, "general");
  }, [cv, isPremium]);

  const { score, suggestions } = useMemo(() => {
    let newScore = 0;
    const newSuggestions: string[] = [];

    // Scoring Logic
    if (cv.personal?.firstName && cv.personal?.lastName) newScore += 10;
    else newSuggestions.push("Add your full name");

    if (cv.personal?.email && cv.personal?.phone) newScore += 10;
    else newSuggestions.push("Add contact information");

    if (cv.professionalSummary && cv.professionalSummary.length > 100) newScore += 20;
    else if (!cv.professionalSummary) newSuggestions.push("Write a professional summary");
    else newSuggestions.push("Make your summary more detailed");

    if (cv.experience && cv.experience.length > 0) {
      newScore += 20;
      const hasBullets = cv.experience.some(exp => exp.bullets && exp.bullets.length > 0);
      if (hasBullets) newScore += 10;
      else newSuggestions.push("Add achievements to your work roles");
    } else {
      newSuggestions.push("Add at least one work experience");
    }

    if (cv.skills && cv.skills.length >= 5) newScore += 20;
    else if (cv.skills && cv.skills.length > 0) {
      newScore += 10;
      newSuggestions.push("Add at least 5 skills for better visibility");
    } else {
      newSuggestions.push("Add your key skills");
    }

    if (cv.education && cv.education.length > 0) newScore += 10;
    else newSuggestions.push("Add your education background");

    // JD Keyword Matching
    if (jdAnalysis && jdAnalysis.keywords.length > 0) {
      const allText = [
        cv.professionalSummary,
        ...(cv.experience?.flatMap(e => [e.title, ...e.bullets]) || []),
        ...(cv.skills || [])
      ].join(" ").toLowerCase();

      const matchedKeywords = jdAnalysis.keywords.filter(k => 
        allText.includes(k.toLowerCase())
      );

      const matchRatio = matchedKeywords.length / Math.min(jdAnalysis.keywords.length, 10);
      const matchScore = Math.min(Math.round(matchRatio * 20), 20); // Max 20 points for JD matching
      
      newScore = Math.min(newScore + matchScore, 100);

      if (matchedKeywords.length < 5) {
        newSuggestions.push(`Include more keywords from the JD (e.g., ${jdAnalysis.keywords.find(k => !matchedKeywords.includes(k)) || "skills"})`);
      }
    }

    return {
      score: newScore,
      suggestions: newSuggestions.slice(0, 3),
    };
  }, [cv, jdAnalysis]);

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ATS Match</span>
          <span className={cn(
            "text-sm font-bold",
            score > 70 ? "text-emerald-500" : score > 40 ? "text-amber-500" : "text-slate-400"
          )}>
            {score}%
          </span>
        </div>
        <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              score > 70 ? "bg-emerald-500" : score > 40 ? "bg-amber-500" : "bg-slate-300"
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-royal-gold/10 rounded-lg">
              <Target className="h-5 w-5 text-royal-gold" />
            </div>
            <h3 className="font-bold text-royal-navy text-sm">ATS Score</h3>
          </div>
          {!isPremium && (
            <span className="text-[10px] font-bold bg-royal-gold/10 text-royal-gold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Free
            </span>
          )}
        </div>

        <div className="relative pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Overall Match</span>
            <span className={cn(
              "text-lg font-bold",
              score > 70 ? "text-emerald-500" : score > 40 ? "text-amber-500" : "text-slate-400"
            )}>
              {score}%
            </span>
          </div>
          <div className="overflow-hidden h-2.5 mb-4 text-xs flex rounded-full bg-slate-100 border border-slate-50">
            <div
              style={{ width: `${score}%` }}
              className={cn(
                "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500",
                score > 70 ? "bg-emerald-500" : score > 40 ? "bg-amber-500" : "bg-slate-300"
              )}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Improvements</h4>
        {suggestions.length > 0 ? (
          <ul className="space-y-2">
            {suggestions.map((suggestion) => (
              <li key={suggestion} className="flex gap-2 text-sm text-slate-600 animate-in fade-in slide-in-from-left-2 duration-300">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                {suggestion}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span>Your CV looks strong! Ready to apply.</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-50">
        <button 
          className={cn(
            "w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
            isPremium 
              ? "bg-royal-navy text-white hover:bg-slate-800" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          )}
          disabled={!isPremium}
          onClick={() => isPremium && setReportOpen(true)}
        >
          {!isPremium && <Crown className="h-4 w-4 text-royal-gold" />}
          {isPremium ? "View Detailed Report" : "Detailed Report (Pro Only)"}
        </button>
      </div>

      {/* Detailed Report Modal */}
      {reportOpen && isPremium && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setReportOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-5 relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={() => setReportOpen(false)}>
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-royal-navy/10 rounded-xl">
                <BarChart3 className="h-5 w-5 text-royal-navy" />
              </div>
              <div>
                <h2 className="font-bold text-royal-navy">Full ATS Report</h2>
                <p className="text-xs text-slate-400">Powered by CvCRAFT scoring engine</p>
              </div>
            </div>

            {/* Score Breakdown */}
            {detailedResult && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ["Keywords", detailedResult.breakdown.keywords, 35],
                    ["Qualifications", detailedResult.breakdown.qualifications, 25],
                    ["Title Fit", detailedResult.breakdown.titleAlignment, 20],
                    ["Soft Skills", detailedResult.breakdown.softSkills, 15],
                    ["Format", detailedResult.breakdown.formatCompliance, 5],
                  ] as [string, number, number][]).map(([label, pts, max]) => (
                    <div key={label} className="bg-slate-50 p-3 rounded-xl">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
                        <span className="text-xs font-bold text-royal-navy">{Math.round(pts)}/{max}</span>
                      </div>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-royal-navy rounded-full transition-all duration-500"
                          style={{ width: `${(pts / max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {detailedResult.missingKeywords.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {detailedResult.missingKeywords.slice(0, 12).map(kw => (
                        <span key={kw} className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-full font-medium">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}

                {detailedResult.formatWarnings.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Format Warnings</h4>
                    <ul className="space-y-1">
                      {detailedResult.formatWarnings.map(w => (
                        <li key={w} className="flex gap-2 text-xs text-slate-600">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
