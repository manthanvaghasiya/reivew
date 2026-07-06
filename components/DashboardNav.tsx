import Link from "next/link";
import { logout } from "@/app/login/actions";

interface DashboardNavProps {
  businessName: string;
  activePath: string;
}

export default function DashboardNav({ businessName, activePath }: DashboardNavProps) {
  return (
    <nav className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/5 bg-[#050505]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">ReviewFlow</span>
        </Link>
        
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-1">
          <Link 
            href="/dashboard"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activePath === '/dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            Overview
          </Link>
          <Link 
            href="/dashboard/auto-reply"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activePath === '/dashboard/auto-reply' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
          >
            Auto-Reply Generator
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          <span className="text-gray-300">{businessName}</span>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm font-medium text-gray-400 hover:text-white transition-colors mr-2">
            Log out
          </button>
        </form>
        <div className="h-8 w-8 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-gray-700 to-gray-900 shadow-inner"></div>
      </div>
    </nav>
  );
}
