"use server";

import { updateLocationFlowMode, updateBusinessTags, updateLocation, deleteLocation } from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";

export async function updateFlowModeAction(locationId: string, mode: 'direct' | 'interactive') {
  try {
    await updateLocationFlowMode(locationId, mode);
    revalidatePath("/dashboard");
  } catch (error: any) {
    throw new Error(error.message || "Failed to update flow mode");
  }
}

export async function updateBusinessTagsAction(businessId: string, tags: string[]) {
  try {
    await updateBusinessTags(businessId, tags);
    revalidatePath("/dashboard");
  } catch (error: any) {
    throw new Error(error.message || "Failed to update business tags");
  }
}

export async function updateLocationAction(locationId: string, name: string, googleLink: string) {
  try {
    await updateLocation(locationId, name, googleLink);
    revalidatePath("/dashboard");
  } catch (error: any) {
    throw new Error(error.message || "Failed to update location");
  }
}

export async function deleteLocationAction(locationId: string) {
  try {
    await deleteLocation(locationId);
    revalidatePath("/dashboard");
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete location");
  }
}

export async function createBranchAction(businessId: string, payload: {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  google_review_link: string;
  logo_url: string;
}) {
  try {
    const { createBranch } = await import("@/lib/supabase/queries");
    await createBranch(businessId, payload);
    revalidatePath("/dashboard");
  } catch (error: any) {
    throw new Error(error.message || "Failed to create branch");
  }
}
