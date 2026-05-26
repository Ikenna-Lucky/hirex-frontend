"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { authApi } from "@/lib/api";
import { setToken, setStoredCompany } from "@/lib/auth";
import type { ApiResponse, Company } from "@/types";
import type { AxiosError } from "axios";

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "E-commerce",
  "Media & Entertainment",
  "Manufacturing",
  "Consulting",
  "Legal",
  "Real Estate",
  "Non-profit",
  "Other",
];

const COMPANY_SIZES = [
  { value: "1-10", label: "1–10 employees" },
  { value: "11-50", label: "11–50 employees" },
  { value: "51-200", label: "51–200 employees" },
  { value: "201-500", label: "201–500 employees" },
  { value: "500+", label: "500+ employees" },
];

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  industry: string;
  size: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    industry: "",
    size: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Company name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await authApi.register({
        name: form.name,
        email: form.email,
        password: form.password,
        industry: form.industry || undefined,
        size: form.size || undefined,
      });
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
        toast.success("Account created! Welcome to HireX.");
        router.push("/dashboard");
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      const msg = error.response?.data?.message;
      if (msg?.toLowerCase().includes("email")) {
        setErrors({ email: "This email is already registered." });
      } else {
        toast.error(msg ?? "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px]">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[2rem] font-bold text-white tracking-tight leading-tight mb-2">
          Start hiring smarter
        </h1>
        <p className="text-[15px] text-gray-500">
          Set up HireX for your company in under two minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company name */}
        <Field label="Company name" error={errors.name}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Acme Corp"
            className={inputCls(!!errors.name)}
          />
        </Field>

        {/* Work email */}
        <Field label="Work email" error={errors.email}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputCls(!!errors.email)}
          />
        </Field>

        {/* Industry + Size */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Industry">
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className={selectCls(false)}
            >
              <option value="">Select…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Company size">
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              className={selectCls(false)}
            >
              <option value="">Select…</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Password */}
        <Field label="Password" error={errors.password}>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className={inputCls(!!errors.password)}
          />
        </Field>

        {/* Confirm password */}
        <Field label="Confirm password" error={errors.confirmPassword}>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
            className={inputCls(!!errors.confirmPassword)}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all mt-2 shadow-lg shadow-brand-600/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-600 text-center leading-relaxed pt-1">
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </form>

      {/* Sign in link */}
      <div className="mt-7 pt-7 border-t border-white/[0.06] text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

// ─── Field wrapper ───────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.12em] mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

// ─── Input styles ────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return [
    "w-full bg-surface-900 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-600",
    "focus:outline-none focus:ring-2 transition",
    hasError
      ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/10"
      : "border-white/10 focus:border-brand-600/50 focus:ring-brand-600/10",
  ].join(" ");
}

function selectCls(hasError: boolean) {
  return [inputCls(hasError), "appearance-none cursor-pointer"].join(" ");
}
