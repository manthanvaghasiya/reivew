import { logQrScan, getLocationById } from "@/lib/supabase/queries";
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

  // Log scan server-side on load
  try {
    await logQrScan(locationId);
  } catch (error) {
    console.error("Failed to log QR scan:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <ReviewFlowClient 
        locationId={locationId} 
        businessId={location.business_id}
        businessName={location.name} 
        googleReviewLink={location.google_review_link} 
        brandColor={location.brand_color} 
      />
    </main>
  );
}
