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

  const brandColor = location.brand_color || "#2f6b4f";

  if (step === "initial") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
            How was your visit to <span style={{ color: brandColor }}>{location.name}</span>?
          </h1>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => setStep("good")}
              className="flex items-center justify-center rounded-xl bg-gray-100 p-5 text-xl font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
            >
              <span className="mr-3 text-3xl">🙂</span> It was good
            </button>
            <button
              onClick={() => setStep("bad")}
              className="flex items-center justify-center rounded-xl bg-gray-100 p-5 text-xl font-semibold text-gray-800 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-sm"
            >
              <span className="mr-3 text-3xl">😕</span> Not great
            </button>
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
