"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus,
  Loader2,
  Briefcase,
  MoreHorizontal,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { jobsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";
import type { AxiosError } from "axios";

type StatusFilter = "all" | "active" | "draft" | "closed" | "archived";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

const STATUS_STYLES: Record<string, string> = {
  active: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  closed: "bg-red-500/10 text-red-400 border-red-500/20",
  archived: "bg-gray-700/20 text-gray-600 border-gray-700/20",
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  async function fetchJobs() {
    try {
      const res = await jobsApi.list({ limit: 100 });
      const data = res.data.data;
      setJobs(Array.isArray(data) ? data : (data?.jobs ?? []));
    } catch {
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  async function toggleStatus(job: Job) {
    const next = job.status === "active" ? "closed" : "active";
    setActionLoading(job.id);
    try {
      await jobsApi.updateStatus(job.id, next);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, status: next as Job["status"] } : j,
        ),
      );
      toast.success(`Job ${next === "active" ? "activated" : "closed"}.`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteJob(job: Job) {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    setActionLoading(job.id);
    try {
      await jobsApi.delete(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      toast.success("Job deleted.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to delete job.");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Jobs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} total
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

      {/* Filter tabs */}
      <div className="flex gap-1 bg-surface-900 border border-white/5 rounded-xl p-1 w-fit">
        {STATUS_TABS.map((tab) => {
          const count =
            tab.key === "all"
              ? jobs.length
              : jobs.filter((j) => j.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-brand-600/15 text-brand-400 border border-brand-600/25"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.key
                    ? "bg-brand-600/20 text-brand-400"
                    : "bg-white/5 text-gray-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState filter={filter} />
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
                <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">
                  Status
                </th>
                <th className="px-5 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((job) => (
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
                  <td className="px-5 py-4 hidden sm:table-cell text-gray-400 capitalize">
                    {job.type?.replace("-", " ") ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-right hidden md:table-cell">
                    <span className="font-medium text-white">
                      {job.applicationCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell text-gray-500">
                    {formatDate(job.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${
                        STATUS_STYLES[job.status] ?? ""
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div
                      className="relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          setOpenMenu(openMenu === job.id ? null : job.id)
                        }
                        disabled={actionLoading === job.id}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
                      >
                        {actionLoading === job.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <MoreHorizontal className="w-4 h-4" />
                        )}
                      </button>

                      {openMenu === job.id && (
                        <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-surface-900 border border-white/10 rounded-xl shadow-xl overflow-hidden">
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              router.push(`/dashboard/jobs/${job.id}`);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            View pipeline
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              router.push(`/dashboard/jobs/${job.id}/edit`);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit job
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              toggleStatus(job);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                          >
                            {job.status === "active" ? (
                              <>
                                <ToggleLeft className="w-3.5 h-3.5" /> Close job
                              </>
                            ) : (
                              <>
                                <ToggleRight className="w-3.5 h-3.5 text-accent-400" />{" "}
                                Activate job
                              </>
                            )}
                          </button>
                          <div className="border-t border-white/5" />
                          <button
                            onClick={() => {
                              setOpenMenu(null);
                              deleteJob(job);
                            }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete job
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: StatusFilter }) {
  return (
    <div className="bg-surface-900 border border-white/5 border-dashed rounded-2xl py-16 text-center">
      <Briefcase className="w-8 h-8 text-gray-700 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-400 mb-1">
        {filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
      </p>
      <p className="text-xs text-gray-600 mb-5">
        {filter === "all"
          ? "Post your first role and start receiving AI-scored applications."
          : `Switch to a different filter or create a new job.`}
      </p>
      {filter === "all" && (
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 text-sm font-medium bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 border border-brand-600/20 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Post a job
        </Link>
      )}
    </div>
  );
}
