"use client";

import { useState } from "react";
import { logFeedbackAction, generateReviewsAction, submitPrivateFeedbackAction } from "./actions";

export default function ReviewFlowClient({ 
  locationId, 
  businessId,
  businessName, 
  googleReviewLink, 
  brandColor 
}: { 
  locationId: string;
  businessId: string;
  businessName: string;
  googleReviewLink: string | null;
  brandColor: string;
}) {
  const [step, setStep] = useState<"initial" | "tags" | "bad" | "thanks" | "feedback" | "thank_you">("initial");
  const [feedback, setFeedback] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const PREDEFINED_TAGS = [
    "Friendly Staff",
    "Quick Service",
    "Great Quality",
    "Clean Environment",
    "Great Value"
  ];

  const handleGoodTap = () => {
    setStep("tags");
    // Fire and forget logging
    logFeedbackAction(locationId, "good_tap");
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerateReview = async () => {
    setIsGeneratingAI(true);
    const res = await generateReviewsAction(businessId, 5, selectedTags);
    if (res.success && res.mode === "review" && res.review) {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(res.review);
      }
      setTimeout(() => {
        if (googleReviewLink) {
          window.open(googleReviewLink, "_blank");
        }
      }, 500);
    }
    setIsGeneratingAI(false);
  };

  const handleBadTap = () => {
    setStep("feedback");
    // Fire and forget
    logFeedbackAction(locationId, "bad_tap");
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

  if (step === "tags") {
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
              {PREDEFINED_TAGS.map((tag) => (
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
              onClick={handleGenerateReview}
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
    <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">How was your experience at {businessName}?</h1>
      <div className="flex flex-col gap-4">
        <button 
          onClick={handleGoodTap}
          className="w-full rounded-md border-2 border-gray-200 p-4 text-lg font-medium text-gray-800 transition-colors hover:bg-gray-50"
        >
          🙂 It was good
        </button>
        <button 
          onClick={handleBadTap}
          className="w-full rounded-md border-2 border-gray-200 p-4 text-lg font-medium text-gray-800 transition-colors hover:bg-gray-50"
        >
          😕 Not great
        </button>
      </div>
    </div>
  );
}
