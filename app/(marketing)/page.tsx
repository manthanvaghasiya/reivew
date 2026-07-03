import Link from "next/link";

export default function MarketingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-black selection:bg-emerald-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-[#0a0a0a] to-black"></div>
      <div className="absolute top-1/3 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full"></div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
            ReviewFlow
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/login" className="px-5 py-2.5 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all text-sm font-medium backdrop-blur-md shadow-lg">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto mt-20 sm:mt-32">
        <div className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now in Public Beta
        </div>
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500 mb-8 leading-[1.1]">
          Turn happy customers into <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            5-star Google Reviews
          </span>
        </h1>
        
        <p className="mt-2 text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          The smartest way for local businesses to capture feedback. Filter out bad experiences privately, and route happy customers directly to Google.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link href="/login" className="group relative flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 font-bold text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg">
            <span className="relative z-10 flex items-center">
              Start Free Trial
              <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </Link>
        </div>
      </div>
      
      {/* Decorative floating UI elements (mockup preview) */}
      <div className="mt-24 sm:mt-32 w-full max-w-5xl px-4 relative z-10 mb-20">
        <div className="rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-2 md:p-4">
           <div className="rounded-xl overflow-hidden bg-[#0a0a0a] aspect-video border border-white/10 flex flex-col">
             {/* Mock Browser Header */}
             <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
               </div>
               <div className="mx-auto w-1/2 h-6 bg-white/5 rounded-md"></div>
             </div>
             {/* Mock App Content */}
             <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-emerald-500/5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
               
               <div className="w-64 bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-sm z-10 text-center transform hover:scale-105 transition-transform duration-500 cursor-pointer">
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-lg mb-4">
                    {/* Mock QR Code Pattern */}
                    <div className="w-full h-full bg-gray-200 grid grid-cols-4 grid-rows-4 gap-1 p-1 rounded-sm">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={`bg-black ${i % 3 === 0 ? 'opacity-0' : 'opacity-100'} rounded-sm`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="h-4 w-3/4 bg-white/20 mx-auto rounded-full mb-2"></div>
                  <div className="h-3 w-1/2 bg-white/10 mx-auto rounded-full"></div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </main>
  );
}
