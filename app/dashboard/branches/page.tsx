import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness, getFeedbackStatsByLocation } from "@/lib/supabase/queries";
import LocationCard from "@/components/LocationCard";
import AddBranchButton from "@/components/AddBranchButton";

export default async function BranchesPage() {
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
  
  const locationData = await Promise.all(
    locations.map(async (loc) => {
      const stats = await getFeedbackStatsByLocation(loc.id);
      return { ...loc, stats };
    })
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Branch Management</h1>
        <p className="mt-1 text-gray-400">Manage multiple physical locations from a single admin panel.</p>
      </header>

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
  );
}
