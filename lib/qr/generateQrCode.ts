import QRCode from "qrcode";

export async function generateQrCodeDataUrl(locationId: string, baseUrl: string): Promise<string> {
  const url = `${baseUrl}/r/${locationId}`;
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}
