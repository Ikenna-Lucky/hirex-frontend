"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Mail, Lock } from "lucide-react";
import { authApi } from "@/lib/api";
import { setToken, setStoredCompany } from "@/lib/auth";
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
      const body = res.data as ApiResponse<{ token: string; company: Company }>;
      if (body.data) {
        setToken(body.data.token);
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
    <div className="w-full max-w-sm">
      {/* Card */}
      <div className="bg-surface-900 border border-white/5 rounded-2xl p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-gray-500">
            Welcome back to your hiring dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Work email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className="w-full bg-surface-950 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-600/60 focus:ring-1 focus:ring-brand-600/30 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-surface-950 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-600/60 focus:ring-1 focus:ring-brand-600/30 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-brand-600/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}
