"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { CaretLeft, Sparkle } from "@phosphor-icons/react";
import { jobsApi } from "@/lib/api";
import JobForm, {
  JOB_FORM_DEFAULTS,
  type JobFormValues,
} from "@/components/JobForm";
import type { AxiosError } from "axios";

export default function NewJobPage() {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(JOB_FORM_DEFAULTS);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        title: values.title,
        description: values.description,
        status: values.status,
      };
      if (values.requirements) payload.requirements = values.requirements;
      if (values.responsibilities)
        payload.responsibilities = values.responsibilities;
      if (values.location) payload.location = values.location;
      if (values.type) payload.type = values.type;
      if (values.salaryMin) payload.salaryMin = values.salaryMin;
      if (values.salaryMax) payload.salaryMax = values.salaryMax;
      if (values.salaryCurrency) payload.salaryCurrency = values.salaryCurrency;
      if (values.closesAt) payload.closesAt = values.closesAt;

      const res = await jobsApi.create(payload);
      const job = res.data.data?.job ?? res.data.data;
      toast.success("Job posted successfully!");
      router.push(`/dashboard/jobs/${job.id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Back ── */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors anim-1"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#a78bfa";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)";
        }}
      >
        <CaretLeft weight="bold" size={14} />
        Back to roles
      </Link>

      {/* ── Hero header ── */}
      <div
        className="relative rounded-2xl overflow-hidden px-8 py-7 anim-1"
        style={{
          background:
            "linear-gradient(135deg,#0e0e1a 0%,#13102a 45%,#0e0e1a 100%)",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkle weight="fill" size={14} style={{ color: "#a78bfa" }} />
            <span
              className="text-[12px] font-semibold tracking-wide uppercase"
              style={{ color: "#a78bfa" }}
            >
              AI-Powered Screening
            </span>
          </div>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight">
            Post a new role
          </h1>
          <p
            className="text-[14px] mt-2 max-w-xl"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Your job description becomes the AI benchmark every CV is scored
            against. The more specific you are, the better the shortlist.
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="anim-2">
        <JobForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Post role"
          onCancel={() => router.push("/dashboard/jobs")}
        />
      </div>
    </div>
  );
}
