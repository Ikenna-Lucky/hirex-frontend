"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Loader2,
  Upload,
  CheckCircle2,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { jobsApi, applicationsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";
import type { AxiosError } from "axios";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  portfolioUrl: string;
  coverLetter: string;
  cv: File | null;
};

const EMPTY_FORM: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  portfolioUrl: "",
  coverLetter: "",
  cv: null,
};

export default function PublicJobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cvError, setCvError] = useState<string | null>(null);

  useEffect(() => {
    jobsApi
      .publicGet(id)
      .then((res) => setJob(res.data.data?.job ?? res.data.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const isClosed =
    job?.status !== "active" ||
    (!!job.closesAt && new Date(job.closesAt) < new Date());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCvError(null);
    if (!file) return;
    if (file.type !== "application/pdf") {
      setCvError("Please upload a PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCvError("CV must be under 5 MB.");
      e.target.value = "";
      return;
    }
    setForm((prev) => ({ ...prev, cv: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cv) {
      setCvError("Please attach your CV.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      fd.append("email", form.email);
      if (form.phone) fd.append("phone", form.phone);
      if (form.linkedinUrl) fd.append("linkedinUrl", form.linkedinUrl);
      if (form.portfolioUrl) fd.append("portfolioUrl", form.portfolioUrl);
      if (form.coverLetter) fd.append("coverLetter", form.coverLetter);
      fd.append("cv", form.cv);

      await applicationsApi.submit(id, fd);
      setSubmitted(true);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const msg =
        error.response?.data?.message ?? "Submission failed. Please try again.";
      if (msg.toLowerCase().includes("already applied")) {
        toast.error("You have already applied for this role.");
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-3 text-gray-400">
        <XCircle className="w-10 h-10 text-gray-700" />
        <p className="font-medium">Job not found.</p>
        <Link
          href="/jobs"
          className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          Browse all jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 text-gray-100">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/jobs"
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> All jobs
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-sm text-gray-400 truncate">{job.title}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid lg:grid-cols-[1fr_420px] gap-10 items-start">
        {/* ─── Job info ─────────────────────────────────── */}
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-400 font-bold shrink-0">
                {job.company?.name?.charAt(0).toUpperCase() ?? (
                  <Building2 className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">
                  {job.company?.name}
                </p>
                <p className="text-xs text-gray-600">{job.company?.industry}</p>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-3">
              {job.location && (
                <Tag icon={<MapPin className="w-3.5 h-3.5" />}>
                  {job.location}
                </Tag>
              )}
              {job.type && (
                <Tag icon={<Briefcase className="w-3.5 h-3.5" />} capitalize>
                  {job.type.replace("-", " ")}
                </Tag>
              )}
              <Tag icon={<Clock className="w-3.5 h-3.5" />}>
                Posted {formatDate(job.createdAt)}
              </Tag>
              {isClosed && (
                <span className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                  <XCircle className="w-3.5 h-3.5" /> Applications closed
                </span>
              )}
            </div>
          </div>

          {/* Salary */}
          {(job.salaryMin || job.salaryMax) && (
            <div className="p-4 rounded-xl bg-surface-900 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">Compensation</p>
              <p className="text-sm font-semibold text-white">
                {job.salaryCurrency}{" "}
                {job.salaryMin && job.salaryMax
                  ? `${Number(job.salaryMin).toLocaleString()} – ${Number(job.salaryMax).toLocaleString()}`
                  : job.salaryMin
                    ? `from ${Number(job.salaryMin).toLocaleString()}`
                    : `up to ${Number(job.salaryMax).toLocaleString()}`}
                <span className="text-gray-500 font-normal"> /month</span>
              </p>
            </div>
          )}

          {/* Description */}
          <Section title="About this role">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </Section>

          {job.responsibilities && (
            <Section title="Responsibilities">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {job.responsibilities}
              </p>
            </Section>
          )}

          {job.requirements && (
            <Section title="Requirements">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </p>
            </Section>
          )}

          {job.closesAt && (
            <p className="text-xs text-gray-600">
              Applications close on {formatDate(job.closesAt)}.
            </p>
          )}
        </div>

        {/* ─── Apply form ───────────────────────────────── */}
        <div className="lg:sticky lg:top-20">
          {submitted ? (
            <SuccessCard name={form.firstName} />
          ) : isClosed ? (
            <ClosedCard />
          ) : (
            <ApplyForm
              form={form}
              cvError={cvError}
              submitting={submitting}
              onChange={handleChange}
              onFile={handleFile}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function ApplyForm({
  form,
  cvError,
  submitting,
  onChange,
  onFile,
  onSubmit,
}: {
  form: FormState;
  cvError: string | null;
  submitting: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="bg-surface-900 border border-white/5 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-6">Apply for this role</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ApplyField label="First name" required>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              required
              placeholder="Ada"
              className={inputCls}
            />
          </ApplyField>
          <ApplyField label="Last name" required>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              required
              placeholder="Okonkwo"
              className={inputCls}
            />
          </ApplyField>
        </div>

        <ApplyField label="Email" required>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="you@email.com"
            className={inputCls}
          />
        </ApplyField>

        <ApplyField label="Phone">
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+234 800 000 0000"
            className={inputCls}
          />
        </ApplyField>

        <ApplyField label="LinkedIn">
          <input
            type="url"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={onChange}
            placeholder="https://linkedin.com/in/yourprofile"
            className={inputCls}
          />
        </ApplyField>

        <ApplyField label="Portfolio / GitHub">
          <input
            type="url"
            name="portfolioUrl"
            value={form.portfolioUrl}
            onChange={onChange}
            placeholder="https://github.com/you"
            className={inputCls}
          />
        </ApplyField>

        <ApplyField label="Cover letter">
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={onChange}
            rows={4}
            placeholder="Why are you the right fit for this role?"
            className={`${inputCls} resize-y`}
          />
        </ApplyField>

        {/* CV Upload */}
        <ApplyField label="CV / Résumé" required error={cvError}>
          <label
            className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-xl px-4 py-5 cursor-pointer transition-colors ${
              form.cv
                ? "border-accent-500/40 bg-accent-500/5"
                : "border-white/10 hover:border-brand-600/40 hover:bg-brand-600/5"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={onFile}
              className="sr-only"
            />
            {form.cv ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-accent-400" />
                <p className="text-xs text-accent-400 font-medium text-center truncate max-w-full">
                  {form.cv.name}
                </p>
                <p className="text-xs text-gray-600">Click to replace</p>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 text-gray-500" />
                <p className="text-xs text-gray-400 font-medium">
                  Click to upload PDF
                </p>
                <p className="text-xs text-gray-600">Max 5 MB</p>
              </>
            )}
          </label>
        </ApplyField>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-brand-600/20 mt-2"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Submitting…" : "Submit application"}
        </button>

        <p className="text-xs text-gray-600 text-center leading-relaxed">
          Your application will be reviewed by the hiring team. You&apos;ll
          receive a confirmation email shortly.
        </p>
      </form>
    </div>
  );
}

function SuccessCard({ name }: { name: string }) {
  return (
    <div className="bg-surface-900 border border-white/5 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent-500/10 flex items-center justify-center mx-auto mb-4">
        <CheckCircle2 className="w-7 h-7 text-accent-400" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">
        Application received!
      </h2>
      <p className="text-sm text-gray-400 leading-relaxed">
        Thanks{name ? `, ${name}` : ""}! Your CV is being scored by our AI.
        You&apos;ll hear from the team soon.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
      >
        Browse more jobs
      </Link>
    </div>
  );
}

function ClosedCard() {
  return (
    <div className="bg-surface-900 border border-white/5 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-500/10 flex items-center justify-center mx-auto mb-4">
        <XCircle className="w-7 h-7 text-gray-500" />
      </div>
      <h2 className="text-lg font-bold text-white mb-2">Applications closed</h2>
      <p className="text-sm text-gray-400 leading-relaxed">
        This role is no longer accepting applications. Check back for other
        openings.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
      >
        Browse all jobs
      </Link>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Tag({
  icon,
  children,
  capitalize,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  capitalize?: boolean;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full ${
        capitalize ? "capitalize" : ""
      }`}
    >
      {icon}
      {children}
    </span>
  );
}

function ApplyField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">
        {label}
        {required && <span className="text-brand-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full bg-surface-950 border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-600/60 focus:ring-1 focus:ring-brand-600/30 transition";
