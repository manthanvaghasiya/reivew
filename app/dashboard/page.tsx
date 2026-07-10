import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness, getFeedbackStatsByLocation } from "@/lib/supabase/queries";
import TagsEditor from "@/components/TagsEditor";
import LocationCard from "@/components/LocationCard";
import AddBranchButton from "@/components/AddBranchButton";

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

  // Fetch stats for all locations
  const locationData = await Promise.all(
    locations.map(async (loc) => {
      const stats = await getFeedbackStatsByLocation(loc.id);
      return {
        ...loc,
        stats
      };
    })
  );
  
    
  const showLocationLabel = locations.length > 1;

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Overview</h1>
        <p className="mt-1 text-gray-400">View analytics and manage your locations.</p>
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
              Analytics {showLocationLabel && <span className="text-gray-400 font-normal ml-2">({loc.name})</span>}
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


        {/* Tags Section */}
        <TagsEditor businessId={business.id} initialTags={business.predefined_tags} />

        {/* Locations Section */}
        <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-semibold text-white">Branches</h2>
            <AddBranchButton businessId={business.id} />
          </div>

          <div className="mt-6">
            {locationData.map((loc) => (
              <LocationCard key={loc.id} loc={loc} />
            ))}

            {locationData.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">No locations found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
