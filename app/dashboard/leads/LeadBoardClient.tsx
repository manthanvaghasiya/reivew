"use client";

import { useState, useTransition } from "react";
import { addLeadAction, sendAiWhatsAppMessageAction, sendFinalConfirmationAction } from "./actions";

type Lead = {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: string;
  ai_summary: string | null;
  created_at: string;
};

export default function LeadBoardClient({ businessId, initialLeads }: { businessId: string, initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isPending, startTransition] = useTransition();

  // New lead form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newSource, setNewSource] = useState("Manual");

  const handleAddLead = () => {
    startTransition(async () => {
      const result = await addLeadAction(businessId, newName, newPhone, newSource);
      if (result.success && result.lead) {
        setLeads([result.lead, ...leads]);
        setIsAdding(false);
        setNewName("");
        setNewPhone("");
        setNewSource("Manual");
      } else {
        alert("Failed to add lead: " + result.error);
      }
    });
  };

  const handleSendAiMessage = (lead: Lead) => {
    startTransition(async () => {
      const result = await sendAiWhatsAppMessageAction(lead.id, lead.name, lead.phone, lead.source);
      if (result.success) {
        setLeads(leads.map(l => l.id === lead.id ? { ...l, status: "Contacted", ai_summary: result.aiMessage! } : l));
      } else {
        alert("Failed to send message: " + result.error);
      }
    });
  };

  const handleConfirmLead = (lead: Lead) => {
    startTransition(async () => {
      const result = await sendFinalConfirmationAction(lead.id, lead.phone);
      if (result.success) {
        setLeads(leads.map(l => l.id === lead.id ? { ...l, status: "Confirmed" } : l));
      } else {
        alert("Failed to confirm: " + result.error);
      }
    });
  };

  const renderLeadCard = (lead: Lead) => (
    <div key={lead.id} className="bg-[#111] border border-white/10 rounded-xl p-5 mb-4 shadow-lg hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-white font-bold text-lg">{lead.name}</h4>
          <p className="text-gray-400 text-sm">{lead.phone}</p>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-gray-300">
          {lead.source}
        </span>
      </div>
      
      {lead.ai_summary && (
        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg p-3 mb-4">
          <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">AI Message Sent</div>
          <p className="text-gray-300 text-xs italic">"{lead.ai_summary}"</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {lead.status === "New" && (
          <button 
            onClick={() => handleSendAiMessage(lead)}
            disabled={isPending}
            className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Auto-Reply (WA)
          </button>
        )}
        {lead.status === "Contacted" && (
          <button 
            onClick={() => handleConfirmLead(lead)}
            disabled={isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Confirm Lead
          </button>
        )}
        {lead.status === "Confirmed" && (
          <div className="flex-1 text-center border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-widest py-2 rounded-lg">
            Closed Won
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 mt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Lead Manager</h1>
          <p className="text-gray-400 text-sm">Automated WhatsApp outreach and conversion pipeline.</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-colors"
        >
          {isAdding ? "Cancel" : "+ Add Lead"}
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-bold mb-4">Add Manual Lead</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Name" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-transparent border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
            <input 
              type="text" 
              placeholder="Phone Number (e.g. 1234567890)" 
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className="bg-transparent border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            />
            <select 
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              className="bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
            >
              <option value="Manual">Manual Entry</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>
          </div>
          <button 
            onClick={handleAddLead}
            disabled={!newName || !newPhone || isPending}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            Save Lead
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NEW LEADS */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">New Leads</h3>
            <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full">{leads.filter(l => l.status === "New").length}</span>
          </div>
          <div className="space-y-4">
            {leads.filter(l => l.status === "New").map(renderLeadCard)}
          </div>
        </div>

        {/* CONTACTED */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs">Contacted</h3>
            <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">{leads.filter(l => l.status === "Contacted").length}</span>
          </div>
          <div className="space-y-4">
            {leads.filter(l => l.status === "Contacted").map(renderLeadCard)}
          </div>
        </div>

        {/* CONFIRMED */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs">Confirmed</h3>
            <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full">{leads.filter(l => l.status === "Confirmed").length}</span>
          </div>
          <div className="space-y-4">
            {leads.filter(l => l.status === "Confirmed").map(renderLeadCard)}
          </div>
        </div>
      </div>
    </div>
  );
}
