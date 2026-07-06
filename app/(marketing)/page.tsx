import Link from "next/link";

export default function MarketingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-x-hidden bg-[#050505] text-gray-200 selection:bg-emerald-500/30 font-sans">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#050505] to-[#050505]"></div>
      
      {/* Dynamic Glowing Orbs */}
      <div className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 w-[800px] md:w-[1200px] h-[400px] md:h-[600px] bg-emerald-500/15 blur-[120px] rounded-[100%] pointer-events-none mix-blend-screen"></div>
      <div className="absolute top-[20%] right-[-10%] -z-10 w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Navbar (Sticky & Glassmorphic) */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/60 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
              MAGIC REVIEWS
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold tracking-[0.1em] text-gray-400 uppercase">
            <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
            <Link href="#industries" className="hover:text-emerald-400 transition-colors">Industries</Link>
            <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold text-gray-300 hover:text-white transition-colors hidden sm:block">
              Login
            </Link>
            <Link href="/login" className="relative group px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white overflow-hidden transition-all hover:bg-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] text-sm font-bold">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">Get Demo</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-40 md:mt-48 w-full mb-32">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-10 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.15)] transform transition-transform hover:scale-105 cursor-default">
          <span className="mr-3 flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          Trusted by 30+ Businesses
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-white mb-8 leading-[1.05] drop-shadow-2xl">
          Get More Google Reviews <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
            Effortlessly with AI
          </span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          Turn happy customers into loyal promoters in just one tap. Powered by smart AI-generated reviews that sound natural, authentic, and rank higher.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center rounded-full bg-emerald-500 hover:bg-emerald-400 px-10 py-5 font-black text-black shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] text-lg uppercase tracking-wider">
            Book Free Demo
          </Link>
          <button className="w-full sm:w-auto flex items-center justify-center rounded-full bg-white/5 border border-white/10 px-10 py-5 font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 text-lg group">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
            </div>
            Watch Demo
          </button>
        </div>

        <div className="mt-20 flex flex-col items-center gap-5">
          <div className="flex -space-x-4">
            {[
              "https://i.pravatar.cc/100?img=33",
              "https://i.pravatar.cc/100?img=12",
              "https://i.pravatar.cc/100?img=47",
              "https://i.pravatar.cc/100?img=61"
            ].map((src, i) => (
              <img key={i} src={src} alt="Trusted Business" className="w-14 h-14 rounded-full border-4 border-[#050505] object-cover" />
            ))}
            <div className="w-14 h-14 rounded-full border-4 border-[#050505] bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-sm font-bold text-white shadow-lg">30+</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-1 text-yellow-400 mb-1">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            </div>
            <span className="font-bold text-white text-lg tracking-wide">4.9/5 Average Rating</span>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-emerald-500/5 blur-[100px] rounded-full -z-10"></div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Your Dashboard Preview</h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">Experience the power of our intuitive dashboard designed to help you manage reviews effortlessly.</p>
        </div>
        
        <div className="relative rounded-[2.5rem] border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-xl p-4 md:p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 h-full w-full pointer-events-none rounded-[2.5rem]"></div>
          
          <div className="aspect-[16/9] w-full rounded-3xl bg-[#111] border border-white/5 overflow-hidden flex flex-col relative group">
            {/* Mock Dashboard Header */}
            <div className="h-14 bg-white/5 border-b border-white/5 flex items-center px-6 justify-between">
              <div className="flex gap-2">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80"></div>
              </div>
              <div className="h-6 w-1/3 bg-white/5 rounded-full"></div>
            </div>
            
            {/* Mock Dashboard Body */}
            <div className="flex-1 p-8 md:p-12 flex gap-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-black/50">
              <div className="w-64 hidden lg:flex flex-col gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-12 w-full bg-white/5 rounded-2xl border border-white/5"></div>)}
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div className="h-32 w-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="h-4 w-1/4 bg-white/20 rounded-full"></div>
                  <div className="h-10 w-1/2 bg-white/10 rounded-full"></div>
                </div>
                <div className="flex-1 flex gap-6">
                  <div className="flex-1 bg-white/5 rounded-3xl border border-white/5 p-6"></div>
                  <div className="flex-1 bg-white/5 rounded-3xl border border-white/5 p-6"></div>
                </div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/40 backdrop-blur-sm z-20">
              <Link href="/login" className="bg-emerald-500 text-black font-black px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                EXPLORE DASHBOARD
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative z-10">
          {[
            { title: "Real-Time Analytics", desc: "Track your reviews and performance metrics in real-time.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
            { title: "Easy Management", desc: "Manage all your branches and reviews from one place.", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            { title: "Quick Insights", desc: "Get instant insights to improve your business operations.", icon: "M13 10V3L4 14h7v7l9-11h-7z" }
          ].map((feature, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 p-10 rounded-[2rem] hover:bg-[#111] hover:border-emerald-500/30 transition-all duration-300 group shadow-lg">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon}/></svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/5 skew-y-3 origin-top-left -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">How It Works</h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">Smart AI Review System - Turn happy customers into loyal promoters in just 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Scan the QR Code", desc: "Customers scan the Google Reviews QR using their phone camera—no app required." },
              { step: "02", title: "Choose a Rating", desc: "The system asks the customer to select a rating from 1 to 5 stars." },
              { step: "03", title: "AI Reviews (Positive)", desc: "For 4 & 5-star ratings, AI generates ready-to-use, SEO-friendly review suggestions. Customers copy and submit." },
              { step: "04", title: "Private Feedback", desc: "For ratings below 3 stars, customers submit private feedback instead of Google to help you improve." }
            ].map((step, i) => (
              <div key={i} className="relative p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-colors group">
                <div className="text-8xl font-black text-white/5 absolute top-4 right-4 group-hover:text-emerald-500/10 transition-colors">{step.step}</div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10 mt-12">{step.title}</h3>
                <p className="text-gray-400 relative z-10 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose AI Based System */}
      <section className="w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Why Choose AI Google Reviews QR?</h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">Discover the powerful benefits that make our AI-powered review system the smart choice for your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Save Time & Effort", desc: "Collect Google reviews without manually following up with each customer." },
            { title: "Boost Local SEO", desc: "More quality AI Suggested reviews help your business rank higher on Google Maps and Search." },
            { title: "Easy to Use", desc: "No technical setup required. Just generate your QR code and start collecting reviews." },
            { title: "Increase Customer Trust", desc: "90%+ customers check Google reviews before choosing a business. Positive reviews enhance credibility." },
            { title: "Instant Review Collection", desc: "Reviews are submitted directly via QR code, instantly visible to you." },
            { title: "Insightful Analytics", desc: "Track reviews, monitor negative feedback, and use insights to improve your service." }
          ].map((benefit, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl flex gap-6 items-start hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full border-y border-white/5 bg-[#0a0a0a] py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200px] bg-emerald-500/5 blur-[80px] rounded-full"></div>
        
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative z-10">
          <div>
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-teal-700 mb-4 drop-shadow-lg">50+</div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Industries Served</div>
          </div>
          <div>
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-teal-700 mb-4 drop-shadow-lg">10K+</div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Reviews Generated</div>
          </div>
          <div>
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-teal-700 mb-4 drop-shadow-lg">200%</div>
            <div className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Average Review Growth</div>
          </div>
        </div>
      </section>

      {/* Key Features & Everything You Need */}
      <section id="features" className="w-full max-w-7xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Everything You Need to Boost Reviews</h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">Our AI Review System packs a powerful punch, giving you all the tools you need to make collecting and managing Google reviews effortless.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Magic QR Review System", desc: "Smart filtering to reduce negative public reviews. Route unhappy customers privately while showcasing 5-star feedback on Google." },
            { title: "AI Review Writer", desc: "Instantly generate SEO-friendly Google reviews. AI crafts compelling, authentic-sounding reviews that boost your visibility." },
            { title: "AI Auto-Reply System", desc: "AI automatically replies to all reviews. Personalized, professional responses in seconds—never leave a customer unattended." },
            { title: "GBP Profile Audit Score", desc: "Complete profile audit with actionable insights. Get a downloadable PDF report to optimize your Google Business Profile." },
            { title: "AI SEO Content Optimizer", desc: "Improve GBP descriptions & services for better ranking. AI-powered optimization to dominate local search." },
            { title: "GBP Posting", desc: "Create & publish posts directly on Google Business Profile. Keep your profile fresh and engaging with one-click publishing." },
            { title: "Promotional Custom Posters", desc: "Create any type of poster & SEO-friendly caption using AI. Perfect for promotions, events, and seasonal campaigns." },
            { title: "One-Click Google Post", desc: "Post generated reviews directly to your Google Business Profile with one click to boost engagement." }
          ].map((feature, i) => (
            <div key={i} className="p-10 rounded-[2rem] bg-[#0a0a0a] border border-white/5 hover:bg-[#111] hover:border-emerald-500/30 transition-all duration-300 group">
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="industries" className="w-full relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/5 -skew-y-3 origin-bottom-right -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Industries We Serve</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">We cater to a wide range of industries, helping businesses of all sizes improve their online presence.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {["Restaurants", "Healthcare", "Retail", "Automotive", "Salons", "Real Estate", "Hotels", "Fitness", "Education", "Legal", "Home Services", "And 40+ More"].map((industry, i) => (
              <div key={i} className="px-8 py-4 rounded-full border border-white/10 bg-[#050505] text-gray-300 font-bold text-lg hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all cursor-default shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="w-full max-w-5xl mx-auto px-6 py-40 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent -z-10"></div>
        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">Ready to Dominate <br/> Local Search?</h2>
        <p className="text-2xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">Join 30+ businesses using Magic Reviews AI to automatically collect 5-star reviews and filter negative feedback.</p>
        <Link href="/login" className="inline-block rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-12 py-6 font-black text-black shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.7)] text-2xl uppercase tracking-widest">
          Get Your Free Demo Now
        </Link>
      </section>

    </main>
  );
}
