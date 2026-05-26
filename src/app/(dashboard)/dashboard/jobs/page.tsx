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
  MapPin,
  Calendar,
} from "lucide-react";
import { jobsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";
import type { AxiosError } from "axios";
import ConfirmModal from "@/components/ConfirmModal";

type StatusFilter = "all" | "active" | "draft" | "closed" | "archived";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  active: {
    bg: "rgba(52,211,153,0.08)",
    color: "#34d399",
    border: "rgba(52,211,153,0.2)",
  },
  draft: {
    bg: "rgba(255,255,255,0.05)",
    color: "#9ca3af",
    border: "rgba(255,255,255,0.1)",
  },
  closed: {
    bg: "rgba(239,68,68,0.08)",
    color: "#f87171",
    border: "rgba(239,68,68,0.2)",
  },
  archived: {
    bg: "rgba(255,255,255,0.03)",
    color: "#6b7280",
    border: "rgba(255,255,255,0.06)",
  },
};

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

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

  async function confirmDelete() {
    if (!deleteTarget) return;
    const job = deleteTarget;
    setDeleteTarget(null);
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
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "#8b5cf6" }}
          />
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            Loading jobs…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this job?"
        message={`"${deleteTarget?.title}" and all its applications will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete job"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-white tracking-tight">
              Jobs
            </h1>
            <p
              className="text-[17px] mt-1.5"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link
            href="/dashboard/jobs/new"
            className="flex-shrink-0 flex items-center gap-2 text-white text-[15px] font-semibold px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
              boxShadow:
                "0 4px 20px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Post a job
          </Link>
        </div>

        {/* Filter tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl w-fit"
          style={{
            backgroundColor: "#0c0c20",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {STATUS_TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? jobs.length
                : jobs.filter((j) => j.status === tab.key).length;
            const active = filter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[14px] font-semibold transition-all"
                style={
                  active
                    ? {
                        backgroundColor: "rgba(124,58,237,0.15)",
                        color: "#a78bfa",
                        border: "1px solid rgba(124,58,237,0.25)",
                      }
                    : {
                        color: "rgba(255,255,255,0.35)",
                        border: "1px solid transparent",
                      }
                }
              >
                {tab.label}
                <span
                  className="text-[13px] px-1.5 py-0.5 rounded-full font-bold"
                  style={
                    active
                      ? {
                          backgroundColor: "rgba(124,58,237,0.2)",
                          color: "#a78bfa",
                        }
                      : {
                          backgroundColor: "rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.3)",
                        }
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table / empty */}
        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "#0c0c20",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Header row */}
            <div
              className="px-5 py-3 grid text-[13px] font-semibold uppercase tracking-wider"
              style={{
                gridTemplateColumns: "1fr 110px 80px 110px 100px 48px",
                color: "rgba(255,255,255,0.25)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span>Role</span>
              <span className="hidden sm:block">Type</span>
              <span className="hidden md:block text-right">CVs</span>
              <span className="hidden lg:block">Posted</span>
              <span>Status</span>
              <span />
            </div>

            {/* Job rows */}
            {filtered.map((job, i) => {
              const s = STATUS_STYLES[job.status] ?? STATUS_STYLES.draft;
              return (
                <div
                  key={job.id}
                  className="px-5 py-4 grid items-center transition-colors group"
                  style={{
                    gridTemplateColumns: "1fr 110px 80px 110px 100px 48px",
                    borderTop:
                      i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "rgba(255,255,255,0.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  {/* Role */}
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-[15px] font-semibold text-white group-hover:text-purple-400 transition-colors block truncate"
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-0.5">
                      {job.location && (
                        <span
                          className="flex items-center gap-1 text-[13px]"
                          style={{ color: "rgba(255,255,255,0.28)" }}
                        >
                          <MapPin className="w-2.5 h-2.5" />
                          {job.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <span
                    className="hidden sm:block text-[14px] capitalize"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {job.type?.replace("-", " ") ?? "—"}
                  </span>

                  {/* CVs */}
                  <span className="hidden md:flex justify-end text-[17px] font-semibold text-white">
                    {job.applicationCount ?? 0}
                  </span>

                  {/* Posted */}
                  <span
                    className="hidden lg:flex items-center gap-1 text-[13px]"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    <Calendar className="w-3 h-3" />
                    {formatDate(job.createdAt)}
                  </span>

                  {/* Status badge */}
                  <div>
                    <span
                      className="text-[13px] font-semibold px-2.5 py-1 rounded-full capitalize"
                      style={{
                        backgroundColor: s.bg,
                        color: s.color,
                        border: `1px solid ${s.border}`,
                      }}
                    >
                      {job.status}
                    </span>
                  </div>

                  {/* Actions menu */}
                  <div
                    className="relative flex justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === job.id ? null : job.id)
                      }
                      disabled={actionLoading === job.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "white";
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "rgba(255,255,255,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.3)";
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      {actionLoading === job.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {openMenu === job.id && (
                      <div
                        className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-xl overflow-hidden"
                        style={{
                          backgroundColor: "#13132a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                        }}
                      >
                        <MenuBtn
                          icon={Briefcase}
                          label="View pipeline"
                          onClick={() => {
                            setOpenMenu(null);
                            router.push(`/dashboard/jobs/${job.id}`);
                          }}
                        />
                        <MenuBtn
                          icon={Pencil}
                          label="Edit job"
                          onClick={() => {
                            setOpenMenu(null);
                            router.push(`/dashboard/jobs/${job.id}/edit`);
                          }}
                        />
                        <MenuBtn
                          icon={
                            job.status === "active" ? ToggleLeft : ToggleRight
                          }
                          label={
                            job.status === "active"
                              ? "Close job"
                              : "Activate job"
                          }
                          onClick={() => {
                            setOpenMenu(null);
                            toggleStatus(job);
                          }}
                        />
                        <div
                          style={{
                            height: "1px",
                            backgroundColor: "rgba(255,255,255,0.06)",
                            margin: "2px 0",
                          }}
                        />
                        <MenuBtn
                          icon={Trash2}
                          label="Delete job"
                          danger
                          onClick={() => {
                            setOpenMenu(null);
                            setDeleteTarget(job);
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function MenuBtn({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[14px] font-medium transition-colors"
      style={{ color: danger ? "#f87171" : "rgba(255,255,255,0.6)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = danger
          ? "rgba(239,68,68,0.06)"
          : "rgba(255,255,255,0.04)";
        (e.currentTarget as HTMLElement).style.color = danger
          ? "#f87171"
          : "white";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLElement).style.color = danger
          ? "#f87171"
          : "rgba(255,255,255,0.6)";
      }}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </button>
  );
}

function EmptyState({ filter }: { filter: StatusFilter }) {
  return (
    <div
      className="rounded-2xl py-16 px-6 text-center"
      style={{
        backgroundColor: "#0c0c20",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          backgroundColor: "rgba(124,58,237,0.08)",
          border: "1px solid rgba(124,58,237,0.15)",
        }}
      >
        <Briefcase
          className="w-5 h-5"
          style={{ color: "rgba(139,92,246,0.6)" }}
        />
      </div>
      <p className="text-[16px] font-semibold text-white mb-1">
        {filter === "all" ? "No jobs yet" : `No ${filter} jobs`}
      </p>
      <p
        className="text-[15px] mb-5"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {filter === "all"
          ? "Post your first role and start receiving AI-scored applications."
          : "Switch to a different filter or create a new job."}
      </p>
      {filter === "all" && (
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 text-[13px] font-bold px-4 py-2.5 rounded-xl text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
            boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
          }}
        >
          <Plus className="w-3.5 h-3.5" /> Post a job
        </Link>
      )}
    </div>
  );
}
