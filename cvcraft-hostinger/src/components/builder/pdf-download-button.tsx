"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CVDocument } from "@/lib/pdf/cv-document";
import { useCvStore } from "@/lib/store/cv-store";
import { toast } from "sonner";

export function PDFDownloadButton() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { cv, selectedTemplate } = useCvStore();

  const handleDownload = async () => {
    if (!cv.personal?.firstName || !cv.personal?.lastName) {
      toast.error("Missing Information", {
        description: "Please enter your name in the Personal section before downloading.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await pdf(<CVDocument cv={cv} templateId={selectedTemplate} isPremium={useCvStore.getState().isPremium} />).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${cv.personal.firstName}_${cv.personal.lastName}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF Downloaded", {
        description: "Your resume has been successfully generated.",
      });
    } catch {
      toast.error("Download Failed", {
        description: "There was an error generating your PDF. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isGenerating}
      className="w-full bg-royal-navy hover:bg-slate-800 text-white font-bold h-12 shadow-lg shadow-royal-navy/10"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-5 w-5" />
          Download PDF
        </>
      )}
    </Button>
  );
}
