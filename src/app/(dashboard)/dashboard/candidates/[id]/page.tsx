"use client";

import { useEffect, useState } from "react";
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
  Clock,
  EnvelopeSimple,
  Globe,
  LinkedinLogo,
  Phone,
  Robot,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import { applicationsApi, candidatesApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { ApplicationStage } from "@/types";

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

function hue(name: string) {
  return name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;
}

function initials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)?.[0]}` : name.slice(0, 2)).toUpperCase();
}

function Avatar({ name }: { name: string }) {
  const h = hue(name);
  return (
    <div
      className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg text-[20px] font-black text-white"
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
    <div className="mx-auto max-w-4xl space-y-5">
      <Bone className="h-4 w-36" />
      <Bone className="h-48" />
      <Bone className="h-6 w-32" />
      <Bone className="h-28" />
      <Bone className="h-28" />
    </div>
  );
}

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
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-600">
          <Warning weight="duotone" size={24} />
        </div>
        <p className="text-[16px] font-bold text-white">Candidate not found</p>
        <Link
          href="/dashboard/candidates"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
        >
          <CaretLeft weight="bold" size={14} />
          Back to candidates
        </Link>
      </div>
    );
  }

  const fullName = `${candidate.firstName} ${candidate.lastName}`.trim();
  const scored = candidate.applications.filter(
    (app) => app.scoringStatus === "completed" && app.aiScore != null,
  );
  const bestScore =
    scored.length > 0
      ? Math.max(...scored.map((app) => app.aiScore ?? 0))
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <Link
        href="/dashboard/candidates"
        className="inline-flex items-center gap-1.5 text-[13px] font-bold text-slate-500 transition hover:text-violet-300"
      >
        <CaretLeft weight="bold" size={14} />
        Back to candidates
      </Link>

      <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] px-5 py-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <Avatar name={fullName} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
              Candidate profile
            </p>
            <h1 className="mt-2 text-[26px] font-black tracking-tight text-white">
              {fullName}
            </h1>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500">
              <Contact icon={<EnvelopeSimple weight="duotone" size={13} />} text={candidate.email} />
              {candidate.phone && <Contact icon={<Phone weight="duotone" size={13} />} text={candidate.phone} />}
              {candidate.linkedinUrl && (
                <ContactLink href={candidate.linkedinUrl} icon={<LinkedinLogo weight="fill" size={13} />} text="LinkedIn" />
              )}
              {candidate.portfolioUrl && (
                <ContactLink href={candidate.portfolioUrl} icon={<Globe weight="bold" size={13} />} text="Portfolio" />
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Applications" value={candidate.applicationCount} />
          <Stat label="Best score" value={bestScore == null ? "Pending" : bestScore} />
          <Stat label="First applied" value={formatDate(candidate.createdAt)} />
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[18px] font-bold text-white">Applications</h2>
            <p className="mt-1 text-[13px] text-slate-600">
              Role history and notes for this candidate.
            </p>
          </div>
        </div>

        {candidate.applications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/[0.08] bg-[#0d0f16] px-5 py-16 text-center text-[13px] text-slate-500">
            No applications found for this candidate.
          </div>
        ) : (
          <div className="space-y-2">
            {candidate.applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onNoteSave={(notes) => {
                  setCandidate((prev) =>
                    prev
                      ? {
                          ...prev,
                          applications: prev.applications.map((item) =>
                            item.id === app.id ? { ...item, notes } : item,
                          ),
                        }
                      : prev,
                  );
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Contact({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="text-violet-300">{icon}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}

function ContactLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 transition hover:text-violet-300"
    >
      <span className="text-violet-300">{icon}</span>
      {text}
    </a>
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

function StagePill({ stage }: { stage: ApplicationStage }) {
  const color = STAGE_COLORS[stage];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold"
      style={{ color, background: `${color}12`, borderColor: `${color}28` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {STAGE_LABELS[stage]}
    </span>
  );
}

function ScoreBox({ app }: { app: CandidateApplication }) {
  if (app.scoringStatus === "completed" && app.aiScore != null) {
    const color = scoreColor(app.aiScore);
    return (
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border text-[13px] font-black tabular-nums"
        style={{ color, background: `${color}12`, borderColor: `${color}28` }}
      >
        {app.aiScore}
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
        <Clock weight="duotone" size={15} />
      )}
    </div>
  );
}

function ApplicationCard({
  app,
  onNoteSave,
}: {
  app: CandidateApplication;
  onNoteSave: (notes: string) => void;
}) {
  const [notes, setNotes] = useState(app.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const strengths = parseJsonArray(app.aiStrengths);
  const weaknesses = parseJsonArray(app.aiWeaknesses);
  const hasAi = app.scoringStatus === "completed" && app.aiScore != null;

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
    <article
      className={`overflow-hidden rounded-lg border bg-[#0d0f16] transition ${
        expanded ? "border-violet-400/25" : "border-white/[0.07]"
      }`}
    >
      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_104px_116px] md:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <ScoreBox app={app} />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate text-[15px] font-bold text-white">
              <Briefcase weight="duotone" size={14} className="flex-shrink-0 text-violet-300" />
              {app.job.title}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[12px] text-slate-600">
              <CalendarBlank size={11} />
              Applied {formatDate(app.createdAt)}
            </p>
            {app.aiSummary && !expanded && (
              <p className="mt-2 line-clamp-1 text-[12px] leading-5 text-slate-500">
                {app.aiSummary}
              </p>
            )}
          </div>
        </div>

        <div className="flex md:justify-end">
          <StagePill stage={app.stage} />
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <Link
            href={`/dashboard/jobs/${app.job.id}/applications/${app.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-200"
            aria-label="Open full application"
          >
            <ArrowSquareOut weight="bold" size={14} />
          </Link>
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-500 transition hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-200"
            aria-label={expanded ? "Collapse application" : "Expand application"}
          >
            {expanded ? <CaretUp weight="bold" size={14} /> : <CaretDown weight="bold" size={14} />}
          </button>
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
          {hasAi && (
            <InfoBlock title="AI analysis" icon={<Robot weight="duotone" size={14} />}>
              {app.aiSummary && (
                <p className="mb-4 text-[13px] leading-6 text-slate-400">
                  {app.aiSummary}
                </p>
              )}
              <div className="grid gap-3 md:grid-cols-2">
                {strengths.length > 0 && <AnalysisList tone="good" title="Strengths" items={strengths} />}
                {weaknesses.length > 0 && <AnalysisList tone="risk" title="Gaps" items={weaknesses} />}
              </div>
            </InfoBlock>
          )}
          <InfoBlock title="Recruiter notes">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              placeholder="Add internal notes about this candidate."
              className="w-full resize-y rounded-lg border border-white/[0.07] bg-white/[0.035] px-3.5 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.055]"
            />
            <button
              type="button"
              onClick={saveNotes}
              disabled={savingNotes || notes === (app.notes ?? "")}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-[12px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {savingNotes && <CircleNotch size={13} className="animate-spin" />}
              {savingNotes ? "Saving" : "Save notes"}
            </button>
          </InfoBlock>
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
