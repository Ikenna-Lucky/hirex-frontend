"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { setStoredCompany } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
import type { ApiResponse, Company } from "@/types";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.045] px-4 py-3.5 text-[14px] text-white outline-none transition placeholder:text-gray-700 focus:border-violet-400/55 focus:bg-white/[0.065] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      const body = res.data as ApiResponse<{ company: Company }>;
      if (body.data) {
        setStoredCompany({
          id: body.data.company.id,
          name: body.data.company.name,
          email: body.data.company.email,
          logoUrl: body.data.company.logoUrl,
          industry: body.data.company.industry,
          isVerified: body.data.company.isVerified,
        });
        toast.success("Welcome back!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid credentials."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[410px] lg:-mt-8">
      <div className="mb-6">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
          Welcome back
        </p>
        <h1 className="text-[1.85rem] font-black leading-tight tracking-tight text-white">
          Sign in to your hiring workspace.
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-gray-500">
          Pick up where you left off: active roles, scored CVs, and candidates
          waiting for review.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
            Work email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@company.com"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label className="block text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-semibold text-violet-300 transition hover:text-violet-200"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${inputClass} px-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-[14px] font-black text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in
            </>
          ) : (
            <>
              Continue to dashboard
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div
        className="mt-6 border-t pt-5 text-center"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p className="text-[13px] text-gray-500">
          New to HireX?{" "}
          <Link
            href="/register"
            className="font-bold text-white transition hover:text-violet-200"
          >
            Create a free company account
          </Link>
        </p>
      </div>
    </div>
  );
}
