"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowSquareOut,
  Briefcase,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretUp,
  CheckCircle,
  CircleNotch,
  CurrencyDollar,
  EnvelopeSimple,
  MapPin,
  PencilSimple,
  Robot,
  UserCircle,
  Users,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import { applicationsApi, jobsApi } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Application, ApplicationStage, Job } from "@/types";

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

const STAGE_STYLES: Record<
  ApplicationStage,
  { color: string; bg: string; border: string }
> = {
  applied: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
  screening: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.2)" },
  shortlisted: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  interview: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" },
  offer: { color: "#c084fc", bg: "rgba(192,132,252,0.1)", border: "rgba(192,132,252,0.2)" },
  rejected: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)" },
  withdrawn: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)" },
};

type StageFilter = "all" | ApplicationStage;

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function scoreColor(score: number) {
  if (score >= 75) return "#34d399";
  if (score >= 50) return "#fbbf24";
  return "#f87171";
}

function candidateName(app: Application) {
  return `${app.candidate.firstName} ${app.candidate.lastName}`.trim();
}

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)?.[0]}` : name.slice(0, 2)).toUpperCase();
}

function hue(name: string) {
  return name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
}

function Avatar({ name }: { name: string }) {
  const h = hue(name);
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[13px] font-black text-white"
      style={{
        background: `linear-gradient(135deg, hsl(${h},60%,42%), hsl(${(h + 42) % 360},70%,32%))`,
      }}
    >
      {initials(name)}
    </div>
  );
}

function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ background: "rgba(255,255,255,0.06)" }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="space-y-5">
      <Bone className="h-4 w-28" />
      <Bone className="h-48" />
      <Bone className="h-11 w-full max-w-4xl" />
      {[0, 1, 2, 3].map((item) => (
        <Bone key={item} className="h-24" />
      ))}
    </div>
  );
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
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

  async function moveStage(app: Application, newStage: ApplicationStage) {
    setMovingStage(app.id);
    try {
      await applicationsApi.updateStage(app.id, newStage);
      setApplications((prev) =>
        prev.map((item) =>
          item.id === app.id ? { ...item, stage: newStage } : item,
        ),
      );
      toast.success(`Moved to ${STAGE_LABELS[newStage]}.`);
    } catch {
      toast.error("Failed to update stage.");
    } finally {
      setMovingStage(null);
    }
  }

  if (loading) return <SkeletonPage />;

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-600">
          <Warning weight="duotone" size={24} />
        </div>
        <p className="text-[16px] font-bold text-white">Role not found</p>
        <Link
          href="/dashboard/jobs"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
        >
          <CaretLeft weight="bold" size={14} />
          Back to roles
        </Link>
      </div>
    );
  }

  const filteredApps =
    stageFilter === "all"
      ? applications
      : applications.filter((app) => app.stage === stageFilter);
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (a.scoringStatus === "completed" && b.scoringStatus !== "completed") return -1;
    if (b.scoringStatus === "completed" && a.scoringStatus !== "completed") return 1;
    return (b.aiScore ?? 0) - (a.aiScore ?? 0);
  });
  const stageCounts = ALL_STAGES.reduce<Record<ApplicationStage, number>>(
    (acc, stage) => {
      acc[stage] = applications.filter((app) => app.stage === stage).length;
      return acc;
    },
    {} as Record<ApplicationStage, number>,
  );
  const aiScoredCount = applications.filter(
    (app) => app.scoringStatus === "completed",
  ).length;
  const shortlistedCount = applications.filter(
    (app) => app.stage === "shortlisted",
  ).length;

  return (
    <div className="space-y-5">
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 transition hover:text-violet-300"
      >
        <CaretLeft weight="bold" size={14} />
        Back to roles
      </Link>

      <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] px-5 py-5 anim-1">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div className="min-w-0">
            <StatusBadge status={job.status} />
            <h1 className="mt-3 text-[26px] font-black leading-tight tracking-tight text-white">
              {job.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500">
              {job.location && <Meta icon={<MapPin weight="duotone" size={13} />} text={job.location} />}
              {job.type && <Meta icon={<Briefcase weight="duotone" size={13} />} text={job.type.replace("-", " ")} />}
              {(job.salaryMin || job.salaryMax) && (
                <Meta
                  icon={<CurrencyDollar weight="duotone" size={13} />}
                  text={
                    job.salaryMin && job.salaryMax
                      ? `${formatCurrency(job.salaryMin, job.salaryCurrency)} - ${formatCurrency(job.salaryMax, job.salaryCurrency)}`
                      : job.salaryMin
                        ? `From ${formatCurrency(job.salaryMin, job.salaryCurrency)}`
                        : `Up to ${formatCurrency(job.salaryMax!, job.salaryCurrency)}`
                  }
                />
              )}
              {job.closesAt && <Meta icon={<CalendarBlank weight="duotone" size={13} />} text={`Closes ${formatDate(job.closesAt)}`} />}
            </div>
          </div>
          <Link
            href={`/dashboard/jobs/${id}/edit`}
            className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
          >
            <PencilSimple weight="duotone" size={15} />
            Edit role
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <Stat label="Applications" value={applications.length} />
          <Stat label="AI scored" value={aiScoredCount} />
          <Stat label="Shortlisted" value={shortlistedCount} />
          <Stat label="Posted" value={formatDate(job.createdAt)} />
        </div>
      </section>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 anim-2">
        <StageTab
          active={stageFilter === "all"}
          label="All"
          count={applications.length}
          onClick={() => setStageFilter("all")}
        />
        {ALL_STAGES.map((stage) => (
          <StageTab
            key={stage}
            active={stageFilter === stage}
            label={STAGE_LABELS[stage]}
            count={stageCounts[stage]}
            style={STAGE_STYLES[stage]}
            onClick={() => setStageFilter(stage)}
          />
        ))}
      </div>

      {sortedApps.length === 0 ? (
        <EmptyState stageFilter={stageFilter} />
      ) : (
        <div className="space-y-2 anim-3">
          {sortedApps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              jobId={id}
              expanded={expanded === app.id}
              movingStage={movingStage === app.id}
              onToggle={() =>
                setExpanded((current) => (current === app.id ? null : app.id))
              }
              onMoveStage={moveStage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 capitalize">
      <span className="text-violet-300">{icon}</span>
      {text}
    </span>
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold capitalize ${
        active
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-slate-500/15 bg-slate-500/10 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-300 shadow-[0_0_8px_#34d399]" : "bg-slate-600"
        }`}
      />
      {status}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
      <p className="text-[12px] font-semibold text-slate-600">{label}</p>
      <p className="mt-1 truncate text-[20px] font-black text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

