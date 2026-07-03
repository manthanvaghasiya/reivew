import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness, getFeedbackEventsByLocation, getFeedbackStatsByLocation } from "@/lib/supabase/queries";
import Link from "next/link";
import { logout } from "@/app/login/actions";

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

  // Fetch private feedback and stats for all locations
  const locationData = await Promise.all(
    locations.map(async (loc) => {
      const [events, stats] = await Promise.all([
        getFeedbackEventsByLocation(loc.id, "private_feedback"),
        getFeedbackStatsByLocation(loc.id)
      ]);
      return {
        ...loc,
        privateFeedbacks: events.map((event) => ({ ...event, locationName: loc.name })),
        stats
      };
    })
  );
  
  const privateFeedbacks = locationData
    .flatMap((d) => d.privateFeedbacks)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
  const showLocationLabel = locations.length > 1;

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
          <form action={logout}>
            <button type="submit" className="text-sm font-medium text-gray-400 hover:text-white transition-colors mr-2">
              Log out
            </button>
          </form>
          <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner"></div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
          <p className="mt-1 text-gray-400">Manage your locations and view feedback.</p>
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

        <div className="space-y-8">
          {/* Stats Section */}
          {locationData.map((loc) => (
            <div key={`stats-${loc.id}`}>
              <h2 className="text-xl font-semibold text-white mb-4">
                Overview {showLocationLabel && <span className="text-gray-400 font-normal ml-2">({loc.name})</span>}
              </h2>
              {loc.stats.scans === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <p className="text-gray-400 text-sm">
                    Print your QR code and place it somewhere customers will see it to start collecting data.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-400">Scans</span>
                    <span className="mt-2 text-2xl font-bold text-white">{loc.stats.scans}</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-400">Said good</span>
                    <span className="mt-2 text-2xl font-bold text-emerald-400">{loc.stats.goodTaps}</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-400">Said not great</span>
                    <span className="mt-2 text-2xl font-bold text-rose-400">{loc.stats.badTaps}</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-400">Clicked Google review</span>
                    <span className="mt-2 text-2xl font-bold text-white">{loc.stats.publicReviewClicks}</span>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm flex flex-col justify-between">
                    <span className="text-xs font-medium text-gray-400">Left private feedback</span>
                    <span className="mt-2 text-2xl font-bold text-white">{loc.stats.privateFeedbacks}</span>
                  </div>
                </div>
              )}
            </div>
          ))}


          {/* Locations Section */}
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-xl font-semibold text-white">Locations</h2>
              <button className="rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white">
                Add Location
              </button>
            </div>

            <div className="mt-6">
              {locations.map((loc) => (
                <div key={loc.id} className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-black/40 p-5 transition-all hover:border-white/10 hover:bg-black/60 sm:flex-row sm:items-center mb-4 last:mb-0">
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
          
          {/* Private Feedback Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Private Feedback</h2>
            {privateFeedbacks.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center backdrop-blur-sm">
                <p className="text-gray-400">
                  No private feedback yet — once customers scan your QR code, anything they don't want posted publicly will show up here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {privateFeedbacks.map((fb) => (
                  <div key={fb.id} className="rounded-xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                      <span className="text-sm text-gray-400">
                        {new Date(fb.created_at).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {showLocationLabel && (
                        <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-gray-300">
                          {fb.locationName}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{fb.message || "No message provided."}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
