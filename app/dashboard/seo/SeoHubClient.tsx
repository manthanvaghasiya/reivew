"use client";

import { useState } from "react";
import { generateSeoContentAction, saveSeoContentAction } from "./actions";

export default function SeoHubClient({ locations }: { locations: any[] }) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || "");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for the editable fields
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<{name: string, description: string}[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  
  // Track sync status
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  // When location changes, pre-fill if data exists
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locId = e.target.value;
    setSelectedLocationId(locId);
    setSyncStatus("idle");
    const loc = locations.find(l => l.id === locId);
    if (loc) {
      setCategoryInput(loc.category || "");
      setDescription(loc.description || "");
      setServices(loc.services || []);
      setKeywords(loc.keywords || []);
    }
  };

  const handleGenerate = async () => {
    if (!selectedLocation || !categoryInput.trim()) {
      alert("Please enter a business category first.");
      return;
    }
    
    setIsGenerating(true);
    setSyncStatus("idle");
    const result = await generateSeoContentAction(selectedLocation.name, categoryInput);
    
    if (result.success && result.data) {
      setDescription(result.data.description || "");
      setServices(result.data.services || []);
      setKeywords(result.data.keywords || []);
    } else {
      alert("Failed to generate content: " + result.error);
    }
    setIsGenerating(false);
  };

  const handleSave = async () => {
    if (!selectedLocation) return;
    
    setIsSaving(true);
    const result = await saveSeoContentAction(
      selectedLocation.id,
      categoryInput,
      description,
      services,
      keywords
    );
    
    if (result.success) {
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } else {
      setSyncStatus("error");
      alert("Failed to save: " + result.error);
    }
    setIsSaving(false);
  };

  if (locations.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center backdrop-blur-sm">
        <p className="text-gray-400">Please create a location first to use the SEO Hub.</p>
      </div>
    );
  }

  // Audit Checklist Data
  const hasDescription = !!description;
  const hasKeywords = keywords && keywords.length > 0;
  const hasServices = services && services.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Configuration & Audit */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-[1.5rem] bg-[#111] border border-white/5 p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">Location Setup</h2>
          
          <div className="mb-4">
            <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2">Select Location</label>
            <select 
              value={selectedLocationId}
              onChange={handleLocationChange}
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm appearance-none"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-2">Business Category</label>
            <input 
              type="text" 
              value={categoryInput}
              onChange={e => setCategoryInput(e.target.value)}
              placeholder="e.g. Yoga Studio, Dental Clinic"
              className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !categoryInput.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-[13px] font-bold tracking-wider text-white hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 uppercase flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI Initialize
              </>
            )}
          </button>
        </div>

        <div className="rounded-[1.5rem] bg-[#111] border border-white/5 p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">GMB Audit Report</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              {hasDescription ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              )}
              <span className={`text-sm ${hasDescription ? 'text-gray-300' : 'text-gray-500'}`}>Business Description</span>
            </li>
            <li className="flex items-center gap-3">
              {hasKeywords ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              )}
              <span className={`text-sm ${hasKeywords ? 'text-gray-300' : 'text-gray-500'}`}>Strategic Keywords</span>
            </li>
            <li className="flex items-center gap-3">
              {hasServices ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              )}
              <span className={`text-sm ${hasServices ? 'text-gray-300' : 'text-gray-500'}`}>Multi-Service Section</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column: Editor & Preview */}
      <div className="lg:col-span-2">
        <div className="rounded-[1.5rem] bg-[#0a0a0a] border border-white/5 p-6 lg:p-8 shadow-2xl relative">
          
          <div className="absolute top-6 right-6">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-[#10b981] px-5 py-2.5 text-[12px] font-bold tracking-wider text-white hover:bg-[#059669] transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 uppercase flex items-center gap-2"
            >
              {isSaving ? "Saving..." : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Push to Google
                </>
              )}
            </button>
            {syncStatus === "success" && (
              <p className="absolute -bottom-6 right-0 text-xs text-emerald-400 font-medium">Synced Successfully!</p>
            )}
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Generated Profile Content</h2>

          <div className="space-y-8 mt-8">
            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-3">SEO Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-sm leading-relaxed resize-none"
                placeholder="Click 'AI Initialize' to generate an SEO-optimized business description."
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-3">Strategic Keywords</label>
              <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-white/10 bg-[#111] min-h-[60px]">
                {keywords.length === 0 ? (
                  <span className="text-sm text-gray-500 italic">No keywords generated yet.</span>
                ) : (
                  keywords.map((kw, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-[#0d2a1f]/60 text-[#10b981] text-xs font-semibold border border-emerald-500/20">
                      {kw}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-3">Service Sections</label>
              <div className="space-y-3">
                {services.length === 0 ? (
                  <div className="p-4 rounded-xl border border-white/10 bg-[#111]">
                    <span className="text-sm text-gray-500 italic">No services generated yet.</span>
                  </div>
                ) : (
                  services.map((svc, i) => (
                    <div key={i} className="p-4 rounded-xl border border-white/10 bg-[#111] flex flex-col gap-2">
                      <input 
                        type="text" 
                        value={svc.name}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[i].name = e.target.value;
                          setServices(newServices);
                        }}
                        className="font-bold text-white bg-transparent outline-none border-b border-transparent focus:border-emerald-500/50 pb-1"
                      />
                      <input 
                        type="text"
                        value={svc.description}
                        onChange={(e) => {
                          const newServices = [...services];
                          newServices[i].description = e.target.value;
                          setServices(newServices);
                        }}
                        className="text-sm text-gray-400 bg-transparent outline-none border-b border-transparent focus:border-emerald-500/50 pb-1 w-full"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
