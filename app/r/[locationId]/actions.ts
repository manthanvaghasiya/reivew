"use server";

import { logFeedbackEvent } from "@/lib/supabase/queries";
import type { FeedbackType } from "@/lib/supabase/database.types";

export async function logFeedbackAction(locationId: string, type: FeedbackType, message?: string) {
  try {
    await logFeedbackEvent(locationId, type, message);
  } catch (error) {
    // Fail silently so the user flow isn't blocked, but log it for debugging
    console.error("Failed to log feedback event:", error);
  }
}
