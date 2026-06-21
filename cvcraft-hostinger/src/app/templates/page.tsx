import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Crown, FileText, Check, Sparkles, Layers } from "lucide-react";
import { templates, type TemplateId } from "@/lib/pdf/templates";

export const metadata: Metadata = {
  title: "CV Templates · UK & Global Designs",
  description:
    "Browse 10+ recruiter-tested, ATS-optimised CV templates. Pick a design, fill it in with AI, download a polished PDF.",
  alternates: { canonical: "/templates" },
};

const PREMIUM_TEMPLATES: TemplateId[] = [
  "executive",
  "creative",
  "premium-gold",
  "obsidian",
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "professional", label: "Professional" },
  { id: "modern", label: "Modern" },
  { id: "creative", label: "Creative" },
  { id: "academic", label: "Academic" },
] as const;

const CATEGORY_BY_TEMPLATE: Record<TemplateId, string[]> = {
  professional: ["professional"],
  modern: ["modern"],
  minimalist: ["modern", "professional"],
  executive: ["professional"],
  creative: ["creative", "modern"],
  academic: ["academic"],
  functional: ["professional"],
  graduate: ["academic", "modern"],
  "premium-gold": ["creative"],
  obsidian: ["creative", "modern"],
};

const ACCENTS: Record<TemplateId, { bg: string; sidebar?: string; accent: string }> = {
  professional: { bg: "#ffffff", accent: "#0a1128" },
  modern: { bg: "#ffffff", sidebar: "#0a1128", accent: "#b8860b" },
  minimalist: { bg: "#ffffff", accent: "#1f2937" },
  executive: { bg: "#0a1128", accent: "#b8860b" },
  creative: { bg: "#ffffff", sidebar: "#b8860b", accent: "#0a1128" },
  academic: { bg: "#fdfcfb", accent: "#1e293b" },
  functional: { bg: "#ffffff", accent: "#0a1128" },
  graduate: { bg: "#ffffff", accent: "#0a1128" },
  "premium-gold": { bg: "#0a1128", sidebar: "#b8860b", accent: "#ffffff" },
  obsidian: { bg: "#0f172a", accent: "#facc15" },
};

