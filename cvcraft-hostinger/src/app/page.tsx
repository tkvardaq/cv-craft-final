import Link from "next/link";
import Image from "next/image";
import type { SVGProps } from "react";
import { ArrowRight, FileText, Sparkles, Target, Shield, Zap, CheckCircle, Search, BarChart3, Users, Star, LineChart, Globe, Quote, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] text-[#0A1128] font-sans selection:bg-royal-gold/30">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-royal-navy/5">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl w-full mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-royal-navy group-hover:bg-royal-gold transition-colors duration-300">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-royal-navy uppercase">CvCRAFT<span className="text-royal-gold">.</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-10 font-bold text-xs uppercase tracking-[0.2em] text-royal-navy/60">
            <Link href="#features" className="hover:text-royal-gold transition-colors">Features</Link>
            <Link href="/templates" className="hover:text-royal-gold transition-colors">Templates</Link>
            <Link href="#comparison" className="hover:text-royal-gold transition-colors">Why Us</Link>
            <Link href="#pricing" className="hover:text-royal-gold transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-xs font-black uppercase tracking-widest text-royal-navy hover:text-royal-gold transition-colors px-4 py-2"
            >
              Log in
            </Link>
            <Link 
              href="/builder" 
              className="hidden sm:flex items-center justify-center rounded-full bg-royal-navy text-white px-8 py-3.5 text-xs font-black uppercase tracking-widest hover:bg-royal-gold hover:text-white transition-all duration-300 shadow-xl hover:shadow-royal-gold/20 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-32 pb-28 overflow-hidden px-6 lg:pt-40 lg:pb-40 flex flex-col items-center text-center max-w-7xl mx-auto">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 -left-20 w-72 h-72 bg-royal-gold/10 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute top-40 -right-20 w-96 h-96 bg-royal-navy/5 rounded-full blur-3xl -z-10" />
          
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-royal-navy/5 text-royal-navy font-semibold text-xs tracking-wide mb-10 border border-royal-navy/10 animate-fade-in-up">
            <Sparkles className="h-4 w-4 text-royal-gold" />
            <span>AI-powered CV builder · trusted by 25,000+ professionals</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-royal-navy leading-[1.05] mb-8 max-w-4xl animate-fade-in-up delay-100">
            Build a job-winning CV in{" "}
            <span className="text-royal-gold">minutes</span>, not hours.
          </h1>

          <p className="text-lg md:text-xl text-royal-navy/60 max-w-2xl mb-12 leading-relaxed animate-fade-in-up delay-200">
            CvCRAFT helps you write a recruiter-ready, ATS-optimised CV with AI guidance and
            professionally designed templates proven to land interviews.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-5 w-full justify-center animate-fade-in-up delay-300">
            <Link
              href="/auth/login"
              className="group flex items-center justify-center gap-2.5 rounded-xl bg-royal-navy text-white px-8 py-4 text-base font-bold hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-royal-navy/15 hover:-translate-y-0.5 w-full sm:w-auto"
            >
              Build my CV — free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/templates"
              className="flex items-center justify-center gap-2 rounded-xl border border-royal-navy/15 bg-white px-8 py-4 text-base font-semibold text-royal-navy hover:border-royal-navy/30 hover:bg-slate-50 transition-all w-full sm:w-auto"
            >
              View templates
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-10 animate-fade-in-up delay-300">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`avatar-${i}`} className="w-10 h-10 rounded-full border-2 border-white bg-royal-gold/10 overflow-hidden shadow-sm">
                  <Image src={`https://i.pravatar.cc/100?u=${i + 10}`} alt={`Reviewer ${i}`} width={40} height={40} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={`star-${i}`} className="h-3.5 w-3.5 fill-royal-gold text-royal-gold" />
                ))}
              </div>
              <p className="text-xs font-medium text-royal-navy/60 mt-1">Rated 4.9/5 by 25,000+ professionals</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-royal-navy relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-gold via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-8 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-12">
            <Stat num="98%" label="ATS Pass Rate" />
            <Stat num="120k+" label="CVs Crafted" />
            <Stat num="45%" label="More Interviews" />
            <Stat num="<2s" label="PDF Render Time" />
          </div>
        </section>

        {/* Trust Logos Section */}
        <section className="py-16 bg-white/50 border-b border-royal-navy/5">
          <div className="max-w-7xl mx-auto px-8">
            <p className="text-center text-[10px] font-black text-royal-navy/40 uppercase tracking-[0.4em] mb-12">Professionals we help have landed roles at</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="text-2xl font-black tracking-tighter">GOOGLE</span>
              <span className="text-2xl font-black tracking-tighter">AMAZON</span>
              <span className="text-2xl font-black tracking-tighter">MICROSOFT</span>
              <span className="text-2xl font-black tracking-tighter">GOLDMAN SACHS</span>
              <span className="text-2xl font-black tracking-tighter">NHS</span>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-24">
              <h2 className="text-sm font-black text-royal-gold uppercase tracking-[0.4em] mb-4">The Methodology</h2>
              <p className="text-4xl md:text-6xl font-black text-royal-navy tracking-tighter">3 Steps to Dominance.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <ProcessStep 
                num="01"
                title="Select Your Armor"
                desc="Choose from our library of ATS-optimized, high-fidelity templates designed for specific industries."
              />
              <ProcessStep 
                num="02"
                title="Inject Intelligence"
                desc="Upload your current CV or JD. Our AI rewrites your bullets into achievement-focused narratives."
              />
              <ProcessStep 
                num="03"
                title="Deploy & Conquer"
                desc="Download your perfect PDF and start landing interviews within 24 hours. Guaranteed."
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col items-center text-center mb-24">
              <h2 className="text-sm font-black text-royal-gold uppercase tracking-[0.4em] mb-4">Unrivaled Power</h2>
              <p className="text-4xl md:text-6xl font-black text-royal-navy tracking-tighter">Engineered for Victory.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Target className="h-8 w-8 text-royal-gold" />}
                title="ATS-Proof Logic"
                desc="Our algorithms ensure every pixel and character is optimized for the software that screens your application."
              />
              <FeatureCard 
                icon={<BarChart3 className="h-8 w-8 text-royal-gold" />}
                title="Keyword Injection"
                desc="Instantly identify and embed high-impact keywords from the job description to skyrocket your relevancy score."
              />
              <FeatureCard 
                icon={<Users className="h-8 w-8 text-royal-gold" />}
                title="Expert Narratives"
                desc="AI-driven rewriting turns mundane tasks into achievement-oriented success stories that sell your potential."
              />
            </div>
          </div>
        </section>

        {/* Industry Intelligence Section */}
        <section className="py-32 bg-royal-navy text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-royal-gold/5 rounded-full blur-[120px] -z-10" />
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-sm font-black text-royal-gold uppercase tracking-[0.4em] mb-6">Industry Intelligence</h2>
                <p className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[0.9]">Semantic <br/><span className="text-royal-gold">Precision.</span></p>
                <p className="text-xl text-white/60 mb-12 leading-relaxed">
                  Our AI does not just scan for words. It understands context, seniority, and industry standards across 50+ sectors.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Search className="h-6 w-6 text-royal-gold" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-widest">LSI Keyword Mapping</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Latent Semantic Indexing for 99.9% ATS pass rate</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Zap className="h-6 w-6 text-royal-gold" />
                    </div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-widest">Action Verb Injection</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Swap passive language for high-impact leadership verbs</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white/5 rounded-[4rem] border border-white/10 p-12 backdrop-blur-3xl">
                   <div className="space-y-8">
                     <div className="p-6 rounded-3xl bg-royal-gold/10 border border-royal-gold/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-royal-gold mb-2">Original</p>
                        <p className="text-sm text-white/60 line-through">&quot;Managed a team of 5 people and did marketing tasks.&quot;</p>
                     </div>
                     <div className="flex justify-center">
                        <div className="w-px h-12 bg-gradient-to-b from-royal-gold to-transparent" />
                     </div>
                     <div className="p-6 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-royal-gold" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-royal-gold mb-2 flex items-center gap-2">
                           <Sparkles className="h-3 w-3" />
                           CvCRAFT Optimized
                        </p>
                        <p className="text-sm font-bold text-white">&quot;Spearheaded a cross-functional team of 5, delivering high-impact marketing campaigns that drove a 40% increase in lead generation.&quot;</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Industry Pulse */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <div>
                <span className="text-royal-gold font-black tracking-[0.4em] uppercase text-[10px]">Live Analytics</span>
                <h2 className="text-5xl md:text-7xl font-black text-royal-navy mt-6 mb-8 tracking-tighter">The Industry <br/>Pulse.</h2>
                <p className="text-royal-navy/50 text-xl mb-12 font-medium leading-relaxed">
                  Our AI tracks thousands of job postings daily. Stay ahead of the curve with real-time data on what recruiters are actually searching for.
                </p>
                
                <div className="space-y-8">
                  {[
                    { label: "AI & Automation Proficiency", trend: "+42%", width: "92%", color: "bg-emerald-500" },
                    { label: "Strategic Leadership", trend: "+18%", width: "75%", color: "bg-royal-gold" },
                    { label: "Data-Driven Decision Making", trend: "+31%", width: "84%", color: "bg-blue-600" },
                    { label: "Remote Collaboration Tools", trend: "-5%", width: "40%", color: "bg-slate-300" }
                  ].map((item) => (
                    <div key={item.label} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-royal-navy">{item.label}</span>
                        <span className={cn(item.trend.startsWith("+") ? "text-emerald-600" : "text-slate-400")}>{item.trend}</span>
                      </div>
                      <div className="h-1.5 bg-royal-navy/5 rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all duration-1000 delay-300", item.color)} style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { icon: LineChart, label: "ATS Passing Rate", val: "99.4%", desc: "Average across all users" },
                  { icon: Users, label: "Interviews Secured", val: "14k+", desc: "In the last 30 days" },
                  { icon: Globe, label: "Global Reach", val: "120+", desc: "Countries supported" },
                  { icon: Award, label: "Industry Rank", val: "#1", desc: "Premium CV Builder" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#F8F9FA] p-10 rounded-[3rem] border border-royal-navy/5 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                    <stat.icon className="h-8 w-8 text-royal-gold mb-6" />
                    <div className="text-4xl font-black text-royal-navy mb-2 tracking-tighter">{stat.val}</div>
                    <div className="text-[10px] font-black text-royal-navy/40 uppercase tracking-widest mb-4">{stat.label}</div>
                    <p className="text-xs font-medium text-royal-navy/50 leading-relaxed">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-32 bg-royal-navy text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto px-8 relative z-10">
            <div className="text-center mb-24">
              <span className="text-royal-gold font-black tracking-[0.4em] uppercase text-[10px]">Testimonials</span>
              <h2 className="text-5xl md:text-7xl font-black text-white mt-6 mb-8 tracking-tighter">Success Stories.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  name: "Sarah Jenkins",
                  role: "Senior Product Manager at Google",
                  text: "CvCRAFT transformed my 4-page mess into a 1-page executive masterpiece. I had three interviews lined up within 48 hours of applying with the new version.",
                  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
                },
                {
                  name: "Dr. James Aris",
                  role: "Consultant Surgeon, NHS",
                  text: "The NHS Specialist template is revolutionary. It perfectly captures the clinical nuances that generic builders miss. It's the standard for medical applications now.",
                  img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
                },
                {
                  name: "Elena Rodriguez",
                  role: "Head of Talent, Civil Service",
                  text: "As someone who reviews hundreds of Success Profiles applications, I can spot a CvCRAFT resume instantly. They are clear, evidence-based, and highly effective.",
                  img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                }
              ].map((story) => (
                <div key={story.name} className="bg-white/5 p-12 rounded-[3.5rem] relative border border-white/10 hover:bg-white/10 transition-all duration-500 group">
                  <Quote className="absolute top-10 right-10 h-12 w-12 text-royal-gold/10 group-hover:text-royal-gold/20 transition-colors" />
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-royal-gold/30 shadow-2xl">
                      <Image src={story.img} alt={story.name} width={96} height={96} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-black text-sm uppercase tracking-widest text-white">{story.name}</div>
                      <div className="text-[10px] font-black text-royal-gold uppercase tracking-widest mt-1 opacity-60">{story.role}</div>
                    </div>
                  </div>
                  <p className="text-white/70 italic leading-relaxed font-medium">
                    &quot;{story.text}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Section (Zety Style) */}
        <section id="comparison" className="py-32 bg-[#F8F9FA]">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-royal-navy mb-6 tracking-tight">The CvCRAFT Difference</h2>
              <p className="text-royal-navy/50 font-medium text-lg">Why thousands are switching from legacy builders.</p>
            </div>
            
            <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-royal-navy/5">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-royal-navy text-white">
                    <th className="p-8 text-xl font-black uppercase tracking-widest">Feature</th>
                    <th className="p-8 text-xl font-black uppercase tracking-widest text-center">Traditional</th>
                    <th className="p-8 text-xl font-black uppercase tracking-widest text-center text-royal-gold">CvCRAFT</th>
                  </tr>
                </thead>
                <tbody className="font-medium">
                  <ComparisonRow feature="AI Optimization" trad={false} craft={true} />
                  <ComparisonRow feature="ATS-Tested Templates" trad="Limited" craft="100%" />
                  <ComparisonRow feature="Keyword Analysis" trad={false} craft={true} />
                  <ComparisonRow feature="Export Quality" trad="Basic" craft="High-Fidelity PDF" />
                  <ComparisonRow feature="Security" trad="Unknown" craft="Enterprise-Grade" />
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section id="templates" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-7xl font-black text-royal-navy mb-6 tracking-tighter leading-none">The <span className="text-royal-gold">Elite</span> Collection.</h2>
                <p className="text-royal-navy/50 font-medium text-lg">Curated styles for the most demanding industries.</p>
              </div>
              <Link href="/builder" className="group text-xs font-black uppercase tracking-widest text-royal-navy flex items-center gap-3 hover:text-royal-gold transition-colors">
                Explore Full Library
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <TemplatePreview name="The Royal Gold" id="premium-gold" tag="Elite Selection" color="bg-[#1a1a1a]" />
              <TemplatePreview name="The Executive" id="executive" tag="C-Suite" color="bg-royal-navy" />
              <TemplatePreview name="Corporate Classic" id="professional" tag="Recruiter Favorite" color="bg-slate-700" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
              <TemplatePreview name="Modern Tech" id="creative" tag="Startup Ready" color="bg-royal-gold" />
              <TemplatePreview name="Clean & Simple" id="minimalist" tag="Minimalist" color="bg-slate-200" darkText />
              <TemplatePreview name="The Scholar" id="academic" tag="Academic" color="bg-stone-100" darkText />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-32 bg-royal-navy text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-sm font-black text-royal-gold uppercase tracking-[0.4em] mb-6">Proven Success</h2>
                  <p className="text-4xl md:text-6xl font-black tracking-tighter mb-12">Don&apos;t just take our word for it.</p>
                  <div className="flex items-center gap-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                    <Image src="https://i.pravatar.cc/100?u=mark" alt="Mark" width={64} height={64} className="w-16 h-16 rounded-full border-2 border-royal-gold" />
                    <div>
                      <p className="font-serif italic text-lg mb-2">&quot;CvCRAFT didn&apos;t just fix my resume; they fixed my confidence. I landed a Senior Role at AWS within 2 weeks.&quot;</p>
                      <p className="text-xs font-black uppercase tracking-widest text-royal-gold">Mark S. - Cloud Architect</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-4">
                      <TestimonialCard name="Sarah J." role="Product Manager" text="ATS pass rate went from 10% to 90%." />
                      <TestimonialCard name="David L." role="Software Engineer" text="The AI suggestions are scarily accurate." />
                   </div>
                   <div className="space-y-4 pt-12">
                      <TestimonialCard name="Elena R." role="Marketing Director" text="Premium templates that actually stand out." />
                      <TestimonialCard name="James W." role="Finance Associate" text="Worth every penny of the premium plan." />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-24">
              <h2 className="text-sm font-black text-royal-gold uppercase tracking-[0.4em] mb-4">Investment</h2>
              <p className="text-4xl md:text-6xl font-black text-royal-navy tracking-tighter">Pricing for the Ambitious.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              <PricingCard
                tier="Free"
                price="£0"
                priceNote="forever"
                desc="Everything you need to build and download a polished CV."
                features={["All 10 templates", "3 AI rewrites per day", "ATS score & keyword check", "Unlimited PDF downloads"]}
                ctaLabel="Start for free"
              />
              <PricingCard
                tier="Premium"
                price="£7.99"
                priceNote="one-time payment"
                isFeatured={true}
                desc="Unlock unlimited AI and remove every limit — pay once, keep forever."
                features={["Unlimited AI bullet rewriting", "Unlimited cover letters", "No watermark on exports", "Priority AI processing", "Lifetime access"]}
                ctaLabel="Go Premium"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-32 bg-white border-t border-royal-navy/5">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-royal-navy mb-4 tracking-tight">Concierge Support</h2>
              <p className="text-royal-navy/50 font-medium">Frequently asked questions by our users.</p>
            </div>
            
            <div className="space-y-6">
              <FaqItem 
                q="How does the AI match my JD?" 
                a="Our AI performs a multi-layer semantic analysis, comparing your experience against 50,000+ industry-specific keywords to ensure perfect alignment with the role."
              />
              <FaqItem 
                q="Is my data encrypted?" 
                a="Every byte is secured with RSA-4096 encryption. Your professional identity is your most valuable asset, and we treat it with ultimate respect."
              />
              <FaqItem 
                q="Can I use this for the NHS?" 
                a="Yes, we have specialized templates and keyword sets specifically designed to pass the complex NHS recruitment filters and band-specific requirements."
              />
              <FaqItem 
                q="What makes a 'Royal' CV?" 
                a="It's the balance of prestige and practicality. We use curated typography, generous whitespace, and a structure that leads the reader to your value proposition in under 6 seconds."
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-32 max-w-7xl mx-auto mb-20">
          <div className="bg-royal-navy rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(10,17,40,0.5)]">
            <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-royal-gold/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight leading-tight">
                Ready to land your next role?
              </h2>
              <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto">
                Join thousands of professionals building standout CVs with CvCRAFT — free to start.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-royal-gold text-white px-10 py-5 text-base font-bold hover:bg-royal-gold-dark transition-all duration-200 shadow-xl hover:-translate-y-0.5"
              >
                Build my CV — free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-8 text-white/40 text-sm">No credit card required · Instant PDF export · ATS-ready</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-royal-navy/5 py-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <div className="p-1.5 rounded-lg bg-royal-navy">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-royal-navy uppercase">CvCRAFT</span>
            </Link>
            <p className="text-royal-navy/50 font-medium max-w-sm mb-8 leading-relaxed text-lg">
              Empowering professionals to navigate the modern job market with artificial intelligence and superior design standards.
            </p>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-royal-navy mb-8">Platform</h5>
            <ul className="space-y-4 text-royal-navy/50 font-bold text-sm">
              <li><Link href="#features" className="hover:text-royal-gold transition-colors">Features</Link></li>
              <li><Link href="/templates" className="hover:text-royal-gold transition-colors">Templates</Link></li>
              <li><Link href="#pricing" className="hover:text-royal-gold transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-black text-xs uppercase tracking-widest text-royal-navy mb-8">Company</h5>
            <ul className="space-y-4 text-royal-navy/50 font-bold text-sm">
              <li><Link href="/privacy" className="hover:text-royal-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-royal-gold transition-colors">Terms of Service</Link></li>
              <li><a href="mailto:hello@cvcraft.uk" className="hover:text-royal-gold transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 border-t border-royal-navy/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-royal-navy/30 text-xs font-black uppercase tracking-widest">
            © {new Date().getFullYear()} CvCRAFT Global. All Rights Reserved.
          </p>
          <div className="flex gap-10">
            <div className="flex items-center gap-2 text-royal-navy/30">
              <Shield className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-royal-navy/30">
              <LockIcon className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="text-center group">
      <div className="text-4xl md:text-6xl font-black text-royal-gold mb-2 tracking-tighter group-hover:scale-110 transition-transform duration-500">{num}</div>
      <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-[#F8F9FA] hover:bg-white border border-transparent hover:border-royal-navy/5 hover:shadow-2xl transition-all duration-500 group">
      <div className="mb-8 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:bg-royal-navy group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-royal-navy mb-4">{title}</h3>
      <p className="text-royal-navy/50 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

type ComparisonValue = boolean | string;

function ComparisonRow({ feature, trad, craft }: { feature: string; trad: ComparisonValue; craft: ComparisonValue }) {
  const renderVal = (val: ComparisonValue, isCraft: boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <div className="flex justify-center"><CheckCircle className={cn("h-6 w-6", isCraft ? "text-royal-gold" : "text-royal-navy/20")} /></div>
      ) : (
        <div className="flex justify-center text-royal-navy/10">-</div>
      );
    }
    return <div className="text-center text-sm font-black uppercase tracking-widest text-royal-navy/60">{val}</div>;
  };

  return (
    <tr className="border-t border-royal-navy/5 hover:bg-royal-gold/5 transition-colors">
      <td className="p-8 font-black text-royal-navy uppercase text-xs tracking-widest">{feature}</td>
      <td className="p-8">{renderVal(trad, false)}</td>
      <td className="p-8 bg-royal-gold/5">{renderVal(craft, true)}</td>
    </tr>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="group p-10 rounded-[3rem] bg-royal-navy/5 border border-transparent hover:bg-white hover:shadow-2xl hover:border-royal-navy/5 transition-all duration-500">
      <h4 className="text-xl font-black text-royal-navy mb-4 flex items-center gap-4">
        <div className="w-2 h-2 rounded-full bg-royal-gold" />
        {q}
      </h4>
      <p className="text-royal-navy/60 font-medium leading-relaxed pl-6 border-l-2 border-royal-gold/20">{a}</p>
    </div>
  );
}

