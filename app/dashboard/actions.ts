"use server";

import { updateLocationFlowMode, updateBusinessTags, updateLocation, deleteLocation } from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";

export async function updateFlowModeAction(locationId: string, mode: 'direct' | 'interactive') {
  await updateLocationFlowMode(locationId, mode);
  revalidatePath("/dashboard");
}

export async function updateBusinessTagsAction(businessId: string, tags: string[]) {
  await updateBusinessTags(businessId, tags);
  revalidatePath("/dashboard");
}

export async function updateLocationAction(locationId: string, name: string, googleLink: string) {
  await updateLocation(locationId, name, googleLink);
  revalidatePath("/dashboard");
}

export async function deleteLocationAction(locationId: string) {
  await deleteLocation(locationId);
  revalidatePath("/dashboard");
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
  const { createBranch } = await import("@/lib/supabase/queries");
  await createBranch(businessId, payload);
  revalidatePath("/dashboard");
}
