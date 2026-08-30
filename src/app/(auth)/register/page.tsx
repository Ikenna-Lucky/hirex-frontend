"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Users,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { setStoredCompany } from "@/lib/auth";
import { getErrorMessage } from "@/lib/utils";
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
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
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

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-white/[0.045] px-4 py-2.5 text-[13.5px] text-white outline-none transition placeholder:text-gray-700 focus:border-violet-400/55 focus:bg-white/[0.065] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
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
        toast.success("Account created. Welcome to HireX.");
        router.push("/dashboard");
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse>;
      const msg = error.response?.data?.message;
      if (msg?.toLowerCase().includes("email")) {
        setErrors({ email: "This email is already registered." });
      } else {
        toast.error(
          getErrorMessage(err, "Something went wrong. Please try again."),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-300">
          Create workspace
        </p>
        <h1 className="text-[1.7rem] font-black leading-tight tracking-tight text-white">
          Start hiring with a cleaner candidate pipeline.
        </h1>
        <p className="mt-2 text-[13.5px] leading-6 text-gray-500">
          Create your company account, post your first role, and start receiving
          scored CVs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <Field label="Company name" error={errors.name}>
          <div className="relative">
            <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="TechNova Solutions"
              className={`${inputClass} pl-11`}
            />
          </div>
        </Field>

        <Field label="Work email" error={errors.email}>
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
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Industry">
            <SelectShell icon={<Briefcase className="h-4 w-4" />}>
              <select
                name="industry"
                value={form.industry}
                onChange={handleChange}
                className={`${inputClass} appearance-none pl-11 pr-10`}
              >
                <option value="">Select</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </SelectShell>
          </Field>

          <Field label="Company size">
            <SelectShell icon={<Users className="h-4 w-4" />}>
              <select
                name="size"
                value={form.size}
                onChange={handleChange}
                className={`${inputClass} appearance-none pl-11 pr-10`}
              >
                <option value="">Select</option>
                {COMPANY_SIZES.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </SelectShell>
          </Field>
        </div>

        <Field label="Password" error={errors.password}>
          <PasswordInput
            name="password"
            value={form.password}
            placeholder="At least 8 characters"
            visible={showPassword}
            onToggle={() => setShowPassword((value) => !value)}
            onChange={handleChange}
          />
        </Field>

        <Field label="Confirm password" error={errors.confirmPassword}>
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            placeholder="Repeat your password"
            visible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((value) => !value)}
            onChange={handleChange}
          />
        </Field>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-[14px] font-black text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-55"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account
            </>
          ) : (
            <>
              Create company account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="hidden text-center text-[11px] leading-5 text-gray-700 sm:block">
          By creating an account, you agree to the HireX Terms and Privacy
          Policy.
        </p>
      </form>

      <div
        className="mt-4 border-t pt-4 text-center"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p className="text-[13px] text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-white transition hover:text-violet-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

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
      <label className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

function SelectShell({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
        {icon}
      </span>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
      {children}
    </div>
  );
}

function PasswordInput({
  name,
  value,
  placeholder,
  visible,
  onToggle,
  onChange,
}: {
  name: "password" | "confirmPassword";
  value: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        required
        autoComplete="new-password"
        placeholder={placeholder}
        className={`${inputClass} px-11`}
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-600 transition hover:bg-white/[0.06] hover:text-gray-300"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
