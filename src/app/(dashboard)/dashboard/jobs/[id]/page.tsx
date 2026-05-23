"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  Loader2,
  Pencil,
  Users,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { jobsApi, applicationsApi } from "@/lib/api";
import { formatDate, getScoreColor, getScoreBg } from "@/lib/utils";
import type { Job, Application, ApplicationStage } from "@/types";

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

const STAGE_STYLES: Record<ApplicationStage, string> = {
  applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  screening: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  shortlisted: "bg-accent-500/10 text-accent-400 border-accent-500/20",
  interview: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  offer: "bg-brand-600/10 text-brand-400 border-brand-600/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  withdrawn: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const SCORING_ICONS = {
  pending: <Clock className="w-3.5 h-3.5 text-gray-500" />,
  processing: <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />,
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-accent-400" />,
  failed: <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
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

  const filteredApps =
    stageFilter === "all"
      ? applications
      : applications.filter((a) => a.stage === stageFilter);

  // Sort: completed scoring first, then by score desc
  const sortedApps = [...filteredApps].sort((a, b) => {
    if (a.scoringStatus === "completed" && b.scoringStatus !== "completed")
      return -1;
    if (b.scoringStatus === "completed" && a.scoringStatus !== "completed")
      return 1;
    return (b.aiScore ?? 0) - (a.aiScore ?? 0);
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 text-gray-500">Job not found.</div>
    );
  }

  const stageCounts = ALL_STAGES.reduce<Record<string, number>>((acc, s) => {
    acc[s] = applications.filter((a) => a.stage === s).length;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to jobs
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white truncate">
                {job.title}
              </h1>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${
                  job.status === "active"
                    ? "bg-accent-500/10 text-accent-400 border-accent-500/20"
                    : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }`}
              >
                {job.status}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500 flex-wrap">
              {job.location && <span>{job.location}</span>}
              {job.type && (
                <span className="capitalize">{job.type.replace("-", " ")}</span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {applications.length} application
                {applications.length !== 1 ? "s" : ""}
              </span>
              <span>Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
          <Link
            href={`/dashboard/jobs/${id}/edit`}
            className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-lg transition-all shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Link>
        </div>
      </div>

      {/* Stage filter tabs */}
      <div className="flex gap-1 bg-surface-900 border border-white/5 rounded-xl p-1 w-fit flex-wrap">
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
          />
        ))}
      </div>

      {/* Application list */}
      {sortedApps.length === 0 ? (
        <EmptyApplications stageFilter={stageFilter} />
      ) : (
        <div className="space-y-3">
          {sortedApps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              expanded={expanded === app.id}
              onToggle={() => setExpanded(expanded === app.id ? null : app.id)}
              onMoveStage={moveStage}
              movingStage={movingStage === app.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Application Card ────────────────────────────────────────

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

  const otherStages = ALL_STAGES.filter((s) => s !== app.stage);

  return (
    <div className="bg-surface-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
      {/* Main row */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Score badge */}
        <div className="shrink-0">
          {hasAi ? (
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${getScoreBg(app.aiScore!)}`}
            >
              <span className={getScoreColor(app.aiScore!)}>{app.aiScore}</span>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              {SCORING_ICONS[app.scoringStatus]}
            </div>
          )}
        </div>

        {/* Candidate info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-white">
              {app.candidate.firstName} {app.candidate.lastName}
            </p>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STAGE_STYLES[app.stage]}`}
            >
              {STAGE_LABELS[app.stage]}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{app.candidate.email}</p>
          {app.aiSummary && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">
              {app.aiSummary}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* CV link */}
          <a
            href={app.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            title="View CV"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Move stage */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowStageMenu((v) => !v)}
              disabled={movingStage}
              className="flex items-center gap-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-40"
            >
              {movingStage ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  Move <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
            {showStageMenu && (
              <div
                className="absolute right-0 top-full mt-1 z-20 w-36 bg-surface-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                onMouseLeave={() => setShowStageMenu(false)}
              >
                {otherStages.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setShowStageMenu(false);
                      onMoveStage(app, s);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-white/5 transition-colors ${
                      s === "rejected"
                        ? "text-red-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {STAGE_LABELS[s]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Expand */}
          {(hasAi || app.coverLetter) && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
            >
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expanded AI analysis */}
      {expanded && (
        <div className="border-t border-white/5 px-5 py-5 space-y-5 bg-surface-950/40">
          {app.coverLetter && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Cover letter
              </p>
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                {app.coverLetter}
              </p>
            </div>
          )}

          {hasAi && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Strengths */}
              {strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-2">
                    Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {strengths.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-400 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {weaknesses.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                    Gaps
                  </p>
                  <ul className="space-y-1.5">
                    {weaknesses.map((w, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Applied date + notes */}
          <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
            <span>Applied {formatDate(app.createdAt)}</span>
            {app.scoredAt && <span>Scored {formatDate(app.scoredAt)}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function TabBtn({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-brand-600/15 text-brand-400 border border-brand-600/25"
          : "text-gray-500 hover:text-gray-300"
      }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-xs ${
            active
              ? "bg-brand-600/20 text-brand-400"
              : "bg-white/5 text-gray-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyApplications({ stageFilter }: { stageFilter: StageFilter }) {
  return (
    <div className="bg-surface-900 border border-white/5 border-dashed rounded-2xl py-16 text-center">
      <Users className="w-8 h-8 text-gray-700 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-400 mb-1">
        {stageFilter === "all"
          ? "No applications yet"
          : `No candidates in ${STAGE_LABELS[stageFilter as ApplicationStage]}`}
      </p>
      <p className="text-xs text-gray-600">
        {stageFilter === "all"
          ? "Share the job link and candidates will appear here once they apply."
          : "Move candidates to this stage from the pipeline."}
      </p>
    </div>
  );
}
