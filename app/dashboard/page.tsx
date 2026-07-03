import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness } from "@/lib/supabase/queries";
import Link from "next/link";

export default async function DashboardPage(props: { searchParams: { [key: string]: string | string[] | undefined } }) {
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
  const primaryLocation = locations[0];
  const justOnboarded = props.searchParams.locationId != null;

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/5 bg-black/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">ReviewFlow</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-gray-300">{business.name}</span>
          </div>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner"></div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
          <p className="mt-1 text-gray-400">Manage your locations and track review performance.</p>
        </header>

        {justOnboarded && primaryLocation && (
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 shadow-lg shadow-emerald-500/5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"></div>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Setup Complete!</h2>
                <p className="mt-1 text-gray-300">
                  Your business has been created successfully. You can now start sharing your QR code to collect reviews.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-xl font-semibold text-white">Locations</h2>
                <button className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
                  Add Location
                </button>
              </div>

              <div className="mt-6">
                {locations.map((loc) => (
                  <div key={loc.id} className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-black/40 p-5 transition-all hover:border-white/10 hover:bg-black/60 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-medium text-white flex items-center gap-2">
                        {loc.name}
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">Active</span>
                      </h3>
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="truncate max-w-[200px] sm:max-w-xs">{loc.google_review_link}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:items-end">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Public QR Link</span>
                      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black p-2 transition-colors group-hover:border-emerald-500/30">
                        <code className="text-sm font-mono text-emerald-400">/r/{loc.id.split('-')[0]}...</code>
                        <div className="h-4 w-px bg-white/10"></div>
                        <Link href={`/r/${loc.id}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                          View
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {locations.length === 0 && (
                  <p className="text-sm text-gray-400 py-4 text-center">No locations found.</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400">Total Scans</h3>
              <p className="mt-2 text-4xl font-bold tracking-tight text-white">0</p>
              <div className="mt-2 flex items-center text-sm text-emerald-400">
                <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Waiting for data
              </div>
            </div>
            
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-6 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-gray-400">Positive Feedback</h3>
              <p className="mt-2 text-4xl font-bold tracking-tight text-white">--</p>
              <div className="mt-2 text-sm text-gray-500">
                No feedback received yet
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
