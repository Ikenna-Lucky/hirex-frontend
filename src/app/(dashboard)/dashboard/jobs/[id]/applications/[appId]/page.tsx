"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  CaretLeft,
  EnvelopeSimple,
  Phone,
  LinkedinLogo,
  Globe,
  CircleNotch,
  ArrowSquareOut,
  CheckCircle,
  XCircle,
  Warning,
  Clock,
  Robot,
  CaretDown,
  UserCircle,
} from "@phosphor-icons/react";
import { applicationsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStage } from "@/types";

/* ── Constants ──────────────────────────────────────────── */
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

const STAGE_COLORS: Record<ApplicationStage, string> = {
  applied: "#60a5fa",
  screening: "#a78bfa",
  shortlisted: "#34d399",
  interview: "#fbbf24",
  offer: "#c084fc",
  rejected: "#f87171",
  withdrawn: "#6b7280",
};

/* ── Helpers ────────────────────────────────────────────── */
function hue(name: string) {
  return name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function scoreColor(score: number) {
  return score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
}

/* ── Avatar ─────────────────────────────────────────────── */
function Avatar({ name }: { name: string }) {
  const h = hue(name);
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2);
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center text-[20px] font-bold text-white flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, hsl(${h},60%,45%), hsl(${(h + 40) % 360},70%,35%))`,
      }}
    >
      {initials.toUpperCase()}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */
export default function ApplicationDetailPage() {
  const { id: jobId, appId } = useParams<{ id: string; appId: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [movingStage, setMovingStage] = useState(false);
  const [showStageMenu, setShowStageMenu] = useState(false);

  useEffect(() => {
    applicationsApi
      .get(appId)
      .then((res) => {
        const data = res.data.data;
        setApp(data);
        setNotes(data?.notes ?? "");
      })
      .catch(() => setApp(null))
      .finally(() => setLoading(false));
  }, [appId]);

  async function moveStage(stage: ApplicationStage) {
    if (!app) return;
    setMovingStage(true);
    setShowStageMenu(false);
    try {
      await applicationsApi.updateStage(app.id, stage);
      setApp((prev) => (prev ? { ...prev, stage } : prev));
      toast.success(`Moved to ${STAGE_LABELS[stage]}.`);
    } catch {
      toast.error("Failed to update stage.");
    } finally {
      setMovingStage(false);
    }
  }

  async function saveNotes() {
    if (!app) return;
    setSavingNotes(true);
    try {
      await applicationsApi.updateNotes(app.id, notes);
      setApp((prev) => (prev ? { ...prev, notes } : prev));
      toast.success("Notes saved.");
    } catch {
      toast.error("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  }

  if (loading) return <SkeletonPage />;

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Warning
          weight="duotone"
          size={36}
          style={{ color: "rgba(255,255,255,0.2)" }}
        />
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Application not found.
        </p>
        <Link
          href={`/dashboard/jobs/${jobId}`}
          className="text-[13px] mt-1"
          style={{ color: "#a78bfa" }}
        >
          ← Back to pipeline
        </Link>
      </div>
    );
  }

  const candidateName = `${app.candidate.firstName} ${app.candidate.lastName}`;
  const stageColor = STAGE_COLORS[app.stage];
  const hasAi = app.scoringStatus === "completed" && app.aiScore != null;
  const strengths = parseJsonArray(app.aiStrengths);
  const weaknesses = parseJsonArray(app.aiWeaknesses);
  const otherStages = ALL_STAGES.filter((s) => s !== app.stage);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* ── Breadcrumb ── */}
      <div
        className="flex items-center gap-2 text-[13px]"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        <Link
          href={`/dashboard/jobs/${jobId}`}
          className="flex items-center gap-1.5 transition-colors"
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.3)")
          }
        >
          <CaretLeft weight="bold" size={14} /> Pipeline
        </Link>
        <span>/</span>
        <span className="text-white/50">{candidateName}</span>
      </div>

      {/* ── Hero header ── */}
      <div
        className="relative rounded-2xl overflow-hidden px-8 py-7"
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

        <div className="relative flex items-start gap-6 flex-wrap">
          <Avatar name={candidateName} />

          <div className="flex-1 min-w-0">
            {/* Name + stage badge */}
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  color: stageColor,
                  background: stageColor + "18",
                  border: `1px solid ${stageColor}30`,
                }}
              >
                {STAGE_LABELS[app.stage]}
              </span>
            </div>
            <h1 className="text-[24px] font-extrabold text-white tracking-tight">
              {candidateName}
            </h1>

            {/* Contact info */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-2">
              <span
                className="flex items-center gap-1.5 text-[13px]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                <EnvelopeSimple
                  weight="duotone"
                  size={13}
                  style={{ color: "#a78bfa" }}
                />
                {app.candidate.email}
              </span>
              {app.candidate.phone && (
                <span
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <Phone
                    weight="duotone"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />
                  {app.candidate.phone}
                </span>
              )}
              {app.candidate.linkedinUrl && (
                <a
                  href={app.candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[13px] transition-colors"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.45)")
                  }
                >
                  <LinkedinLogo
                    weight="fill"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />{" "}
                  LinkedIn
                </a>
              )}
              {app.candidate.portfolioUrl && (
                <a
                  href={app.candidate.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[13px] transition-colors"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.45)")
                  }
                >
                  <Globe weight="bold" size={13} style={{ color: "#a78bfa" }} />{" "}
                  Portfolio
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-5">
              <StatChip label="Applied" value={formatDate(app.createdAt)} />
              {app.scoredAt && (
                <StatChip label="Scored" value={formatDate(app.scoredAt)} />
              )}
              {hasAi && (
                <StatChip
                  label="AI score"
                  value={String(app.aiScore)}
                  color={scoreColor(app.aiScore!)}
                  large
                />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View CV */}
            <a
              href={app.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.6)";
              }}
            >
              <ArrowSquareOut weight="bold" size={14} /> View CV
            </a>

            {/* View candidate profile */}
            <Link
              href={`/dashboard/candidates/${app.candidate.id}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{
                color: "#a78bfa",
                background: "rgba(124,58,237,0.1)",
                border: "1px solid rgba(124,58,237,0.25)",
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
              <UserCircle weight="duotone" size={14} /> Profile
            </Link>

            {/* Move stage */}
            <div className="relative">
              <button
                onClick={() => setShowStageMenu((v) => !v)}
                disabled={movingStage}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40"
                style={{
                  color: "rgba(255,255,255,0.55)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {movingStage ? (
                  <>
                    <CircleNotch size={13} className="animate-spin" /> Moving…
                  </>
                ) : (
                  <>
                    Move stage <CaretDown weight="bold" size={11} />
                  </>
                )}
              </button>
              {showStageMenu && (
                <div
                  className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-xl overflow-hidden py-1"
                  style={{
                    background: "#1a1a28",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  }}
                  onMouseLeave={() => setShowStageMenu(false)}
                >
                  {otherStages.map((s) => (
                    <button
                      key={s}
                      onClick={() => moveStage(s)}
                      className="w-full text-left px-3.5 py-2.5 text-[12px] font-medium transition-colors flex items-center gap-2.5"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLElement).style.color =
                          STAGE_COLORS[s];
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "";
                        (e.currentTarget as HTMLElement).style.color =
                          "rgba(255,255,255,0.55)";
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: STAGE_COLORS[s] }}
                      />
                      {STAGE_LABELS[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2-col layout ── */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
        {/* LEFT: AI + cover letter */}
        <div className="space-y-5">
          {/* AI analysis */}
          <Section
            title="AI Analysis"
            icon={
              <Robot weight="duotone" size={16} style={{ color: "#a78bfa" }} />
            }
          >
            {hasAi ? (
              <div className="space-y-4">
                {app.aiSummary && (
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {app.aiSummary}
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
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
            ) : (
              <div
                className="flex items-center gap-3 py-4"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {app.scoringStatus === "processing" ? (
                  <>
                    <CircleNotch
                      size={16}
                      className="animate-spin"
                      style={{ color: "#a78bfa" }}
                    />{" "}
                    <span className="text-[13px]">AI scoring in progress…</span>
                  </>
                ) : app.scoringStatus === "failed" ? (
                  <>
                    <Warning
                      weight="fill"
                      size={16}
                      style={{ color: "#f87171" }}
                    />{" "}
                    <span className="text-[13px]">Scoring failed.</span>
                  </>
                ) : (
                  <>
                    <Clock
                      weight="duotone"
                      size={16}
                      style={{ color: "#6b7280" }}
                    />{" "}
                    <span className="text-[13px]">Scoring queued…</span>
                  </>
                )}
              </div>
            )}
          </Section>

          {/* Cover letter */}
          {app.coverLetter && (
            <Section title="Cover Letter">
              <p
                className="text-[14px] leading-relaxed whitespace-pre-line"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {app.coverLetter}
              </p>
            </Section>
          )}
        </div>

        {/* RIGHT: sidebar */}
        <div className="space-y-5">
          {/* Recruiter notes */}
          <Section title="Recruiter Notes">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Add internal notes about this candidate…"
              className="w-full rounded-xl px-4 py-3 text-[13px] text-white placeholder-gray-600 resize-y focus:outline-none transition"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(124,58,237,0.4)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            />
            <button
              onClick={saveNotes}
              disabled={savingNotes || notes === (app.notes ?? "")}
              className="mt-2 w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40"
              style={{
                background: "rgba(124,58,237,0.15)",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              {savingNotes ? "Saving…" : "Save notes"}
            </button>
          </Section>

          {/* Application info */}
          <Section title="Application Info">
            <dl className="space-y-3">
              <InfoRow label="Status">
                <span
                  className="text-[12px] font-semibold px-2.5 py-1 rounded-full capitalize"
                  style={{
                    color: stageColor,
                    background: stageColor + "18",
                    border: `1px solid ${stageColor}30`,
                  }}
                >
                  {STAGE_LABELS[app.stage]}
                </span>
              </InfoRow>
              <InfoRow label="Applied">{formatDate(app.createdAt)}</InfoRow>
              {app.scoredAt && (
                <InfoRow label="AI scored">{formatDate(app.scoredAt)}</InfoRow>
              )}
              <InfoRow label="CV">
                <a
                  href={app.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[13px] transition-colors"
                  style={{ color: "#a78bfa" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#c4b5fd")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
                  }
                >
                  Open CV <ArrowSquareOut size={12} />
                </a>
              </InfoRow>
            </dl>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ── Shared components ──────────────────────────────────── */
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2
          className="text-[13px] font-bold uppercase tracking-widest"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
  large,
}: {
  label: string;
  value: string;
  color?: string;
  large?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-extrabold leading-none ${large ? "text-[22px]" : "text-[14px] font-semibold"}`}
        style={{ color: color ?? "rgba(255,255,255,0.55)" }}
      >
        {value}
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

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt
        className="text-[12px] font-medium"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {label}
      </dt>
      <dd className="text-[13px] text-white">{children}</dd>
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────── */
function Bone({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      className="animate-pulse rounded-xl"
      style={{ background: "rgba(255,255,255,0.06)", ...style }}
    />
  );
}

function SkeletonPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <Bone style={{ width: 100, height: 18 }} />
      <div
        className="rounded-2xl p-8 space-y-4"
        style={{
          background: "#0e0e1a",
          border: "1px solid rgba(124,58,237,0.12)",
        }}
      >
        <div className="flex items-start gap-6">
          <Bone style={{ width: 64, height: 64, borderRadius: 16 }} />
          <div className="flex-1 space-y-3">
            <Bone style={{ width: 60, height: 20, borderRadius: 999 }} />
            <Bone style={{ width: 240, height: 26 }} />
            <Bone style={{ width: 180, height: 14 }} />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Bone key={i} style={{ height: 120 + i * 40 }} />
          ))}
        </div>
        <div className="space-y-4">
          <Bone style={{ height: 180 }} />
          <Bone style={{ height: 150 }} />
        </div>
      </div>
    </div>
  );
}
