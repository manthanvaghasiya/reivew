"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    
    if (mode === "signup") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!agreeTerms) {
        setError("You must agree to the Terms of Service.");
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setError(error.message);
        } else {
          if (data.session) {
            router.push("/onboarding");
          } else {
            setMessage("We sent you an email. Please check your inbox to confirm your account.");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setError("Invalid email or password. Please try again.");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setMessage(null);
  };

  return (
    <main className="flex min-h-screen bg-[#050505] selection:bg-emerald-500/30 font-sans">
      
      {/* Left Form Section */}
      <div className="flex w-full flex-col justify-center px-6 sm:px-12 lg:w-1/2 lg:px-24 xl:px-32 relative z-10 bg-black">
        <Link href="/" className="absolute top-8 left-8 flex items-center text-gray-400 hover:text-white transition-colors text-sm font-medium group">
          <div className="bg-white/5 p-1.5 rounded-full mr-2 group-hover:bg-white/10 transition-colors border border-white/5">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Back
        </Link>

        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10 mt-16 lg:mt-0">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,113,0.3)] mb-8">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
             </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-gray-400">
              {mode === "signin" 
                ? "Sign in to access your dashboard and manage reviews." 
                : "Join ReviewFlow and start turning customers into 5-star Google reviews."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-600 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                  Password
                </label>
                {mode === "signin" && (
                   <a href="#" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-600 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>

            {mode === "signup" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required={mode === "signup"}
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-gray-600 transition-all focus:border-emerald-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
                />
              </div>
            )}

            {mode === "signup" && (
              <div className="flex items-start mt-2 animate-in fade-in duration-300">
                <div className="flex h-5 items-center">
                  <input
                    id="agreeTerms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-black"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="text-gray-400">
                    I agree to the <a href="#" className="font-medium text-emerald-400 hover:underline">Terms of Service</a> and <a href="#" className="font-medium text-emerald-400 hover:underline">Privacy Policy</a>.
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-2 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 flex items-start">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mt-2 rounded-xl bg-emerald-500/10 p-4 text-sm text-emerald-400 border border-emerald-500/20 flex items-start">
                <svg className="w-5 h-5 mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 group relative flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 p-4 font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <span className="relative z-10 flex items-center">
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait...
                  </>
                ) : (
                  mode === "signin" ? "Sign In" : "Create Account"
                )}
              </span>
              {!loading && <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100"></div>}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {mode === "signin" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                disabled={loading}
                className="font-semibold text-emerald-400 hover:text-emerald-300 hover:underline focus:outline-none"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Visual Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-l border-white/5 items-center justify-center">
         {/* Beautiful glowing orb background */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
         <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
         
         <div className="relative z-10 max-w-lg p-10 backdrop-blur-md bg-black/40 border border-white/10 rounded-3xl shadow-2xl">
            <div className="mb-8 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,113,0.6)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <h2 className="text-3xl font-bold text-white mb-8 leading-snug">
              "ReviewFlow completely changed how we handle customer feedback. Our Google rating went from 3.8 to 4.9 in just two months."
            </h2>
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 p-[2px]">
                 <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                   <span className="font-bold text-white text-lg">SJ</span>
                 </div>
               </div>
               <div>
                 <p className="font-semibold text-white text-lg">Sarah Jenkins</p>
                 <p className="text-emerald-400/80">Owner, The Daily Grind Cafe</p>
               </div>
            </div>
         </div>
         
         {/* Subtle Grid overlay */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom_left,white,transparent_70%)] pointer-events-none"></div>
      </div>
    </main>
  );
}
