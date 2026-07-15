"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
  businessName: string;
}

export default function DashboardShell({ children, businessName }: DashboardShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  ];

  const creativeSuite = [
    { name: "Insights & Feedback", href: "/dashboard/insights", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { name: "Review Manager", href: "/dashboard/reviews", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
    // { name: "SEO Re-writer", href: "/dashboard/seo", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-gray-200 print:bg-white print:text-black">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden print:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-[#0a0a0a] border-r border-white/5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 print:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase">Business Panel</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">
          
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <svg className="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div>
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Creative Suite</h3>
            <nav className="space-y-1">
              {creativeSuite.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <svg className="h-5 w-5 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold">
              {businessName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{businessName}</p>
              <p className="text-[10px] font-medium tracking-widest uppercase text-emerald-500">Pro Studio</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-6 lg:px-10 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase hidden sm:block">Google Business Hub</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{businessName}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Owner</p>
              </div>
              <div className="h-10 w-10 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 overflow-x-hidden">
          {children}
        </div>
      </main>

    </div>
  );
}
