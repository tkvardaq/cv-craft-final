"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, FileText, Mail, Phone, Globe, MapPin } from "lucide-react";
import type { CV } from "@/lib/schemas/cv";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFViewer),
  { ssr: false, loading: () => <div className="aspect-[1/1.414] bg-slate-50 animate-pulse rounded-2xl" /> }
);

const CVDocument = dynamic(
  () => import("@/lib/pdf/cv-document").then((m) => ({ default: m.CVDocument })),
  { ssr: false }
);

export function PublicCvView({ cv, title }: { cv: CV; title: string }) {
  const name = `${cv.personal?.firstName ?? ""} ${cv.personal?.lastName ?? ""}`.trim() || title;
  const headline = cv.experience?.[0]
    ? `${cv.experience[0].title} · ${cv.experience[0].company}`
    : "Professional";

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-royal-navy font-sans">
      <header className="border-b border-royal-navy/5 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-royal-navy group-hover:bg-royal-gold transition-colors">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black uppercase tracking-tight">
              CvCRAFT<span className="text-royal-gold">.</span>
            </span>
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-royal-navy text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full hover:bg-royal-gold transition-colors"
          >
            Build your CV
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-5 gap-10">
        <aside className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">{name}</h1>
            <p className="mt-2 text-royal-navy/60 font-semibold">{headline}</p>
          </div>

          {cv.professionalSummary && (
            <div className="bg-white p-6 rounded-2xl border border-royal-navy/5 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-royal-gold mb-3">
                About
              </h2>
              <p className="text-sm text-royal-navy/80 leading-relaxed">{cv.professionalSummary}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-royal-navy/5 shadow-sm space-y-2 text-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-royal-gold mb-3">
              Contact
            </h2>
            {cv.personal?.email && (
              <div className="flex items-center gap-2 text-royal-navy/80">
                <Mail className="h-4 w-4 text-royal-gold" />
                <span className="truncate">{cv.personal.email}</span>
              </div>
            )}
            {cv.personal?.phone && (
              <div className="flex items-center gap-2 text-royal-navy/80">
                <Phone className="h-4 w-4 text-royal-gold" />
                {cv.personal.phone}
              </div>
            )}
            {cv.personal?.address && (
              <div className="flex items-center gap-2 text-royal-navy/80">
                <MapPin className="h-4 w-4 text-royal-gold" />
                {cv.personal.address}
              </div>
            )}
            {cv.personal?.linkedin && (
              <div className="flex items-center gap-2 text-royal-navy/80">
                <Globe className="h-4 w-4 text-royal-gold" />
                <span className="truncate">{cv.personal.linkedin}</span>
              </div>
            )}
          </div>

          {cv.skills && cv.skills.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-royal-navy/5 shadow-sm">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-royal-gold mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 bg-royal-navy/5 text-royal-navy/80 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        <section className="lg:col-span-3">
          <div className="bg-white p-3 rounded-2xl border border-royal-navy/5 shadow-xl">
            <div className="aspect-[1/1.414] w-full rounded-xl overflow-hidden bg-slate-100">
              <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: "none" }}>
                <CVDocument cv={cv} templateId={cv.templateId} isPremium />
              </PDFViewer>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-royal-navy/40">
            Built with{" "}
            <Link href="/" className="font-bold text-royal-gold hover:underline">
              CvCRAFT
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
