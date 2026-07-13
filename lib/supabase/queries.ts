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

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetch a single business by its ID.
 * Returns the first matching row or `null`.
 */
export async function getBusinessById(businessId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .maybeSingle();

  if (error) {
    if (error.code === "22P02") return null;
    throw new Error(error.message);
  }
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

  if (error) throw new Error(error.message);
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

  if (error) {
    if (error.code === "22P02") return null;
    throw new Error(error.message);
  }
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

  if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
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

    if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
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

export async function createBusiness(userId: string, name: string, industry: string = "Unspecified", googleReviewUrl: string = "") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .insert({ owner_id: userId, name, industry, google_review_url: googleReviewUrl })
    .select()
    .single();

  if (error) throw new Error(error.message);
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

  if (error) throw new Error(error.message);
  return data;
}

export async function createBranch(businessId: string, payload: {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  google_review_link: string;
  logo_url: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("locations")
    .insert({
      business_id: businessId,
      name: payload.name,
      category: payload.category,
      description: payload.description,
      address: payload.address,
      phone: payload.phone,
      google_review_link: payload.google_review_link,
      logo_url: payload.logo_url,
      brand_color: "#10b981", // default emerald
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBusinessTags(businessId: string, tags: string[]) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("businesses")
    .update({ predefined_tags: tags })
    .eq("id", businessId);

  if (error) throw new Error(error.message);
}

export async function updateLocationFlowMode(locationId: string, mode: 'direct' | 'interactive') {
  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .update({ review_flow_mode: mode })
    .eq("id", locationId);

  if (error) throw new Error(error.message);
}

export async function updateLocation(locationId: string, name: string, googleReviewLink: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .update({ 
      name, 
      google_review_link: googleReviewLink 
    })
    .eq("id", locationId);

  if (error) throw new Error(error.message);
}

export async function deleteLocation(locationId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("id", locationId);

  if (error) throw new Error(error.message);
}

// ------------------------------------------------------------------ //
//  Google Reviews                                                     //
// ------------------------------------------------------------------ //

export async function getGoogleReviewsByLocation(locationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_reviews")
    .select("*")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}



export async function updateGoogleReviewReply(reviewId: string, aiResponse: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_reviews")
    .update({ 
      ai_response: aiResponse,
      responded_at: new Date().toISOString()
    })
    .eq("id", reviewId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ------------------------------------------------------------------ //
//  Leads Management                                                   //
// ------------------------------------------------------------------ //

export async function getLeadsByBusiness(businessId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createLead(payload: {
  business_id: string;
  name: string;
  phone: string;
  source: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateLeadStatus(leadId: string, status: string, aiSummary?: string, whatsappMessageId?: string) {
  const supabase = await createClient();
  
  const updates: any = { status, updated_at: new Date().toISOString() };
  if (aiSummary !== undefined) updates.ai_summary = aiSummary;
  if (whatsappMessageId !== undefined) updates.whatsapp_message_id = whatsappMessageId;

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", leadId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getLeadMessages(leadId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function insertLeadMessage(payload: { lead_id: string; sender: "user" | "business" | "ai"; message_text: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lead_messages")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateBusinessAIPrompt(businessId: string, prompt: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("businesses")
    .update({ custom_ai_prompt: prompt })
    .eq("id", businessId);

  if (error) throw new Error(error.message);
}
