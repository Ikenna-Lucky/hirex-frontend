"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Loader2,
  Zap,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { subscriptionsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type PlanKey = "starter" | "growth" | "scale";

type SubStatus = {
  status: "active" | "inactive" | "expired" | null;
  plan: PlanKey | null;
  endsAt: string | null;
};

const PLANS: {
  key: PlanKey;
  name: string;
  price: string;
  priceRaw: number;
  tagline: string;
  jobLimit: string;
  features: string[];
  highlight: boolean;
}[] = [
  {
    key: "starter",
    name: "Starter",
    price: "₦15,000",
    priceRaw: 15000,
    tagline: "For teams that hire occasionally",
    jobLimit: "5 active job posts",
    features: [
      "5 active job posts",
      "AI CV scoring",
      "Email notifications",
      "Hiring pipeline",
      "Email support",
    ],
    highlight: false,
  },
  {
    key: "growth",
    name: "Growth",
    price: "₦35,000",
    priceRaw: 35000,
    tagline: "For growing teams with regular needs",
    jobLimit: "20 active job posts",
    features: [
      "20 active job posts",
      "AI CV scoring",
      "Email notifications",
      "Hiring pipeline",
      "Advanced analytics",
      "Priority support",
    ],
    highlight: true,
  },
  {
    key: "scale",
    name: "Scale",
    price: "₦75,000",
    priceRaw: 75000,
    tagline: "Unlimited hiring for high-growth orgs",
    jobLimit: "Unlimited job posts",
    features: [
      "Unlimited job posts",
      "AI CV scoring",
      "Email notifications",
      "Hiring pipeline",
      "Advanced analytics",
      "Dedicated support",
    ],
    highlight: false,
  },
];

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}

function BillingContent() {
  const searchParams = useSearchParams();
  const [sub, setSub] = useState<SubStatus>({
    status: null,
    plan: null,
    endsAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState<PlanKey | null>(null);
  const [verifying, setVerifying] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await subscriptionsApi.status();
      const d = res.data.data;
      setSub({
        status: d?.status ?? null,
        plan: d?.plan ?? null,
        endsAt: d?.endsAt ?? null,
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // Check for Paystack callback reference on mount
  useEffect(() => {
    const reference = searchParams.get("reference");
    if (reference) {
      setVerifying(true);
      subscriptionsApi
        .verify(reference)
        .then(() => {
          toast.success("Subscription activated! Welcome to HireX.");
          return fetchStatus();
        })
        .catch(() =>
          toast.error(
            "Payment verification failed. Contact support if you were charged.",
          ),
        )
        .finally(() => setVerifying(false));
      // Clean URL without reload
      window.history.replaceState({}, "", "/dashboard/billing");
    } else {
      fetchStatus();
    }
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

  if (loading || verifying) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
        {verifying && (
          <p className="text-sm text-gray-500">Verifying your payment…</p>
        )}
      </div>
    );
  }

  const isActive = sub.status === "active";

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your HireX subscription.
        </p>
      </div>

      {/* Current status banner */}
      {isActive ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-accent-500/5 border border-accent-500/20 text-accent-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {PLANS.find((p) => p.key === sub.plan)?.name ?? sub.plan} plan —
              active
            </p>
            {sub.endsAt && (
              <p className="text-xs text-accent-400/70 mt-0.5">
                Renews {formatDate(sub.endsAt)}
              </p>
            )}
          </div>
          <CreditCard className="w-4 h-4 shrink-0 text-accent-400/50" />
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">No active subscription</p>
            <p className="text-xs text-amber-500/70 mt-0.5">
              Choose a plan below to start posting jobs and scoring CVs.
            </p>
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const isCurrent = isActive && sub.plan === plan.key;
          const isLoading = initiating === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative flex flex-col p-6 rounded-2xl border transition-all ${
                plan.highlight
                  ? "bg-brand-600/5 border-brand-600/40 shadow-lg shadow-brand-600/5"
                  : "bg-surface-900 border-white/5"
              } ${isCurrent ? "ring-2 ring-accent-500/40" : ""}`}
            >
              {plan.highlight && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Current plan
                </div>
              )}

              <div className="mb-5">
                <h3 className="font-bold text-lg text-white mb-0.5">
                  {plan.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{plan.tagline}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isCurrent && choosePlan(plan.key)}
                disabled={isCurrent || isLoading || initiating !== null}
                className={`w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all disabled:cursor-not-allowed ${
                  isCurrent
                    ? "bg-accent-500/10 text-accent-400 border border-accent-500/20 cursor-default"
                    : plan.highlight
                      ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/20 disabled:opacity-60"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10 disabled:opacity-60"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                  </>
                ) : isCurrent ? (
                  "Current plan"
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" /> Choose {plan.name}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Fine print */}
      <p className="text-xs text-gray-600 text-center">
        Payments are processed securely via Paystack. All plans renew monthly.
        Cancel anytime by contacting support.
      </p>
    </div>
  );
}
