"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { AlertCircle, Loader2 } from "lucide-react";

export default function GooglePatientCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const finishSignIn = async () => {
      const session = await getSession();
      const patient = session?.user?.patient;

      if (!patient?.id || session.user.role !== "patient") {
        if (!cancelled) setError("We could not create your patient account. Please return to sign in.");
        return;
      }

      sessionStorage.setItem("medconnect_patient", JSON.stringify(patient));
      router.replace("/patient/dashboard");
    };

    finishSignIn().catch(() => {
      if (!cancelled) setError("Google sign-in could not be completed. Please return to sign in.");
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#e8f1ed] p-6">
      <div className="w-full max-w-sm rounded-xl border border-[#d9ddd6] bg-white p-8 text-center shadow-[0_12px_36px_rgba(43,61,56,0.1)]">
        {error ? (
          <>
            <AlertCircle className="mx-auto mb-4 h-8 w-8 text-red-600" />
            <p className="text-sm font-medium text-red-700" role="alert">{error}</p>
            <button type="button" onClick={() => router.replace("/patient/login")} className="btn-primary mt-6">
              Return to sign in
            </button>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-teal-700" aria-hidden="true" />
            <p className="text-sm font-medium text-gray-600" role="status">Finishing secure sign-in...</p>
          </>
        )}
      </div>
    </main>
  );
}
