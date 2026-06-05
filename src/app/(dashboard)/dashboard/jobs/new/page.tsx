"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CaretLeft,
  Sparkle,
  Lock,
  Lightning,
  Rocket,
  Crown,
  ArrowRight,
  CircleNotch,
} from "@phosphor-icons/react";
import { jobsApi, subscriptionsApi } from "@/lib/api";
import type { SubStatus } from "@/lib/api";
import JobForm, {
  JOB_FORM_DEFAULTS,
  type JobFormValues,
} from "@/components/JobForm";
import type { AxiosError } from "axios";

/* ── Loading skeleton ─────────────────────────────────── */
function Bone({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

/* ── Upgrade wall ─────────────────────────────────────── */
const UPGRADE_PLANS = [
  {
    key: "starter",
    name: "Starter",
    price: "₦15,000",
    jobs: "5 posts",
    icon: Lightning,
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  },
  {
    key: "growth",
    name: "Growth",
    price: "₦35,000",
    jobs: "20 posts",
    icon: Rocket,
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    highlight: true,
  },
  {
    key: "scale",
    name: "Scale",
    price: "₦75,000",
    jobs: "Unlimited",
    icon: Crown,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
  },
];

function UpgradeWall({
  onChoose,
  choosing,
}: {
  onChoose: (plan: string) => void;
  choosing: string | null;
}) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium anim-1"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)")
        }
      >
        <CaretLeft weight="bold" size={14} />
        Back to roles
      </Link>

      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden px-8 py-8 anim-1 text-center"
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
          {/* Lock icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background:
                "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(109,40,217,0.2))",
              border: "1px solid rgba(124,58,237,0.35)",
              boxShadow: "0 0 24px rgba(124,58,237,0.3)",
            }}
          >
            <Lock weight="duotone" size={26} style={{ color: "#a78bfa" }} />
          </div>

          <h2 className="text-[24px] font-extrabold text-white tracking-tight mb-2">
            You've used your free post
          </h2>
          <p
            className="text-[15px] max-w-md mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Your free plan includes 1 role post. Upgrade to keep building your
            team — all plans include full AI-powered CV scoring.
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid sm:grid-cols-3 gap-4 anim-2">
        {UPGRADE_PLANS.map((plan) => {
          const PlanIcon = plan.icon;
          const isLoading = choosing === plan.key;

          return (
            <div
              key={plan.key}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "#111118",
                border: plan.highlight
                  ? `1px solid ${plan.border}`
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: plan.highlight ? `0 0 32px ${plan.bg}` : "none",
              }}
            >
              <div
                className="h-0.5"
                style={{
                  background: plan.highlight
                    ? `linear-gradient(90deg,${plan.color},transparent)`
                    : "transparent",
                }}
              />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: plan.bg,
                      border: `1px solid ${plan.border}`,
                    }}
                  >
                    <PlanIcon
                      weight="duotone"
                      size={16}
                      style={{ color: plan.color }}
                    />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white leading-none">
                      {plan.name}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {plan.jobs}/mo
                    </p>
                  </div>
                </div>

                <div className="mb-5 flex-1">
                  <span className="text-[22px] font-extrabold text-white">
                    {plan.price}
                  </span>
                  <span
                    className="text-[11px] ml-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    /mo
                  </span>
                </div>

                <button
                  onClick={() => !choosing && onChoose(plan.key)}
                  disabled={!!choosing}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={
                    plan.highlight
                      ? {
                          background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`,
                          boxShadow: `0 4px 16px ${plan.bg}`,
                        }
                      : {
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }
                  }
                >
                  {isLoading ? (
                    <>
                      <CircleNotch size={13} className="animate-spin" />{" "}
                      Processing…
                    </>
                  ) : (
                    <>
                      Upgrade to {plan.name} <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p
        className="text-center text-[12px] anim-3"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        Payments secured by Paystack · Monthly billing · Cancel anytime
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function NewJobPage() {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(JOB_FORM_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [choosing, setChoosing] = useState<string | null>(null);

  /* Check quota on mount */
  useEffect(() => {
    subscriptionsApi
      .status()
      .then((res) => setSub(res.data.data))
      .catch(() => {
        /* assume allowed on error */
      })
      .finally(() => setChecking(false));
  }, []);

  /* Initiate Paystack checkout from the upgrade wall */
  const handleChoosePlan = async (plan: string) => {
    setChoosing(plan);
    try {
      const res = await subscriptionsApi.initialize(
        plan as "starter" | "growth" | "scale",
      );
      const { authorizationUrl } = res.data.data;
      if (authorizationUrl) window.location.href = authorizationUrl;
      else toast.error("Could not initiate payment. Please try again.");
    } catch {
      toast.error("Failed to start payment. Please try again.");
    } finally {
      setChoosing(null);
    }
  };

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
      toast.success("Role posted!");
      router.push(`/dashboard/jobs/${job.id}`);
    } catch (err) {
      const error = err as AxiosError<{ message?: string; code?: string }>;
      const code = error.response?.data?.code;
      if (code === "FREE_QUOTA_EXHAUSTED") {
        // Refresh quota state and show the wall
        const fresh = await subscriptionsApi.status().catch(() => null);
        if (fresh) setSub(fresh.data.data);
        setChecking(false);
      } else {
        toast.error(error.response?.data?.message ?? "Failed to create role.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (checking) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <Bone style={{ width: 120, height: 14 }} />
        <div
          className="rounded-2xl p-8"
          style={{
            background: "#0e0e1a",
            border: "1px solid rgba(124,58,237,0.12)",
          }}
        >
          <Bone style={{ width: 200, height: 28, marginBottom: 12 }} />
          <Bone style={{ width: "70%", height: 16 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="px-6 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <Bone style={{ width: 140, height: 14 }} />
            </div>
            <div className="p-6 space-y-4">
              <Bone style={{ width: "100%", height: 44 }} />
              <Bone style={{ width: "100%", height: 120 }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Upgrade wall ── */
  if (sub?.quotaExhausted) {
    return <UpgradeWall onChoose={handleChoosePlan} choosing={choosing} />;
  }

  /* ── Normal form ── */
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors anim-1"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)")
        }
      >
        <CaretLeft weight="bold" size={14} />
        Back to roles
      </Link>

      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden px-5 py-5 md:px-8 md:py-7 anim-1"
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
          {/* Free post indicator */}
          {!sub?.isActive && (
            <div
              className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-xl text-[12px] font-medium"
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.2)",
                color: "#a78bfa",
              }}
            >
              <Sparkle weight="fill" size={11} />
              Using your 1 free role post · Upgrade anytime for unlimited
            </div>
          )}
        </div>
      </div>

      {/* Form */}
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
