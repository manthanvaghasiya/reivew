"use client";

import { useState } from "react";
import { updateFlowModeAction } from "@/app/dashboard/actions";

interface FlowModeToggleProps {
  locationId: string;
  initialMode: 'direct' | 'interactive';
}

export default function FlowModeToggle({ locationId, initialMode }: FlowModeToggleProps) {
  const [mode, setMode] = useState<'direct' | 'interactive'>(initialMode);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (newMode: 'direct' | 'interactive') => {
    if (newMode === mode || isUpdating) return;
    setIsUpdating(true);
    setMode(newMode); // optimistic update
    try {
      await updateFlowModeAction(locationId, newMode);
    } catch (error) {
      console.error("Failed to update mode", error);
      setMode(mode); // revert on failure
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative flex w-[280px] sm:w-[320px] p-1.5 bg-[#000000] rounded-[16px] border border-white/10 shadow-inner">
      <div 
        className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[12px] bg-[#0d2a1f] border border-[#10b981]/30 shadow-md transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${mode === 'interactive' ? 'translate-x-[100%]' : 'translate-x-0'}`} 
      />
      
      <button
        onClick={() => handleToggle('direct')}
        disabled={isUpdating}
        className={`relative z-10 flex-1 py-2 flex flex-col items-center justify-center transition-colors ${mode === 'direct' ? 'text-[#10b981]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <span className="text-[11px] font-bold tracking-widest uppercase mb-0.5">Direct</span>
        <span className={`text-[10px] font-medium opacity-80 ${mode === 'direct' ? 'text-[#10b981]' : 'text-gray-600'}`}>(1 Review)</span>
      </button>
      
      <button
        onClick={() => handleToggle('interactive')}
        disabled={isUpdating}
        className={`relative z-10 flex-1 py-2 flex flex-col items-center justify-center transition-colors ${mode === 'interactive' ? 'text-[#10b981]' : 'text-gray-500 hover:text-gray-300'}`}
      >
        <span className="text-[11px] font-bold tracking-widest uppercase mb-0.5">Interactive</span>
        <span className={`text-[10px] font-medium opacity-80 ${mode === 'interactive' ? 'text-[#10b981]' : 'text-gray-600'}`}>(3 Options)</span>
      </button>
    </div>
  );
}

