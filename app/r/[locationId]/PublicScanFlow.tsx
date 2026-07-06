"use client";

import { useState } from "react";

type Location = {
  id: string;
  name: string;
  google_review_link: string | null;
  brand_color: string;
};

export default function PublicScanFlow({ location }: { location: Location }) {
  const [step, setStep] = useState<"initial" | "good" | "bad">("initial");
  const [feedback, setFeedback] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (rating: number) => {
    if (rating >= 4) {
      setStep("good");
    } else {
      setStep("bad");
    }
  };

  const brandColor = location.brand_color || "#2f6b4f";

  if (step === "initial") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
            How was your visit to <span style={{ color: brandColor }}>{location.name}</span>?
          </h1>

          <div className="flex justify-center gap-2 mb-4">
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
                    star <= hoveredRating ? 'text-yellow-400' : 'text-gray-200'
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
        </div>
      </main>
    );
  }

  if (step === "good") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Glad to hear it!</h1>
          
          <div className="mb-8 rounded-xl bg-gray-50 p-6 text-left border border-gray-100 shadow-sm">
            <p className="mb-3 font-semibold text-gray-800 text-sm uppercase tracking-wider">Tips for your review:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>What you came for</li>
              <li>Something our staff did well</li>
              <li>Would you recommend us?</li>
            </ul>
          </div>

          <a
            href={location.google_review_link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: brandColor }}
            className="mb-6 block w-full rounded-xl p-4 text-center font-bold text-white transition-opacity hover:opacity-90 shadow-md text-lg"
          >
            Write my Google review →
          </a>

          <button
            onClick={() => setStep("initial")}
            className="text-sm text-gray-500 hover:text-gray-800 underline focus:outline-none"
          >
            ← back
          </button>
        </div>
      </main>
    );
  }

  if (step === "bad") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">We're sorry to hear that</h1>
          <p className="mb-6 text-sm text-gray-600">
            Please let us know how we can improve. Your feedback goes directly to the owner.
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience..."
            className="mb-6 w-full rounded-xl border border-gray-200 p-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[140px] resize-none"
          />

          <button
            style={{ backgroundColor: brandColor }}
            className="mb-6 block w-full rounded-xl p-4 text-center font-bold text-white transition-opacity hover:opacity-90 shadow-md text-lg"
          >
            Send privately to owner
          </button>

          <div className="mb-6 pt-5 border-t border-gray-100">
            <a
              href={location.google_review_link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-gray-800 underline"
            >
              or leave a public Google review instead
            </a>
          </div>

          <button
            onClick={() => setStep("initial")}
            className="text-sm text-gray-500 hover:text-gray-800 focus:outline-none"
          >
            ← back
          </button>
        </div>
      </main>
    );
  }

  return null;
}
