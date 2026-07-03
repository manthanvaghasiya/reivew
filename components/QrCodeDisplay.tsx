"use client";

import { useEffect, useState } from "react";
import { getQrCodeAction } from "@/app/actions/qr";

interface QrCodeDisplayProps {
  locationId: string;
}

export default function QrCodeDisplay({ locationId }: QrCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${baseUrl}/r/${locationId}`;

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const qr = await getQrCodeAction(locationId);
        setDataUrl(qr);
      } catch (err: unknown) {
        setError("Failed to generate QR code");
        console.error(err);
      }
    };
    fetchQr();
  }, [locationId]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `reviewflow-qr-${locationId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (error) {
    return <div className="text-red-500 rounded-lg bg-red-500/10 p-4 border border-red-500/20">{error}</div>;
  }

  if (!dataUrl) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <div className="animate-pulse bg-gray-800 w-64 h-64 rounded-lg"></div>
        <div className="animate-pulse bg-gray-800 h-4 w-48 rounded mt-2"></div>
        <div className="animate-pulse bg-gray-800 h-10 w-36 rounded-lg mt-2"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl w-fit">
      <img 
        src={dataUrl} 
        alt={`QR Code for ${url}`} 
        className="w-64 h-64 rounded-lg bg-white p-2" 
      />
      <p className="text-sm text-gray-400 font-mono text-center select-all px-2 py-1 bg-black/30 rounded w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {url}
      </p>
      <button 
        onClick={handleDownload}
        className="mt-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 font-semibold text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Download QR Code
      </button>
    </div>
  );
}
