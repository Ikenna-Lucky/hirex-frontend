"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Loader2,
  Save,
  Building2,
  Globe,
  MapPin,
  Users,
  FileText,
  Mail,
  Lock,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { getStoredCompany, setStoredCompany } from "@/lib/auth";
import type { AxiosError } from "axios";

type FormState = {
  name: string;
  website: string;
  industry: string;
  size: string;
  location: string;
  description: string;
};

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

const inputStyle = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  padding: "10px 14px",
  color: "white",
  fontSize: "13px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
};

const focusHandlers = {
  onFocus: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
  },
  onBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
    e.currentTarget.style.boxShadow = "none";
  },
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState<FormState>({
    name: "",
    website: "",
    industry: "",
    size: "",
    location: "",
    description: "",
  });
  const company = getStoredCompany();

  useEffect(() => {
    authApi
      .me()
      .then((res) => {
        const c = res.data.data?.company ?? res.data.data;
        setForm({
          name: c.name ?? "",
          website: c.website ?? "",
          industry: c.industry ?? "",
          size: c.size ?? "",
          location: c.location ?? "",
          description: c.description ?? "",
        });
      })
      .catch(() => {
        const stored = getStoredCompany();
        if (stored)
          setForm((prev) => ({
            ...prev,
            name: stored.name ?? "",
            industry: stored.industry ?? "",
          }));
      })
      .finally(() => setFetching(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Company name is required.");
      return;
    }
    setLoading(true);
    try {
      await authApi.updateProfile({
        name: form.name,
        website: form.website || null,
        industry: form.industry || null,
        size: form.size || null,
        location: form.location || null,
        description: form.description || null,
      });
      const stored = getStoredCompany();
      if (stored)
        setStoredCompany({
          ...stored,
          name: form.name,
          industry: form.industry || null,
        });
      toast.success("Profile updated.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "#8b5cf6" }}
          />
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  const initials =
    company?.name
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-white tracking-tight">
          Settings
        </h1>
        <p
          className="text-[17px] mt-1.5"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Manage your company profile and account preferences.
        </p>
      </div>

      {/* Company avatar + quick info */}
      <div
        className="flex items-center gap-4 p-5 rounded-2xl"
        style={{
          backgroundColor: "#0c0c20",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-[18px] font-black text-white flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
          }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-[17px] font-semibold text-white">
            {form.name || "Your company"}
          </p>
          <p
            className="text-[13px] mt-0.5"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {company?.email}
          </p>
          {form.industry && (
            <span
              className="inline-block mt-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(124,58,237,0.1)",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              {form.industry}
            </span>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Section: Company details */}
        <Section
          icon={Building2}
          title="Company details"
          subtitle="Basic information about your company"
        >
          <div className="space-y-4">
            <Field label="Company name" required icon={Building2}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Acme Corp"
                style={{ ...inputStyle, paddingLeft: "38px" }}
                {...focusHandlers}
              />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Website" icon={Globe}>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  style={{ ...inputStyle, paddingLeft: "38px" }}
                  {...focusHandlers}
                />
              </Field>
              <Field label="Location" icon={MapPin}>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Lagos, Nigeria"
                  style={{ ...inputStyle, paddingLeft: "38px" }}
                  {...focusHandlers}
                />
              </Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Industry" icon={Building2}>
                <select
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    paddingLeft: "38px",
                    cursor: "pointer",
                    appearance: "none" as const,
                  }}
                  {...focusHandlers}
                >
                  <option value="">Select industry…</option>
                  {INDUSTRIES.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Company size" icon={Users}>
                <select
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    paddingLeft: "38px",
                    cursor: "pointer",
                    appearance: "none" as const,
                  }}
                  {...focusHandlers}
                >
                  <option value="">Select size…</option>
                  {COMPANY_SIZES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        </Section>

        {/* Section: About */}
        <Section
          icon={FileText}
          title="About your company"
          subtitle="Shown to candidates on your public job posts"
        >
          <Field label="Description" icon={FileText}>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="We build tools that help teams move faster…"
              style={{
                ...inputStyle,
                paddingLeft: "38px",
                resize: "vertical",
                paddingTop: "10px" as const,
              }}
              {...focusHandlers}
            />
          </Field>
        </Section>

        {/* Section: Account (read-only) */}
        <Section icon={Lock} title="Account" subtitle="Your login credentials">
          <div className="space-y-4">
            <Field label="Email address" icon={Mail}>
              <input
                type="email"
                value={company?.email ?? ""}
                disabled
                style={{
                  ...inputStyle,
                  paddingLeft: "38px",
                  opacity: 0.4,
                  cursor: "not-allowed",
                }}
              />
            </Field>
          </div>
        </Section>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #5b21b6)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "#0c0c20",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Section header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
        </div>
        <div>
          <p className="text-[17px] font-semibold text-white">{title}</p>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {subtitle}
          </p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-[11px] font-semibold uppercase tracking-wider mb-2"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
        {required && <span style={{ color: "#a78bfa" }}> *</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
