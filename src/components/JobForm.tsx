"use client";

import {
  Article,
  BriefcaseMetal,
  CalendarBlank,
  CheckCircle,
  CircleNotch,
  CurrencyDollar,
  FileText,
  ListChecks,
  MapPin,
  PaperPlaneTilt,
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
  onSubmit: (event: React.FormEvent) => void;
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

const inputClass =
  "min-h-11 w-full rounded-lg border border-white/[0.07] bg-white/[0.035] px-3.5 text-[14px] text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.055]";

export default function JobForm({
  values,
  onChange,
  onSubmit,
  loading,
  submitLabel,
  onCancel,
}: Props) {
  const set = (field: keyof JobFormValues, value: string) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Section
        icon={<BriefcaseMetal weight="duotone" size={18} />}
        title="Role basics"
        subtitle="Name the role candidates will apply for."
      >
        <Field label="Job title" required>
          <input
            type="text"
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            required
            placeholder="Senior Backend Engineer"
            className={inputClass}
          />
        </Field>
      </Section>

      <Section
        icon={<Article weight="duotone" size={18} />}
        title="Job description"
        subtitle="Set the context the AI will score CVs against."
      >
        <Field
          label="Description"
          required
          hint="Describe the role, the team, and what success looks like."
        >
          <textarea
            value={values.description}
            onChange={(event) => set("description", event.target.value)}
            required
            rows={6}
            placeholder="Tell candidates what this role is about."
            className={`${inputClass} resize-y py-3 leading-6`}
          />
        </Field>
      </Section>

      <Section
        icon={<ListChecks weight="duotone" size={18} />}
        title="Requirements and responsibilities"
        subtitle="Help candidates understand the real work."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Field
            label="Requirements"
            hint="Skills, experience, and qualifications you are looking for."
          >
            <textarea
              value={values.requirements}
              onChange={(event) => set("requirements", event.target.value)}
              rows={6}
              placeholder={
                "3+ years of TypeScript experience\nAPI design experience"
              }
              className={`${inputClass} resize-y py-3 leading-6`}
            />
          </Field>
          <Field
            label="Responsibilities"
            hint="What this person will own day to day."
          >
            <textarea
              value={values.responsibilities}
              onChange={(event) => set("responsibilities", event.target.value)}
              rows={6}
              placeholder={
                "Design and ship API endpoints\nReview candidates in HireX"
              }
              className={`${inputClass} resize-y py-3 leading-6`}
            />
          </Field>
        </div>
      </Section>

      <Section
        icon={<MapPin weight="duotone" size={18} />}
        title="Role details"
        subtitle="Add location, work mode, pay range, and deadline."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Location">
            <input
              type="text"
              value={values.location}
              onChange={(event) => set("location", event.target.value)}
              placeholder="Lagos, Nigeria or Remote"
              className={inputClass}
            />
          </Field>
          <Field label="Job type">
            <select
              value={values.type}
              onChange={(event) => set("type", event.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="" className="bg-[#0d0f16]">
                Select type
              </option>
              {JOB_TYPES.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  className="bg-[#0d0f16]"
                >
                  {type.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Min salary">
            <input
              type="number"
              value={values.salaryMin}
              onChange={(event) => set("salaryMin", event.target.value)}
              placeholder="500000"
              min={0}
              className={inputClass}
            />
          </Field>
          <Field label="Max salary">
            <input
              type="number"
              value={values.salaryMax}
              onChange={(event) => set("salaryMax", event.target.value)}
              placeholder="800000"
              min={0}
              className={inputClass}
            />
          </Field>
          <Field label="Currency">
            <select
              value={values.salaryCurrency}
              onChange={(event) => set("salaryCurrency", event.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option value="NGN" className="bg-[#0d0f16]">
                NGN
              </option>
              <option value="USD" className="bg-[#0d0f16]">
                USD
              </option>
              <option value="GBP" className="bg-[#0d0f16]">
                GBP
              </option>
              <option value="EUR" className="bg-[#0d0f16]">
                EUR
              </option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Application deadline"
            hint="Leave blank to accept applications indefinitely."
          >
            <input
              type="date"
              value={values.closesAt}
              onChange={(event) => set("closesAt", event.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={inputClass}
            />
          </Field>
          <Field label="Initial status">
            <div className="grid h-11 grid-cols-2 overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.035] p-1">
              <StatusButton
                active={values.status === "draft"}
                icon={
                  <FileText
                    size={14}
                    weight={values.status === "draft" ? "fill" : "regular"}
                  />
                }
                label="Draft"
                onClick={() => set("status", "draft")}
              />
              <StatusButton
                active={values.status === "active"}
                icon={
                  <CheckCircle
                    size={14}
                    weight={values.status === "active" ? "fill" : "regular"}
                  />
                }
                label="Active"
                onClick={() => set("status", "active")}
              />
            </div>
            <p className="mt-2 text-[12px] text-slate-600">
              {values.status === "draft"
                ? "Draft roles are not visible to applicants yet."
                : "Active roles are open for applications immediately."}
            </p>
          </Field>
        </div>
      </Section>

      <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <CircleNotch size={15} className="animate-spin" />
          ) : (
            <PaperPlaneTilt weight="fill" size={15} />
          )}
          {loading ? "Saving" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] px-5 py-2.5 text-[13px] font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/[0.07] bg-[#0d0f16]">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
          {icon}
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-white">{title}</h2>
          <p className="mt-0.5 text-[12px] text-slate-600">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
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
    <div className="space-y-1.5">
      <label className="block text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
        {required && <span className="ml-1 text-violet-300">*</span>}
      </label>
      {children}
      {hint && <p className="text-[12px] leading-5 text-slate-600">{hint}</p>}
    </div>
  );
}

function StatusButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md text-[13px] font-bold transition ${
        active
          ? "bg-violet-400/[0.14] text-violet-200"
          : "text-slate-600 hover:bg-white/[0.04] hover:text-slate-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
