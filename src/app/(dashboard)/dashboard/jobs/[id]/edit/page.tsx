"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, PencilSimple, BriefcaseMetal } from "@phosphor-icons/react";
import { jobsApi } from "@/lib/api";
import JobForm, { type JobFormValues } from "@/components/JobForm";
import type { Job } from "@/types";
import type { AxiosError } from "axios";

/* ════════════════════════════════════════════════════════════
   SKELETON
════════════════════════════════════════════════════════════ */
function Bone({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back link skeleton */}
      <Bone style={{ width: 120, height: 14 }} />

      {/* Hero skeleton */}
      <div
        className="rounded-2xl p-7 flex items-center gap-5"
        style={{
          background: "#0e0e1a",
          border: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <Bone
          style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }}
        />
        <div className="flex-1 space-y-2.5">
          <Bone style={{ width: 200, height: 24 }} />
          <Bone style={{ width: 280, height: 14 }} />
        </div>
      </div>

      {/* Form sections */}
      {[6, 4, 4, 3, 2, 1].map((_, ci) => (
        <div
          key={ci}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="flex items-center gap-3 px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Bone style={{ width: 28, height: 28, borderRadius: 8 }} />
            <Bone style={{ width: 140, height: 14 }} />
          </div>
          <div className="p-6 space-y-4">
            <Bone style={{ width: "100%", height: 44 }} />
            {ci < 2 && <Bone style={{ width: "100%", height: 120 }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [values, setValues] = useState<JobFormValues | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    jobsApi
      .get(id)
      .then((res) => {
        const j: Job = res.data.data?.job ?? res.data.data;
        setJob(j);
        setValues({
          title: j.title ?? "",
          description: j.description ?? "",
          requirements: j.requirements ?? "",
          responsibilities: j.responsibilities ?? "",
          location: j.location ?? "",
          type: j.type ?? "",
          salaryMin: j.salaryMin ?? "",
          salaryMax: j.salaryMax ?? "",
          salaryCurrency: j.salaryCurrency ?? "NGN",
          closesAt: j.closesAt ? j.closesAt.split("T")[0] : "",
          status:
            j.status === "active" || j.status === "draft" ? j.status : "draft",
        });
      })
      .catch(() => toast.error("Role not found."))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values) return;
    setLoading(true);
    try {
      await jobsApi.update(id, {
        title: values.title,
        description: values.description,
        requirements: values.requirements || null,
        responsibilities: values.responsibilities || null,
        location: values.location || null,
        type: values.type || null,
        salaryMin: values.salaryMin || null,
        salaryMax: values.salaryMax || null,
        salaryCurrency: values.salaryCurrency,
        closesAt: values.closesAt || null,
        status: values.status,
      });
      toast.success("Role updated.");
      router.push(`/dashboard/jobs/${id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to update role.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (fetching) return <SkeletonPage />;

  /* ── Not found ── */
  if (!job || !values) {
    return (
      <div className="max-w-3xl mx-auto">
        <div
          className="rounded-2xl p-16 text-center"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <BriefcaseMetal
            weight="duotone"
            size={48}
            style={{ color: "rgba(255,255,255,0.15)", margin: "0 auto 16px" }}
          />
          <p className="text-[16px] font-semibold text-white mb-1">
            Role not found
          </p>
          <p
            className="text-[13px] mb-6"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            This role may have been deleted or you don't have access to it.
          </p>
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{
              background: "rgba(124,58,237,0.2)",
              border: "1px solid rgba(124,58,237,0.3)",
            }}
          >
            <ArrowLeft size={14} />
            Back to roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ── Back link ── */}
      <Link
        href={`/dashboard/jobs/${id}`}
        className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors anim-1"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.75)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)")
        }
      >
        <ArrowLeft size={14} />
        Back to role
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
        {/* Orb */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)",
          }}
        />

        <div className="relative flex items-center gap-5">
          {/* Icon badge */}
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(109,40,217,0.2))",
              border: "1px solid rgba(124,58,237,0.35)",
              boxShadow: "0 0 20px rgba(124,58,237,0.25)",
            }}
          >
            <PencilSimple
              weight="duotone"
              size={22}
              style={{ color: "#a78bfa" }}
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-[22px] font-extrabold text-white tracking-tight leading-none">
                Edit role
              </h1>
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  color: "#a78bfa",
                  background: "rgba(124,58,237,0.15)",
                  border: "1px solid rgba(124,58,237,0.25)",
                }}
              >
                {values.status === "active" ? "Active" : "Draft"}
              </span>
            </div>
            <p
              className="text-[14px] font-medium truncate"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {job.title}
            </p>
          </div>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="anim-2">
        <JobForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Save changes"
          onCancel={() => router.push(`/dashboard/jobs/${id}`)}
        />
      </div>
    </div>
  );
}
