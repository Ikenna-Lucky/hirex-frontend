"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  CircleNotch,
  CreditCard,
  Crown,
  Gift,
  Lightning,
  Lock,
  Rocket,
  ShieldCheck,
  Warning,
} from "@phosphor-icons/react";
import { subscriptionsApi } from "@/lib/api";
import type { SubStatus } from "@/lib/api";

type PlanKey = "starter" | "growth" | "scale";

type Plan = {
  key: PlanKey;
  name: string;
  price: string;
  tagline: string;
  icon: React.ElementType;
  highlight: boolean;
  accentColor: string;
  features: string[];
};

const PAID_PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    price: "NGN 15,000",
    tagline: "For teams that hire occasionally",
    icon: Lightning,
    highlight: false,
    accentColor: "#a78bfa",
    features: [
      "5 active job posts",
      "AI-powered CV scoring",
      "Automated candidate emails",
      "Hiring pipeline",
      "Email support",
    ],
  },
  {
    key: "growth",
    name: "Growth",
    price: "NGN 35,000",
    tagline: "For growing teams with regular needs",
    icon: Rocket,
    highlight: true,
    accentColor: "#34d399",
    features: [
      "20 active job posts",
      "AI-powered CV scoring",
      "Automated candidate emails",
      "Hiring pipeline",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    key: "scale",
    name: "Scale",
    price: "NGN 75,000",
    tagline: "Unlimited hiring for high-growth orgs",
    icon: Crown,
    highlight: false,
    accentColor: "#f59e0b",
    features: [
      "Unlimited job posts",
      "AI-powered CV scoring",
      "Automated candidate emails",
      "Hiring pipeline",
      "Advanced analytics",
      "Dedicated support",
    ],
  },
];

function LoadingState({ verifying = false }: { verifying?: boolean }) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3">
      <CircleNotch size={24} className="animate-spin text-violet-400" />
      {verifying && (
        <p className="text-[13px] text-slate-500">Verifying your payment...</p>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState<PlanKey | null>(null);
  const [verifying, setVerifying] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await subscriptionsApi.status();
      setSub(res.data.data);
    } catch {
      setSub(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const reference = searchParams.get("reference");

    if (!reference) {
      fetchStatus();
      return;
    }

    setVerifying(true);
    subscriptionsApi
      .verify(reference)
      .then(() => {
        toast.success("Subscription activated. Welcome to HireX Pro.");
        return fetchStatus();
      })
      .catch(() =>
        toast.error(
          "Payment verification failed. Contact support if you were charged.",
        ),
      )
      .finally(() => {
        setVerifying(false);
        window.history.replaceState({}, "", "/dashboard/billing");
      });
  }, [searchParams, fetchStatus]);

  async function choosePlan(plan: PlanKey) {
    setInitiating(plan);

    try {
      const res = await subscriptionsApi.initialize(plan);
      const { authorizationUrl } = res.data.data;

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        toast.error("Could not initiate payment. Please try again.");
      }
    } catch {
      toast.error("Failed to start payment. Please try again.");
    } finally {
      setInitiating(null);
    }
  }

  if (loading || verifying) return <LoadingState verifying={verifying} />;

  const isActive = sub?.isActive ?? false;
  const jobsUsed = sub?.jobsUsed ?? 0;
  const freeLimit = sub?.freeLimit ?? 1;
  const quotaLeft = sub?.quotaLeft ?? Math.max(0, freeLimit - jobsUsed);
  const quotaExhausted = sub?.quotaExhausted ?? false;
  const currentPlanKey = sub?.plan as PlanKey | null;
  const planName = sub?.planDetails?.name ?? currentPlanKey;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 anim-1 sm:flex-row sm:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Billing
          </p>
          <h1 className="mt-2 text-[26px] font-black leading-tight tracking-tight text-white">
            Plans and usage
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            {isActive
              ? `You are on the ${planName} plan.`
              : quotaExhausted
                ? "Your free role post has been used. Upgrade to keep hiring."
                : "Start with one free role post, then upgrade when hiring picks up."}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-[#0d0f16] px-3 py-2 text-[12px] font-bold text-slate-400">
          <CreditCard weight="duotone" size={15} className="text-violet-300" />
          Monthly billing
        </div>
      </div>

      {isActive && (
        <StatusBanner
          tone="success"
          title={`${planName} plan active`}
          body={
            sub?.currentPeriodEnd
              ? `Renews ${new Date(sub.currentPeriodEnd).toLocaleDateString(
                  "en-NG",
                  { day: "numeric", month: "long", year: "numeric" },
                )}.`
              : "Your workspace can keep posting roles under this plan."
          }
        />
      )}

      {!isActive && quotaExhausted && (
        <StatusBanner
          tone="warning"
          title="Free post used"
          body="Choose a plan below to post more roles and keep your hiring pipeline moving."
        />
      )}

      <section className="grid gap-3 anim-2 sm:grid-cols-3">
        <UsageCard
          label="Current plan"
          value={isActive ? (planName ?? "Paid") : "Free"}
          detail={isActive ? "Unlimited by plan limit" : "Starter access"}
        />
        <UsageCard
          label="Role posts used"
          value={`${jobsUsed}`}
          detail={isActive ? "Across this period" : `${freeLimit} free post`}
        />
        <UsageCard
          label="Posts remaining"
          value={isActive ? "Unlimited" : `${Math.max(0, quotaLeft)}`}
          detail={quotaExhausted ? "Upgrade required" : "Available now"}
        />
      </section>

      <section className="grid gap-3 anim-3 lg:grid-cols-4">
        <FreePlanCard
          jobsUsed={jobsUsed}
          freeLimit={freeLimit}
          isCurrent={!isActive}
        />
        {PAID_PLANS.map((plan) => (
          <PaidPlanCard
            key={plan.key}
            plan={plan}
            isCurrent={isActive && currentPlanKey === plan.key}
            isLoading={initiating === plan.key}
            isDisabled={!!initiating}
            onChoose={() => choosePlan(plan.key)}
          />
        ))}
      </section>

      <div className="flex flex-col gap-3 border-t border-white/[0.06] pt-4 text-[12px] text-slate-600 anim-4 sm:flex-row sm:items-center sm:justify-center">
        <span className="inline-flex items-center gap-2">
          <ShieldCheck weight="duotone" size={14} />
          Payments secured by Paystack
        </span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
        <span>All paid plans renew monthly</span>
        <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}

