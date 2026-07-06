"use client";

import { useState } from "react";
import { createBranchAction } from "@/app/dashboard/actions";

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
}

export default function AddBranchModal({ isOpen, onClose, businessId }: AddBranchModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    google_review_link: "",
    logo_url: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await createBranchAction(businessId, formData);
      onClose(); // Close on success
      setFormData({
        name: "", category: "", description: "", address: "", phone: "", google_review_link: "", logo_url: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to create branch.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-2xl custom-scrollbar relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-white mb-2">Deploy New Branch</h2>
          <p className="text-gray-400 mb-8">Add a new location to generate its unique QR code and Review Funnel.</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Branch Name *</label>
                <input 
                  required type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="e.g. Downtown Cafe"
                  className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Category (Industry) *</label>
                <input 
                  required type="text" name="category" value={formData.category} onChange={handleChange}
                  placeholder="e.g. Restaurant, Salon"
                  className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Business Description *</label>
              <textarea 
                required name="description" value={formData.description} onChange={handleChange}
                placeholder="Brief 2-3 line description of services to help train the AI."
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none resize-none h-24" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Physical Address</label>
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange}
                  placeholder="123 Main St, City, ST"
                  className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Phone Number</label>
                <input 
                  type="text" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Google Reviews URL *</label>
              <input 
                required type="url" name="google_review_link" value={formData.google_review_link} onChange={handleChange}
                placeholder="https://g.page/r/..."
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none text-sm" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Logo URL</label>
              <input 
                type="url" name="logo_url" value={formData.logo_url} onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-white focus:border-emerald-500 outline-none text-sm" 
              />
              <p className="mt-2 text-xs text-gray-500">Paste a direct link to your logo image.</p>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-emerald-600 px-6 py-4 text-sm font-bold tracking-wide text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deploying...
                  </>
                ) : (
                  "Deploy Branch"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
