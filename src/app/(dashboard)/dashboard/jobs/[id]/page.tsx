"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CaretLeft,
  CircleNotch,
  PencilSimple,
  Users,
  ArrowSquareOut,
  CaretDown,
  CaretUp,
  CheckCircle,
  Clock,
  Warning,
  XCircle,
  MapPin,
  Briefcase,
  CurrencyDollar,
  CalendarBlank,
  Sparkle,
  Robot,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import { jobsApi, applicationsApi } from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Job, Application, ApplicationStage } from "@/types";

/* ── Stage config ─────────────────────────────────────────── */
const ALL_STAGES: ApplicationStage[] = [
  "applied",
  "screening",
  "shortlisted",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
];

const STAGE_LABELS: Record<ApplicationStage, string> = {
  applied: "Applied",
  screening: "Screening",
  shortlisted: "Shortlisted",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

type StageStyle = { color: string; bg: string; border: string };
const STAGE_STYLES: Record<ApplicationStage, StageStyle> = {
  applied: {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
  },
  screening: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  },
  shortlisted: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  interview: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
  },
  offer: {
    color: "#c084fc",
    bg: "rgba(192,132,252,0.1)",
    border: "rgba(192,132,252,0.2)",
  },
  rejected: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.1)",
    border: "rgba(248,113,113,0.2)",
  },
  withdrawn: {
    color: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
    border: "rgba(107,114,128,0.2)",
  },
};

/* ── Scoring status icons ─────────────────────────────────── */
const SCORING_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock weight="duotone" size={16} style={{ color: "#6b7280" }} />,
  processing: (
    <CircleNotch
      size={16}
      className="animate-spin"
      style={{ color: "#a78bfa" }}
    />
  ),
  completed: (
    <CheckCircle weight="fill" size={16} style={{ color: "#34d399" }} />
  ),
  failed: <Warning weight="fill" size={16} style={{ color: "#f87171" }} />,
};

/* ── Score helpers ────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}
function scoreBg(score: number) {
  if (score >= 75) return "rgba(52,211,153,0.12)";
  if (score >= 50) return "rgba(251,191,36,0.12)";
  return "rgba(248,113,113,0.12)";
}

/* ── JSON array parser ────────────────────────────────────── */
function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