function TemplatePreview({ name, tag, color, id, darkText = false }: { name: string; tag: string; color: string; id: string; darkText?: boolean }) {
  const accentColor = darkText ? "bg-black/10 text-royal-navy" : "bg-white/20 text-white";
  const barColor = darkText ? "bg-royal-navy/20" : "bg-white";
  
  return (
    <div className="group relative flex flex-col gap-8 bg-white p-2 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-4">
      <div className={cn("aspect-[3/4.5] w-full rounded-[3rem] relative overflow-hidden shadow-inner", color)}>
        <div className={cn("absolute top-8 right-8 px-5 py-2 backdrop-blur-xl rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-xl z-20", accentColor, darkText ? "border-black/5" : "border-white/20")}>
          {tag}
        </div>
        {/* Abstract Premium Visual */}
        <div className="absolute inset-0 p-12 flex flex-col justify-between opacity-30 group-hover:opacity-60 transition-opacity duration-700">
           <div className="space-y-4">
             <div className={cn("w-1/2 h-6 rounded-full", barColor)} />
             <div className={cn("w-full h-3 rounded-full opacity-50", barColor)} />
             <div className={cn("w-3/4 h-3 rounded-full opacity-30", barColor)} />
           </div>
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className={cn("h-40 rounded-[2rem]", darkText ? "bg-royal-navy/10" : "bg-white/40")} />
               <div className={cn("h-40 rounded-[2rem]", darkText ? "bg-royal-navy/10" : "bg-white/40")} />
             </div>
             <div className={cn("w-full h-2 rounded-full", barColor)} />
             <div className={cn("w-full h-2 rounded-full", barColor)} />
           </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center pb-12">
           <Link href={`/builder?template=${id}`} className="bg-white text-royal-navy px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-royal-gold hover:text-white transition-all">Select Template</Link>
        </div>
      </div>
      <div className="px-10 pb-8 text-center">
        <h4 className="text-2xl font-black text-royal-navy mb-2">{name}</h4>
        <p className="text-[10px] font-black text-royal-navy/30 uppercase tracking-[0.4em]">Premium Series</p>
      </div>
    </div>
  );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  );
}

