import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/supabase/queries";
import DashboardShell from "@/components/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login");
  }

  const business = await getBusinessByOwner(authData.user.id);
  
  if (!business) {
    // If they have no business, maybe they are in onboarding. 
    // We shouldn't block /dashboard entirely if they need to see something, 
    // but typically they redirect to /onboarding
    redirect("/onboarding");
  }

  return (
    <DashboardShell businessName={business.name}>
      {children}
    </DashboardShell>
  );
}
