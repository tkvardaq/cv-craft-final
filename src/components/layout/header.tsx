import Link from "next/link";
import { FileText, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-900 transition-colors">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="h-6 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <span className="font-bold text-slate-900 tracking-tight">CvCRAFT</span>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-widest ml-1">Builder</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1 mr-4">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Changes Saved</span>
        </div>
        <Link href="/checkout">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Upgrade to Premium
          </Button>
        </Link>
      </div>
    </header>
  );
}
