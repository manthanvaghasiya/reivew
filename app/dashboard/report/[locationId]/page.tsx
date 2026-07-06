import { createClient } from "@/lib/supabase/server";
import { getLocationById } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import AuditClient from "./AuditClient";
import Link from "next/link";

export default async function ReportPage({ params }: { params: Promise<{ locationId: string }> }) {
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

  return <AuditClient location={location} />;
}
