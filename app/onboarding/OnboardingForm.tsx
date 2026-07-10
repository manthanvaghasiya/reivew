"use client";

import { useState } from "react";
import { submitOnboarding } from "./actions";

export default function OnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    businessName?: string;
    locationName?: string;
    googleReviewLink?: string;
  }>({});

  const [businessName, setBusinessName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationEdited, setLocationEdited] = useState(false);

  const handleBusinessNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBusinessName(val);
    if (!locationEdited) {
      setLocationName(val);
    }
    // Clear error
    if (fieldErrors.businessName) {
      setFieldErrors(prev => ({ ...prev, businessName: undefined }));
    }
  };

  const handleLocationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationName(e.target.value);
    setLocationEdited(true);
    if (fieldErrors.locationName) {
      setFieldErrors(prev => ({ ...prev, locationName: undefined }));
    }
  };

  const handleLinkChange = () => {
    if (fieldErrors.googleReviewLink) {
      setFieldErrors(prev => ({ ...prev, googleReviewLink: undefined }));
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setGlobalError(null);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const googleLink = formData.get("googleReviewLink") as string;
    const bName = formData.get("businessName") as string;
    const lName = formData.get("locationName") as string;
    
    let hasErrors = false;
    const newFieldErrors: typeof fieldErrors = {};

    if (!bName.trim()) {
      newFieldErrors.businessName = "Business name is required";
      hasErrors = true;
    }
    if (!lName.trim()) {
      newFieldErrors.locationName = "Location name is required";
      hasErrors = true;
    }
    
    if (!googleLink.startsWith("http://") && !googleLink.startsWith("https://")) {
      newFieldErrors.googleReviewLink = "URL must start with http:// or https://";
      hasErrors = true;
    } else {
      try {
        new URL(googleLink);
      } catch {
        newFieldErrors.googleReviewLink = "Please enter a valid URL";
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFieldErrors(newFieldErrors);
      setLoading(false);
      return;
    }

    const result = await submitOnboarding(formData);
    if (result?.error) {
      setGlobalError(result.error);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {globalError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {globalError}
        </div>
      )}
      
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="businessName">
          Business Name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={businessName}
          onChange={handleBusinessNameChange}
          className={`w-full rounded-md border p-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${fieldErrors.businessName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="e.g. Acme Coffee"
        />
        {fieldErrors.businessName && <p className="mt-1 text-sm text-red-500">{fieldErrors.businessName}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="locationName">
          Location Name
        </label>
        <input
          id="locationName"
          name="locationName"
          type="text"
          value={locationName}
          onChange={handleLocationNameChange}
          className={`w-full rounded-md border p-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${fieldErrors.locationName ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="e.g. Downtown"
        />
        {fieldErrors.locationName && <p className="mt-1 text-sm text-red-500">{fieldErrors.locationName}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="industry">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          className="w-full rounded-md border p-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 border-gray-300 dark:border-gray-700"
          defaultValue="Unspecified"
        >
          <option value="Unspecified">Select an industry...</option>
          <option value="Restaurants">Restaurants & Food</option>
          <option value="Healthcare">Healthcare & Medical</option>
          <option value="Retail">Retail & Shopping</option>
          <option value="Automotive">Automotive</option>
          <option value="Home Services">Home Services (Plumbing, HVAC, etc.)</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Salons">Salons & Beauty</option>
          <option value="Fitness">Fitness & Gyms</option>
          <option value="Education">Education</option>
          <option value="Legal">Legal</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="googleReviewLink">
          Google Review Link
        </label>
        <input
          id="googleReviewLink"
          name="googleReviewLink"
          type="url"
          onChange={handleLinkChange}
          className={`w-full rounded-md border p-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${fieldErrors.googleReviewLink ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}`}
          placeholder="https://g.page/r/..."
        />
        {fieldErrors.googleReviewLink && <p className="mt-1 text-sm text-red-500">{fieldErrors.googleReviewLink}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="brandColor">
          Brand Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="brandColor"
            name="brandColor"
            type="color"
            defaultValue="#2f6b4f"
            className="h-9 w-14 cursor-pointer rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-0.5"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full rounded-md bg-emerald-600 p-2.5 font-medium text-white transition-colors hover:bg-emerald-700 disabled:bg-emerald-800 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Complete Setup"}
      </button>
    </form>
  );
}
