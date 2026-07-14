"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      // API always returns a generic success message, whether or not the
      // email exists — don't let this screen leak which emails are registered.
      setSent(true);
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Something went wrong. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="w-full max-w-[380px]">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.25em] mb-3">
            Check your inbox
          </p>
          <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight mb-2">
            Reset link sent
          </h1>
          <p className="text-[14px] text-gray-600 leading-relaxed">
            If an account exists for{" "}
            <span className="text-gray-400">{email}</span>, a password reset
            link is on its way. It expires in 1 hour.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="mb-8">
        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.25em] mb-3">
          Forgot password
        </p>
        <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight mb-2">
          Reset your password
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Enter your work email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-2">
            Work email
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-gray-700 focus:outline-none transition"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(124,58,237,0.5)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(124,58,237,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            boxShadow:
              "0 4px 20px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div
        className="mt-8 pt-7 border-t text-center"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <p className="text-[13px] text-gray-600">
          Remembered it after all?{" "}
          <Link
            href="/login"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