function TemplateMockup({ id }: { id: TemplateId }) {
  const a = ACCENTS[id];
  const hasSidebar = !!a.sidebar;
  const dark = a.bg === "#0a1128" || a.bg === "#0f172a";

  return (
    <div
      className="aspect-[1/1.414] w-full rounded-xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all relative"
      style={{ backgroundColor: a.bg }}
    >
      <div className="absolute inset-0 flex">
        {hasSidebar && (
          <div
            className="w-2/5 h-full p-4 flex flex-col gap-3"
            style={{ backgroundColor: a.sidebar }}
          >
            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: a.accent + "33" }} />
            <div className="h-2 rounded" style={{ backgroundColor: a.accent + "55", width: "70%" }} />
            <div className="space-y-1.5 mt-2">
              {[60, 80, 55, 70, 45].map((w, i) => (
                <div key={`s-${id}-${i}`} className="h-1 rounded" style={{ backgroundColor: a.accent + "33", width: `${w}%` }} />
              ))}
            </div>
            <div className="mt-3 h-2 rounded" style={{ backgroundColor: a.accent + "55", width: "50%" }} />
            <div className="space-y-1.5">
              {[80, 65, 75].map((w, i) => (
                <div key={`s2-${id}-${i}`} className="h-1 rounded" style={{ backgroundColor: a.accent + "33", width: `${w}%` }} />
              ))}
            </div>
          </div>
        )}
        <div className={hasSidebar ? "w-3/5 p-4 space-y-3" : "w-full p-5 space-y-3"}>
          <div className="space-y-1.5">
            <div
              className="h-3 rounded"
              style={{ backgroundColor: dark ? a.accent : a.accent, width: "60%" }}
            />
            <div
              className="h-1.5 rounded"
              style={{ backgroundColor: dark ? a.accent + "88" : a.accent + "55", width: "45%" }}
            />
          </div>
          <div className="h-px" style={{ backgroundColor: dark ? a.accent + "33" : "#e5e7eb" }} />
          <div className="space-y-1.5">
            <div className="h-1.5 rounded" style={{ backgroundColor: dark ? a.accent + "88" : a.accent + "66", width: "30%" }} />
            {[95, 88, 92, 70].map((w, i) => (
              <div key={`b-${id}-${i}`} className="h-1 rounded" style={{ backgroundColor: dark ? a.accent + "55" : "#cbd5e1", width: `${w}%` }} />
            ))}
          </div>
          <div className="space-y-1.5 mt-3">
            <div className="h-1.5 rounded" style={{ backgroundColor: dark ? a.accent + "88" : a.accent + "66", width: "35%" }} />
            {[90, 85, 92].map((w, i) => (
              <div key={`c-${id}-${i}`} className="h-1 rounded" style={{ backgroundColor: dark ? a.accent + "55" : "#cbd5e1", width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function TemplatesPage({ searchParams }: { searchParams?: Promise<{ category?: string }> }) {
  const params = (await searchParams) ?? {};
  const activeCategory = params.category ?? "all";
  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => CATEGORY_BY_TEMPLATE[t.id]?.includes(activeCategory));

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-royal-navy font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-royal-navy/5">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-royal-navy group-hover:bg-royal-gold transition-colors">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">
              CvCRAFT<span className="text-royal-gold">.</span>
            </span>
          </Link>
          <nav className="flex items-center gap-3 md:gap-6 text-xs font-bold uppercase tracking-[0.2em] text-royal-navy/70">
            <Link href="/" className="hidden sm:inline hover:text-royal-gold transition-colors">
              Home
            </Link>
            <Link href="/templates" className="text-royal-gold">
              Templates
            </Link>
            <Link
              href="/auth/login"
              className="bg-royal-navy text-white px-4 py-2 rounded-full hover:bg-royal-gold transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-8 pt-16 pb-12 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-royal-gold mb-5">
            <Layers className="h-3.5 w-3.5" /> Template Library
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Recruiter-tested CV templates,<br />
            <span className="text-royal-gold">ready to ship.</span>
          </h1>
          <p className="text-lg text-royal-navy/70 leading-relaxed max-w-2xl">
            Every design is parsed cleanly by ATS systems and tuned for the UK, EU, and global markets. Pick one, drop in your details, download a PDF that looks exactly as designed.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-8 max-w-7xl mx-auto sticky top-[65px] z-40 bg-[#FDFCFB]/95 backdrop-blur-sm py-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <Link
                key={cat.id}
                href={cat.id === "all" ? "/templates" : `/templates?category=${cat.id}`}
                className={
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all " +
                  (active
                    ? "bg-royal-navy text-white shadow-md shadow-royal-navy/10"
                    : "bg-white text-royal-navy/60 border border-royal-navy/10 hover:border-royal-gold hover:text-royal-navy")
                }
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 md:px-8 pt-8 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((template) => {
            const isPremium = PREMIUM_TEMPLATES.includes(template.id);
            return (
              <article
                key={template.id}
                className="group relative bg-white rounded-3xl p-6 border border-royal-navy/5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
              >
                {isPremium && (
                  <span className="absolute top-4 right-4 z-10 inline-flex items-center gap-1 bg-royal-gold text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                    <Crown className="h-3 w-3" /> Premium
                  </span>
                )}

                <TemplateMockup id={template.id} />

                <div className="mt-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-royal-navy">{template.name}</h3>
                    <p className="text-sm text-royal-navy/60 line-clamp-2 mt-1">
                      {template.description}
                    </p>
                  </div>
                  <Link
                    href={`/builder?template=${template.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-royal-gold hover:text-royal-navy transition-colors group/cta"
                  >
                    Use this template
                    <ArrowRight className="h-3.5 w-3.5 group-hover/cta:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-royal-navy/60">No templates match this category yet.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-royal-navy text-white px-6 md:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="h-10 w-10 text-royal-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-5">
            Ready to land your next interview?
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Start with any template above, let AI tailor your bullets to the job description, and export a polished PDF in minutes.
          </p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-3 bg-royal-gold text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-royal-gold-dark transition-colors shadow-lg"
          >
            Get started for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-white/60">
            {["No credit card", "ATS-optimised", "10+ designs", "Instant PDF"].map((f) => (
              <li key={f} className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-royal-gold" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
