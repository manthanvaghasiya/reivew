import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness } from "@/lib/supabase/queries";
import SeoHubClient from "./SeoHubClient";

export default async function SeoPage() {
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
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SEO Optimization Hub</h1>
        <p className="text-gray-400">Generate high-quality business descriptions and strategic keywords to improve local search visibility.</p>
      </header>
      
      <SeoHubClient locations={locations} />
    </div>
  );
}
