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
      <div className="bg-white rounded-[1.5rem] p-5 w-full shadow-2xl animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-lg"></div>
        <div className="mt-4 w-full h-9 bg-gray-200 rounded-lg"></div>
        <div className="mt-3 w-full h-11 bg-gray-200 rounded-[0.85rem]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[1.5rem] p-5 w-full shadow-2xl">
      <img 
        src={dataUrl} 
        alt={`QR Code for ${url}`} 
        className="w-full aspect-square object-contain mx-auto rounded-xl shadow-sm border border-gray-100" 
      />
      <div className="mt-4">
        <div className="w-full bg-[#f8f9fa] text-gray-500 text-[11px] text-center rounded-[10px] py-2.5 font-mono truncate px-4 border border-gray-100">
          {url}
        </div>
      </div>
      <button 
        onClick={handleDownload}
        className="group w-full mt-3 flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-[12px] py-3 text-[13px] transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none"
      >
        <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download QR Code
      </button>
    </div>
  );
}
