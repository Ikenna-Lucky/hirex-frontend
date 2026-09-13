"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BriefcaseMetal,
  CalendarBlank,
  CaretRight,
  CircleNotch,
  DotsThree,
  Eye,
  FunnelSimple,
  Lock,
  MapPin,
  PencilSimple,
  Plus,
  Trash,
  Users,
  ToggleLeft,
  ToggleRight,
} from "@phosphor-icons/react";
import ConfirmModal from "@/components/ConfirmModal";
import { jobsApi, subscriptionsApi } from "@/lib/api";
import type { SubStatus } from "@/lib/api";
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

const STATUS_MAP: Record<
  string,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.18)",
    dot: "#34d399",
  },
  draft: {
    label: "Draft",
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.14)",
    dot: "#94a3b8",
  },
  closed: {
    label: "Closed",
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.16)",
    dot: "#f87171",
  },
  archived: {
    label: "Archived",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.08)",
    border: "rgba(107,114,128,0.13)",
    dot: "#6b7280",
  },
};

function getInitials(title: string) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function Bone({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-28" />
          <Bone className="h-4 w-52" />
        </div>
        <Bone className="h-10 w-32" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Bone key={item} className="h-24" />
        ))}
      </div>
      <Bone className="h-11 w-full max-w-xl" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((item) => (
          <Bone key={item} className="h-[86px]" />
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const state = STATUS_MAP[status] ?? STATUS_MAP.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[12px] font-bold capitalize"
      style={{
        color: state.color,
        background: state.bg,
        borderColor: state.border,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: state.dot,
          boxShadow: status === "active" ? `0 0 7px ${state.dot}` : "none",
        }}
      />
      {state.label}
    </span>
  );
}

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
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-[13px] font-semibold transition ${
        danger
          ? "text-red-300 hover:bg-red-400/[0.08]"
          : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
      }`}
    >
      <Icon weight={iconWeight} size={15} className="flex-shrink-0" />
      {label}
    </button>
  );
}

function EmptyState({ filter }: { filter: StatusFilter }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-[#0d0f16] px-5 py-20 text-center anim-2">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10">
        <BriefcaseMetal
          weight="duotone"
          size={24}
          className="text-violet-300"
        />
      </div>
      <p className="text-[16px] font-bold text-white">
        {filter === "all" ? "No roles posted yet" : `No ${filter} roles`}
      </p>
      <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
        {filter === "all"
          ? "Post your first role and start receiving AI-scored applications."
          : "Try a different filter or post a new role."}
      </p>
      {filter === "all" && (
        <Link
          href="/dashboard/jobs/new"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
        >
          <Plus weight="bold" size={16} />
          Post your first role
        </Link>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4">
      <p className="text-[12px] font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-[28px] font-black leading-none text-white tabular-nums">
        {value.toLocaleString()}
      </p>
      <p className="mt-2 text-[12px] text-slate-600">{detail}</p>
    </div>
  );
}

function RoleRow({
  job,
  actionLoading,
  isMenuOpen,
  menuRef,
  onOpenMenu,
  onCloseMenu,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
}: {
  job: Job;
  actionLoading: boolean;
  isMenuOpen: boolean;
  menuRef?: React.RefObject<HTMLDivElement | null>;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
  onView: () => void;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
}) {
  const initials = getInitials(job.title);

  return (
    <article className="group relative grid gap-4 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4 transition hover:border-violet-400/20 hover:bg-violet-400/[0.035] md:grid-cols-[minmax(0,1fr)_88px_110px_96px_36px] md:items-center">
      <div className="flex min-w-0 items-start gap-3">
        <Link
          href={`/dashboard/jobs/${job.id}`}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 text-[12px] font-black text-white"
          aria-label={`Open ${job.title}`}
        >
          {initials}
        </Link>

        <div className="min-w-0">
          <Link
            href={`/dashboard/jobs/${job.id}`}
            className="block truncate text-[15px] font-bold text-slate-100 transition hover:text-violet-200"
          >
            {job.title}
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
            {job.location && (
              <span className="inline-flex items-center gap-1 text-[12px] text-slate-600">
                <MapPin weight="fill" size={11} />
                {job.location}
              </span>
            )}
            {job.type && (
              <span className="rounded-md bg-white/[0.055] px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-500">
                {job.type.replace("-", " ")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 md:hidden">
          CVs
        </p>
        <div className="flex items-center gap-1.5 md:justify-end">
          <Users weight="duotone" size={14} className="text-slate-600" />
          <span className="text-[15px] font-bold text-white tabular-nums">
            {job.applicationCount ?? 0}
          </span>
        </div>
      </div>

      <div className="hidden text-right text-[12px] text-slate-600 md:block">
        <span className="inline-flex items-center gap-1">
          <CalendarBlank weight="fill" size={11} />
          {formatDate(job.createdAt)}
        </span>
      </div>

      <div className="flex md:justify-end">
        <StatusBadge status={job.status} />
      </div>

      <div
        className="absolute right-4 top-4 md:static"
        ref={isMenuOpen ? menuRef : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onOpenMenu}
          disabled={actionLoading}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-slate-600 transition hover:border-white/[0.08] hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Open actions for ${job.title}`}
        >
          {actionLoading ? (
            <CircleNotch size={15} className="animate-spin" />
          ) : (
            <DotsThree weight="bold" size={20} />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-lg border border-white/[0.09] bg-[#121420] py-1 shadow-2xl shadow-black/60">
            <MenuBtn
              icon={Eye}
              label="View pipeline"
              onClick={() => {
                onCloseMenu();
                onView();
              }}
            />
            <MenuBtn
              icon={PencilSimple}
              label="Edit role"
              onClick={() => {
                onCloseMenu();
                onEdit();
              }}
            />
            <MenuBtn
              icon={job.status === "active" ? ToggleLeft : ToggleRight}
              label={job.status === "active" ? "Close role" : "Activate role"}
              onClick={() => {
                onCloseMenu();
                onToggleStatus();
              }}
            />
            <div className="my-1 h-px bg-white/[0.06]" />
            <MenuBtn
              icon={Trash}
              label="Delete role"
              danger
              onClick={() => {
                onCloseMenu();
                onDelete();
              }}
            />
          </div>
        )}
      </div>
    </article>
  );
}

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
    subscriptionsApi
      .status()
      .then((res) => setSub(res.data.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
      toast.error("Failed to load roles.");
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
        prev.map((item) =>
          item.id === job.id
            ? { ...item, status: next as Job["status"] }
            : item,
        ),
      );
      toast.success(`Role ${next === "active" ? "activated" : "closed"}.`);
    } catch {
      toast.error("Failed to update role status.");
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
      setJobs((prev) => prev.filter((item) => item.id !== job.id));
      toast.success("Role deleted.");
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      toast.error(error.response?.data?.message ?? "Failed to delete role.");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) return <SkeletonPage />;

  const filtered =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  const activeCount = jobs.filter((job) => job.status === "active").length;
  const draftCount = jobs.filter((job) => job.status === "draft").length;
  const totalCVs = jobs.reduce(
    (sum, job) => sum + (job.applicationCount ?? 0),
    0,
  );

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this role?"
        message={`"${deleteTarget?.title}" and all its applications will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete role"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="space-y-5">
        {sub?.quotaExhausted && (
          <div className="flex flex-col gap-4 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] px-4 py-4 anim-1 sm:flex-row sm:items-center">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-300">
              <Lock weight="fill" size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-bold text-white">Free post used</p>
              <p className="mt-0.5 text-[13px] leading-5 text-slate-500">
                You have used your 1 free role post. Upgrade to post more roles
                and keep hiring.
              </p>
            </div>
            <Link
              href="/dashboard/billing"
              className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-violet-500"
            >
              Upgrade
              <ArrowRight size={13} />
            </Link>
          </div>
        )}

        <div className="flex flex-col justify-between gap-4 anim-1 sm:flex-row sm:items-start">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
              Roles
            </p>
            <h1 className="mt-2 text-[26px] font-black leading-tight tracking-tight text-white">
              Manage open roles
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
              {jobs.length} role{jobs.length !== 1 ? "s" : ""} - {activeCount}{" "}
              active - {totalCVs} CVs received
            </p>
          </div>
          <Link
            href="/dashboard/jobs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
          >
            <Plus weight="bold" size={16} />
            Post a role
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 anim-2">
          <SummaryCard
            label="Total roles"
            value={jobs.length}
            detail="All roles in this workspace"
          />
          <SummaryCard
            label="Active postings"
            value={activeCount}
            detail={`${draftCount} draft${draftCount !== 1 ? "s" : ""} waiting`}
          />
          <SummaryCard
            label="Applications"
            value={totalCVs}
            detail="CVs received across roles"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 anim-2">
          <FunnelSimple
            weight="duotone"
            size={15}
            className="hidden flex-shrink-0 text-slate-600 sm:block"
          />
          <div className="flex min-w-max gap-1 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-1">
            {STATUS_TABS.map((tab) => {
              const count =
                tab.key === "all"
                  ? jobs.length
                  : jobs.filter((job) => job.status === tab.key).length;
              const isActive = filter === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilter(tab.key)}
                  className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[13px] font-bold transition ${
                    isActive
                      ? "border-violet-400/20 bg-violet-400/[0.14] text-violet-200"
                      : "border-transparent text-slate-500 hover:bg-white/[0.045] hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[11px] tabular-nums ${
                      isActive
                        ? "bg-violet-400/15 text-violet-200"
                        : "bg-white/[0.06] text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <div className="space-y-2 anim-3">
            {filtered.map((job) => (
              <RoleRow
                key={job.id}
                job={job}
                actionLoading={actionLoading === job.id}
                isMenuOpen={openMenu === job.id}
                menuRef={menuRef}
                onOpenMenu={() =>
                  setOpenMenu((current) => (current === job.id ? null : job.id))
                }
                onCloseMenu={() => setOpenMenu(null)}
                onView={() => router.push(`/dashboard/jobs/${job.id}`)}
                onEdit={() => router.push(`/dashboard/jobs/${job.id}/edit`)}
                onToggleStatus={() => toggleStatus(job)}
                onDelete={() => setDeleteTarget(job)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
