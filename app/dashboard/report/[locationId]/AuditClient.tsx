"use client";

import { useState } from "react";
import { generateAuditReportAction } from "./actions";

interface AuditClientProps {
  location: any;
}

export default function AuditClient({ location }: AuditClientProps) {
  const [report, setReport] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateAuditReportAction({
        name: location.name,
        category: location.category,
        description: location.description,
        address: location.address,
        phone: location.phone,
      });
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate report.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* Header - Hidden when printing */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">GMB Audit Report</h1>
          <p className="text-gray-400">Diagnostic health and SEO-optimization analysis for {location.name}.</p>
        </div>
        
        {!report ? (
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold tracking-wide text-white transition-all hover:bg-emerald-500 hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing Profile...
              </>
            ) : (
              "Run Audit Analysis"
            )}
          </button>
        ) : (
          <button
            onClick={handlePrint}
            className="rounded-full bg-white text-black px-6 py-3 text-sm font-bold tracking-wide transition-all hover:bg-gray-200 hover:scale-105 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Export PDF
          </button>
        )}
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 print:hidden">
          {error}
        </div>
      )}

      {/* Report Content - This gets printed */}
      {report && (
        <div className="print:bg-white print:text-black rounded-[2rem] bg-white/5 border border-white/10 p-8 sm:p-12 shadow-2xl print:shadow-none print:border-none print:p-0">
          
          {/* Print Header */}
          <div className="flex justify-between items-center mb-12 border-b border-white/10 print:border-gray-200 pb-8">
            <div className="flex items-center gap-4">
              {location.logo_url ? (
                <img src={location.logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-xl print:bg-transparent bg-white p-1" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-emerald-500/20 print:bg-emerald-100 flex items-center justify-center text-emerald-500 text-2xl font-bold">
                  {location.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white print:text-gray-900">{location.name}</h2>
                <p className="text-gray-400 print:text-gray-500 text-sm">{location.address || "Address pending"}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Diagnostic Audit</p>
              <p className="text-gray-400 print:text-gray-500 text-xs mt-1">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Score */}
            <div className="flex flex-col items-center justify-center border-r border-white/10 print:border-gray-200 pr-0 md:pr-12">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 print:text-gray-500 mb-6">Health Score</p>
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/10 print:text-gray-100" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                    strokeDasharray="283" 
                    strokeDashoffset={283 - (283 * report.healthScore) / 100}
                    className={`${report.healthScore >= 80 ? 'text-emerald-500' : report.healthScore >= 60 ? 'text-yellow-500' : 'text-rose-500'} transition-all duration-1000 ease-out`} 
                  />
                </svg>
                <span className="text-5xl font-bold text-white print:text-gray-900">{report.healthScore}<span className="text-2xl">%</span></span>
              </div>
            </div>

            {/* Analysis Grid */}
            <div className="md:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 print:text-gray-500 mb-6">Comprehensive Profile Analysis</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <CheckItem label="Business Description" passed={report.checks.description} detail="High-quality, professional description." />
                <CheckItem label="Keyword Optimization" passed={report.checks.keywords} detail="SEO-friendly keywords present." />
                <CheckItem label="Multi-Service Section" passed={report.checks.services} detail="All business services listed correctly." />
                <CheckItem label="Contact & Links" passed={report.checks.contact} detail="Website, address, and primary categories mapped." />

              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 print:text-gray-500 mb-6">Actionable Recommendations</p>
            <ul className="space-y-4">
              {report.recommendations.map((rec: string, i: number) => (
                <li key={i} className="flex gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 print:bg-red-50 print:border-red-100">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 print:bg-red-200 print:text-red-700 flex items-center justify-center font-bold text-sm">!</span>
                  <span className="text-gray-300 print:text-gray-800 text-sm leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested Categories */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 print:text-gray-500 mb-6">Suggested Additional Categories</p>
            <div className="flex flex-wrap gap-2">
              {report.suggestedCategories.map((cat: string, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 print:bg-blue-50 print:border-blue-200 print:text-blue-800 text-sm font-medium">
                  {cat}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function CheckItem({ label, passed, detail }: { label: string, passed: boolean, detail: string }) {
  return (
    <div className={`p-4 rounded-xl border ${passed ? 'bg-emerald-500/10 border-emerald-500/20 print:bg-green-50 print:border-green-200' : 'bg-gray-800/50 border-white/5 print:bg-gray-50 print:border-gray-200'}`}>
      <div className="flex items-center gap-3 mb-1">
        {passed ? (
          <svg className="w-5 h-5 text-emerald-500 print:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-500 print:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <h4 className={`font-bold text-sm ${passed ? 'text-emerald-400 print:text-green-800' : 'text-gray-400 print:text-gray-700'}`}>{label}</h4>
      </div>
      <p className="text-xs text-gray-500 print:text-gray-500 ml-8">{detail}</p>
    </div>
  );
}
