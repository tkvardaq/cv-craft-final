"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ChevronLeft, LogOut, Crown, LayoutDashboard, FileSignature, Briefcase, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "CVs", icon: LayoutDashboard },
  { href: "/cover-letters", label: "Cover letters", icon: FileSignature },
  { href: "/applications", label: "Jobs", icon: Briefcase },
];

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white border-b border-royal-navy/10 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 md:gap-6">
          {showBack && (
            <>
              <Link href={backUrl}>
                <Button variant="ghost" size="sm" className="gap-1.5 font-bold text-royal-navy/60 hover:text-royal-navy hover:bg-slate-50 rounded-full px-2 sm:px-4">
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
            <span className="font-bold text-royal-navy tracking-tight text-lg hidden sm:inline-block">CvCRAFT</span>
          </Link>

          {userEmail && !showBack && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors",
                      active
                        ? "bg-royal-navy text-white"
                        : "text-royal-navy/60 hover:text-royal-navy hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {isSaving && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Auto-saving</span>
            </div>
          )}

          {userEmail ? (
            <div className="flex items-center gap-2 md:gap-3">
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
              
              <form action={signOut} className="hidden sm:block">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full h-9 w-9">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>

              {/* Mobile menu toggle */}
              {!showBack && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-royal-navy"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
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

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && userEmail && !showBack && (
        <div className="fixed inset-0 top-16 z-20 bg-white md:hidden overflow-y-auto">
          <div className="flex flex-col p-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg font-bold transition-colors",
                      active
                        ? "bg-royal-navy/5 text-royal-navy"
                        : "text-royal-navy/60 active:bg-slate-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            
            <div className="h-px w-full bg-slate-100" />
            
            <div className="flex flex-col space-y-3 px-2">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</span>
                <span className="text-sm font-bold text-royal-navy truncate">{userEmail}</span>
              </div>
              
              {isPremium && (
                <div className="flex items-center gap-1.5">
                  <Crown className="h-4 w-4 text-royal-gold" />
                  <span className="text-xs font-bold text-royal-gold uppercase tracking-widest">Premium Account</span>
                </div>
              )}
              
              <form action={signOut} className="mt-2">
                <Button variant="outline" className="w-full justify-start text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