function StatusBanner({
  tone,
  title,
  body,
}: {
  tone: "success" | "warning";
  title: string;
  body: string;
}) {
  const success = tone === "success";

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-4 anim-2 ${
        success
          ? "border-emerald-400/20 bg-emerald-400/[0.07]"
          : "border-amber-400/20 bg-amber-400/[0.07]"
      }`}
    >
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${
          success
            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
            : "border-amber-400/20 bg-amber-400/10 text-amber-300"
        }`}
      >
        {success ? (
          <CheckCircle weight="fill" size={17} />
        ) : (
          <Warning weight="fill" size={17} />
        )}
      </div>
      <div>
        <p className="text-[14px] font-bold text-white">{title}</p>
        <p className="mt-1 text-[13px] leading-5 text-slate-500">{body}</p>
      </div>
    </div>
  );
}

function UsageCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4">
      <p className="text-[12px] font-semibold text-slate-500">{label}</p>
      <p className="mt-3 truncate text-[24px] font-black leading-none text-white">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-slate-600">{detail}</p>
    </div>
  );
}

function FreePlanCard({
  jobsUsed,
  freeLimit,
  isCurrent,
}: {
  jobsUsed: number;
  freeLimit: number;
  isCurrent: boolean;
}) {
  const used = Math.min(jobsUsed, freeLimit);
  const pct = freeLimit > 0 ? (used / freeLimit) * 100 : 0;
  const isUsed = used >= freeLimit;

  return (
    <article
      className={`flex min-h-[430px] flex-col overflow-hidden rounded-lg border bg-[#0d0f16] ${
        isCurrent ? "border-violet-400/25" : "border-white/[0.07]"
      }`}
    >
      <div
        className={`h-px ${isCurrent ? "bg-violet-400" : "bg-transparent"}`}
      />
      <div className="flex flex-1 flex-col p-5">
        <PlanHeader
          icon={<Gift weight="duotone" size={18} />}
          name="Free"
          tagline="Try before you pay"
          accent="violet"
          current={isCurrent}
        />

        <div className="mt-5">
          <span className="text-[25px] font-black text-white">NGN 0</span>
          <span className="ml-1 text-[12px] text-slate-600">/mo</span>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold text-slate-500">
              Role posts
            </span>
            <span
              className={`text-[12px] font-bold ${
                isUsed ? "text-red-300" : "text-violet-300"
              }`}
            >
              {used}/{freeLimit}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className={`h-full rounded-full transition-all ${
                isUsed ? "bg-red-400" : "bg-violet-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">
            {isUsed
              ? "Quota used. Upgrade to post more."
              : `${freeLimit - used} post remaining.`}
          </p>
        </div>

        <FeatureList
          features={[
            "1 job post lifetime",
            "AI-powered CV scoring",
            "Hiring pipeline",
            "Candidate emails",
          ]}
          mutedFirst
          accentColor="#a78bfa"
        />

        {isCurrent ? (
          <div className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-violet-400/15 bg-violet-400/10 text-[13px] font-bold text-violet-300">
            <CheckCircle weight="fill" size={14} />
            Current plan
          </div>
        ) : (
          <Link
            href="/dashboard/jobs"
            className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.045] text-[13px] font-bold text-white transition hover:bg-white/[0.07]"
          >
            <ArrowSquareOut size={14} />
            View roles
          </Link>
        )}
      </div>
    </article>
  );
}

function PaidPlanCard({
  plan,
  isCurrent,
  isLoading,
  isDisabled,
  onChoose,
}: {
  plan: Plan;
  isCurrent: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onChoose: () => void;
}) {
  const PlanIcon = plan.icon;

  return (
    <article
      className={`flex min-h-[430px] flex-col overflow-hidden rounded-lg border bg-[#0d0f16] ${
        isCurrent
          ? "border-emerald-400/25"
          : plan.highlight
            ? "border-violet-400/20"
            : "border-white/[0.07]"
      }`}
    >
      <div
        className={`h-px ${
          isCurrent
            ? "bg-emerald-400"
            : plan.highlight
              ? "bg-violet-500"
              : "bg-transparent"
        }`}
      />
      <div className="flex flex-1 flex-col p-5">
        <PlanHeader
          icon={<PlanIcon weight="duotone" size={18} />}
          name={plan.name}
          tagline={plan.tagline}
          accent={plan.highlight ? "emerald" : "violet"}
          current={isCurrent}
        />

        <div className="mt-5">
          <span className="text-[25px] font-black text-white">
            {plan.price}
          </span>
          <span className="ml-1 text-[12px] text-slate-600">/mo</span>
        </div>

        <FeatureList features={plan.features} accentColor={plan.accentColor} />

        <button
          type="button"
          onClick={onChoose}
          disabled={isCurrent || isDisabled}
          className={`mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-lg text-[13px] font-bold transition disabled:cursor-not-allowed ${
            isCurrent
              ? "border border-emerald-400/15 bg-emerald-400/10 text-emerald-300"
              : plan.highlight
                ? "bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-60"
                : "border border-white/[0.08] bg-white/[0.045] text-white hover:bg-white/[0.07] disabled:opacity-60"
          }`}
        >
          {isLoading ? (
            <>
              <CircleNotch size={14} className="animate-spin" />
              Processing
            </>
          ) : isCurrent ? (
            <>
              <CheckCircle weight="fill" size={14} />
              Current plan
            </>
          ) : (
            <>
              Upgrade
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function PlanHeader({
  icon,
  name,
  tagline,
  accent,
  current,
}: {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  accent: "violet" | "emerald";
  current: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${
            accent === "emerald"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-violet-400/20 bg-violet-400/10 text-violet-300"
          }`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold leading-tight text-white">
            {name}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-600">{tagline}</p>
        </div>
      </div>
      {current && (
        <span className="rounded-lg border border-emerald-400/15 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
          Current
        </span>
      )}
    </div>
  );
}

function FeatureList({
  features,
  accentColor,
  mutedFirst = false,
}: {
  features: string[];
  accentColor: string;
  mutedFirst?: boolean;
}) {
  return (
    <ul className="my-6 flex-1 space-y-2.5">
      {features.map((feature, index) => {
        const muted = mutedFirst && index === 0;
        return (
          <li key={feature} className="flex items-center gap-2.5">
            {muted ? (
              <Lock weight="fill" size={13} className="flex-shrink-0 text-slate-700" />
            ) : (
              <CheckCircle
                weight="fill"
                size={14}
                className="flex-shrink-0"
                style={{ color: accentColor }}
              />
            )}
            <span
              className={`text-[13px] leading-5 ${
                muted ? "text-slate-600" : "text-slate-400"
              }`}
            >
              {feature}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
