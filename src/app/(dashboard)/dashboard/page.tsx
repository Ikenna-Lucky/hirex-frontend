"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { jobsApi, subscriptionsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";

type Stats = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingScoring: number;
};

type SubStatus = {
  status: "active" | "inactive" | "expired" | null;
  plan: string | null;
  endsAt: string | null;
};

const JOB_STATUS_STYLES: Record<string, string> = {
  active: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
  archived: "bg-gray-700/20 text-gray-600 border-gray-700/20",
};

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [jobsRes, subRes] = await Promise.all([
          jobsApi.list({ limit: 50 }),
          subscriptionsApi.status(),
        ]);

        const allJobs: Job[] =
          jobsRes.data.data?.jobs ?? jobsRes.data.data ?? [];
        setJobs(allJobs);

        const totalApplications = allJobs.reduce(
          (sum: number, j: Job) => sum + (j.applicationCount ?? 0),
          0,
        );

        setStats({
          totalJobs: allJobs.length,
          activeJobs: allJobs.filter((j: Job) => j.status === "active").length,
          totalApplications,
          pendingScoring: 0, // enriched per-job in future
        });

        const subData = subRes.data.data;
        setSub({
          status: subData?.status ?? null,
          plan: subData?.plan ?? null,
          endsAt: subData?.endsAt ?? null,
        });
      } catch {
        // errors handled silently; UI shows empty state
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  const recentJobs = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ─── Header ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            What&apos;s happening across your hiring pipeline.
          </p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-all shadow-lg shadow-brand-600/20"
        >
          <Plus className="w-4 h-4" />
          Post a job
        </Link>
      </div>

      {/* ─── Subscription banner ─────────────────────────── */}
      {sub?.status !== "active" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">No active subscription</p>
            <p className="text-xs text-amber-500/70 mt-0.5">
              You need an active plan to post jobs and score CVs.
            </p>
          </div>
          <Link
            href="/dashboard/billing"
            className="text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Choose a plan
          </Link>
        </div>
      )}

      {/* ─── Stats ───────────────────────────────────────── */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Briefcase}
            label="Total jobs"
            value={stats.totalJobs}
            color="brand"
          />
          <StatCard
            icon={TrendingUp}
            label="Active postings"
            value={stats.activeJobs}
            color="accent"
          />
          <StatCard
            icon={Users}
            label="Applications"
            value={stats.totalApplications}
            color="brand"
          />
          <StatCard
            icon={Clock}
            label="Awaiting review"
            value={stats.pendingScoring}
            color="accent"
          />
        </div>
      )}

      {/* ─── Recent jobs ────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Recent jobs</h2>
          <Link
            href="/dashboard/jobs"
            className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <EmptyJobs />
        ) : (
          <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                    Role
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden sm:table-cell">
                    Type
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 px-5 py-3 hidden md:table-cell">
                    Applications
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 hidden lg:table-cell">
                    Posted
                  </th>
                  <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/jobs/${job.id}`}
                        className="font-medium text-white group-hover:text-brand-400 transition-colors"
                      >
                        {job.title}
                      </Link>
                      {job.location && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {job.location}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-gray-400 capitalize">
                        {job.type?.replace("-", " ") ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right hidden md:table-cell">
                      <span className="text-white font-medium">
                        {job.applicationCount}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell text-gray-500">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${
                          JOB_STATUS_STYLES[job.status] ?? ""
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: "brand" | "accent";
}) {
  return (
    <div className="bg-surface-900 border border-white/5 rounded-2xl p-5">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
          color === "brand"
            ? "bg-brand-600/10 text-brand-400"
            : "bg-accent-500/10 text-accent-400"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function EmptyJobs() {
  return (
    <div className="bg-surface-900 border border-white/5 border-dashed rounded-2xl py-14 px-6 text-center">
      <Briefcase className="w-8 h-8 text-gray-700 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-400 mb-1">
        No jobs posted yet
      </p>
      <p className="text-xs text-gray-600 mb-4">
        Create your first job post and start receiving scored applications.
      </p>
      <Link
        href="/dashboard/jobs/new"
        className="inline-flex items-center gap-2 text-sm font-medium bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 border border-brand-600/20 px-4 py-2 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" /> Post your first job
      </Link>
    </div>
  );
}
