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

/* ─── Input style helpers ─────────────────────────────────── */
const baseInput =
  "w-full rounded-xl px-4 py-3 text-[13.5px] text-white placeholder-gray-700 focus:outline-none transition";

const baseStyle = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = "1px solid rgba(124,58,237,0.5)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
    e.currentTarget.style.boxShadow = "none";
  },
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
    if (errors[name as keyof FormState])
      setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Company name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.password.length < 8) next.password = "Min. 8 characters.";
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
    <div className="w-full max-w-[400px]">
      {/* Heading */}
      <div className="mb-7">
        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-[0.25em] mb-3">
          Get started free
        </p>
        <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight mb-2">
          Start hiring smarter
        </h1>
        <p className="text-[14px] text-gray-600 leading-relaxed">
          Set up HireX for your company in under two minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Company name */}
        <Field label="Company name" error={errors.name}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Acme Corp"
            className={baseInput}
            style={{ ...baseStyle }}
            {...focusHandlers}
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
            className={baseInput}
            style={{ ...baseStyle }}
            {...focusHandlers}
          />
        </Field>

        {/* Industry + Size — two columns */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Industry">
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className={baseInput + " appearance-none cursor-pointer"}
              style={{ ...baseStyle }}
              {...focusHandlers}
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
              className={baseInput + " appearance-none cursor-pointer"}
              style={{ ...baseStyle }}
              {...focusHandlers}
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
            className={baseInput}
            style={{ ...baseStyle }}
            {...focusHandlers}
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
            className={baseInput}
            style={{ ...baseStyle }}
            {...focusHandlers}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all mt-1 disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            boxShadow:
              "0 4px 20px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating account…
            </>
          ) : (
            <>
              Create account <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p
          className="text-[11px] text-center leading-relaxed"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </form>

      {/* Sign in link */}
      <div
        className="mt-6 pt-6 border-t text-center"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <p className="text-[13px] text-gray-600">
          Already have an account?{" "}
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

/* ─── Field wrapper ───────────────────────────────────────── */
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
      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-[0.18em] mb-2">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}
