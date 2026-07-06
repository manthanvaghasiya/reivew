"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FlowModeToggle from "@/components/FlowModeToggle";
import { updateLocationAction, deleteLocationAction } from "@/app/dashboard/actions";
import { getQrCodeAction } from "@/app/actions/qr";

export default function LocationCard({ loc }: { loc: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [name, setName] = useState(loc.name);
  const [googleLink, setGoogleLink] = useState(loc.google_review_link || "");
  const [isSaving, setIsSaving] = useState(false);

  // QR Code State
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicUrl = `${baseUrl}/r/${loc.id}`;

  useEffect(() => {
    const fetchQr = async () => {
      try {
        const qr = await getQrCodeAction(loc.id);
        setQrDataUrl(qr);
      } catch (err) {
        console.error("Failed to fetch QR", err);
      }
    };
    fetchQr();
  }, [loc.id]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `reviewflow-qr-${loc.id.split('-')[0]}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateLocationAction(loc.id, name, googleLink);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert("Failed to update location.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await deleteLocationAction(loc.id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete location.");
      setIsSaving(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="rounded-[2rem] border border-rose-500/30 bg-[#0a0a0a] p-8 mb-6 shadow-2xl transition-all">
        <h3 className="text-xl font-bold text-rose-400 mb-2">Delete Location?</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-lg">
          Are you sure you want to delete <strong className="text-white">{loc.name}</strong>? This action cannot be undone and will permanently remove all associated QR scans and feedback.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={handleDelete}
            disabled={isSaving}
            className="rounded-xl bg-rose-600 px-6 py-2.5 text-[13px] font-bold tracking-wide text-white hover:bg-rose-500 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Deleting..." : "YES, DELETE PERMANENTLY"}
          </button>
          <button 
            onClick={() => setIsDeleting(false)}
            disabled={isSaving}
            className="rounded-xl bg-[#222] px-6 py-2.5 text-[13px] font-bold tracking-wide text-white hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            CANCEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0a0a] transition-all hover:border-emerald-500/20 mb-6 last:mb-0 shadow-2xl">
      
      {/* Action Menu (Edit / Delete) - Positioned absolute at the top right */}
      <div className="absolute top-6 right-6 flex gap-2 z-10">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-lg bg-[#222] border border-transparent text-gray-400 hover:text-white transition-all shadow-sm"
          title="Edit Location"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button 
          onClick={() => setIsDeleting(true)}
          className="p-2 rounded-lg bg-[#222] border border-transparent text-gray-400 hover:text-rose-400 transition-all shadow-sm"
          title="Delete Location"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left Column: Info & Actions */}
        <div className="flex-1 min-w-0 flex flex-col justify-start">
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0d2a1f] text-[#10b981] overflow-hidden">
                {loc.logo_url ? (
                  <img src={loc.logo_url} alt={`${loc.name} Logo`} className="w-full h-full object-cover bg-white" />
                ) : (
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 overflow-hidden mt-0.5">
                {isEditing ? (
                  <div className="space-y-4 max-w-lg mb-4 pr-16">
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Location Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Google Review URL</label>
                      <input 
                        type="text" 
                        value={googleLink} 
                        onChange={e => setGoogleLink(e.target.value)} 
                        placeholder="https://g.page/r/..."
                        className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm" 
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="rounded-xl bg-[#10b981] px-6 py-2.5 text-[13px] font-bold tracking-wider text-white hover:bg-[#059669] disabled:opacity-50 uppercase"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setName(loc.name);
                          setGoogleLink(loc.google_review_link || "");
                        }} 
                        disabled={isSaving}
                        className="rounded-xl bg-[#222] px-6 py-2.5 text-[13px] font-bold tracking-wider text-white hover:bg-[#333] disabled:opacity-50 uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pr-16">
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                      <span className="truncate">{loc.name}</span>
                      <span className="shrink-0 rounded-full bg-[#0d2a1f] px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#10b981]">Active</span>
                      {loc.category && (
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gray-300">{loc.category}</span>
                      )}
                    </h3>
                    
                    {(loc.address || loc.phone) && (
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                        {loc.address && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="truncate">{loc.address}</span>
                          </div>
                        )}
                        {loc.phone && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="truncate">{loc.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5 w-fit">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-yellow-400">
                          {loc.stats ? (
                            (loc.stats.goodTaps + loc.stats.badTaps) > 0 
                              ? (((loc.stats.goodTaps * 5) + (loc.stats.badTaps * 1)) / (loc.stats.goodTaps + loc.stats.badTaps)).toFixed(1)
                              : "0.0"
                          ) : "0.0"}
                        </span>
                        <span className="text-xs text-yellow-500/60 font-medium ml-1">
                          ({loc.stats ? loc.stats.goodTaps + loc.stats.badTaps : 0} Reviews)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span className="truncate max-w-[200px] sm:max-w-md">{loc.google_review_link}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-8">
              <div>
                <span className="mb-3 block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Public Link</span>
                <div className="inline-flex max-w-full items-center gap-0 rounded-[14px] border border-white/5 bg-[#000000] p-1.5 transition-colors hover:border-emerald-500/30">
                  <div className="rounded-[10px] bg-[#0d2a1f]/40 px-4 py-2 truncate flex items-center">
                    <code className="text-[13px] font-mono text-[#10b981]">/r/{loc.id.split('-')[0]}</code>
                  </div>
                  <div className="h-5 w-px bg-white/10 mx-2 shrink-0"></div>
                  <Link href={`/r/${loc.id}`} className="shrink-0 text-[13px] font-semibold text-gray-400 hover:text-white transition-colors flex items-center gap-2 pr-3 pl-1">
                    View
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div>
                <span className="mb-3 block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Review Flow</span>
                <div className="pt-1">
                  <FlowModeToggle locationId={loc.id} initialMode={loc.review_flow_mode || 'direct'} />
                </div>
              </div>

              <div>
                <span className="mb-3 block text-[11px] font-bold text-gray-500 uppercase tracking-widest">QR Code</span>
                <button 
                  onClick={handleDownloadQr}
                  disabled={!qrDataUrl}
                  className="group inline-flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-[14px] py-2.5 px-6 text-[13px] transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: QR Code Thumbnail */}
        {!isEditing && (
          <div className="flex-shrink-0 flex items-center justify-center bg-white/5 rounded-2xl p-4 self-center lg:self-start">
            {qrDataUrl ? (
              <div className="bg-white p-3 rounded-xl shadow-lg">
                <img 
                  src={qrDataUrl} 
                  alt={`QR Code for ${publicUrl}`} 
                  className="w-32 h-32 object-contain rounded-md" 
                />
              </div>
            ) : (
              <div className="w-32 h-32 bg-white/10 animate-pulse rounded-xl"></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
