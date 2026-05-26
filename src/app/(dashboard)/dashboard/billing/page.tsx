"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Loader2,
  Zap,
  CreditCard,
  AlertTriangle,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { subscriptionsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";

type PlanKey = "starter" | "growth" | "scale";
type SubStatus = {
  status: "active" | "inactive" | "expired" | null;
  plan: PlanKey | null;
  endsAt: string | null;
};

const PLANS = [
  {
    key: "starter" as PlanKey,
    name: "Starter",
    price: "₦15,000",
    tagline: "For teams that hire occasionally",
    features: [
      "5 active job posts",
      "AI CV scoring",
      "Email notifications",
      "Hiring pipeline",
      "Email support",
    ],
    highlight: false,
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.12)",
  },
  {
    key: "growth" as PlanKey,
    name: "Growth",
    price: "₦35,000",
    tagline: "For growing teams with regular needs",
    features: [
      "20 active job posts",
      "AI CV scoring",
      "Email notifications",
      "Hiring pipeline",
      "Advanced analytics",
      "Priority support",
    ],
    highlight: true,
    color: "#34d399",
    glow: "rgba(52,211,153,0.12)",
  },
  {
    key: "scale" as PlanKey,
    name: "Scale",
    price: "₦75,000",
    tagline: "Unlimited hiring for high-growth orgs",
    features: [
      "Unlimited job posts",
      "AI CV scoring",
      "Email notifications",
      "Hiring pipeline",
      "Advanced analytics",
      "Dedicated support",
    ],
    highlight: false,
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.12)",
  },
];

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "#8b5cf6" }}
          />
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
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

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
      if (authorizationUrl) window.location.href = authorizationUrl;
      else toast.error("Could not initiate payment. Please try again.");
    } catch {
      toast.error("Failed to start payment. Please try again.");
    } finally {
      setInitiating(null);
    }
  }

  if (loading || verifying) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#8b5cf6" }}
        />
        {verifying && (
          <p
            className="text-[13px]"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Verifying your payment…
          </p>
        )}
      </div>
    );
  }

  const isActive = sub.status === "active";
  const currentPlan = PLANS.find((p) => p.key === sub.plan);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-bold text-white tracking-tight">
          Billing
        </h1>
        <p
          className="text-[17px] mt-1.5"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Manage your HireX subscription and plan.
        </p>
      </div>

      {/* Current status card */}
      {isActive ? (
        <div
          className="flex items-center gap-4 p-5 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(52,211,153,0.07) 0%, rgba(16,185,129,0.04) 100%)",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <CheckCircle2 className="w-5 h-5" style={{ color: "#34d399" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold" style={{ color: "#34d399" }}>
              {currentPlan?.name ?? sub.plan} plan — Active
            </p>
            {sub.endsAt && (
              <p
                className="text-[13px] mt-0.5"
                style={{ color: "rgba(52,211,153,0.6)" }}
              >
                Renews {formatDate(sub.endsAt)}
              </p>
            )}
          </div>
          <CreditCard
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "rgba(52,211,153,0.4)" }}
          />
        </div>
      ) : (
        <div
          className="flex items-center gap-4 p-5 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.07) 0%, rgba(234,88,12,0.04) 100%)",
            border: "1px solid rgba(245,158,11,0.2)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <AlertTriangle className="w-5 h-5" style={{ color: "#fbbf24" }} />
          </div>
          <div>
            <p className="text-[15px] font-bold" style={{ color: "#fbbf24" }}>
              No active subscription
            </p>
            <p
              className="text-[13px] mt-0.5"
              style={{ color: "rgba(251,191,36,0.6)" }}
            >
              Choose a plan below to start posting jobs and scoring CVs with AI.
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
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#0c0c20",
                border: isCurrent
                  ? "1px solid rgba(52,211,153,0.35)"
                  : plan.highlight
                    ? "1px solid rgba(139,92,246,0.3)"
                    : "1px solid rgba(255,255,255,0.06)",
                boxShadow: plan.highlight ? `0 0 40px ${plan.glow}` : "none",
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1"
                style={{
                  background: isCurrent
                    ? "linear-gradient(90deg, #34d399, #10b981)"
                    : plan.highlight
                      ? "linear-gradient(90deg, #7c3aed, #a78bfa)"
                      : "transparent",
                }}
              />

              {/* Badge */}
              {plan.highlight && !isCurrent && (
                <div
                  className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: "rgba(124,58,237,0.15)",
                    color: "#a78bfa",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" /> Popular
                </div>
              )}
              {isCurrent && (
                <div
                  className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: "rgba(52,211,153,0.12)",
                    color: "#34d399",
                    border: "1px solid rgba(52,211,153,0.25)",
                  }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" /> Current
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Plan name + tagline */}
                <div className="mb-5">
                  <h3 className="text-[17px] font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p
                    className="text-[13px]"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {plan.tagline}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <span
                    className="text-[2.2rem] font-bold"
                    style={{ color: plan.highlight ? "#a78bfa" : "white" }}
                  >
                    {plan.price}
                  </span>
                  <span
                    className="text-[13px] ml-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    /month
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: plan.highlight
                            ? "rgba(124,58,237,0.15)"
                            : "rgba(52,211,153,0.1)",
                        }}
                      >
                        <CheckCircle2
                          className="w-2.5 h-2.5"
                          style={{
                            color: plan.highlight ? "#a78bfa" : "#34d399",
                          }}
                        />
                      </div>
                      <span
                        className="text-[14px]"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() =>
                    !isCurrent && !initiating && choosePlan(plan.key)
                  }
                  disabled={isCurrent || isLoading || initiating !== null}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[15px] font-semibold text-white transition-all disabled:cursor-not-allowed"
                  style={
                    isCurrent
                      ? {
                          backgroundColor: "rgba(52,211,153,0.1)",
                          border: "1px solid rgba(52,211,153,0.2)",
                          color: "#34d399",
                        }
                      : plan.highlight
                        ? {
                            background:
                              "linear-gradient(135deg, #7c3aed, #5b21b6)",
                            boxShadow: "0 4px 20px rgba(124,58,237,0.3)",
                            opacity: initiating ? 0.6 : 1,
                          }
                        : {
                            backgroundColor: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            opacity: initiating ? 0.6 : 1,
                          }
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />{" "}
                      Processing…
                    </>
                  ) : isCurrent ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Current plan
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" /> Choose {plan.name}{" "}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security note */}
      <div
        className="flex items-center justify-center gap-2"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        <Shield className="w-3.5 h-3.5" />
        <p className="text-[13px]">
          Payments secured by Paystack · All plans renew monthly · Cancel
          anytime
        </p>
      </div>
    </div>
  );
}
