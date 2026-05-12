"use client";

import Link from "next/link";
import { FileText, ChevronLeft, LogOut, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

interface HeaderProps {
  userEmail?: string;
  isPremium?: boolean;
  showBack?: boolean;
  backUrl?: string;
  backLabel?: string;
  isSaving?: boolean;
}

export function Header({ 
  userEmail, 
  isPremium = false, 
  showBack = false, 
  backUrl = "/dashboard", 
  backLabel = "Dashboard",
  isSaving = false
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-royal-navy/10 flex items-center px-6 md:px-8 justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {showBack && (
          <>
            <Link href={backUrl}>
              <Button variant="ghost" size="sm" className="gap-1.5 font-bold text-royal-navy/60 hover:text-royal-navy hover:bg-slate-50 rounded-full px-4">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to {backLabel}</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-royal-navy/10 hidden sm:block" />
          </>
        )}
        
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1 bg-royal-gold/10 rounded-lg group-hover:bg-royal-gold/20 transition-colors">
            <FileText className="h-5 w-5 text-royal-gold" />
          </div>
          <span className="font-bold text-royal-navy tracking-tight text-lg">CvCRAFT</span>
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        {isSaving && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Auto-saving</span>
          </div>
        )}

        {userEmail ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</span>
              <span className="text-xs font-bold text-royal-navy">{userEmail}</span>
            </div>
            
            {isPremium && (
              <div className="hidden sm:flex items-center gap-1 bg-royal-gold/10 px-2.5 py-1 rounded-full border border-royal-gold/20">
                <Crown className="h-3 w-3 text-royal-gold" />
                <span className="text-[10px] font-bold text-royal-gold uppercase tracking-widest">Premium</span>
              </div>
            )}

            <div className="h-8 w-px bg-royal-navy/10 mx-1 hidden sm:block" />
            
            <form action={signOut}>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-9 w-9">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        ) : (
          <Link href="/auth/login">
            <Button size="sm" className="bg-royal-navy hover:bg-slate-800 text-white font-bold rounded-full px-6">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
