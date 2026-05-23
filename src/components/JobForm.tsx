"use client";

import { Loader2 } from "lucide-react";

export type JobFormValues = {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  type: string;
  salaryMin: string;
  salaryMax: string;
  salaryCurrency: string;
  closesAt: string;
  status: "draft" | "active";
};

export const JOB_FORM_DEFAULTS: JobFormValues = {
  title: "",
  description: "",
  requirements: "",
  responsibilities: "",
  location: "",
  type: "",
  salaryMin: "",
  salaryMax: "",
  salaryCurrency: "NGN",
  closesAt: "",
  status: "draft",
};

type Props = {
  values: JobFormValues;
  onChange: (values: JobFormValues) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  submitLabel: string;
  onCancel?: () => void;
};

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export default function JobForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  onCancel,
}: Props) {
  const set = (field: keyof JobFormValues, value: string) =>
    onChange({ ...values, [field]: value });

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {/* Title */}
      <Field label="Job title" required>
        <input
          type="text"
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          required
          placeholder="e.g. Senior Backend Engineer"
          className={inputCls}
        />
      </Field>

      {/* Description */}
      <Field
        label="Job description"
        required
        hint="Describe the role, the team, and what success looks like."
      >
        <textarea
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          required
          rows={6}
          placeholder="Tell candidates what this role is about…"
          className={`${inputCls} resize-y`}
        />
      </Field>

      {/* Requirements */}
      <Field
        label="Requirements"
        hint="Skills, experience, and qualifications you're looking for."
      >
        <textarea
          value={values.requirements}
          onChange={(e) => set("requirements", e.target.value)}
          rows={5}
          placeholder="• 3+ years of TypeScript experience&#10;• Familiarity with distributed systems…"
          className={`${inputCls} resize-y`}
        />
      </Field>

      {/* Responsibilities */}
      <Field
        label="Responsibilities"
        hint="What will this person own day-to-day?"
      >
        <textarea
          value={values.responsibilities}
          onChange={(e) => set("responsibilities", e.target.value)}
          rows={5}
          placeholder="• Design and ship new API endpoints&#10;• Lead code reviews…"
          className={`${inputCls} resize-y`}
        />
      </Field>

      {/* Location + Type */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Location">
          <input
            type="text"
            value={values.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Lagos, Nigeria · Remote OK"
            className={inputCls}
          />
        </Field>
        <Field label="Job type">
          <select
            value={values.type}
            onChange={(e) => set("type", e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            <option value="">Select type…</option>
            {JOB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Salary */}
      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Min salary">
          <input
            type="number"
            value={values.salaryMin}
            onChange={(e) => set("salaryMin", e.target.value)}
            placeholder="500,000"
            min={0}
            className={inputCls}
          />
        </Field>
        <Field label="Max salary">
          <input
            type="number"
            value={values.salaryMax}
            onChange={(e) => set("salaryMax", e.target.value)}
            placeholder="800,000"
            min={0}
            className={inputCls}
          />
        </Field>
        <Field label="Currency">
          <select
            value={values.salaryCurrency}
            onChange={(e) => set("salaryCurrency", e.target.value)}
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            <option value="NGN">NGN (₦)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </Field>
      </div>

      {/* Closes at + Status */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Application deadline"
          hint="Leave blank to accept indefinitely."
        >
          <input
            type="date"
            value={values.closesAt}
            onChange={(e) => set("closesAt", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className={inputCls}
          />
        </Field>
        <Field label="Initial status">
          <select
            value={values.status}
            onChange={(e) =>
              set("status", e.target.value as "draft" | "active")
            }
            className={`${inputCls} appearance-none cursor-pointer`}
          >
            <option value="draft">Draft — not visible to applicants</option>
            <option value="active">Active — open for applications</option>
          </select>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-brand-600/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-2.5 rounded-lg transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
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
