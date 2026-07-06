import { createClient } from "@/lib/supabase/server";
import { getBusinessByOwner, getLocationsByBusiness } from "@/lib/supabase/queries";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ConnectPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login");
  }

  const business = await getBusinessByOwner(authData.user.id);
  if (!business) {
    redirect("/onboarding");
  }

  const locations = await getLocationsByBusiness(business.id);

  return (
    <div className="max-w-7xl mx-auto">
      
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          Google Business Intelligence
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </h1>
        <p className="text-gray-400">Link your Google Business Profiles to enable AI-powered review management and analytics.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Column - Network Branches */}
        <div className="xl:col-span-2 space-y-8">
          
          <div className="rounded-[2rem] bg-white/5 border border-white/10 p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -z-10"></div>
            
            <div className="flex items-center gap-4 mb-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-widest text-white uppercase">Network Branches</h2>
            </div>

            {locations.length === 0 ? (
              <div className="text-center py-10 border border-white/5 rounded-2xl bg-[#0a0a0a]">
                <p className="text-gray-400 mb-4">No branches deployed yet.</p>
                <Link href="/dashboard/branches" className="text-emerald-400 hover:text-emerald-300 font-bold">
                  Deploy your first branch &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {locations.map((loc) => (
                  <div key={loc.id} className="relative rounded-2xl border border-white/5 bg-[#0a0a0a] p-6 transition-colors hover:border-emerald-500/30">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3">{loc.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                            Branch
                          </span>
                          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                            Auto-Reply Active
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="truncate max-w-[200px]">{loc.address || "Location set"}</span>
                        </div>
                        <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          • Last Synced 2 hours ago
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Link href="/dashboard/reviews" className="rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-blue-500 uppercase tracking-wider">
                        Reviews
                      </Link>
                      <Link href="/dashboard/poster-studio" className="rounded-full bg-purple-600 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-purple-500 uppercase tracking-wider">
                        Poster Studio
                      </Link>
                      <Link href="/dashboard/posts" className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-emerald-500 uppercase tracking-wider">
                        Post
                      </Link>
                      <Link href="/dashboard/seo" className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-indigo-500 uppercase tracking-wider">
                        SEO
                      </Link>
                      <Link href={`/dashboard/report/${loc.id}`} className="rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white transition-transform hover:scale-105 hover:bg-rose-500 uppercase tracking-wider">
                        Report
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
             <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                  i
                </div>
                <h3 className="text-xl font-bold tracking-widest text-white uppercase">Branch Logic</h3>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
               <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <span className="text-white/50 text-xs font-bold mb-2 block">01</span>
                  <h4 className="text-white font-bold mb-2">Initialization</h4>
                  <p className="text-blue-100 text-sm">Link your branches to authorized Google locations. Sync cycles occur every 24-36 hours.</p>
               </div>
               <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                  <span className="text-white/50 text-xs font-bold mb-2 block">02</span>
                  <h4 className="text-white font-bold mb-2">AI Intelligence</h4>
                  <p className="text-blue-100 text-sm">Our neural engine analyzes new incoming feedback, generates contextual responses, and optimizes SEO content.</p>
               </div>
             </div>
          </div>

        </div>

        {/* Right Sidebar - Active Master Session */}
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white/5 border border-white/10 p-6 shadow-xl">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Active Master Session</h3>
            
            <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 flex items-center gap-4">
              <div className="h-12 w-12 flex-shrink-0 bg-white rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Connected Account</h4>
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-1">Connected</p>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center mb-4">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Available Profiles</h3>
              <button className="text-emerald-400 hover:text-emerald-300">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                ACCOUNTS/112657579902128197862
              </div>
              
              {locations.map((loc) => (
                <div key={`profile-${loc.id}`} className="rounded-xl border border-white/5 bg-[#0a0a0a] p-4 hover:border-emerald-500/20 transition-colors cursor-pointer">
                  <h4 className="text-white font-bold text-sm mb-1 truncate">{loc.name}</h4>
                  <p className="text-gray-500 text-xs truncate">{loc.address || "Address pending"}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
