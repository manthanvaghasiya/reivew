import { logQrScan, getLocationById, getBusinessById } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import ReviewFlowClient from "./ReviewFlowClient";

export default async function ReviewPage(props: {
  params: Promise<{ locationId: string }>;
}) {
  const params = await props.params;
  const locationId = params.locationId;
  
  const location = await getLocationById(locationId);
  if (!location) {
    notFound();
  }

  const business = await getBusinessById(location.business_id);
  if (!business) {
    notFound();
  }

  // QR scan is now logged client-side to prevent Next.js prefetch false-positives

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <ReviewFlowClient 
        locationId={locationId} 
        businessId={location.business_id}
        businessName={location.name} 
        googleReviewLink={location.google_review_link} 
        brandColor={location.brand_color} 
        flowMode={location.review_flow_mode as 'direct' | 'interactive' || 'direct'}
        predefinedTags={business.predefined_tags}
      />
    </main>
  );
}
