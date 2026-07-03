import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByOwner } from "@/lib/supabase/queries";
import OnboardingForm from "./OnboardingForm";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData?.user) {
    redirect("/login");
  }

  const existingBusiness = await getBusinessByOwner(authData.user.id);
  if (existingBusiness) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:border-gray-800 dark:bg-gray-900">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">
          Business Profile
        </h1>
        <OnboardingForm />
      </div>
    </main>
  );
}
