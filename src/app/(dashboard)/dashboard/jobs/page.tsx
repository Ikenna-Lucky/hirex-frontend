"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus,
  BriefcaseMetal,
  DotsThree,
  PencilSimple,
  Trash,
  Eye,
  MapPin,
  CalendarBlank,
  Users,
  ToggleLeft,
  ToggleRight,
  CircleNotch,
  FunnelSimple,
  Lock,
  ArrowRight,
} from "@phosphor-icons/react";
import { jobsApi, subscriptionsApi } from "@/lib/api";
import type { SubStatus } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";
import type { AxiosError } from "axios";
import ConfirmModal from "@/components/ConfirmModal";

/* ─────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────── */
type StatusFilter = "all" | "active" | "draft" | "closed" | "archived";

const STATUS_TABS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

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

function getInitials(title: string) {
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
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-24 rounded-lg" />
          <Bone className="h-4 w-32 rounded-md" />
        </div>
        <Bone className="h-10 w-32 rounded-xl" />
      </div>
      {/* tabs */}
      <Bone className="h-10 w-80 rounded-xl" />
      {/* cards */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-2xl"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Bone className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone
                className="h-4 rounded-md"
                style={{ width: `${50 + (i % 4) * 12}%` }}
              />
              <Bone className="h-3 w-40 rounded-md" />
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Bone className="h-8 w-16 rounded-lg" />
              <Bone className="h-8 w-20 rounded-lg" />
            </div>
            <Bone className="w-8 h-8 rounded-lg flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ACTION MENU BUTTON
───────────────────────────────────────── */
function MenuBtn({
  icon: Icon,
  label,
  onClick,
  danger = false,
  iconWeight = "duotone",
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
  iconWeight?: "duotone" | "fill" | "bold" | "regular";
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-all"
      style={{ color: danger ? "#f87171" : "rgba(255,255,255,0.55)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = danger
          ? "rgba(248,113,113,0.08)"
          : "rgba(124,58,237,0.07)";
        (e.currentTarget as HTMLElement).style.color = danger
          ? "#f87171"
          : "white";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = "transparent";
        (e.currentTarget as HTMLElement).style.color = danger
          ? "#f87171"
          : "rgba(255,255,255,0.55)";
      }}
    >
      <Icon weight={iconWeight} size={14} className="flex-shrink-0" />
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */
function EmptyState({ filter }: { filter: StatusFilter }) {
  return (
    <div
      className="rounded-2xl flex flex-col items-center justify-center py-20 text-center anim-2"
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
          size={26}
          style={{ color: "#a78bfa" }}
        />
      </div>
      <p className="text-[17px] font-bold mb-2 text-white">
        {filter === "all" ? "No roles posted yet" : `No ${filter} roles`}
      </p>
      <p
        className="text-[14px] max-w-xs mb-6"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {filter === "all"
          ? "Post your first role and start receiving AI-scored applications."
          : "Try a different filter or post a new role."}
      </p>
      {filter === "all" && (
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold text-white"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
            boxShadow: "0 0 20px rgba(124,58,237,0.3)",
          }}
        >
          <Plus weight="bold" size={16} /> Post your first role
        </Link>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [sub, setSub] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchJobs();
    // Fetch subscription status in parallel — used for the upgrade banner
    subscriptionsApi
      .status()
      .then((r) => setSub(r.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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

  if (loading) return <SkeletonPage />;

  const filtered =
    filter === "all" ? jobs : jobs.filter((j) => j.status === filter);

  const activeCount = jobs.filter((j) => j.status === "active").length;
  const totalCVs = jobs.reduce((s, j) => s + (j.applicationCount ?? 0), 0);

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

      <div className="space-y-6">
        {/* ══ UPGRADE BANNER — shown when free quota is exhausted ══ */}
        {sub?.quotaExhausted && (
          <div
            className="flex items-center gap-4 px-5 py-4 rounded-2xl anim-1"
            style={{
              background:
                "linear-gradient(135deg,rgba(124,58,237,0.1) 0%,rgba(109,40,217,0.06) 100%)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <Lock weight="fill" size={16} style={{ color: "#a78bfa" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-white">
                Free post used
              </p>
              <p
                className="text-[13px]"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                You've used your 1 free role post. Upgrade to post more and
                scale your hiring.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                boxShadow: "0 0 16px rgba(124,58,237,0.3)",
              }}
            >
              Upgrade <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* ══ HEADER ══ */}
        <div className="flex items-start justify-between gap-4 anim-1">
          <div>
            <h1 className="text-[28px] font-extrabold text-white tracking-tight">
              Roles
            </h1>
            <p
              className="text-[14px] mt-1"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {jobs.length} role{jobs.length !== 1 ? "s" : ""} · {activeCount}{" "}
              active · {totalCVs} CVs received
            </p>
          </div>
          <Link
            href="/dashboard/jobs/new"
            className="flex-shrink-0 flex items-center gap-2 text-white text-[14px] font-bold px-5 py-2.5 rounded-xl transition-all"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
              boxShadow: "0 0 24px rgba(124,58,237,0.35)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 36px rgba(124,58,237,0.52)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 24px rgba(124,58,237,0.35)";
            }}
          >
            <Plus weight="bold" size={16} />
            Post a role
          </Link>
        </div>

        {/* ══ FILTER TABS ══ */}
        <div className="flex items-center gap-2 flex-wrap anim-2">
          <FunnelSimple
            weight="duotone"
            size={15}
            style={{ color: "rgba(255,255,255,0.25)" }}
          />
          <div
            className="flex gap-1 p-1 rounded-xl"
            style={{
              background: "#111118",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {STATUS_TABS.map((tab) => {
              const count =
                tab.key === "all"
                  ? jobs.length
                  : jobs.filter((j) => j.status === tab.key).length;
              const isActive = filter === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all"
                  style={
                    isActive
                      ? {
                          background: "rgba(124,58,237,0.18)",
                          color: "#a78bfa",
                          border: "1px solid rgba(124,58,237,0.28)",
                        }
                      : {
                          color: "rgba(255,255,255,0.38)",
                          border: "1px solid transparent",
                        }
                  }
                >
                  {tab.label}
                  <span
                    className="text-[11px] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
                    style={
                      isActive
                        ? {
                            background: "rgba(124,58,237,0.25)",
                            color: "#a78bfa",
                          }
                        : {
                            background: "rgba(255,255,255,0.07)",
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
        </div>

        {/* ══ JOB CARDS ══ */}
        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-3">
            {filtered.map((job, i) => {
              const s = STATUS_MAP[job.status] ?? STATUS_MAP.draft;
              const gradient = JOB_GRADIENTS[i % JOB_GRADIENTS.length];
              const initials = getInitials(job.title);
              const isMenuOpen = openMenu === job.id;

              return (
                <div
                  key={job.id}
                  className="group flex items-center gap-4 p-5 rounded-2xl transition-all"
                  style={{
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.07)",
                    animation: `fade-up-in 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 55 + 80}ms both`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(124,58,237,0.22)";
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(124,58,237,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "rgba(255,255,255,0.07)";
                    (e.currentTarget as HTMLElement).style.background =
                      "#111118";
                  }}
                >
                  {/* Gradient avatar */}
                  <Link
                    href={`/dashboard/jobs/${job.id}`}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-extrabold text-white flex-shrink-0 transition-transform"
                    style={{ background: gradient }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform =
                        "scale(1)";
                    }}
                  >
                    {initials}
                  </Link>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/jobs/${job.id}`}
                      className="text-[15px] font-semibold truncate block transition-colors"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "#a78bfa";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.9)";
                      }}
                    >
                      {job.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {job.location && (
                        <span
                          className="flex items-center gap-1 text-[12px]"
                          style={{ color: "rgba(255,255,255,0.28)" }}
                        >
                          <MapPin weight="fill" size={11} /> {job.location}
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
                  <div className="hidden sm:flex flex-col items-center flex-shrink-0 min-w-[56px]">
                    <div className="flex items-center gap-1.5">
                      <Users
                        weight="duotone"
                        size={13}
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      />
                      <span className="text-[16px] font-bold text-white tabular-nums">
                        {job.applicationCount ?? 0}
                      </span>
                    </div>
                    <span
                      className="text-[10px] mt-0.5"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      CVs
                    </span>
                  </div>

                  {/* Date */}
                  <div className="hidden lg:flex flex-col items-end flex-shrink-0 min-w-[96px]">
                    <span
                      className="flex items-center gap-1 text-[12px]"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      <CalendarBlank weight="fill" size={11} />
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

                  {/* Actions */}
                  <div
                    className="relative flex-shrink-0"
                    ref={isMenuOpen ? menuRef : undefined}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setOpenMenu(isMenuOpen ? null : job.id)}
                      disabled={actionLoading === job.id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                      style={{
                        color: "rgba(255,255,255,0.3)",
                        border: "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color = "white";
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "rgba(255,255,255,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.3)";
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          "transparent";
                      }}
                    >
                      {actionLoading === job.id ? (
                        <CircleNotch size={14} className="animate-spin" />
                      ) : (
                        <DotsThree weight="bold" size={18} />
                      )}
                    </button>

                    {isMenuOpen && (
                      <div
                        className="absolute right-0 top-full mt-2 z-30 w-48 rounded-2xl overflow-hidden py-1"
                        style={{
                          background: "#16162a",
                          border: "1px solid rgba(255,255,255,0.1)",
                          boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
                        }}
                      >
                        <MenuBtn
                          icon={Eye}
                          label="View pipeline"
                          iconWeight="duotone"
                          onClick={() => {
                            setOpenMenu(null);
                            router.push(`/dashboard/jobs/${job.id}`);
                          }}
                        />
                        <MenuBtn
                          icon={PencilSimple}
                          label="Edit job"
                          iconWeight="duotone"
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
                          iconWeight="duotone"
                          onClick={() => {
                            setOpenMenu(null);
                            toggleStatus(job);
                          }}
                        />
                        <div
                          style={{
                            height: "1px",
                            background: "rgba(255,255,255,0.06)",
                            margin: "4px 0",
                          }}
                        />
                        <MenuBtn
                          icon={Trash}
                          label="Delete job"
                          danger
                          iconWeight="duotone"
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
