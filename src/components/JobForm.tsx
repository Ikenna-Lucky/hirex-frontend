"use client";

import {
  BriefcaseMetal,
  Article,
  ListChecks,
  MapPin,
  CurrencyDollar,
  CalendarBlank,
  CircleNotch,
  PaperPlaneTilt,
  FileText,
  CheckCircle,
} from "@phosphor-icons/react";

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
    <form onSubmit={onSubmit} className="space-y-4">
      {/* ── Section 1 · Role basics ───────────────────────── */}
      <Section
        icon={
          <BriefcaseMetal
            weight="duotone"
            size={16}
            style={{ color: "#a78bfa" }}
          />
        }
        title="Role basics"
      >
        <Field label="Job title" required>
          <input
            type="text"
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="e.g. Senior Backend Engineer"
            className="hirex-input"
          />
        </Field>
      </Section>

      {/* ── Section 2 · Description ───────────────────────── */}
      <Section
        icon={
          <Article weight="duotone" size={16} style={{ color: "#a78bfa" }} />
        }
        title="Job description"
      >
        <Field
          label="Description"
          required
          hint="Describe the role, the team, and what success looks like."
        >
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={6}
            placeholder="Tell candidates what this role is about…"
            className="hirex-input resize-y"
          />
        </Field>
      </Section>

      {/* ── Section 3 · Requirements & Responsibilities ───── */}
      <Section
        icon={
          <ListChecks weight="duotone" size={16} style={{ color: "#a78bfa" }} />
        }
        title="Requirements & responsibilities"
      >
        <Field
          label="Requirements"
          hint="Skills, experience, and qualifications you're looking for."
        >
          <textarea
            value={values.requirements}
            onChange={(e) => set("requirements", e.target.value)}
            rows={5}
            placeholder={
              "• 3+ years of TypeScript experience\n• Familiarity with distributed systems…"
            }
            className="hirex-input resize-y"
          />
        </Field>
        <Field
          label="Responsibilities"
          hint="What will this person own day-to-day?"
        >
          <textarea
            value={values.responsibilities}
            onChange={(e) => set("responsibilities", e.target.value)}
            rows={5}
            placeholder={
              "• Design and ship new API endpoints\n• Lead code reviews…"
            }
            className="hirex-input resize-y"
          />
        </Field>
      </Section>

      {/* ── Section 4 · Job details ───────────────────────── */}
      <Section
        icon={
          <MapPin weight="duotone" size={16} style={{ color: "#a78bfa" }} />
        }
        title="Job details"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Location">
            <input
              type="text"
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Lagos, Nigeria · Remote OK"
              className="hirex-input"
            />
          </Field>
          <Field label="Job type">
            <select
              value={values.type}
              onChange={(e) => set("type", e.target.value)}
              className="hirex-input appearance-none cursor-pointer"
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
      </Section>

      {/* ── Section 5 · Compensation ──────────────────────── */}
      <Section
        icon={
          <CurrencyDollar
            weight="duotone"
            size={16}
            style={{ color: "#a78bfa" }}
          />
        }
        title="Compensation"
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Min salary">
            <input
              type="number"
              value={values.salaryMin}
              onChange={(e) => set("salaryMin", e.target.value)}
              placeholder="500,000"
              min={0}
              className="hirex-input"
            />
          </Field>
          <Field label="Max salary">
            <input
              type="number"
              value={values.salaryMax}
              onChange={(e) => set("salaryMax", e.target.value)}
              placeholder="800,000"
              min={0}
              className="hirex-input"
            />
          </Field>
          <Field label="Currency">
            <select
              value={values.salaryCurrency}
              onChange={(e) => set("salaryCurrency", e.target.value)}
              className="hirex-input appearance-none cursor-pointer"
            >
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* ── Section 6 · Publishing ────────────────────────── */}
      <Section
        icon={
          <CalendarBlank
            weight="duotone"
            size={16}
            style={{ color: "#a78bfa" }}
          />
        }
        title="Publishing"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="Application deadline"
            hint="Leave blank to accept applications indefinitely."
          >
            <input
              type="date"
              value={values.closesAt}
              onChange={(e) => set("closesAt", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="hirex-input"
            />
          </Field>

          <Field label="Initial status">
            {/* Toggle buttons instead of <select> */}
            <div
              className="flex rounded-xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <button
                type="button"
                onClick={() => set("status", "draft")}
                className="flex-1 flex items-center justify-center gap-2 py-[11px] text-[13px] font-medium transition-all"
                style={
                  values.status === "draft"
                    ? {
                        background: "rgba(124,58,237,0.18)",
                        color: "#a78bfa",
                        borderRight: "1px solid rgba(124,58,237,0.25)",
                      }
                    : {
                        color: "rgba(255,255,255,0.35)",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                      }
                }
              >
                <FileText
                  weight={values.status === "draft" ? "fill" : "regular"}
                  size={14}
                />
                Draft
              </button>
              <button
                type="button"
                onClick={() => set("status", "active")}
                className="flex-1 flex items-center justify-center gap-2 py-[11px] text-[13px] font-medium transition-all"
                style={
                  values.status === "active"
                    ? {
                        background: "rgba(124,58,237,0.18)",
                        color: "#a78bfa",
                      }
                    : {
                        color: "rgba(255,255,255,0.35)",
                      }
                }
              >
                <CheckCircle
                  weight={values.status === "active" ? "fill" : "regular"}
                  size={14}
                />
                Active
              </button>
            </div>
            <p
              className="text-[12px] mt-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {values.status === "draft"
                ? "Draft — not visible to applicants yet."
                : "Active — open for applications immediately."}
            </p>
          </Field>
        </div>
      </Section>

      {/* ── Actions ───────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-2 pb-1">
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2.5 px-7 py-3 rounded-xl text-[14px] font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: loading
              ? "rgba(124,58,237,0.5)"
              : "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
            boxShadow: loading
              ? "none"
              : "0 0 24px rgba(124,58,237,0.35), 0 4px 12px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 32px rgba(124,58,237,0.55), 0 4px 16px rgba(0,0,0,0.4)";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 24px rgba(124,58,237,0.35), 0 4px 12px rgba(0,0,0,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "";
            }
          }}
        >
          {loading ? (
            <>
              <CircleNotch size={15} className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <PaperPlaneTilt weight="fill" size={15} />
              {submitLabel}
            </>
          )}
        </button>

        {/* Cancel */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 rounded-xl text-[14px] font-medium transition-all"
            style={{
              color: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.75)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.13)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.08)";
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

/* ── Section card ───────────────────────────────────────── */
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Section header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          {icon}
        </div>
        <h3
          className="text-[13px] font-semibold tracking-wide uppercase"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
}

/* ── Field label + hint ─────────────────────────────────── */
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
    <div className="space-y-1.5">
      <label
        className="block text-[13px] font-medium"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "#a78bfa" }}>
            *
          </span>
        )}
      </label>
      {hint && (
        <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.28)" }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
