"use server";

import { createClient } from "@/lib/supabase/server";
import { createBusiness, createLocation } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";

export async function submitOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { error: "You must be logged in to complete onboarding." };
  }

  const businessName = formData.get("businessName") as string;
  const locationName = formData.get("locationName") as string;
  const googleReviewLink = formData.get("googleReviewLink") as string;
  const brandColor = formData.get("brandColor") as string;
  const industry = (formData.get("industry") as string) || "Unspecified";

  if (!businessName || !locationName || !googleReviewLink) {
    return { error: "Missing required fields." };
  }

  let locationId = "";

  try {
    const business = await createBusiness(authData.user.id, businessName, industry, googleReviewLink);
    const location = await createLocation(business.id, locationName, googleReviewLink, brandColor || "#2f6b4f");
    locationId = location.id;
  } catch (err: any) {
    return { error: err.message || "Failed to save data. Please try again." };
  }

  // Redirect on success outside of the try-catch block for Next.js 14 server actions
  redirect(`/dashboard?locationId=${locationId}`);
}
