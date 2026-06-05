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
  Briefcase,
  CalendarBlank,
} from "@phosphor-icons/react";
import { candidatesApi, applicationsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { ApplicationStage } from "@/types";

/* ── Types ─────────────────────────────────────────────── */
interface CandidateApplication {
  id: string;
  stage: ApplicationStage;
  aiScore?: number | null;
  aiSummary?: string | null;
  aiStrengths?: string | null;
  aiWeaknesses?: string | null;
  scoringStatus: string;
  cvUrl: string;
  coverLetter?: string | null;
  notes?: string | null;
  scoredAt?: string | null;
  createdAt: string;
  job: { id: string; title: string; status: string };
}

interface CandidateDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  createdAt: string;
  applications: CandidateApplication[];
  applicationCount: number;
}

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

const STAGE_COLORS: Record<string, string> = {
  applied: "#60a5fa",
  screening: "#a78bfa",
  shortlisted: "#34d399",
  interview: "#fbbf24",
  offer: "#c084fc",
  rejected: "#f87171",
  withdrawn: "#6b7280",
};
const stageColor = (s: string) => STAGE_COLORS[s] ?? "#a78bfa";

function scoreColor(score: number) {
  return score >= 75 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";
}

/* ── Avatar ─────────────────────────────────────────────── */
function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const h = hue(name);
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : name.slice(0, 2);
  return (
    <div
      className="rounded-2xl flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.28,
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
export default function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    candidatesApi
      .get(id)
      .then((res) => setCandidate(res.data.data))
      .catch(() => setCandidate(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonPage />;

  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Warning
          weight="duotone"
          size={36}
          style={{ color: "rgba(255,255,255,0.2)" }}
        />
        <p className="text-[15px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Candidate not found.
        </p>
        <Link
          href="/dashboard/candidates"
          className="text-[13px] mt-1"
          style={{ color: "#a78bfa" }}
        >
          ← Back to candidates
        </Link>
      </div>
    );
  }

  const fullName = `${candidate.firstName} ${candidate.lastName}`;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* ── Back ── */}
      <Link
        href="/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
        style={{ color: "rgba(255,255,255,0.35)" }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.color = "#a78bfa")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.color =
            "rgba(255,255,255,0.35)")
        }
      >
        <CaretLeft weight="bold" size={14} /> Back to candidates
      </Link>

      {/* ── Profile card ── */}
      <div
        className="relative rounded-2xl overflow-hidden px-5 py-5 md:px-8 md:py-7"
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
          <Avatar name={fullName} size={64} />

          <div className="flex-1 min-w-0">
            <h1 className="text-[20px] md:text-[26px] font-extrabold text-white tracking-tight">
              {fullName}
            </h1>

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
                {candidate.email}
              </span>
              {candidate.phone && (
                <span
                  className="flex items-center gap-1.5 text-[13px]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  <Phone
                    weight="duotone"
                    size={13}
                    style={{ color: "#a78bfa" }}
                  />
                  {candidate.phone}
                </span>
              )}
              {candidate.linkedinUrl && (
                <a
                  href={candidate.linkedinUrl}
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
              {candidate.portfolioUrl && (
                <a
                  href={candidate.portfolioUrl}
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

            <div className="flex gap-6 mt-5">
              <div>
                <p className="text-[22px] font-extrabold text-white leading-none">
                  {candidate.applicationCount}
                </p>
                <p
                  className="text-[11px] mt-1 uppercase tracking-wide font-medium"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  {candidate.applicationCount === 1
                    ? "Application"
                    : "Applications"}
                </p>
              </div>
              <div>
                <p
                  className="text-[14px] font-semibold leading-none"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {formatDate(candidate.createdAt)}
                </p>
                <p
                  className="text-[11px] mt-1 uppercase tracking-wide font-medium"
                  style={{ color: "rgba(255,255,255,0.28)" }}
                >
                  First applied
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Applications list ── */}
      <div>
        <h2 className="text-[16px] font-bold text-white mb-3">Applications</h2>
        <div className="space-y-3">
          {candidate.applications.map((app, i) => (
            <div
              key={app.id}
              style={{
                animation: `fade-up-in 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 60}ms both`,
              }}
            >
              <ApplicationCard
                app={app}
                candidateId={id}
                onNoteSave={(notes) => {
                  setCandidate((prev) =>
                    prev
                      ? {
                          ...prev,
                          applications: prev.applications.map((a) =>
                            a.id === app.id ? { ...a, notes } : a,
                          ),
                        }
                      : prev,
                  );
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Application card ───────────────────────────────────── */
function ApplicationCard({
  app,
  candidateId,
  onNoteSave,
}: {
  app: CandidateApplication;
  candidateId: string;
  onNoteSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const strengths = parseJsonArray(app.aiStrengths);
  const weaknesses = parseJsonArray(app.aiWeaknesses);
  const hasAi = app.scoringStatus === "completed" && app.aiScore != null;
  const sc = stageColor(app.stage);

  async function saveNotes() {
    setSavingNotes(true);
    try {
      await applicationsApi.updateNotes(app.id, notes);
      onNoteSave(notes);
      toast.success("Notes saved.");
    } catch {
      toast.error("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  }

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
        {/* AI score */}
        {hasAi ? (
          <div
            className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
            style={{
              background: scoreColor(app.aiScore!) + "15",
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
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {app.scoringStatus === "processing" ? (
              <CircleNotch
                size={16}
                className="animate-spin"
                style={{ color: "#a78bfa" }}
              />
            ) : app.scoringStatus === "failed" ? (
              <Warning weight="fill" size={16} style={{ color: "#f87171" }} />
            ) : (
              <Clock weight="duotone" size={16} style={{ color: "#6b7280" }} />
            )}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-[14px] font-semibold text-white">
              <Briefcase
                weight="duotone"
                size={13}
                style={{ color: "#a78bfa" }}
              />
              {app.job.title}
            </span>
            <span
              className="text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize"
              style={{
                color: sc,
                background: sc + "18",
                border: `1px solid ${sc}30`,
              }}
            >
              {app.stage}
            </span>
          </div>
          <div className="flex gap-4 mt-1">
            <span
              className="flex items-center gap-1 text-[12px]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <CalendarBlank size={11} /> Applied {formatDate(app.createdAt)}
            </span>
          </div>
          {app.aiSummary && !expanded && (
            <p
              className="text-[12px] mt-1.5 line-clamp-1 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {app.aiSummary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View full detail */}
          <Link
            href={`/dashboard/jobs/${app.job.id}/applications/${app.id}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{
              color: "rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            title="Full application"
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
          </Link>

          {/* CV */}
          <a
            href={app.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-[12px] font-medium transition-all"
            style={{
              color: "rgba(255,255,255,0.45)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.45)";
            }}
          >
            CV ↗
          </a>

          {/* Expand */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all text-[11px] font-bold"
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
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ── Expanded content ── */}
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
          )}

          {/* Recruiter notes */}
          <div>
            <p
              className="text-[11px] font-bold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Recruiter notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
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
              className="mt-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all disabled:opacity-40"
              style={{
                background: "rgba(124,58,237,0.15)",
                color: "#a78bfa",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              {savingNotes ? "Saving…" : "Save notes"}
            </button>
          </div>
        </div>
      )}
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
      <Bone style={{ width: 130, height: 18 }} />
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
            <Bone style={{ width: 260, height: 28 }} />
            <Bone style={{ width: 180, height: 14 }} />
            <div className="flex gap-8 pt-2">
              <Bone style={{ width: 60, height: 40 }} />
              <Bone style={{ width: 80, height: 40 }} />
            </div>
          </div>
        </div>
      </div>
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Bone style={{ width: 44, height: 44, borderRadius: 12 }} />
          <div className="flex-1 space-y-2">
            <Bone style={{ width: "35%", height: 15 }} />
            <Bone style={{ width: "20%", height: 12 }} />
          </div>
          <Bone style={{ width: 100, height: 36, borderRadius: 12 }} />
        </div>
      ))}
    </div>
  );
}
