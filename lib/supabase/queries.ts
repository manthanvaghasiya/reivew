import { createClient } from "./server";
import type { FeedbackType } from "./database.types";

// ------------------------------------------------------------------ //
//  Businesses                                                         //
// ------------------------------------------------------------------ //

/**
 * Fetch the business owned by a given user.
 * Returns the first matching row or `null`.
 */
export async function getBusinessByOwner(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------ //
//  Locations                                                          //
// ------------------------------------------------------------------ //

/**
 * Fetch all locations for a specific business.
 */
export async function getLocationsByBusiness(businessId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Fetch a single location by its ID.
 * Used on the public QR-scan page — works for anon callers because
 * the RLS policy allows anon SELECT on locations.
 */
export async function getLocationById(locationId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("id", locationId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// ------------------------------------------------------------------ //
//  QR Scans                                                           //
// ------------------------------------------------------------------ //

/**
 * Record a QR scan event.
 * Can be called by anon users (public endpoint).
 */
export async function logQrScan(locationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("qr_scans")
    .insert({ location_id: locationId });

  if (error) throw error;
}

// ------------------------------------------------------------------ //
//  Feedback Events                                                    //
// ------------------------------------------------------------------ //

/**
 * Record a feedback event from a customer.
 * Can be called by anon users (public endpoint).
 */
export async function logFeedbackEvent(
  locationId: string,
  type: FeedbackType,
  message?: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("feedback_events")
    .insert({
      location_id: locationId,
      type,
      message: message ?? null,
    });

  if (error) throw error;
}

// ------------------------------------------------------------------ //
//  Mutations                                                          //
// ------------------------------------------------------------------ //

export async function createBusiness(userId: string, name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .insert({ owner_user_id: userId, name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createLocation(businessId: string, name: string, googleReviewLink: string, brandColor: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .insert({
      business_id: businessId,
      name,
      google_review_link: googleReviewLink,
      brand_color: brandColor,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
