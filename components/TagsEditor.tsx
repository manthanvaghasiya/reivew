"use client";

import { useState } from "react";
import { updateBusinessTagsAction } from "@/app/dashboard/actions";

export default function TagsEditor({
  businessId,
  initialTags,
}: {
  businessId: string;
  initialTags: string[];
}) {
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTag("");
      setMessage("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setMessage("");
  };

  const handleSave = async () => {
    if (tags.length === 0) {
      setMessage("Please add at least one tag.");
      return;
    }
    setIsSaving(true);
    try {
      await updateBusinessTagsAction(businessId, tags);
      setMessage("Tags saved successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to save tags.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Review Tags</h2>
          <p className="mt-1 text-sm text-gray-400">
            These tags will be shown to customers when they give a positive review (4-5 stars).
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="text-emerald-500 hover:text-emerald-300 focus:outline-none"
              aria-label="Remove tag"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {tags.length === 0 && (
          <span className="text-sm text-gray-500 italic">No tags added yet.</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTag();
            }
          }}
          placeholder="E.g., Great Coffee"
          className="flex-1 rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
        <button
          onClick={handleAddTag}
          disabled={!newTag.trim()}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-4"
        >
          {isSaving ? "Saving..." : "Save Tags"}
        </button>
      </div>
      
      {message && (
        <p className={`mt-4 text-sm ${message.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
