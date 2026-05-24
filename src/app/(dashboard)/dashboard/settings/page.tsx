"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
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
        // fallback to localStorage
        const stored = getStoredCompany();
        if (stored) {
          setForm((prev) => ({
            ...prev,
            name: stored.name ?? "",
            industry: stored.industry ?? "",
          }));
        }
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

      // Keep localStorage in sync
      const stored = getStoredCompany();
      if (stored) {
        setStoredCompany({
          ...stored,
          name: form.name,
          industry: form.industry || null,
        });
      }

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
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Update your company profile.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-900 border border-white/5 rounded-2xl p-7 space-y-6"
      >
        {/* Company name */}
        <Field label="Company name" required>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Acme Corp"
            className={inputCls}
          />
        </Field>

        {/* Website */}
        <Field label="Website">
          <input
            type="url"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
            className={inputCls}
          />
        </Field>

        {/* Location */}
        <Field label="Location">
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Lagos, Nigeria"
            className={inputCls}
          />
        </Field>

        {/* Industry + Size */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Industry">
            <select
              name="industry"
              value={form.industry}
              onChange={handleChange}
              className={`${inputCls} appearance-none cursor-pointer`}
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
              className={`${inputCls} appearance-none cursor-pointer`}
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

        {/* Description */}
        <Field
          label="About the company"
          hint="Shown to candidates on your public job posts."
        >
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="We build tools that help teams move faster…"
            className={`${inputCls} resize-y`}
          />
        </Field>

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-brand-600/20"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label}
        {required && <span className="text-brand-400 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-600 mb-2">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-surface-950 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-600/60 focus:ring-1 focus:ring-brand-600/30 transition";
