"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { setStoredCompany } from "@/lib/auth";
import type { ApiResponse, Company } from "@/types";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      const error = err as AxiosError<ApiResponse>;
      toast.error(error.response?.data?.message ?? "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[380px]">
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.25em] mb-3">
          Welcome back
        </p>
        <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight mb-2">
          Sign in to HireX
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Your hiring pipeline is waiting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-2">
            Work email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em]">
              Password
            </label>
          </div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
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

        {/* Submit */}
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
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider + register link */}
      <div
        className="mt-8 pt-7 border-t text-center"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <p className="text-[13px] text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
