"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, BriefcaseMetal } from "@phosphor-icons/react";
import JobForm, { type JobFormValues } from "@/components/JobForm";
import { jobsApi } from "@/lib/api";
import type { Job } from "@/types";
import type { AxiosError } from "axios";

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Bone className="h-4 w-28" />
      <Bone className="h-28" />
      <Bone className="h-44" />
      <Bone className="h-64" />
    </div>
  );
}

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
        const current: Job = res.data.data?.job ?? res.data.data;
        setJob(current);
        setValues({
          title: current.title ?? "",
          description: current.description ?? "",
          requirements: current.requirements ?? "",
          responsibilities: current.responsibilities ?? "",
          location: current.location ?? "",
          type: current.type ?? "",
          salaryMin: current.salaryMin ?? "",
          salaryMax: current.salaryMax ?? "",
          salaryCurrency: current.salaryCurrency ?? "NGN",
          closesAt: current.closesAt ? current.closesAt.split("T")[0] : "",
          status:
            current.status === "active" || current.status === "draft"
              ? current.status
              : "draft",
        });
      })
      .catch(() => toast.error("Role not found."))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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

  if (fetching) return <SkeletonPage />;

  if (!job || !values) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-white/[0.07] bg-[#0d0f16] px-5 py-20 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-600">
            <BriefcaseMetal weight="duotone" size={24} />
          </div>
          <p className="text-[16px] font-bold text-white">Role not found</p>
          <p className="mt-2 text-[13px] text-slate-500">
            This role may have been deleted or you may not have access to it.
          </p>
          <Link
            href="/dashboard/jobs"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
          >
            <ArrowLeft size={14} />
            Back to roles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href={`/dashboard/jobs/${id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 transition hover:text-violet-300"
      >
        <ArrowLeft size={14} />
        Back to role
      </Link>

      <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] px-5 py-5 anim-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
          Edit role
        </p>
        <h1 className="mt-2 text-[26px] font-black tracking-tight text-white">
          {job.title}
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-6 text-slate-500">
          Update the public role details and scoring context candidates are
          evaluated against.
        </p>
      </section>

      <JobForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Save role"
        onCancel={() => router.push(`/dashboard/jobs/${id}`)}
      />
    </div>
  );
}
