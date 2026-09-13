"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  CaretLeft,
  CircleNotch,
  Crown,
  Lightning,
  Lock,
  Rocket,
  Sparkle,
} from "@phosphor-icons/react";
import JobForm, {
  JOB_FORM_DEFAULTS,
  type JobFormValues,
} from "@/components/JobForm";
import { jobsApi, subscriptionsApi } from "@/lib/api";
import type { SubStatus } from "@/lib/api";
import type { AxiosError } from "axios";

const UPGRADE_PLANS = [
  { key: "starter", name: "Starter", price: "NGN 15,000", jobs: "5 posts", icon: Lightning },
  { key: "growth", name: "Growth", price: "NGN 35,000", jobs: "20 posts", icon: Rocket },
  { key: "scale", name: "Scale", price: "NGN 75,000", jobs: "Unlimited", icon: Crown },
];

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

function LoadingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Bone className="h-4 w-28" />
      <Bone className="h-32" />
      <Bone className="h-44" />
      <Bone className="h-64" />
    </div>
  );
}

function UpgradeWall({
  choosing,
  onChoose,
}: {
  choosing: string | null;
  onChoose: (plan: string) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 transition hover:text-violet-300"
      >
        <CaretLeft weight="bold" size={14} />
        Back to roles
      </Link>

      <section className="rounded-lg border border-amber-400/20 bg-[#0d0f16] px-6 py-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-300">
          <Lock weight="duotone" size={24} />
        </div>
        <h1 className="text-[26px] font-black tracking-tight text-white">
          Your free post has been used
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-[14px] leading-6 text-slate-500">
          Upgrade to post more roles. Every paid plan keeps AI scoring,
          candidate profiles, and pipeline tracking active.
        </p>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        {UPGRADE_PLANS.map((plan) => {
          const Icon = plan.icon;
          const loading = choosing === plan.key;

          return (
            <article
              key={plan.key}
              className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
                  <Icon weight="duotone" size={18} />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-white">{plan.name}</p>
                  <p className="text-[11px] text-slate-600">{plan.jobs}/mo</p>
                </div>
              </div>
              <p className="mt-5 text-[24px] font-black text-white">
                {plan.price}
                <span className="ml-1 text-[12px] text-slate-600">/mo</span>
              </p>
              <button
                type="button"
                onClick={() => onChoose(plan.key)}
                disabled={!!choosing}
                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-[13px] font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <CircleNotch size={14} className="animate-spin" />
                ) : (
                  <ArrowRight size={14} />
                )}
                {loading ? "Processing" : `Upgrade to ${plan.name}`}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function NewJobPage() {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(JOB_FORM_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [choosing, setChoosing] = useState<string | null>(null);

  useEffect(() => {
    subscriptionsApi
      .status()
      .then((res) => setSub(res.data.data))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const handleChoosePlan = async (plan: string) => {
    setChoosing(plan);
    try {
      const res = await subscriptionsApi.initialize(plan);
      const { authorizationUrl } = res.data.data;
      if (authorizationUrl) window.location.href = authorizationUrl;
      else toast.error("Could not initiate payment. Please try again.");
    } catch {
      toast.error("Failed to start payment. Please try again.");
    } finally {
      setChoosing(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        title: values.title,
        description: values.description,
        status: values.status,
      };
      if (values.requirements) payload.requirements = values.requirements;
      if (values.responsibilities) payload.responsibilities = values.responsibilities;
      if (values.location) payload.location = values.location;
      if (values.type) payload.type = values.type;
      if (values.salaryMin) payload.salaryMin = values.salaryMin;
      if (values.salaryMax) payload.salaryMax = values.salaryMax;
      if (values.salaryCurrency) payload.salaryCurrency = values.salaryCurrency;
      if (values.closesAt) payload.closesAt = values.closesAt;

      const res = await jobsApi.create(payload);
      const job = res.data.data?.job ?? res.data.data;
      toast.success("Role posted.");
      router.push(`/dashboard/jobs/${job.id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string; code?: string }>;
      if (error.response?.data?.code === "FREE_QUOTA_EXHAUSTED") {
        const fresh = await subscriptionsApi.status().catch(() => null);
        if (fresh) setSub(fresh.data.data);
      } else {
        toast.error(error.response?.data?.message ?? "Failed to create role.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <LoadingPage />;
  if (sub?.quotaExhausted) {
    return <UpgradeWall choosing={choosing} onChoose={handleChoosePlan} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 transition hover:text-violet-300"
      >
        <CaretLeft weight="bold" size={14} />
        Back to roles
      </Link>

      <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] px-5 py-5 anim-1">
        <div className="mb-2 flex items-center gap-2 text-violet-300">
          <Sparkle weight="fill" size={14} />
          <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
            AI-powered screening
          </span>
        </div>
        <h1 className="text-[26px] font-black tracking-tight text-white">
          Post a new role
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-6 text-slate-500">
          Your role description becomes the benchmark every CV is scored
          against. Clear details create a cleaner shortlist.
        </p>
        {!sub?.isActive && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[12px] font-bold text-violet-200">
            <Sparkle weight="fill" size={12} />
            Using your free role post
          </div>
        )}
      </section>

      <JobForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Post role"
        onCancel={() => router.push("/dashboard/jobs")}
      />
    </div>
  );
}
