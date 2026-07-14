"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (form.password.length < 8) next.password = "Min. 8 characters.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("This reset link is missing its token. Request a new one.");
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.resetPassword(token, form.password);
      toast.success("Password reset. Please sign in.");
      router.push("/login");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "This reset link is invalid or has expired."),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-[380px]">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.25em] mb-3">
            Invalid link
          </p>
          <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight mb-2">
            This link isn&apos;t valid
          </h1>
          <p className="text-[14px] text-gray-600 leading-relaxed">
            It may have expired, or the link is incomplete. Request a new one
            below.
          </p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          Request a new link
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="mb-8">
        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.25em] mb-3">
          Reset password
        </p>
        <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight mb-2">
          Choose a new password
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Make it something you haven&apos;t used before.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-2">
            New password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((p) => ({ ...p, password: e.target.value }))
            }
            required
            autoComplete="new-password"
            placeholder="Min. 8 characters"
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
          {errors.password && (
            <p className="mt-1.5 text-[11px] text-red-400">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-2">
            Confirm new password
          </label>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
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
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[11px] text-red-400">
              {errors.confirmPassword}
            </p>
          )}
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
              Resetting…
            </>
          ) : (
            <>
              Reset password
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
