import { createClient } from "@/lib/supabase/server";
import { getLocationById, getFeedbackEventsByLocation } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import AuditClient from "./AuditClient";
import Link from "next/link";

export default async function InsightsPage({ params }: { params: Promise<{ locationId: string }> }) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login");
  }

  const { locationId } = await params;
  const location = await getLocationById(locationId);

  if (!location) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Location Not Found</h1>
        <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const privateFeedbacks = await getFeedbackEventsByLocation(locationId, "private_feedback");

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <AuditClient location={location} />
      
      {/* Private Feedback Section */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Private Feedback</h2>
        {privateFeedbacks.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-white/5 p-8 text-center backdrop-blur-sm">
            <p className="text-gray-400">
              No private feedback yet — once customers scan your QR code, anything they don't want posted publicly will show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {privateFeedbacks.map((fb) => (
              <div key={fb.id} className="rounded-xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                  <span className="text-sm text-gray-400">
                    {new Date(fb.created_at).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap">{fb.message || "No message provided."}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
