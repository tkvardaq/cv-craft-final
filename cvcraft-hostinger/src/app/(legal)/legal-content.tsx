import Link from "next/link";
import { FileText } from "lucide-react";

export function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory font-sans text-royal-navy">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-royal-navy group-hover:bg-royal-gold transition-colors">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">CvCRAFT</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-royal-navy transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">{title}</h1>
        <p className="text-sm text-slate-400 mb-10">Last updated {updated}</p>
        <article className="prose prose-slate max-w-none space-y-6 text-slate-600 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-royal-navy [&_h2]:mt-10 [&_h2]:mb-3">
          {children}
        </article>
      </main>
    </div>
  );
}
