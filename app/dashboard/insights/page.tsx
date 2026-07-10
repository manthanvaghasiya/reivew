import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness } from "@/lib/supabase/queries";

export default async function InsightsRedirectPage() {
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
  
  if (locations && locations.length > 0) {
    redirect(`/dashboard/insights/${locations[0].id}`);
  }

  return (
    <div className="max-w-5xl mx-auto py-20 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">No Locations Found</h1>
      <p className="text-gray-400">Please add a location to view insights and feedback.</p>
    </div>
  );
}
