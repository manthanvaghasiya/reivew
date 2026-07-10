"use client";

import { useState, useTransition, useEffect } from "react";
import type { GoogleReview } from "@/lib/supabase/database.types";
import { generateAiReplyAction, updateReviewReplyAction } from "@/app/dashboard/reviews/actions";

export default function FeedbackStreamClient({ 
  businessId, 
  businessName, 
  initialReviews 
}: { 
  businessId: string;
  businessName: string;
  initialReviews: GoogleReview[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditClick = (review: GoogleReview) => {
    setEditingId(review.id);
    setEditDraft(review.ai_response || "");
  };

  const handleSaveEdit = (id: string) => {
    startTransition(async () => {
      await updateReviewReplyAction(id, editDraft);
      setEditingId(null);
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleAutoGenerateReplies = () => {
    startTransition(async () => {
      await generateAiReplyAction(businessId);
    });
  };

  return (
    <div className="space-y-8 mt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black tracking-tight text-white">Google Feedback Stream</h1>
            <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Synced</span>
          </div>
          <p className="text-gray-400 text-sm">Real-time review monitoring for <span className="text-purple-400 font-bold">{businessName}</span>.</p>
        </div>
        
        <div className="flex items-center gap-4">

          <button 
            onClick={handleAutoGenerateReplies} 
            disabled={isPending}
            className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white shadow-lg transition-colors disabled:opacity-50"
          >
            Auto-Reply All
          </button>
          
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-xl ml-2">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Authenticated Profile</div>
              <div className="text-white font-bold text-sm truncate max-w-[150px]">{businessName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {initialReviews.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-[2rem] bg-[#0a0a0a]">
            <p className="text-gray-500 text-sm font-medium">No reviews found.</p>
          </div>
        ) : (
          initialReviews.map((review) => (
            <div key={review.id} className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all hover:border-white/10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start mb-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400 overflow-hidden border-2 border-white/10 shadow-lg">
                    {review.author_name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">{review.author_name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {mounted ? new Date(review.created_at).toLocaleDateString() : ""}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < review.rating ? "text-yellow-400" : "text-gray-700"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-gray-300 text-lg leading-relaxed italic">
                    "{review.review_text}"
                  </p>
                </div>
              </div>

              {review.ai_response && (
                <div className="bg-[#111] rounded-3xl p-6 md:p-8 border border-white/5 relative">
                  <div className="absolute left-0 top-10 bottom-10 w-1 bg-blue-500 rounded-r-full"></div>
                  
                  <div className="flex justify-between items-center mb-4 pl-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">GBP Response</span>
                    </div>
                    
                    {editingId !== review.id && (
                      <button 
                        onClick={() => handleEditClick(review)}
                        disabled={isPending}
                        className="text-[11px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                      >
                        Edit Reply
                      </button>
                    )}
                  </div>
                  
                  <div className="pl-4">
                    {editingId === review.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[120px]"
                        />
                        <div className="flex gap-3 justify-end">
                          <button 
                            onClick={handleCancelEdit}
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl bg-[#222] text-xs font-bold text-white hover:bg-[#333] uppercase tracking-wider transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleSaveEdit(review.id)}
                            disabled={isPending}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-500 uppercase tracking-wider transition-colors disabled:opacity-50"
                          >
                            {isPending ? "Saving..." : "Save Reply"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-300 text-base leading-relaxed mb-6">
                          {review.ai_response}
                        </p>
                        {review.responded_at && (
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            TRANSMITTED {new Date(review.responded_at).toLocaleDateString()}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