function StageTab({
  active,
  label,
  count,
  onClick,
  style,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
  style?: { color: string; bg: string; border: string };
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex flex-shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-bold transition ${
        active
          ? "border-violet-400/20 bg-violet-400/[0.14] text-violet-200"
          : "border-white/[0.07] bg-[#0d0f16] text-slate-500 hover:bg-white/[0.045] hover:text-slate-300"
      }`}
      style={
        active && style
          ? { color: style.color, background: style.bg, borderColor: style.border }
          : undefined
      }
    >
      {label}
      {count > 0 && (
        <span className="rounded-full bg-white/[0.07] px-1.5 py-0.5 text-[11px] tabular-nums">
          {count}
        </span>
      )}
    </button>
  );
}

function ScoreBox({ app }: { app: Application }) {
  const hasScore = app.scoringStatus === "completed" && app.aiScore != null;

  if (hasScore) {
    const color = scoreColor(app.aiScore!);
    return (
      <div
        className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg border"
        style={{ color, background: `${color}12`, borderColor: `${color}28` }}
      >
        <span className="text-[13px] font-black leading-none tabular-nums">
          {app.aiScore}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-600">
      {app.scoringStatus === "processing" ? (
        <CircleNotch size={15} className="animate-spin text-violet-300" />
      ) : app.scoringStatus === "failed" ? (
        <Warning weight="fill" size={15} className="text-red-300" />
      ) : (
        <Robot weight="duotone" size={15} />
      )}
    </div>
  );
}

function StagePill({ stage }: { stage: ApplicationStage }) {
  const style = STAGE_STYLES[stage];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold"
      style={{ color: style.color, background: style.bg, borderColor: style.border }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: style.color }} />
      {STAGE_LABELS[stage]}
    </span>
  );
}

function ApplicationCard({
  app,
  jobId,
  expanded,
  movingStage,
  onToggle,
  onMoveStage,
}: {
  app: Application;
  jobId: string;
  expanded: boolean;
  movingStage: boolean;
  onToggle: () => void;
  onMoveStage: (app: Application, stage: ApplicationStage) => void;
}) {
  const [showStageMenu, setShowStageMenu] = useState(false);
  const name = candidateName(app);
  const strengths = parseJsonArray(app.aiStrengths);
  const weaknesses = parseJsonArray(app.aiWeaknesses);
  const hasDetail = !!app.coverLetter || !!app.aiSummary || strengths.length > 0 || weaknesses.length > 0;
  const otherStages = ALL_STAGES.filter((stage) => stage !== app.stage);

  return (
    <article
      className={`overflow-hidden rounded-lg border bg-[#0d0f16] transition ${
        expanded ? "border-violet-400/25" : "border-white/[0.07]"
      }`}
    >
      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_108px_132px_124px] md:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar name={name} />
          <ScoreBox app={app} />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-white">{name}</p>
            <p className="mt-1 inline-flex min-w-0 items-center gap-1 text-[12px] text-slate-600">
              <EnvelopeSimple size={11} className="flex-shrink-0" />
              <span className="truncate">{app.candidate.email}</span>
            </p>
            {app.aiSummary && (
              <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500">
                {app.aiSummary}
              </p>
            )}
          </div>
        </div>

        <div className="flex md:justify-end">
          <StagePill stage={app.stage} />
        </div>

        <div className="relative flex gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => setShowStageMenu((current) => !current)}
            disabled={movingStage}
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 text-[12px] font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {movingStage ? (
              <CircleNotch size={13} className="animate-spin" />
            ) : (
              <>
                Move
                <CaretDown weight="bold" size={11} />
              </>
            )}
          </button>
          {showStageMenu && (
            <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-lg border border-white/[0.09] bg-[#121420] py-1 shadow-2xl shadow-black/60">
              {otherStages.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => {
                    setShowStageMenu(false);
                    onMoveStage(app, stage);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: STAGE_STYLES[stage].color }}
                  />
                  {STAGE_LABELS[stage]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <Link
            href={`/dashboard/jobs/${jobId}/applications/${app.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-200"
            aria-label={`Open ${name}`}
          >
            <UserCircle weight="duotone" size={16} />
          </Link>
          <a
            href={app.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-200"
            aria-label={`Open ${name} CV`}
          >
            <ArrowSquareOut weight="bold" size={14} />
          </a>
          {hasDetail && (
            <button
              type="button"
              onClick={onToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-200"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? <CaretUp weight="bold" size={14} /> : <CaretDown weight="bold" size={14} />}
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 border-t border-white/[0.06] bg-black/10 p-5">
          {app.coverLetter && (
            <InfoBlock title="Cover letter">
              <p className="whitespace-pre-line text-[13px] leading-6 text-slate-400">
                {app.coverLetter}
              </p>
            </InfoBlock>
          )}

          {app.aiSummary && (
            <InfoBlock title="AI summary" icon={<Robot weight="duotone" size={14} />}>
              <p className="text-[13px] leading-6 text-slate-400">{app.aiSummary}</p>
            </InfoBlock>
          )}

          {(strengths.length > 0 || weaknesses.length > 0) && (
            <div className="grid gap-3 md:grid-cols-2">
              {strengths.length > 0 && (
                <AnalysisList tone="good" title="Strengths" items={strengths} />
              )}
              {weaknesses.length > 0 && (
                <AnalysisList tone="risk" title="Gaps" items={weaknesses} />
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 text-[11px] text-slate-700">
            <span>Applied {formatDate(app.createdAt)}</span>
            {app.scoredAt && <span>Scored {formatDate(app.scoredAt)}</span>}
          </div>
        </div>
      )}
    </article>
  );
}

function InfoBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600">
        {icon}
        {title}
      </p>
      {children}
    </div>
  );
}

function AnalysisList({
  tone,
  title,
  items,
}: {
  tone: "good" | "risk";
  title: string;
  items: string[];
}) {
  const good = tone === "good";
  return (
    <div
      className={`rounded-lg border p-4 ${
        good
          ? "border-emerald-400/15 bg-emerald-400/[0.05]"
          : "border-red-400/15 bg-red-400/[0.05]"
      }`}
    >
      <p
        className={`mb-3 text-[11px] font-bold uppercase tracking-[0.16em] ${
          good ? "text-emerald-300" : "text-red-300"
        }`}
      >
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2 text-[13px] leading-5 text-slate-400">
            {good ? (
              <CheckCircle weight="fill" size={14} className="mt-0.5 flex-shrink-0 text-emerald-300" />
            ) : (
              <XCircle weight="fill" size={14} className="mt-0.5 flex-shrink-0 text-red-300" />
            )}
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ stageFilter }: { stageFilter: StageFilter }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-[#0d0f16] px-5 py-20 text-center anim-2">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
        <Users weight="duotone" size={24} />
      </div>
      <p className="text-[16px] font-bold text-white">
        {stageFilter === "all"
          ? "No applications yet"
          : `No candidates in ${STAGE_LABELS[stageFilter]}`}
      </p>
      <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
        {stageFilter === "all"
          ? "Share the job link and candidates will appear here once they apply."
          : "Try another stage or move candidates here from the list."}
      </p>
    </div>
  );
}
