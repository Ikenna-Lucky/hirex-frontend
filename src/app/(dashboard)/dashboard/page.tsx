"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Zap,
  Target,
  MapPin,
  Calendar,
  ChevronRight,
  Sparkles,
  BarChart3,
  Activity,
} from "lucide-react";
import { jobsApi, subscriptionsApi } from "@/lib/api";
import { getStoredCompany } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";

type Stats = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingScoring: number;
};
type Sub = {
  status: "active" | "inactive" | "expired" | null;
  plan: string | null;
  endsAt: string | null;
};

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
  "linear-gradient(135deg,#0ea5e9,#0284c7)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#ec4899,#db2777)",
  "linear-gradient(135deg,#8b5cf6,#7c3aed)",
];

function getJobInitials(title: string): string {
  return title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function OverviewPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sub, setSub] = useState<Sub | null>(null);
  const [loading, setLoading] = useState(true);
  const company = getStoredCompany();

  useEffect(() => {
    (async () => {
      try {
        const [jr, sr] = await Promise.all([
          jobsApi.list({ limit: 50 }),
          subscriptionsApi.status(),
        ]);
        const all: Job[] = jr.data.data?.jobs ?? jr.data.data ?? [];
        setJobs(all);
        setStats({
          totalJobs: all.length,
          activeJobs: all.filter((j: Job) => j.status === "active").length,
          totalApplications: all.reduce(
            (s: number, j: Job) => s + (j.applicationCount ?? 0),
            0,
          ),
          pendingScoring: 0,
        });
        const d = sr.data.data;
        setSub({
          status: d?.status ?? null,
          plan: d?.plan ?? null,
          endsAt: d?.endsAt ?? null,
        });
      } catch {
        /**/
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2
          className="w-6 h-6 animate-spin"
          style={{ color: "#7c3aed" }}
        />
      </div>
    );

  const recent = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = company?.name?.split(" ")[0] ?? "there";

  const totalJobs = stats?.totalJobs ?? 0;
  const activeJobs = stats?.activeJobs ?? 0;
  const totalCVs = stats?.totalApplications ?? 0;

  /* ─── stat card data ─── */
  const STAT_CARDS = [
    {
      label: "Total Jobs",
      value: stats?.totalJobs ?? 0,
      icon: Briefcase,
      accent: "#7c3aed",
      accentA: "rgba(124,58,237,0.12)",
      sub: `${activeJobs} currently active`,
    },
    {
      label: "Active Postings",
      value: activeJobs,
      icon: Activity,
      accent: "#34d399",
      accentA: "rgba(52,211,153,0.12)",
      sub:
        totalJobs > 0
          ? `${Math.round((activeJobs / totalJobs) * 100)}% of all jobs`
          : "No jobs yet",
    },
    {
      label: "Applications",
      value: totalCVs,
      icon: Users,
      accent: "#0ea5e9",
      accentA: "rgba(14,165,233,0.12)",
      sub:
        activeJobs > 0
          ? `~${Math.round(totalCVs / Math.max(activeJobs, 1))} per active job`
          : "Awaiting applications",
    },
    {
      label: "Awaiting Review",
      value: stats?.pendingScoring ?? 0,
      icon: Clock,
      accent: "#f59e0b",
      accentA: "rgba(245,158,11,0.12)",
      sub: "AI scoring queue",
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════
          HERO GREETING BANNER
      ══════════════════════════════════════════ */}
      <div
        className="relative rounded-2xl overflow-hidden px-8 py-7"
        style={{
          background:
            "linear-gradient(135deg,#0e0e1a 0%,#13102a 45%,#0e0e1a 100%)",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        {/* decorative glow orbs */}
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

        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
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
            {sub?.status !== "active" && (
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
                <Zap className="w-3.5 h-3.5" /> Upgrade
              </Link>
            )}
            <Link
              href="/dashboard/jobs/new"
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
              <Plus className="w-4 h-4" /> Post a job
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STAT CARDS
      ══════════════════════════════════════════ */}
      {stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STAT_CARDS.map(
            ({ label, value, icon: Icon, accent, accentA, sub: subText }) => (
              <div
                key={label}
                className="relative rounded-2xl p-5 flex flex-col gap-4 overflow-hidden"
                style={{
                  background: "#111118",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg,${accent}88,transparent)`,
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
                    style={{ background: accentA }}
                  >
                    <Icon className="w-4 h-4" style={{ color: accent }} />
                  </div>
                </div>

                <div>
                  <p className="text-[40px] font-black leading-none tracking-tight text-white">
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
            ),
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          MAIN 2-COLUMN LAYOUT
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* ── LEFT: Recent Jobs ── */}
        <div>
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
              View all <ArrowRight className="w-3.5 h-3.5" />
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
                <Briefcase className="w-6 h-6" style={{ color: "#a78bfa" }} />
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
                <Plus className="w-4 h-4" /> Post your first job
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
                    {/* Gradient icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-extrabold text-white flex-shrink-0"
                      style={{ background: gradient }}
                    >
                      {initials}
                    </div>

                    {/* Job info */}
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
                            <MapPin className="w-3 h-3" /> {job.location}
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

                    {/* CV count */}
                    <div className="hidden sm:flex flex-col items-end flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Users
                          className="w-3.5 h-3.5"
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

                    {/* Date */}
                    <div className="hidden lg:block flex-shrink-0">
                      <span
                        className="flex items-center gap-1 text-[12px]"
                        style={{ color: "rgba(255,255,255,0.22)" }}
                      >
                        <Calendar className="w-3 h-3" />{" "}
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {/* Status badge */}
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

                    <ChevronRight
                      className="w-4 h-4 flex-shrink-0 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ color: "#a78bfa" }}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="space-y-4">
          {/* ── Subscription card ── */}
          <div
            className="rounded-2xl p-5"
            style={{
              background:
                sub?.status === "active"
                  ? "linear-gradient(135deg,rgba(52,211,153,0.07) 0%,rgba(16,185,129,0.04) 100%)"
                  : "linear-gradient(135deg,rgba(245,158,11,0.08) 0%,rgba(234,179,8,0.04) 100%)",
              border:
                sub?.status === "active"
                  ? "1px solid rgba(52,211,153,0.16)"
                  : "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              {sub?.status === "active" ? (
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "#34d399" }}
                />
              ) : (
                <AlertTriangle
                  className="w-4 h-4"
                  style={{ color: "#f59e0b" }}
                />
              )}
              <span
                className="text-[12px] font-bold uppercase tracking-wider"
                style={{
                  color: sub?.status === "active" ? "#34d399" : "#f59e0b",
                }}
              >
                {sub?.status === "active" ? "Plan Active" : "No Active Plan"}
              </span>
            </div>

            {sub?.status === "active" ? (
              <>
                <p className="text-[24px] font-black text-white capitalize">
                  {sub.plan}
                </p>
                <p
                  className="text-[12px] mt-1"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {sub.endsAt
                    ? `Renews ${formatDate(sub.endsAt)}`
                    : "Active subscription"}
                </p>
                <Link
                  href="/dashboard/billing"
                  className="flex items-center gap-1 text-[12px] font-semibold mt-3 transition-opacity hover:opacity-100"
                  style={{ color: "rgba(52,211,153,0.65)" }}
                >
                  Manage plan <ArrowUpRight className="w-3 h-3" />
                </Link>
              </>
            ) : (
              <>
                <p
                  className="text-[14px] mb-4"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  Subscribe to post jobs and unlock AI-powered CV scoring.
                </p>
                <Link
                  href="/dashboard/billing"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-bold transition-all"
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                    color: "#000",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.9";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  <Zap className="w-3.5 h-3.5" /> Choose a Plan
                </Link>
              </>
            )}
          </div>

          {/* ── Pipeline overview ── */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4" style={{ color: "#a78bfa" }} />
              <h3 className="text-[14px] font-bold text-white">
                Pipeline Overview
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Total Jobs",
                  value: totalJobs,
                  max: Math.max(totalJobs, 1),
                  pct: 100,
                  color: "#7c3aed",
                },
                {
                  label: "Active",
                  value: activeJobs,
                  max: Math.max(totalJobs, 1),
                  pct:
                    totalJobs > 0
                      ? Math.round((activeJobs / totalJobs) * 100)
                      : 0,
                  color: "#34d399",
                },
                {
                  label: "Applications",
                  value: totalCVs,
                  max: Math.max(totalCVs, 1),
                  pct: 100,
                  color: "#0ea5e9",
                },
              ].map(({ label, value, pct, color }) => (
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
                        width: `${pct}%`,
                        background: `linear-gradient(90deg,${color},${color}88)`,
                        boxShadow: `0 0 8px ${color}55`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Quick actions ── */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4" style={{ color: "#a78bfa" }} />
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
                  color: "#7c3aed",
                },
                {
                  href: "/dashboard/jobs",
                  icon: Briefcase,
                  label: "Manage jobs",
                  color: "#0ea5e9",
                },
                {
                  href: "/dashboard/billing",
                  icon: TrendingUp,
                  label: "Upgrade plan",
                  color: "#f59e0b",
                },
                {
                  href: "/dashboard/settings",
                  icon: Zap,
                  label: "Company settings",
                  color: "#34d399",
                },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                  style={{ border: "1px solid transparent" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.07)";
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
                    style={{ background: `${color}1a` }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span
                    className="text-[13px] font-medium flex-1"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {label}
                  </span>
                  <ChevronRight
                    className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
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
