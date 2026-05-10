import Link from "next/link";
import { ArrowRight, FileText, Sparkles, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-ivory text-royal-navy font-sans">
      {/* Navigation */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-royal-gold" />
          <span className="text-2xl font-bold tracking-tight text-royal-navy">CvCRAFT</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="#features" className="hover:text-royal-gold transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-royal-gold transition-colors">Pricing</Link>
          <Link href="/auth/login" className="hover:text-royal-gold transition-colors">Log in</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link 
            href="/builder" 
            className="hidden md:flex items-center justify-center rounded-full bg-royal-navy text-white px-6 py-2.5 font-medium hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl"
          >
            Create CV
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal-gold/10 text-royal-gold-dark font-medium mb-8 border border-royal-gold/20">
          <Sparkles className="h-4 w-4" />
          <span>AI-Powered CV Builder</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-royal-navy leading-tight mb-6">
          Craft a <span className="text-royal-gold">Royal-Class</span> CV that Commands Attention.
        </h1>
        
        <p className="text-xl md:text-2xl text-royal-navy/70 max-w-3xl mb-12 leading-relaxed">
          Stand out from the crowd with elegant, ATS-optimized resumes. Our AI automatically enhances your experience to match your dream job.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link 
            href="/builder" 
            className="flex items-center justify-center gap-2 rounded-full bg-royal-gold text-white px-8 py-4 text-lg font-semibold hover:bg-royal-gold-dark transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
          >
            Build Your CV Now
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link 
            href="/auth/login" 
            className="flex items-center justify-center gap-2 rounded-full bg-white border-2 border-royal-navy/10 text-royal-navy px-8 py-4 text-lg font-semibold hover:border-royal-navy/30 transition-all shadow-sm w-full sm:w-auto"
          >
            Sign In
          </Link>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left w-full">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-royal-navy/5">
            <div className="h-14 w-14 rounded-2xl bg-royal-navy/5 flex items-center justify-center mb-6">
              <Sparkles className="h-7 w-7 text-royal-gold" />
            </div>
            <h3 className="text-xl font-bold text-royal-navy mb-3">AI Bullet Rewriter</h3>
            <p className="text-royal-navy/70 leading-relaxed">
              Transform weak bullet points into strong, action-oriented achievements that recruiters love.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-royal-navy/5">
            <div className="h-14 w-14 rounded-2xl bg-royal-navy/5 flex items-center justify-center mb-6">
              <Target className="h-7 w-7 text-royal-gold" />
            </div>
            <h3 className="text-xl font-bold text-royal-navy mb-3">ATS-Optimized</h3>
            <p className="text-royal-navy/70 leading-relaxed">
              Analyze job descriptions instantly and tailor your CV to pass automated screening systems.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-royal-navy/5">
            <div className="h-14 w-14 rounded-2xl bg-royal-navy/5 flex items-center justify-center mb-6">
              <FileText className="h-7 w-7 text-royal-gold" />
            </div>
            <h3 className="text-xl font-bold text-royal-navy mb-3">Elegant PDF Export</h3>
            <p className="text-royal-navy/70 leading-relaxed">
              Download pixel-perfect, elegantly structured PDFs that leave a lasting professional impression.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-royal-navy text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-royal-gold" />
            <span className="text-xl font-bold tracking-tight">CvCRAFT</span>
          </div>
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} CvCRAFT. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
