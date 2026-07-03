"use client";

import { useState } from "react";
import { logFeedbackAction } from "./actions";

export default function ReviewFlowClient({ 
  locationId, 
  businessName, 
  googleReviewLink, 
  brandColor 
}: { 
  locationId: string;
  businessName: string;
  googleReviewLink: string | null;
  brandColor: string;
}) {
  const [step, setStep] = useState<"initial" | "good" | "bad" | "thanks">("initial");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoodTap = () => {
    setStep("good");
    // Fire and forget
    logFeedbackAction(locationId, "good_tap");
  };

  const handleBadTap = () => {
    setStep("bad");
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
    // Wait for write attempt to complete before showing thanks UI
    await logFeedbackAction(locationId, "private_feedback", feedback);
    setIsSubmitting(false);
    setStep("thanks");
  };

  if (step === "thanks") {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Thanks for your feedback!</h2>
        <p className="mt-2 text-gray-600">We appreciate you taking the time to help us improve.</p>
      </div>
    );
  }

  if (step === "good") {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">We're glad to hear that!</h2>
        <p className="mt-2 text-gray-600 mb-6">Would you mind sharing your experience on Google?</p>
        <button 
          onClick={handleGoogleReviewClick}
          className="w-full rounded-md p-3 font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: brandColor || "#2f6b4f" }}
        >
          Write my Google review →
        </button>
      </div>
    );
  }

  if (step === "bad") {
    return (
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">We're sorry to hear that.</h2>
        <p className="mt-2 text-gray-600 mb-4">Please let us know how we can improve.</p>
        <textarea
          className="w-full rounded-md border border-gray-300 p-3 mb-4 min-h-[120px] outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-900"
          placeholder="Tell us about your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button 
          onClick={handlePrivateFeedbackSubmit}
          disabled={isSubmitting || !feedback.trim()}
          className="w-full rounded-md p-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 mb-4"
          style={{ backgroundColor: brandColor || "#2f6b4f" }}
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </button>
        <button 
          onClick={handleGoogleReviewClick}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 underline"
        >
          Write my Google review →
        </button>
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
