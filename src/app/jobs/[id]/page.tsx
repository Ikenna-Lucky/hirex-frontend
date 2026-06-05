"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  MapPin,
  Briefcase,
  Clock,
  Buildings,
  CircleNotch,
  UploadSimple,
  CheckCircle,
  XCircle,
  CaretLeft,
} from "@phosphor-icons/react";
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

  /* ── Loading ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0f" }}
      >
        <CircleNotch
          size={28}
          className="animate-spin"
          style={{ color: "#a78bfa" }}
        />
      </div>
    );
  }

  /* ── Not found ── */
  if (!job) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
        style={{ background: "#0a0a0f", color: "rgba(255,255,255,0.4)" }}
      >
        <XCircle size={40} style={{ color: "rgba(255,255,255,0.15)" }} />
        <p className="text-[15px] font-semibold text-white">Job not found</p>
        <Link href="/jobs" className="text-[13px]" style={{ color: "#a78bfa" }}>
          ← Browse all jobs
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0a0a0f", color: "#e5e7eb" }}
    >
      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 flex items-center gap-3 px-4 md:px-8"
        style={{
          height: "56px",
          background: "rgba(10,10,15,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link
          href="/jobs"
          className="flex items-center gap-1.5 text-[13px] font-medium transition-colors flex-shrink-0"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#fff")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.4)")
          }
        >
          <CaretLeft size={13} weight="bold" /> All jobs
        </Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
        <span
          className="text-[13px] truncate"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {job.title}
        </span>
      </nav>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* ── 2-col on large, single col on mobile ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10 items-start">
          {/* ─── Job info ─── */}
          <div className="space-y-7">
            {/* Company + title */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-[15px] font-bold text-white flex-shrink-0"
                  style={{
                    background: "rgba(124,58,237,0.15)",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  {job.company?.name?.charAt(0).toUpperCase() ?? (
                    <Buildings
                      weight="duotone"
                      size={20}
                      style={{ color: "#a78bfa" }}
                    />
                  )}
                </div>
                <div>
                  <p
                    className="text-[14px] font-semibold"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    {job.company?.name}
                  </p>
                  {job.company?.industry && (
                    <p
                      className="text-[12px]"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {job.company.industry}
                    </p>
                  )}
                </div>
              </div>

              <h1 className="text-[22px] md:text-[28px] font-bold text-white mb-4 leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-2">
                {job.location && (
                  <Tag>
                    <MapPin weight="duotone" size={12} /> {job.location}
                  </Tag>
                )}
                {job.type && (
                  <Tag className="capitalize">
                    <Briefcase weight="duotone" size={12} />{" "}
                    {job.type.replace("-", " ")}
                  </Tag>
                )}
                <Tag>
                  <Clock weight="duotone" size={12} /> Posted{" "}
                  {formatDate(job.createdAt)}
                </Tag>
                {isClosed && (
                  <span
                    className="flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full"
                    style={{
                      color: "#f87171",
                      background: "rgba(248,113,113,0.1)",
                      border: "1px solid rgba(248,113,113,0.2)",
                    }}
                  >
                    <XCircle size={12} /> Applications closed
                  </span>
                )}
              </div>
            </div>

            {/* Salary */}
            {(job.salaryMin || job.salaryMax) && (
              <div
                className="p-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p
                  className="text-[11px] mb-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Compensation
                </p>
                <p className="text-[15px] font-semibold text-white">
                  {job.salaryCurrency}{" "}
                  {job.salaryMin && job.salaryMax
                    ? `${Number(job.salaryMin).toLocaleString()} – ${Number(job.salaryMax).toLocaleString()}`
                    : job.salaryMin
                      ? `from ${Number(job.salaryMin).toLocaleString()}`
                      : `up to ${Number(job.salaryMax).toLocaleString()}`}
                  <span
                    className="text-[13px] font-normal"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {" "}
                    /month
                  </span>
                </p>
              </div>
            )}

            {/* Description */}
            <Section title="About this role">
              <p
                className="text-[14px] leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {job.description}
              </p>
            </Section>

            {job.responsibilities && (
              <Section title="Responsibilities">
                <p
                  className="text-[14px] leading-relaxed whitespace-pre-line"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {job.responsibilities}
                </p>
              </Section>
            )}

            {job.requirements && (
              <Section title="Requirements">
                <p
                  className="text-[14px] leading-relaxed whitespace-pre-line"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {job.requirements}
                </p>
              </Section>
            )}

            {job.closesAt && (
              <p
                className="text-[12px]"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Applications close on {formatDate(job.closesAt)}.
              </p>
            )}
          </div>

          {/* ─── Apply form — sticky on large screens ─── */}
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
    </div>
  );
}

/* ── Apply form ──────────────────────────────────────────── */
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
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#fff",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div
      className="rounded-2xl p-5 md:p-6"
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <h2 className="text-[17px] font-bold text-white mb-5">
        Apply for this role
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" required>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              required
              placeholder="Ada"
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(124,58,237,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </Field>
          <Field label="Last name" required>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              required
              placeholder="Okonkwo"
              style={inputStyle}
              onFocus={(e) =>
                (e.target.style.borderColor = "rgba(124,58,237,0.5)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </Field>
        </div>

        <Field label="Email" required>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            placeholder="you@email.com"
            style={inputStyle}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(124,58,237,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </Field>

        <Field label="Phone">
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={onChange}
            placeholder="+234 800 000 0000"
            style={inputStyle}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(124,58,237,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </Field>

        <Field label="LinkedIn URL">
          <input
            type="url"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={onChange}
            placeholder="https://linkedin.com/in/you"
            style={inputStyle}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(124,58,237,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </Field>

        <Field label="Portfolio / GitHub">
          <input
            type="url"
            name="portfolioUrl"
            value={form.portfolioUrl}
            onChange={onChange}
            placeholder="https://github.com/you"
            style={inputStyle}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(124,58,237,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </Field>

        <Field label="Cover letter">
          <textarea
            name="coverLetter"
            value={form.coverLetter}
            onChange={onChange}
            rows={4}
            placeholder="Why are you the right fit for this role?"
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(124,58,237,0.5)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </Field>

        {/* CV upload */}
        <Field label="CV / Résumé (PDF)" required error={cvError}>
          <label
            className="flex flex-col items-center gap-2 rounded-xl cursor-pointer transition-all"
            style={{
              padding: "20px 16px",
              border: `2px dashed ${form.cv ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
              background: form.cv
                ? "rgba(52,211,153,0.04)"
                : "rgba(255,255,255,0.02)",
            }}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={onFile}
              className="sr-only"
            />
            {form.cv ? (
              <>
                <CheckCircle
                  weight="fill"
                  size={20}
                  style={{ color: "#34d399" }}
                />
                <p
                  className="text-[12px] font-medium text-center truncate max-w-full"
                  style={{ color: "#34d399" }}
                >
                  {form.cv.name}
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  Click to replace
                </p>
              </>
            ) : (
              <>
                <UploadSimple
                  size={20}
                  style={{ color: "rgba(255,255,255,0.3)" }}
                />
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  Click to upload PDF
                </p>
                <p
                  className="text-[11px]"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  Max 5 MB
                </p>
              </>
            )}
          </label>
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
          }}
        >
          {submitting && <CircleNotch size={16} className="animate-spin" />}
          {submitting ? "Submitting…" : "Submit application"}
        </button>

        <p
          className="text-[11px] text-center"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Your application will be reviewed by the hiring team.
        </p>
      </form>
    </div>
  );
}

/* ── Success card ────────────────────────────────────────── */
function SuccessCard({ name }: { name: string }) {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{
        background: "#111118",
        border: "1px solid rgba(52,211,153,0.15)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: "rgba(52,211,153,0.1)",
          border: "1px solid rgba(52,211,153,0.2)",
        }}
      >
        <CheckCircle weight="fill" size={26} style={{ color: "#34d399" }} />
      </div>
      <h2 className="text-[18px] font-bold text-white mb-2">
        Application received!
      </h2>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        Thanks{name ? `, ${name}` : ""}! Your CV is being scored by our AI.
        You'll hear from the team soon.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 mt-6 text-[13px] font-semibold"
        style={{ color: "#a78bfa" }}
      >
        Browse more jobs →
      </Link>
    </div>
  );
}

/* ── Closed card ─────────────────────────────────────────── */
function ClosedCard() {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <XCircle size={26} style={{ color: "rgba(255,255,255,0.3)" }} />
      </div>
      <h2 className="text-[18px] font-bold text-white mb-2">
        Applications closed
      </h2>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        This role is no longer accepting applications. Check back for other
        openings.
      </p>
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 mt-6 text-[13px] font-semibold"
        style={{ color: "#a78bfa" }}
      >
        Browse all jobs →
      </Link>
    </div>
  );
}

/* ── Section ─────────────────────────────────────────────── */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-white mb-3">{title}</h3>
      {children}
    </div>
  );
}

/* ── Tag ─────────────────────────────────────────────────── */
function Tag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full ${className ?? ""}`}
      style={{
        color: "rgba(255,255,255,0.4)",
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {children}
    </span>
  );
}

/* ── Field ───────────────────────────────────────────────── */
function Field({
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
      <label
        className="block text-[12px] font-medium mb-1.5"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        {label}
        {required && <span style={{ color: "#a78bfa", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px]" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}
    </div>
  );
}
