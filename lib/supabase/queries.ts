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
    .eq("owner_id", userId)
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

/**
 * Fetch feedback events for a specific location.
 * Optionally filter by feedback type.
 */
export async function getFeedbackEventsByLocation(
  locationId: string,
  type?: FeedbackType
) {
  const supabase = await createClient();

  if (type === "private_feedback") {
    // Read from the new private_feedback table
    const { data, error } = await supabase
      .from("private_feedback")
      .select("*")
      .eq("location_id", locationId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  let query = supabase
    .from("feedback_events")
    .select("*")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Fetch basic stats for a specific location efficiently using exact count.
 */
export async function getFeedbackStatsByLocation(locationId: string) {
  const supabase = await createClient();

  const [
    scansResult,
    goodTapsResult,
    badTapsResult,
    publicReviewClicksResult,
    privateFeedbacksResult,
  ] = await Promise.all([
    supabase.from("qr_scans").select("*", { count: "exact", head: true }).eq("location_id", locationId),
    supabase.from("feedback_events").select("*", { count: "exact", head: true }).eq("location_id", locationId).eq("type", "good_tap"),
    supabase.from("feedback_events").select("*", { count: "exact", head: true }).eq("location_id", locationId).eq("type", "bad_tap"),
    supabase.from("feedback_events").select("*", { count: "exact", head: true }).eq("location_id", locationId).eq("type", "public_review_click"),
    supabase.from("private_feedback").select("*", { count: "exact", head: true }).eq("location_id", locationId),
  ]);

  return {
    scans: scansResult.count || 0,
    goodTaps: goodTapsResult.count || 0,
    badTaps: badTapsResult.count || 0,
    publicReviewClicks: publicReviewClicksResult.count || 0,
    privateFeedbacks: privateFeedbacksResult.count || 0,
  };
}


// ------------------------------------------------------------------ //
//  Mutations                                                          //
// ------------------------------------------------------------------ //

export async function createBusiness(userId: string, name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .insert({ owner_id: userId, name })
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
