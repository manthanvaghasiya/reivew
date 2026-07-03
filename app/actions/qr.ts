"use server";

import { generateQrCodeDataUrl } from "@/lib/qr/generateQrCode";

export async function getQrCodeAction(locationId: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return generateQrCodeDataUrl(locationId, baseUrl);
}
