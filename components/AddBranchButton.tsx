"use client";

import { useState } from "react";
import AddBranchModal from "./AddBranchModal";

export default function AddBranchButton({ businessId }: { businessId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold tracking-wide text-white transition-colors hover:bg-emerald-500 shadow-lg shadow-emerald-900/20"
      >
        Deploy New Branch
      </button>

      <AddBranchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        businessId={businessId} 
      />
    </>
  );
}
