"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

type Status = "verifying" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("This verification link is missing its token.");
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(
          getErrorMessage(
            err,
            "This verification link is invalid or has expired.",
          ),
        );
      });
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin mb-5" />
        <h1 className="text-[1.4rem] font-black text-white tracking-tight leading-tight mb-2">
          Verifying your email…
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Just a moment.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="w-full max-w-[380px] flex flex-col items-center text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <CheckCircle2 className="w-7 h-7 text-accent-400" />
        </div>
        <h1 className="text-[1.4rem] font-black text-white tracking-tight leading-tight mb-2">
          Email verified
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed mb-7">
          Your account is confirmed. You&apos;re all set.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-white text-[14px] font-bold px-6 py-3 rounded-xl transition-all"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            boxShadow:
              "0 4px 20px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          Go to dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px] flex flex-col items-center text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <XCircle className="w-7 h-7 text-red-400" />
      </div>
      <h1 className="text-[1.4rem] font-black text-white tracking-tight leading-tight mb-2">
        Verification failed
      </h1>
      <p className="text-[14px] text-gray-600 leading-relaxed mb-7">
        {message}
      </p>
      <Link
        href="/dashboard/settings"
        className="text-[13px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
      >
        Go to settings to resend the link
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
