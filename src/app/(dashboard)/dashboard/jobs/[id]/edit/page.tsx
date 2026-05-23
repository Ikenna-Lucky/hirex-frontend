"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft, Loader2 } from "lucide-react";
import { jobsApi } from "@/lib/api";
import JobForm, { type JobFormValues } from "@/components/JobForm";
import type { Job } from "@/types";
import type { AxiosError } from "axios";

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
      .catch(() => toast.error("Job not found."))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values) return;
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
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
      };
      await jobsApi.update(id, payload);
      toast.success("Job updated.");
      router.push(`/dashboard/jobs/${id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to update job.");
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

  if (!job || !values) {
    return (
      <div className="text-center py-20 text-gray-500">Job not found.</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      <div>
        <Link
          href={`/dashboard/jobs/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-5"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to pipeline
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit job</h1>
        <p className="text-sm text-gray-500 mt-1 truncate">{job.title}</p>
      </div>

      <div className="bg-surface-900 border border-white/5 rounded-2xl p-7">
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
