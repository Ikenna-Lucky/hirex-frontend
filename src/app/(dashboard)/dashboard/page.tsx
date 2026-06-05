"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BriefcaseMetal,
  Users,
  ChartLineUp,
  Timer,
  Plus,
  ArrowRight,
  Warning,
  CheckCircle,
  ArrowUpRight,
  Lightning,
  Crosshair,
  MapPin,
  CalendarBlank,
  CaretRight,
  Sparkle,
  ChartBar,
  Pulse,
  Gift,
  Lock,
  Crown,
  RocketLaunch,
  GearSix,
  Globe,
} from "@phosphor-icons/react";
import { authApi, subscriptionsApi } from "@/lib/api";
import { getStoredCompany } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Stats = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingScoring: number;
};
type Sub = {
  status: "active" | "inactive" | "trialing" | "cancelled" | null;
  plan: string | null;
  isActive: boolean;
  freeLimit: number;
  jobsUsed: number;
  quotaLeft: number | null;
  quotaExhausted: boolean;
  currentPeriodEnd: string | null;
};

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "#34d399",
    bg: "rgba(52,211,153,0.12)",
    dot: "#34d399",
  },
  draft: {
    label: "Draft",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    dot: "#94a3b8",
  },
  closed: {
    label: "Closed",
    color: "#f87171",
    bg: "rgba(248,113,113,0.12)",
    dot: "#f87171",
  },
  archived: {
    label: "Archived",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.08)",
    dot: "#6b7280",
  },
};

const JOB_GRADIENTS = [
  "linear-gradient(135deg,#7c3aed,#6d28d9)",
  "linear-gradient(135deg,#6d28d9,#5b21b6)",
  "linear-gradient(135deg,#8b5cf6,#7c3aed)",
  "linear-gradient(135deg,#5b21b6,#4c1d95)",
  "linear-gradient(135deg,#7c3aed,#8b5cf6)",
  "linear-gradient(135deg,#6d28d9,#7c3aed)",
];

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */

/** Counts from 0 → target with an ease-out cubic curve */
function useCountUp(target: number, duration = 1000, delay = 200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }

    timerRef.current = setTimeout(() => {
      let startTime: number | null = null;

      const tick = (ts: number) => {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setValue(Math.round(eased * target));
        if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return value;
}

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function getJobInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function Bone({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="space-y-6">
      {/* hero */}
      <Bone className="h-[108px] rounded-2xl" />

      {/* stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center justify-between">
              <Bone className="h-3 w-20 rounded-md" />
              <Bone className="w-8 h-8 rounded-xl" />
            </div>
            <Bone className="h-9 w-14 rounded-md" />
            <Bone className="h-2.5 w-28 rounded-md" />
          </div>
        ))}
      </div>

      {/* 2-col */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* jobs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Bone className="h-5 w-32 rounded-md" />
            <Bone className="h-7 w-20 rounded-lg" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: "#111118",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Bone className="w-11 h-11 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Bone
                    className="h-4 rounded-md"
                    style={{ width: `${55 + (i % 3) * 15}%` }}
                  />
                  <Bone className="h-3 w-28 rounded-md" />
                </div>
                <Bone className="h-7 w-16 rounded-lg hidden sm:block" />
              </div>
            ))}
          </div>
        </div>

        {/* sidebar */}
        <div className="space-y-4">
          <Bone className="h-36 rounded-2xl" />
          <Bone className="h-44 rounded-2xl" />
          <Bone className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function OverviewPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);
  const [loading, setLoading] = useState(true);
  const [barsReady, setBarsReady] = useState(false);
  const company = getStoredCompany();

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, subRes] = await Promise.all([
          authApi.stats(),
          subscriptionsApi.status(),
        ]);
        const d = statsRes.data.data;
        // Populate recent jobs list from the stats endpoint
        setJobs(d.recentJobs ?? []);
        setStats({
          totalJobs: d.jobs.total ?? 0,
          activeJobs: d.jobs.active ?? 0,
          totalApplications: d.applications.total ?? 0,
          pendingScoring: d.applications.pendingScoring ?? 0,
        });
        const sd = subRes.data.data;
        setSub({
          status: sd?.status ?? null,
          plan: sd?.plan ?? null,
          isActive: sd?.isActive ?? false,
          freeLimit: sd?.freeLimit ?? 1,
          jobsUsed: sd?.jobsUsed ?? 0,
          quotaLeft: sd?.quotaLeft ?? null,
          quotaExhausted: sd?.quotaExhausted ?? false,
          currentPeriodEnd: sd?.currentPeriodEnd ?? null,
        });
      } catch {
        /**/
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* trigger pipeline bar fill after content appears */
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setBarsReady(true), 120);
      return () => clearTimeout(t);
    }
  }, [loading]);

  /* count-up hooks — must be called unconditionally */
  const c1 = useCountUp(stats?.totalJobs ?? 0, 900, 250);
  const c2 = useCountUp(stats?.activeJobs ?? 0, 900, 350);
  const c3 = useCountUp(stats?.totalApplications ?? 0, 1100, 450);
  const c4 = useCountUp(stats?.pendingScoring ?? 0, 900, 550);

  if (loading) return <SkeletonPage />;

  // recentJobs already ordered by createdAt DESC (max 5) from the stats endpoint
  const recent = jobs.slice(0, 6);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = company?.name?.split(" ")[0] ?? "there";

  const totalJobs = stats?.totalJobs ?? 0;
  const activeJobs = stats?.activeJobs ?? 0;
  const totalCVs = stats?.totalApplications ?? 0;

  const STAT_CARDS = [
    {
      label: "Total Jobs",
      value: c1,
      icon: BriefcaseMetal,
      sub: `${activeJobs} currently active`,
    },
    {
      label: "Active Postings",
      value: c2,
      icon: Pulse,
      sub:
        totalJobs > 0
          ? `${Math.round((activeJobs / totalJobs) * 100)}% of all jobs`
          : "No jobs yet",
    },
    {
      label: "Applications",
      value: c3,
      icon: Users,
      sub:
        activeJobs > 0
          ? `~${Math.round(totalCVs / Math.max(activeJobs, 1))} per active job`
          : "Awaiting applications",
    },
    {
      label: "Awaiting Review",
      value: c4,
      icon: Timer,
      sub: "AI scoring queue",
    },
  ] as const;

  const PIPELINE = [
    { label: "Total Jobs", value: totalJobs, pct: totalJobs > 0 ? 100 : 0 },
    {
      label: "Active",
      value: activeJobs,
      pct: totalJobs > 0 ? Math.round((activeJobs / totalJobs) * 100) : 0,
    },
    { label: "Applications", value: totalCVs, pct: totalCVs > 0 ? 100 : 0 },
  ];

  return (
    <div className="space-y-6">
      {/* ══ HERO GREETING ══ */}
      <div
        className="relative rounded-2xl overflow-hidden px-5 py-5 md:px-8 md:py-7 anim-1"
        style={{
          background:
            "linear-gradient(135deg,#0e0e1a 0%,#13102a 45%,#0e0e1a 100%)",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)",
          }}
        />
        <div
          className="absolute -bottom-12 left-24 w-56 h-32 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse,rgba(124,58,237,0.09) 0%,transparent 70%)",
          }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkle weight="fill" size={14} style={{ color: "#a78bfa" }} />
              <span
                className="text-[12px] font-semibold tracking-wide uppercase"
                style={{ color: "#a78bfa" }}
              >
                AI-Powered Recruitment
              </span>
            </div>
            <h1 className="text-[30px] font-extrabold text-white tracking-tight leading-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p
              className="text-[15px] mt-2"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {activeJobs > 0
                ? `${activeJobs} active posting${activeJobs !== 1 ? "s" : ""} · ${totalCVs} total application${totalCVs !== 1 ? "s" : ""} received`
                : "Ready to find your next great hire? Post your first job."}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Show upgrade nudge when not subscribed */}
            {!sub?.isActive && (
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all"
                style={{
                  background: "rgba(124,58,237,0.14)",
                  border: "1px solid rgba(124,58,237,0.28)",
                  color: "#a78bfa",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(124,58,237,0.24)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(124,58,237,0.14)";
                }}
              >
                <Lightning weight="fill" size={14} />
                {sub?.quotaExhausted ? "Upgrade to post" : "Upgrade"}
              </Link>
            )}
            {/* Primary CTA — links to billing when quota is exhausted */}
            <Link
              href={
                sub?.quotaExhausted
                  ? "/dashboard/billing"
                  : "/dashboard/jobs/new"
              }
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                boxShadow: "0 0 24px rgba(124,58,237,0.38)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 36px rgba(124,58,237,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 24px rgba(124,58,237,0.38)";
              }}
            >
              {sub?.quotaExhausted ? (
                <>
                  <Crown weight="fill" size={15} /> Unlock more roles
                </>
              ) : (
                <>
                  <Plus weight="bold" size={16} /> Post a role
                </>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ══ STAT CARDS — staggered entrance ══ */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, sub: subText }, i) => (
            <div
              key={label}
              className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
                animation: `fade-up-in 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 80 + 100}ms both`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(124,58,237,0.7),transparent)",
                }}
              />
              <div className="flex items-center justify-between">
                <p
                  className="text-[13px] font-medium"
                  style={{ color: "rgba(255,255,255,0.38)" }}
                >
                  {label}
                </p>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.1)" }}
                >
                  <Icon
                    weight="duotone"
                    size={18}
                    style={{ color: "#a78bfa" }}
                  />
                </div>
              </div>
              <div>
                <p className="text-[40px] font-black leading-none tracking-tight text-white tabular-nums">
                  {value.toLocaleString()}
                </p>
                <p
                  className="text-[12px] mt-2"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {subText}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ MAIN 2-COLUMN ══ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* ── Recent Jobs ── */}
        <div className="anim-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[19px] font-bold text-white">Recent Jobs</h2>
              <p
                className="text-[13px] mt-0.5"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Your latest role postings
              </p>
            </div>
            <Link
              href="/dashboard/jobs"
              className="flex items-center gap-1.5 text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                color: "#a78bfa",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(124,58,237,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(124,58,237,0.1)";
              }}
            >
              View all <ArrowRight weight="bold" size={13} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div
              className="rounded-2xl flex flex-col items-center justify-center py-20 text-center"
              style={{
                background: "#111118",
                border: "1px dashed rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <BriefcaseMetal
                  weight="duotone"
                  size={24}
                  style={{ color: "#a78bfa" }}
                />
              </div>
              <p
                className="text-[17px] font-bold mb-2"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                No jobs posted yet
              </p>
              <p
                className="text-[14px] max-w-xs mb-6"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Post your first role and let our AI automatically score and rank
                incoming applications.
              </p>
              <Link
                href="/dashboard/jobs/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  boxShadow: "0 0 20px rgba(124,58,237,0.3)",
                }}
              >
                <Plus weight="bold" size={16} /> Post your first job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((job, i) => {
                const s = STATUS_MAP[job.status] ?? STATUS_MAP.draft;
                const gradient = JOB_GRADIENTS[i % JOB_GRADIENTS.length];
                const initials = getJobInitials(job.title);
                return (
                  <Link
                    key={job.id}
                    href={`/dashboard/jobs/${job.id}`}
                    className="flex items-center gap-4 p-4 rounded-2xl transition-all group"
                    style={{
                      background: "#111118",
                      border: "1px solid rgba(255,255,255,0.07)",
                      animation: `fade-up-in 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 60 + 300}ms both`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(124,58,237,0.28)";
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(124,58,237,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.07)";
                      (e.currentTarget as HTMLElement).style.background =
                        "#111118";
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-extrabold text-white flex-shrink-0"
                      style={{ background: gradient }}
                    >
                      {initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[15px] font-semibold truncate"
                        style={{ color: "rgba(255,255,255,0.9)" }}
                      >
                        {job.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {job.location && (
                          <span
                            className="flex items-center gap-1 text-[12px]"
                            style={{ color: "rgba(255,255,255,0.3)" }}
                          >
                            <MapPin weight="fill" size={12} /> {job.location}
                          </span>
                        )}
                        {job.type && (
                          <span
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md capitalize"
                            style={{
                              color: "rgba(255,255,255,0.38)",
                              background: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {job.type.replace("-", " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Users
                          weight="duotone"
                          size={14}
                          style={{ color: "rgba(255,255,255,0.25)" }}
                        />
                        <span
                          className="text-[15px] font-bold"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {job.applicationCount ?? 0}
                        </span>
                      </div>
                      <span
                        className="text-[11px] mt-0.5"
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        CVs
                      </span>
                    </div>

                    <div className="hidden lg:block flex-shrink-0">
                      <span
                        className="flex items-center gap-1 text-[12px]"
                        style={{ color: "rgba(255,255,255,0.22)" }}
                      >
                        <CalendarBlank weight="fill" size={12} />{" "}
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    <div className="flex-shrink-0">
                      <span
                        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
                        style={{ color: s.color, background: s.bg }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{
                            background: s.dot,
                            boxShadow:
                              job.status === "active"
                                ? `0 0 6px ${s.dot}`
                                : "none",
                          }}
                        />
                        {s.label}
                      </span>
                    </div>

                    <CaretRight
                      weight="bold"
                      size={14}
                      className="flex-shrink-0 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ color: "#a78bfa" }}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div
          className="space-y-4 xl:sticky xl:top-0 xl:overflow-y-auto anim-4"
          style={{
            maxHeight: "520px",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(124,58,237,0.3) transparent",
          }}
        >
          {/* ── Plan / quota card ── */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#111118",
              border: sub?.isActive
                ? "1px solid rgba(52,211,153,0.15)"
                : sub?.quotaExhausted
                  ? "1px solid rgba(248,113,113,0.15)"
                  : "1px solid rgba(124,58,237,0.15)",
            }}
          >
            {/* ── STATE 1: Active paid plan ── */}
            {sub?.isActive ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle
                    weight="fill"
                    size={15}
                    style={{ color: "#34d399" }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#34d399" }}
                  >
                    Plan active
                  </span>
                </div>
                <p className="text-[22px] font-black text-white capitalize mb-1">
                  {sub.plan}
                </p>
                <p
                  className="text-[12px]"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {sub.currentPeriodEnd
                    ? `Renews ${formatDate(sub.currentPeriodEnd)}`
                    : "Active subscription"}
                </p>
                <Link
                  href="/dashboard/billing"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold mt-3"
                  style={{ color: "rgba(52,211,153,0.6)" }}
                >
                  Manage plan <ArrowUpRight size={11} />
                </Link>
              </>
            ) : sub?.quotaExhausted ? (
              /* ── STATE 2: Free quota used up ── */
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Lock weight="fill" size={14} style={{ color: "#f87171" }} />
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#f87171" }}
                  >
                    Free post used
                  </span>
                </div>

                {/* Usage bar — full/red */}
                <div className="mb-3">
                  <div
                    className="flex justify-between text-[11px] mb-1.5"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    <span>Role posts</span>
                    <span style={{ color: "#f87171", fontWeight: 700 }}>
                      1/1
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-full rounded-full w-full"
                      style={{
                        background: "linear-gradient(90deg,#ef4444,#f87171)",
                      }}
                    />
                  </div>
                </div>

                <p
                  className="text-[12px] mb-4"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Upgrade to post unlimited roles and keep hiring.
                </p>
                <Link
                  href="/dashboard/billing"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                    boxShadow: "0 0 18px rgba(124,58,237,0.3)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 26px rgba(124,58,237,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      "0 0 18px rgba(124,58,237,0.3)";
                  }}
                >
                  <Lightning weight="fill" size={13} /> View plans
                </Link>
              </>
            ) : (
              /* ── STATE 3: Free with quota remaining ── */
              <>
                <div className="flex items-center gap-2 mb-3">
                  <Gift
                    weight="duotone"
                    size={15}
                    style={{ color: "#a78bfa" }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#a78bfa" }}
                  >
                    Free plan
                  </span>
                </div>

                {/* Usage bar */}
                <div className="mb-3">
                  <div
                    className="flex justify-between text-[11px] mb-1.5"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    <span>Role posts</span>
                    <span style={{ color: "#a78bfa", fontWeight: 700 }}>
                      {sub?.jobsUsed ?? 0}/{sub?.freeLimit ?? 1}
                    </span>
                  </div>
                  <div
                    className="h-1.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round(((sub?.jobsUsed ?? 0) / (sub?.freeLimit ?? 1)) * 100)}%`,
                        background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
                      }}
                    />
                  </div>
                </div>

                <p
                  className="text-[12px] mb-4"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {(sub?.quotaLeft ?? 1) > 0
                    ? "1 free role post included. Upgrade for unlimited."
                    : "Upgrade to post more roles."}
                </p>
                <Link
                  href="/dashboard/billing"
                  className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-[12px] font-semibold transition-all"
                  style={{
                    color: "rgba(167,139,250,0.8)",
                    background: "rgba(124,58,237,0.08)",
                    border: "1px solid rgba(124,58,237,0.18)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(124,58,237,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(124,58,237,0.08)";
                  }}
                >
                  <Lightning weight="fill" size={12} /> Upgrade for unlimited
                </Link>
              </>
            )}
          </div>

          {/* Getting Started — only shown for brand-new accounts */}
          {totalJobs === 0 && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: "#111118",
                border: "1px solid rgba(124,58,237,0.18)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <RocketLaunch
                  weight="duotone"
                  size={16}
                  style={{ color: "#a78bfa" }}
                />
                <h3 className="text-[14px] font-bold text-white">
                  Getting Started
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    label: "Complete your profile",
                    sub: "Add your company name, logo, and description.",
                    href: "/dashboard/settings",
                    icon: GearSix,
                  },
                  {
                    step: 2,
                    label: "Post your first role",
                    sub: "Create a job listing and go live in minutes.",
                    href: "/dashboard/jobs/new",
                    icon: BriefcaseMetal,
                  },
                  {
                    step: 3,
                    label: "Share your job board",
                    sub: "Send applicants to your public listings page.",
                    href: "/jobs",
                    icon: Globe,
                  },
                ].map(({ step, label, sub, href, icon: Icon }) => (
                  <Link
                    key={step}
                    href={href}
                    target={step === 3 ? "_blank" : undefined}
                    className="flex items-start gap-3 p-3 rounded-xl transition-all group"
                    style={{ border: "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(124,58,237,0.07)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(124,58,237,0.18)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "transparent";
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5"
                      style={{
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        color: "#a78bfa",
                      }}
                    >
                      {step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {label}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {sub}
                      </p>
                    </div>
                    <Icon
                      weight="duotone"
                      size={14}
                      style={{ color: "rgba(255,255,255,0.2)" }}
                      className="flex-shrink-0 mt-1"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline — bars fill on mount */}
          {totalJobs > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{
                background: "#111118",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2 mb-5">
                <ChartBar
                  weight="duotone"
                  size={16}
                  style={{ color: "#a78bfa" }}
                />
                <h3 className="text-[14px] font-bold text-white">
                  Pipeline Overview
                </h3>
              </div>
              <div className="space-y-4">
                {PIPELINE.map(({ label, value, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-[12px]"
                        style={{ color: "rgba(255,255,255,0.38)" }}
                      >
                        {label}
                      </span>
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: "rgba(255,255,255,0.75)" }}
                      >
                        {value}
                      </span>
                    </div>
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: barsReady ? `${pct}%` : "0%",
                          background:
                            "linear-gradient(90deg,#7c3aed,rgba(124,58,237,0.5))",
                          boxShadow: "0 0 8px rgba(124,58,237,0.35)",
                          transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Crosshair
                weight="duotone"
                size={16}
                style={{ color: "#a78bfa" }}
              />
              <h3 className="text-[14px] font-bold text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-1">
              {[
                {
                  href: "/dashboard/jobs/new",
                  icon: Plus,
                  label: "Post a new job",
                  iconWeight: "bold",
                },
                {
                  href: "/dashboard/jobs",
                  icon: BriefcaseMetal,
                  label: "Manage jobs",
                  iconWeight: "duotone",
                },
                {
                  href: "/dashboard/billing",
                  icon: ChartLineUp,
                  label: "Upgrade plan",
                  iconWeight: "duotone",
                },
                {
                  href: "/dashboard/settings",
                  icon: Lightning,
                  label: "Company settings",
                  iconWeight: "fill",
                },
              ].map(({ href, icon: Icon, label, iconWeight }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(124,58,237,0.07)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(124,58,237,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "transparent";
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.1)" }}
                  >
                    <Icon
                      weight={iconWeight as "bold" | "duotone" | "fill"}
                      size={14}
                      style={{ color: "#a78bfa" }}
                    />
                  </div>
                  <span
                    className="text-[13px] font-medium flex-1"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </span>
                  <CaretRight
                    weight="bold"
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