/* ── Initials avatar ──────────────────────────────────────── */
function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2);

  // Deterministic hue from name
  const hue = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, hsl(${hue},60%,45%), hsl(${(hue + 40) % 360},70%,35%))`,
      }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

type StageFilter = "all" | ApplicationStage;

/* ════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════ */
export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [movingStage, setMovingStage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        jobsApi.get(id),
        applicationsApi.listByJob(id),
      ]);
      setJob(jobRes.data.data?.job ?? jobRes.data.data);
      const apps = appsRes.data.data?.applications ?? appsRes.data.data ?? [];
      setApplications(Array.isArray(apps) ? apps : []);
    } catch {
      toast.error("Failed to load pipeline.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── Derived data ─────────────────────────────────── */
  const filteredApps =
    stageFilter === "all"
      ? applications
      : applications.filter((a) => a.stage === stageFilter);

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (a.scoringStatus === "completed" && b.scoringStatus !== "completed")
      return -1;
    if (b.scoringStatus === "completed" && a.scoringStatus !== "completed")
      return 1;
    return (b.aiScore ?? 0) - (a.aiScore ?? 0);
  });

  const stageCounts = ALL_STAGES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = applications.filter((a) => a.stage === s).length;
    return acc;
  }, {});

  const aiScoredCount = applications.filter(
    (a) => a.scoringStatus === "completed",
  ).length;
  const shortlistedCount = applications.filter(
    (a) => a.stage === "shortlisted",
  ).length;

  async function moveStage(app: Application, newStage: ApplicationStage) {
    setMovingStage(app.id);
    try {
      await applicationsApi.updateStage(app.id, newStage);
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, stage: newStage } : a)),
      );
      toast.success(`Moved to ${STAGE_LABELS[newStage]}.`);
    } catch {
      toast.error("Failed to update stage.");
    } finally {
      setMovingStage(null);
    }
  }

  /* ── Skeleton ─────────────────────────────────────── */
  if (loading) return <SkeletonPage />;

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Warning
          weight="duotone"
          size={36}
          style={{ color: "rgba(255,255,255,0.2)" }}
        />
        <p style={{ color: "rgba(255,255,255,0.35)" }} className="text-[15px]">
          Job not found.
        </p>
        <Link
          href="/dashboard/jobs"
          className="text-[13px] mt-1"
          style={{ color: "#a78bfa" }}
        >
          ← Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* ── Back ── */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors anim-1"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#a78bfa";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)";
        }}
      >
        <CaretLeft weight="bold" size={14} />
        Back to jobs
      </Link>

      {/* ── Hero header ── */}
      <div
        className="relative rounded-2xl overflow-hidden px-8 py-7 anim-1"
        style={{
          background:
            "linear-gradient(135deg,#0e0e1a 0%,#13102a 45%,#0e0e1a 100%)",
          border: "1px solid rgba(124,58,237,0.22)",
        }}
      >
        {/* Orb */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle,rgba(124,58,237,0.18) 0%,transparent 65%)",
          }}
        />

        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0 flex-1">
            {/* Status + title */}
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={
                  job.status === "active"
                    ? {
                        color: "#34d399",
                        background: "rgba(52,211,153,0.12)",
                        border: "1px solid rgba(52,211,153,0.2)",
                      }
                    : {
                        color: "#6b7280",
                        background: "rgba(107,114,128,0.1)",
                        border: "1px solid rgba(107,114,128,0.2)",
                      }
                }
              >
                {job.status}
              </span>
            </div>
            <h1 className="text-[26px] font-extrabold text-white tracking-tight leading-tight">
              {job.title}
            </h1>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3">
              {job.location && (
                <span
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <MapPin
                    weight="duotone"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />
                  {job.location}
                </span>
              )}
              {job.type && (
                <span
                  className="flex items-center gap-1.5 text-[13px] capitalize"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <Briefcase
                    weight="duotone"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />
                  {job.type.replace("-", " ")}
                </span>
              )}
              {(job.salaryMin || job.salaryMax) && (
                <span
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <CurrencyDollar
                    weight="duotone"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />
                  {job.salaryMin && job.salaryMax
                    ? `${formatCurrency(job.salaryMin, job.salaryCurrency ?? "NGN")} – ${formatCurrency(job.salaryMax, job.salaryCurrency ?? "NGN")}`
                    : job.salaryMin
                      ? `From ${formatCurrency(job.salaryMin, job.salaryCurrency ?? "NGN")}`
                      : `Up to ${formatCurrency(job.salaryMax!, job.salaryCurrency ?? "NGN")}`}
                </span>
              )}
              {job.closesAt && (
                <span
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <CalendarBlank
                    weight="duotone"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />
                  Closes {formatDate(job.closesAt)}
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mt-5">
              <Stat label="Applications" value={applications.length} />
              <Stat label="AI Scored" value={aiScoredCount} accent />
              <Stat label="Shortlisted" value={shortlistedCount} />
              <Stat label="Posted" value={formatDate(job.createdAt)} raw />
            </div>
          </div>

          {/* Edit button */}
          <Link
            href={`/dashboard/jobs/${id}/edit`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold flex-shrink-0 transition-all"
            style={{
              color: "#a78bfa",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(124,58,237,0.18)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(124,58,237,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(124,58,237,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(124,58,237,0.25)";
            }}
          >
            <PencilSimple weight="duotone" size={14} />
            Edit job
          </Link>
        </div>
      </div>

      {/* ── Stage filter tabs ── */}
      <div className="anim-2 flex gap-1.5 flex-wrap">
        <TabBtn
          active={stageFilter === "all"}
          onClick={() => setStageFilter("all")}
          label="All"
          count={applications.length}
        />
        {ALL_STAGES.filter((s) => s !== "withdrawn").map((stage) => (
          <TabBtn
            key={stage}
            active={stageFilter === stage}
            onClick={() => setStageFilter(stage)}
            label={STAGE_LABELS[stage]}
            count={stageCounts[stage]}
            style={STAGE_STYLES[stage]}
          />
        ))}
      </div>

      {/* ── Application list ── */}
      <div className="anim-3">
        {sortedApps.length === 0 ? (
          <EmptyState stageFilter={stageFilter} />
        ) : (
          <div className="space-y-3">
            {sortedApps.map((app, i) => (
              <div
                key={app.id}
                style={{
                  animation: `fade-up-in 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 55 + 80}ms both`,
                }}
              >
                <ApplicationCard
                  app={app}
                  expanded={expanded === app.id}
                  onToggle={() =>
                    setExpanded(expanded === app.id ? null : app.id)
                  }
                  onMoveStage={moveStage}
                  movingStage={movingStage === app.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   STAT CHIP
════════════════════════════════════════════════════════════ */
function Stat({
  label,
  value,
  accent,
  raw,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
  raw?: boolean;
}) {
  return (
    <div>
      <p
        className="text-[22px] font-extrabold leading-none"
        style={{
          color: accent ? "#a78bfa" : raw ? "rgba(255,255,255,0.55)" : "#fff",
        }}
      >
        {raw ? (
          <span className="text-[14px] font-semibold">{value}</span>
        ) : (
          value
        )}
      </p>
      <p
        className="text-[11px] mt-1 uppercase tracking-wide font-medium"
        style={{ color: "rgba(255,255,255,0.28)" }}
      >
        {label}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   TAB BUTTON
════════════════════════════════════════════════════════════ */
function TabBtn({
  active,
  onClick,
  label,
  count,
  style: stageStyle,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  style?: StageStyle;
}) {
  const activeColor = stageStyle?.color ?? "#a78bfa";
  const activeBg = stageStyle?.bg ?? "rgba(124,58,237,0.12)";
  const activeBorder = stageStyle?.border ?? "rgba(124,58,237,0.25)";

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
      style={
        active
          ? {
              color: activeColor,
              background: activeBg,
              border: `1px solid ${activeBorder}`,
            }
          : {
              color: "rgba(255,255,255,0.35)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }
      }
      onMouseEnter={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.7)";
      }}
      onMouseLeave={(e) => {
        if (!active)
          (e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)";
      }}
    >
      {label}
      {count > 0 && (
        <span
          className="px-1.5 py-px rounded-full text-[11px] font-semibold"
          style={
            active
              ? { color: activeColor, background: activeBg }
              : {
                  color: "rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.06)",
                }
          }
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   APPLICATION CARD
════════════════════════════════════════════════════════════ */
function ApplicationCard({
  app,
  expanded,
  onToggle,
  onMoveStage,
  movingStage,
}: {
  app: Application;
  expanded: boolean;
  onToggle: () => void;
  onMoveStage: (app: Application, stage: ApplicationStage) => void;
  movingStage: boolean;
}) {
  const [showStageMenu, setShowStageMenu] = useState(false);
  const strengths = parseJsonArray(app.aiStrengths);
  const weaknesses = parseJsonArray(app.aiWeaknesses);
  const hasAi = app.scoringStatus === "completed" && app.aiScore !== null;
  const candidateName = `${app.candidate.firstName} ${app.candidate.lastName}`;
  const stageStyle = STAGE_STYLES[app.stage];
  const otherStages = ALL_STAGES.filter((s) => s !== app.stage);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: "#111118",
        border: expanded
          ? "1px solid rgba(124,58,237,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* ── Main row ── */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Candidate avatar */}
        <Avatar name={candidateName} />

        {/* Score badge */}
        <div className="flex-shrink-0">
          {hasAi ? (
            <div
              className="w-11 h-11 rounded-xl flex flex-col items-center justify-center"
              style={{
                background: scoreBg(app.aiScore!),
                border: `1px solid ${scoreColor(app.aiScore!)}30`,
              }}
            >
              <span
                className="text-[15px] font-extrabold leading-none"
                style={{ color: scoreColor(app.aiScore!) }}
              >
                {app.aiScore}
              </span>
              <span
                className="text-[9px] font-semibold mt-0.5 uppercase tracking-wide"
                style={{ color: scoreColor(app.aiScore!) + "aa" }}
              >
                score
              </span>
            </div>
          ) : (
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              title={app.scoringStatus}
            >
              {SCORING_ICONS[app.scoringStatus] ?? SCORING_ICONS.pending}
            </div>
          )}
        </div>

        {/* Candidate info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <p className="text-[15px] font-semibold text-white">
              {candidateName}
            </p>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                color: stageStyle.color,
                background: stageStyle.bg,
                border: `1px solid ${stageStyle.border}`,
              }}
            >
              {STAGE_LABELS[app.stage]}
            </span>
          </div>
          <p
            className="text-[12px] mt-0.5 flex items-center gap-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            <EnvelopeSimple size={11} />
            {app.candidate.email}
          </p>
          {app.aiSummary && (
            <p
              className="text-[12px] mt-2 leading-relaxed line-clamp-2"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {app.aiSummary}
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-2 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* View CV */}
          <a
            href={app.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              color: "rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            title="View CV"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#a78bfa";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(124,58,237,0.3)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(124,58,237,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.3)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
            }}
          >
            <ArrowSquareOut weight="bold" size={14} />
          </a>

          {/* Move stage dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStageMenu((v) => !v)}
              disabled={movingStage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all disabled:opacity-40"
              style={{
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                if (!movingStage)
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(255,255,255,0.85)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.5)";
              }}
            >
              {movingStage ? (
                <CircleNotch size={13} className="animate-spin" />
              ) : (
                <>
                  Move
                  <CaretDown weight="bold" size={10} />
                </>
              )}
            </button>

            {showStageMenu && (
              <div
                className="absolute right-0 top-full mt-1.5 z-20 w-40 rounded-xl overflow-hidden py-1"
                style={{
                  background: "#1a1a28",
                  border: "1px solid rgba(255,255,255,0.1)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                }}
                onMouseLeave={() => setShowStageMenu(false)}
              >
                {otherStages.map((s) => {
                  const ss = STAGE_STYLES[s];
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setShowStageMenu(false);
                        onMoveStage(app, s);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium transition-colors flex items-center gap-2.5"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLElement).style.color = ss.color;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "";
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.55)";
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: ss.color }}
                      />
                      {STAGE_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Expand toggle */}
          {(hasAi || app.coverLetter) && (
            <button
              onClick={onToggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                color: expanded ? "#a78bfa" : "rgba(255,255,255,0.3)",
                background: expanded
                  ? "rgba(124,58,237,0.12)"
                  : "rgba(255,255,255,0.04)",
                border: expanded
                  ? "1px solid rgba(124,58,237,0.25)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {expanded ? (
                <CaretUp weight="bold" size={13} />
              ) : (
                <CaretDown weight="bold" size={13} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded AI analysis ── */}
      {expanded && (
        <div
          className="px-5 py-5 space-y-5"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          {/* Cover letter */}
          {app.coverLetter && (
            <div>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Cover letter
              </p>
              <p
                className="text-[13px] leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {app.coverLetter}
              </p>
            </div>
          )}

          {/* AI analysis */}
          {hasAi && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Robot
                  weight="duotone"
                  size={13}
                  style={{ color: "#a78bfa" }}
                />
                <p
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  AI analysis
                </p>
              </div>

              {app.aiSummary && (
                <p
                  className="text-[13px] leading-relaxed mb-4 pb-4"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {app.aiSummary}
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Strengths */}
                {strengths.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(52,211,153,0.05)",
                      border: "1px solid rgba(52,211,153,0.12)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-widest mb-3"
                      style={{ color: "#34d399" }}
                    >
                      Strengths
                    </p>
                    <ul className="space-y-2">
                      {strengths.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px]"
                          style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          <CheckCircle
                            weight="fill"
                            size={14}
                            style={{
                              color: "#34d399",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gaps */}
                {weaknesses.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(248,113,113,0.05)",
                      border: "1px solid rgba(248,113,113,0.12)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-widest mb-3"
                      style={{ color: "#f87171" }}
                    >
                      Gaps
                    </p>
                    <ul className="space-y-2">
                      {weaknesses.map((w, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px]"
                          style={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          <XCircle
                            weight="fill"
                            size={14}
                            style={{
                              color: "#f87171",
                              flexShrink: 0,
                              marginTop: 2,
                            }}
                          />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex items-center gap-5 pt-1 flex-wrap">
            <span
              className="text-[11px]"
              style={{ color: "rgba(255,255,255,0.22)" }}
            >
              Applied {formatDate(app.createdAt)}
            </span>
            {app.scoredAt && (
              <span
                className="text-[11px]"
                style={{ color: "rgba(255,255,255,0.22)" }}
              >
                Scored {formatDate(app.scoredAt)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════════════════════════ */
function EmptyState({ stageFilter }: { stageFilter: StageFilter }) {
  return (
    <div
      className="rounded-2xl py-20 flex flex-col items-center gap-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <Users weight="duotone" size={20} style={{ color: "#a78bfa" }} />
      </div>
      <p className="text-[15px] font-semibold text-white">
        {stageFilter === "all"
          ? "No applications yet"
          : `No candidates in ${STAGE_LABELS[stageFilter as ApplicationStage]}`}
      </p>
      <p
        className="text-[13px] text-center max-w-xs"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {stageFilter === "all"
          ? "Share the job link and candidates will appear here once they apply."
          : "Move candidates to this stage from the pipeline view."}
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   SKELETON
════════════════════════════════════════════════════════════ */
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
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Back */}
      <Bone style={{ width: 90, height: 18 }} />

      {/* Hero */}
      <div
        className="rounded-2xl p-8 space-y-4"
        style={{
          background: "#0e0e1a",
          border: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <Bone style={{ width: 60, height: 20, borderRadius: 999 }} />
        <Bone style={{ width: 320, height: 30 }} />
        <div className="flex gap-4">
          <Bone style={{ width: 110, height: 16 }} />
          <Bone style={{ width: 90, height: 16 }} />
          <Bone style={{ width: 140, height: 16 }} />
        </div>
        <div className="flex gap-8 pt-2">
          {[60, 60, 70, 90].map((w, i) => (
            <Bone key={i} style={{ width: w, height: 40 }} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[50, 75, 85, 75, 80, 70].map((w, i) => (
          <Bone key={i} style={{ width: w, height: 36, borderRadius: 12 }} />
        ))}
      </div>

      {/* Cards */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Bone style={{ width: 44, height: 44, borderRadius: 12 }} />
          <Bone style={{ width: 44, height: 44, borderRadius: 12 }} />
          <div className="flex-1 space-y-2">
            <Bone style={{ width: "40%", height: 16 }} />
            <Bone style={{ width: "25%", height: 12 }} />
            <Bone style={{ width: "70%", height: 12 }} />
          </div>
          <div className="flex gap-2">
            <Bone style={{ width: 36, height: 36, borderRadius: 12 }} />
            <Bone style={{ width: 70, height: 36, borderRadius: 12 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
