"use client";

import { useState, useEffect, useRef } from "react";
import { logFeedbackAction, generateReviewsAction, submitPrivateFeedbackAction, logQrScanAction } from "./actions";

export default function ReviewFlowClient({ 
  locationId, 
  businessId,
  businessName, 
  googleReviewLink, 
  brandColor,
  predefinedTags = [],
  flowMode
}: { 
  locationId: string;
  businessId: string;
  businessName: string;
  googleReviewLink: string | null;
  brandColor: string;
  predefinedTags: string[];
  flowMode: 'direct' | 'interactive';
}) {
  const [step, setStep] = useState<"initial" | "tags" | "bad" | "thanks" | "feedback" | "thank_you" | "options" | "direct_copied">("initial");
  const [feedback, setFeedback] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const hasLoggedScan = useRef(false);

  useEffect(() => {
    if (!hasLoggedScan.current) {
      logQrScanAction(locationId);
      hasLoggedScan.current = true;
    }
  }, [locationId]);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleGoodTap = () => {
    setStep("tags");
    // Fire and forget logging
    logFeedbackAction(locationId, "good_tap");
  };

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag) 
      ? selectedTags.filter((t) => t !== tag) 
      : [...selectedTags, tag];
      
    setSelectedTags(newTags);
    
    if (generatedOptions.length > 0) {
      handleGenerateReview(newTags);
    }
  };

  const handleGenerateReview = async (tagsOverride?: string[]) => {
    setIsGeneratingAI(true);
    const ratingToUse = flowMode === 'interactive' ? selectedRating : 5;
    const tagsToUse = tagsOverride || selectedTags;
    const res = await generateReviewsAction(businessId, ratingToUse, tagsToUse, flowMode);
    
    if (res.success) {
      if (flowMode === 'interactive' && res.reviews) {
        setGeneratedOptions(res.reviews);
        // Do NOT change step, keep it on the same page
      } else if (flowMode === 'direct' && res.review) {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(res.review);
        }
        setStep("direct_copied");
        setTimeout(() => {
          if (googleReviewLink) {
            window.open(googleReviewLink, "_blank");
          }
        }, 2000);
      }
    } else {
      alert(res.error || "Failed to generate review. Please try again.");
    }
    setIsGeneratingAI(false);
  };

  const handleBadTap = () => {
    setStep("feedback");
    // Fire and forget
    logFeedbackAction(locationId, "bad_tap");
  };

  const handleStarClick = (rating: number) => {
    if (rating >= 4) {
      if (flowMode === 'interactive') {
        setSelectedRating(rating);
        // Do not change step, stay on initial to show tags below
        logFeedbackAction(locationId, "good_tap");
      } else {
        handleGoodTap();
      }
    } else {
      handleBadTap();
    }
  };

  const handleOptionSelect = (review: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(review);
    }
    setCopiedIndex(index);
    setTimeout(() => {
      if (googleReviewLink) {
        window.open(googleReviewLink, "_blank");
      }
      setCopiedIndex(null);
    }, 1500);
  };

  const handleGoogleReviewClick = () => {
    // Fire and forget
    logFeedbackAction(locationId, "public_review_click");
    if (googleReviewLink) {
      window.location.href = googleReviewLink;
    }
  };

  const handlePrivateFeedbackSubmit = async () => {
    setIsSubmitting(true);
    // Submit to new private_feedback table
    await submitPrivateFeedbackAction(locationId, feedbackText);
    setIsSubmitting(false);
    setStep("thank_you");
  };

  if (step === "thanks") {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Thanks for your feedback!</h2>
        <p className="mt-2 text-gray-600">We appreciate you taking the time to help us improve.</p>
      </div>
    );
  }

  if (step === "direct_copied") {
    return (
      <div className="w-full max-w-md rounded-xl bg-emerald-500 p-8 text-center shadow-lg border border-emerald-600 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Review Copied!</h2>
        <p className="text-emerald-50 font-medium">Opening Google Maps...</p>
        <div className="mt-6 bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/20 text-left">
          <p className="text-white text-sm leading-relaxed">
            <strong className="block mb-2 uppercase tracking-wide text-xs text-emerald-100">Next steps:</strong>
            1. Select your star rating ⭐️<br/>
            2. Tap and select <strong>Paste</strong> for the text 📋<br/>
            3. Click Submit! 🎉
          </p>
        </div>
      </div>
    );
  }

  if (step === "tags" && flowMode === 'direct') {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">We're glad to hear that!</h2>
        <p className="mt-2 text-gray-600 mb-6">What were the highlights of your visit?</p>
        
        {isGeneratingAI ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-600 font-medium animate-pulse">Crafting your perfect review...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {predefinedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleGenerateReview()}
              className="w-full rounded-md p-3 font-medium text-white transition-opacity hover:opacity-90 mb-4"
              style={{ backgroundColor: brandColor || "#2f6b4f" }}
            >
              Generate Review
            </button>
            
            <button 
              onClick={handleGoogleReviewClick}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
            >
              Skip and write my own review →
            </button>
          </>
        )}
      </div>
    );
  }

  // The "options" step block is removed because it will be rendered inline in the main return.

  if (step === "feedback") {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">We're sorry to hear that. How can we improve?</h2>
        <p className="mt-2 text-gray-600 mb-4">Please let us know how we can improve.</p>
        <textarea
          className="w-full rounded-md border border-gray-300 p-3 mb-4 min-h-[120px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
          placeholder="Tell us about your experience..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        />
        <button 
          onClick={handlePrivateFeedbackSubmit}
          disabled={isSubmitting || !feedbackText.trim()}
          className="w-full rounded-md p-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 mb-4"
          style={{ backgroundColor: brandColor || "#2f6b4f" }}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    );
  }

  if (step === "thank_you") {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Thank you for your feedback. We will work on improving!</h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100 transition-all duration-300">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">How was your experience at {businessName}?</h1>
      <div className={`flex justify-center gap-2 ${flowMode === 'interactive' && selectedRating >= 4 ? 'mb-8' : 'mb-4'}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            onClick={() => handleStarClick(star)}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              className={`w-12 h-12 transition-colors ${
                star <= (hoveredRating || selectedRating) ? 'text-yellow-400' : 'text-gray-200'
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
      
      {flowMode === 'interactive' && selectedRating >= 4 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <p className="text-gray-600 mb-4 font-medium border-t border-gray-100 pt-6">What were the highlights?</p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          {isGeneratingAI ? (
            <div className="flex flex-col items-center justify-center py-8 border-t border-gray-100 pt-6 mt-6">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
              <p className="text-emerald-600 font-medium animate-pulse">Crafting perfect reviews...</p>
            </div>
          ) : generatedOptions.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500 border-t border-gray-100 pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select your favorite!</h2>
              <p className="text-sm text-gray-600 mb-6">Tap to copy a review. Then <strong>paste</strong> it and select stars on Google.</p>
              
              <div className="flex flex-col gap-3 mb-6">
                {generatedOptions.map((review, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(review, i)}
                    className="relative text-left p-4 rounded-lg border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group overflow-hidden"
                  >
                    <p className="text-gray-700 text-sm italic">"{review}"</p>
                    {copiedIndex === i && (
                      <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center animate-in fade-in duration-200">
                        <span className="text-white font-medium flex items-center gap-2 text-lg">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Review copied!
                        </span>
                        <span className="text-emerald-50 text-sm mt-1 font-medium text-center px-4">
                          Opening Google...<br/>Don't forget to paste it!
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleGoogleReviewClick}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
              >
                Skip and write my own review →
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => handleGenerateReview()}
                className="w-full rounded-md p-3 font-medium text-white transition-opacity hover:opacity-90 mb-2 mt-6"
                style={{ backgroundColor: brandColor || "#2f6b4f" }}
              >
                Generate Review
              </button>
              <button 
                onClick={handleGoogleReviewClick}
                className="text-sm font-medium text-gray-400 hover:text-gray-600 underline block w-full mt-2"
              >
                Skip and write my own review
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
