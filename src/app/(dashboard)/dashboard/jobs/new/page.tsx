"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";
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
      toast.success("Job posted!");
      router.push(`/dashboard/jobs/${job.id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to create job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-5"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to jobs
        </Link>
        <h1 className="text-2xl font-bold text-white">Post a new job</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your job description becomes the AI benchmark every CV is scored
          against — be specific.
        </p>
      </div>

      <div className="bg-surface-900 border border-white/5 rounded-2xl p-7">
        <JobForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Post job"
          onCancel={() => router.push("/dashboard/jobs")}
        />
      </div>
    </div>
  );
}
