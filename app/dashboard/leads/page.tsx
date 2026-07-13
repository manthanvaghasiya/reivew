import { redirect } from "next/navigation";
import { getBusinessByOwner, getLeadsByBusiness } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import LeadBoardClient from "./LeadBoardClient";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const business = await getBusinessByOwner(user.id);
  if (!business) {
    redirect("/onboarding");
  }

  const leads = await getLeadsByBusiness(business.id);

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <LeadBoardClient 
        businessId={business.id} 
        initialLeads={leads} 
        initialCustomPrompt={business.custom_ai_prompt || ""} 
      />
    </div>
  );
}