function ProcessStep({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="group">
      <div className="text-6xl font-black text-royal-navy/5 mb-6 group-hover:text-royal-gold/20 transition-colors duration-500">{num}</div>
      <h3 className="text-2xl font-black text-royal-navy mb-4">{title}</h3>
      <p className="text-royal-navy/50 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300">
      <p className="text-sm font-medium text-white/80 mb-4">&quot;{text}&quot;</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-royal-gold/20 flex items-center justify-center text-[10px] font-black">{name[0]}</div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-white">{name}</p>
          <p className="text-[8px] font-black uppercase tracking-widest text-royal-gold/60">{role}</p>
        </div>
      </div>
    </div>
  );
}

function PricingCard({ tier, price, priceNote, desc, features, ctaLabel, isFeatured = false }: { tier: string; price: string; priceNote?: string; desc: string; features: string[]; ctaLabel: string; isFeatured?: boolean }) {
  return (
    <div className={cn(
      "p-8 md:p-10 rounded-3xl flex flex-col transition-all duration-300 relative overflow-hidden",
      isFeatured ? "bg-royal-navy text-white shadow-2xl shadow-royal-navy/20 ring-2 ring-royal-gold" : "bg-white text-royal-navy border border-slate-200 shadow-sm"
    )}>
      {isFeatured && <div className="absolute top-5 right-5 bg-royal-gold text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Most popular</div>}
      <h3 className={cn("text-sm font-semibold uppercase tracking-wider mb-4", isFeatured ? "text-royal-gold" : "text-slate-500")}>{tier}</h3>
      <div className="flex items-end gap-2 mb-1">
        <span className="text-5xl font-extrabold tracking-tight">{price}</span>
        {priceNote && <span className={cn("text-sm font-medium mb-1.5", isFeatured ? "text-white/60" : "text-slate-400")}>{priceNote}</span>}
      </div>
      <p className={cn("text-sm leading-relaxed mb-8 mt-3", isFeatured ? "text-white/70" : "text-slate-500")}>{desc}</p>
      <ul className="space-y-3 mb-8 flex-1">
        {features.map(f => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <CheckCircle className={cn("h-5 w-5 shrink-0", isFeatured ? "text-royal-gold" : "text-emerald-500")} />
            <span className={isFeatured ? "text-white/90" : "text-slate-600"}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/auth/login"
        className={cn(
          "w-full py-4 rounded-xl text-sm font-bold text-center transition-all duration-200",
          isFeatured ? "bg-royal-gold text-white hover:bg-royal-gold-dark" : "bg-royal-navy text-white hover:bg-slate-800"
        )}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

