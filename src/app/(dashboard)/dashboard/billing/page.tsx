"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CheckCircle,
  CircleNotch,
  Lightning,
  CreditCard,
  Warning,
  ShieldCheck,
  ArrowRight,
  Sparkle,
  Rocket,
  Crown,
  Lock,
  Gift,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { subscriptionsApi } from "@/lib/api";
import type { SubStatus } from "@/lib/api";

type PlanKey = "starter" | "growth" | "scale";

const PAID_PLANS = [
  {
    key: "starter" as PlanKey,
    name: "Starter",
    price: "₦15,000",
    priceNum: 15000,
    tagline: "For teams that hire occasionally",
    icon: Lightning,
    highlight: false,
    accentColor: "#a78bfa",
    accentBg: "rgba(167,139,250,0.1)",
    accentBorder: "rgba(167,139,250,0.2)",
    features: [
      "5 active job posts",
      "AI-powered CV scoring",
      "Automated candidate emails",
      "Hiring pipeline",
      "Email support",
    ],
  },
  {
    key: "growth" as PlanKey,
    name: "Growth",
    price: "₦35,000",
    priceNum: 35000,
    tagline: "For growing teams with regular needs",
    icon: Rocket,
    highlight: true,
    accentColor: "#34d399",
    accentBg: "rgba(52,211,153,0.1)",
    accentBorder: "rgba(52,211,153,0.2)",
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
    key: "scale" as PlanKey,
    name: "Scale",
    price: "₦75,000",
    priceNum: 75000,
    tagline: "Unlimited hiring for high-growth orgs",
    icon: Crown,
    highlight: false,
    accentColor: "#f59e0b",
    accentBg: "rgba(245,158,11,0.1)",
    accentBorder: "rgba(245,158,11,0.2)",
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

/* ════════════════════════════════════════════════════════════
   PAGE WRAPPER  (required for useSearchParams)
════════════════════════════════════════════════════════════ */
export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <CircleNotch
            size={24}
            className="animate-spin"
            style={{ color: "#7c3aed" }}
          />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}

/* ════════════════════════════════════════════════════════════
   BILLING CONTENT
════════════════════════════════════════════════════════════ */
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
      /* silent — will show skeleton/empty states */
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
          toast.success("Subscription activated! Welcome to HireX Pro.");
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

  /* ── Loading ── */
  if (loading || verifying) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <CircleNotch
          size={24}
          className="animate-spin"
          style={{ color: "#7c3aed" }}
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

  const isActive = sub?.isActive ?? false;
  const jobsUsed = sub?.jobsUsed ?? 0;
  const freeLimit = sub?.freeLimit ?? 1;
  const quotaLeft = sub?.quotaLeft ?? freeLimit - jobsUsed;
  const quotaExhausted = sub?.quotaExhausted ?? false;
  const currentPlanKey = sub?.plan as PlanKey | null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
        <div className="relative flex items-center gap-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(109,40,217,0.2))",
              border: "1px solid rgba(124,58,237,0.35)",
              boxShadow: "0 0 20px rgba(124,58,237,0.25)",
            }}
          >
            <CreditCard
              weight="duotone"
              size={22}
              style={{ color: "#a78bfa" }}
            />
          </div>
          <div>
            <h1 className="text-[22px] font-extrabold text-white tracking-tight leading-none mb-1">
              Billing &amp; plans
            </h1>
            <p
              className="text-[14px]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {isActive
                ? `You're on the ${sub?.planDetails?.name ?? currentPlanKey} plan.`
                : quotaExhausted
                  ? "Your free post has been used — upgrade to keep hiring."
                  : "You have 1 free role post available. Upgrade anytime for unlimited."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Active subscription banner ── */}
      {isActive && (
        <div
          className="flex items-center gap-4 p-5 rounded-2xl anim-2"
          style={{
            background:
              "linear-gradient(135deg,rgba(52,211,153,0.07) 0%,rgba(16,185,129,0.04) 100%)",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(52,211,153,0.1)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <CheckCircle weight="fill" size={20} style={{ color: "#34d399" }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold" style={{ color: "#34d399" }}>
              {sub?.planDetails?.name ?? currentPlanKey} plan — Active
            </p>
            {sub?.currentPeriodEnd && (
              <p
                className="text-[13px] mt-0.5"
                style={{ color: "rgba(52,211,153,0.6)" }}
              >
                Renews{" "}
                {new Date(sub.currentPeriodEnd).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <CreditCard
            weight="duotone"
            size={16}
            style={{ color: "rgba(52,211,153,0.4)" }}
          />
        </div>
      )}

      {/* ── Free quota exhausted banner ── */}
      {!isActive && quotaExhausted && (
        <div
          className="flex items-center gap-4 p-5 rounded-2xl anim-2"
          style={{
            background:
              "linear-gradient(135deg,rgba(245,158,11,0.08) 0%,rgba(234,88,12,0.04) 100%)",
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <Warning weight="fill" size={20} style={{ color: "#fbbf24" }} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold" style={{ color: "#fbbf24" }}>
              Free post used
            </p>
            <p
              className="text-[13px] mt-0.5"
              style={{ color: "rgba(251,191,36,0.6)" }}
            >
              Choose a plan below to post more roles and scale your hiring.
            </p>
          </div>
        </div>
      )}

      {/* ── Plan cards ── */}
      <div className="grid md:grid-cols-4 gap-4 anim-2">
        {/* ─ Free tier card ─ */}
        <FreePlanCard
          jobsUsed={jobsUsed}
          freeLimit={freeLimit}
          isCurrent={!isActive}
        />

        {/* ─ Paid plans ─ */}
        {PAID_PLANS.map((plan) => {
          const isCurrent = isActive && currentPlanKey === plan.key;
          const isLoading = initiating === plan.key;
          const PlanIcon = plan.icon;

          return (
            <div
              key={plan.key}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "#111118",
                border: isCurrent
                  ? `1px solid ${plan.accentBorder}`
                  : plan.highlight
                    ? "1px solid rgba(52,211,153,0.25)"
                    : "1px solid rgba(255,255,255,0.06)",
                boxShadow: plan.highlight
                  ? "0 0 40px rgba(52,211,153,0.08)"
                  : "none",
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-0.5"
                style={{
                  background: isCurrent
                    ? `linear-gradient(90deg,${plan.accentColor},transparent)`
                    : plan.highlight
                      ? "linear-gradient(90deg,#34d399,#10b981)"
                      : "transparent",
                }}
              />

              {/* Popular badge */}
              {plan.highlight && !isCurrent && (
                <div
                  className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: "rgba(52,211,153,0.12)",
                    color: "#34d399",
                    border: "1px solid rgba(52,211,153,0.2)",
                  }}
                >
                  <Sparkle weight="fill" size={9} /> Popular
                </div>
              )}
              {isCurrent && (
                <div
                  className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{
                    background: plan.accentBg,
                    color: plan.accentColor,
                    border: `1px solid ${plan.accentBorder}`,
                  }}
                >
                  <CheckCircle weight="fill" size={9} /> Current
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                {/* Icon + name */}
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: plan.accentBg,
                      border: `1px solid ${plan.accentBorder}`,
                    }}
                  >
                    <PlanIcon
                      weight="duotone"
                      size={16}
                      style={{ color: plan.accentColor }}
                    />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white leading-none">
                      {plan.name}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {plan.tagline}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-5">
                  <span className="text-[26px] font-extrabold text-white">
                    {plan.price}
                  </span>
                  <span
                    className="text-[12px] ml-1"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    /mo
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle
                        weight="fill"
                        size={14}
                        style={{ color: plan.accentColor, flexShrink: 0 }}
                      />
                      <span
                        className="text-[13px]"
                        style={{ color: "rgba(255,255,255,0.5)" }}
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
                  disabled={isCurrent || !!initiating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all disabled:cursor-not-allowed"
                  style={
                    isCurrent
                      ? {
                          background: plan.accentBg,
                          border: `1px solid ${plan.accentBorder}`,
                          color: plan.accentColor,
                        }
                      : plan.highlight
                        ? {
                            background:
                              "linear-gradient(135deg,#059669,#047857)",
                            boxShadow: "0 4px 16px rgba(5,150,105,0.25)",
                            opacity: initiating ? 0.6 : 1,
                          }
                        : {
                            background: "rgba(255,255,255,0.06)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            opacity: initiating ? 0.6 : 1,
                          }
                  }
                  onMouseEnter={(e) => {
                    if (!isCurrent && !initiating && !plan.highlight) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.09)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent && !initiating && !plan.highlight) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.06)";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <CircleNotch size={13} className="animate-spin" />{" "}
                      Processing…
                    </>
                  ) : isCurrent ? (
                    <>
                      <CheckCircle weight="fill" size={13} /> Current plan
                    </>
                  ) : (
                    <>
                      Upgrade <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer note ── */}
      <div
        className="flex items-center justify-center gap-2 pb-2 anim-4"
        style={{ color: "rgba(255,255,255,0.18)" }}
      >
        <ShieldCheck weight="duotone" size={14} />
        <p className="text-[12px]">
          Payments secured by Paystack · All plans renew monthly · Cancel
          anytime
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FREE PLAN CARD
════════════════════════════════════════════════════════════ */
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
  const pct = (used / freeLimit) * 100;
  const isUsed = used >= freeLimit;

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#111118",
        border: isCurrent
          ? "1px solid rgba(124,58,237,0.3)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: isCurrent ? "0 0 24px rgba(124,58,237,0.08)" : "none",
      }}
    >
      {/* Top accent */}
      <div
        className="h-0.5"
        style={{
          background: isCurrent
            ? "linear-gradient(90deg,#7c3aed,#a78bfa)"
            : "transparent",
        }}
      />

      {isCurrent && (
        <div
          className="absolute top-3.5 right-3.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: "rgba(124,58,237,0.15)",
            color: "#a78bfa",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <CheckCircle weight="fill" size={9} /> Current
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Icon + name */}
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <Gift weight="duotone" size={16} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-white leading-none">
              Free
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Try before you pay
            </p>
          </div>
        </div>

        {/* Price */}
        <div className="mb-5">
          <span className="text-[26px] font-extrabold text-white">₦0</span>
          <span
            className="text-[12px] ml-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            /mo
          </span>
        </div>

        {/* Usage bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[12px] font-medium"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Role posts
            </span>
            <span
              className="text-[12px] font-bold"
              style={{ color: isUsed ? "#f87171" : "#a78bfa" }}
            >
              {used}/{freeLimit}
            </span>
          </div>
          <div
            className="w-full h-1.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: isUsed
                  ? "linear-gradient(90deg,#ef4444,#f87171)"
                  : "linear-gradient(90deg,#7c3aed,#a78bfa)",
              }}
            />
          </div>
          <p
            className="text-[11px] mt-1.5"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            {isUsed
              ? "Quota used — upgrade to post more"
              : `${freeLimit - used} post remaining`}
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2 mb-6 flex-1">
          {[
            "1 job post (lifetime)",
            "AI-powered CV scoring",
            "Hiring pipeline",
            "Candidate emails",
          ].map((f, i) => (
            <li key={f} className="flex items-center gap-2">
              {i === 0 ? (
                <Lock
                  weight="fill"
                  size={12}
                  style={{ color: "rgba(255,255,255,0.2)", flexShrink: 0 }}
                />
              ) : (
                <CheckCircle
                  weight="fill"
                  size={14}
                  style={{ color: "#a78bfa", flexShrink: 0 }}
                />
              )}
              <span
                className="text-[13px]"
                style={{
                  color:
                    i === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.5)",
                }}
              >
                {f}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA / status */}
        {isCurrent ? (
          <div
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold"
            style={{
              background: "rgba(124,58,237,0.08)",
              border: "1px solid rgba(124,58,237,0.15)",
              color: "rgba(167,139,250,0.6)",
            }}
          >
            <CheckCircle weight="fill" size={13} />
            Current plan
          </div>
        ) : (
          <Link
            href="/dashboard/jobs"
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <ArrowSquareOut size={13} />
            View roles
          </Link>
        )}
      </div>
    </div>
  );
}
