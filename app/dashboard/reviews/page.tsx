import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner, getLocationsByBusiness, getGoogleReviewsByLocation } from "@/lib/supabase/queries";
import FeedbackStreamClient from "@/components/FeedbackStreamClient";

export default async function ReviewsPage() {
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
  let reviews: any[] = [];
  
  if (locations && locations.length > 0) {
    reviews = await getGoogleReviewsByLocation(locations[0].id);
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <FeedbackStreamClient 
        businessId={business.id}
        businessName={business.name} 
        initialReviews={reviews}
      />
    </div>
  );
}
