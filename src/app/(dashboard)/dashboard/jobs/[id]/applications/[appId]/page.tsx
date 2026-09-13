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
  CheckCircle,
  CircleNotch,
  Clock,
  EnvelopeSimple,
  Globe,
  LinkedinLogo,
  Phone,
  Robot,
  UserCircle,
  Warning,
  XCircle,
} from "@phosphor-icons/react";
import { applicationsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Application, ApplicationStage } from "@/types";

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
      <Bone className="h-4 w-32" />
      <Bone className="h-48" />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Bone className="h-56" />
          <Bone className="h-40" />
        </div>
        <div className="space-y-5">
          <Bone className="h-52" />
          <Bone className="h-44" />
        </div>
      </div>
    </div>
  );
}

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
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035] text-slate-600">
          <Warning weight="duotone" size={24} />
        </div>
        <p className="text-[16px] font-bold text-white">Application not found</p>
        <Link
          href={`/dashboard/jobs/${jobId}`}
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
        >
          <CaretLeft weight="bold" size={14} />
          Back to pipeline
        </Link>
      </div>
    );
  }

  const name = `${app.candidate.firstName} ${app.candidate.lastName}`.trim();
  const stageColor = STAGE_COLORS[app.stage];
  const hasAi = app.scoringStatus === "completed" && app.aiScore != null;
  const strengths = parseJsonArray(app.aiStrengths);
  const weaknesses = parseJsonArray(app.aiWeaknesses);
  const otherStages = ALL_STAGES.filter((stage) => stage !== app.stage);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-600">
        <Link
          href={`/dashboard/jobs/${jobId}`}
          className="inline-flex items-center gap-1.5 font-bold transition hover:text-violet-300"
        >
          <CaretLeft weight="bold" size={14} />
          Pipeline
        </Link>
        <span>/</span>
        <span className="text-slate-400">{name}</span>
      </div>

      <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] px-5 py-5">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="flex min-w-0 gap-4">
            <Avatar name={name} />
            <div className="min-w-0">
              <StagePill stage={app.stage} />
              <h1 className="mt-3 text-[26px] font-black tracking-tight text-white">
                {name}
              </h1>
              <p className="mt-1 text-[13px] text-slate-500">
                {app.job?.title ?? "Application review"}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-slate-500">
                <Contact icon={<EnvelopeSimple weight="duotone" size={13} />} text={app.candidate.email} />
                {app.candidate.phone && <Contact icon={<Phone weight="duotone" size={13} />} text={app.candidate.phone} />}
                {app.candidate.linkedinUrl && (
                  <ContactLink href={app.candidate.linkedinUrl} icon={<LinkedinLogo weight="fill" size={13} />} text="LinkedIn" />
                )}
                {app.candidate.portfolioUrl && (
                  <ContactLink href={app.candidate.portfolioUrl} icon={<Globe weight="bold" size={13} />} text="Portfolio" />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={app.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 text-[13px] font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowSquareOut weight="bold" size={14} />
              View CV
            </a>
            <Link
              href={`/dashboard/candidates/${app.candidate.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
            >
              <UserCircle weight="duotone" size={14} />
              Profile
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStageMenu((current) => !current)}
                disabled={movingStage}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.035] px-4 py-2.5 text-[13px] font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {movingStage ? (
                  <>
                    <CircleNotch size={13} className="animate-spin" />
                    Moving
                  </>
                ) : (
                  <>
                    Move stage
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
                      onClick={() => moveStage(stage)}
                      className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[12px] font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: STAGE_COLORS[stage] }}
                      />
                      {STAGE_LABELS[stage]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label="Applied" value={formatDate(app.createdAt)} />
          <Stat label="Scored" value={app.scoredAt ? formatDate(app.scoredAt) : "Pending"} />
          <Stat
            label="AI score"
            value={hasAi ? String(app.aiScore) : app.scoringStatus}
            color={hasAi ? scoreColor(app.aiScore!) : undefined}
          />
        </div>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Section title="AI analysis" icon={<Robot weight="duotone" size={16} />}>
            {hasAi ? (
              <div className="space-y-4">
                {app.aiSummary && (
                  <p className="text-[14px] leading-6 text-slate-400">
                    {app.aiSummary}
                  </p>
                )}
                <div className="grid gap-3 md:grid-cols-2">
                  {strengths.length > 0 && (
                    <AnalysisList tone="good" title="Strengths" items={strengths} />
                  )}
                  {weaknesses.length > 0 && (
                    <AnalysisList tone="risk" title="Gaps" items={weaknesses} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-3 text-[13px] text-slate-500">
                {app.scoringStatus === "processing" ? (
                  <CircleNotch size={16} className="animate-spin text-violet-300" />
                ) : app.scoringStatus === "failed" ? (
                  <Warning weight="fill" size={16} className="text-red-300" />
                ) : (
                  <Clock weight="duotone" size={16} className="text-slate-600" />
                )}
                {app.scoringStatus === "processing"
                  ? "AI scoring in progress."
                  : app.scoringStatus === "failed"
                    ? "AI scoring failed."
                    : "AI scoring is queued."}
              </div>
            )}
          </Section>

          {app.coverLetter && (
            <Section title="Cover letter">
              <p className="whitespace-pre-line text-[14px] leading-6 text-slate-400">
                {app.coverLetter}
              </p>
            </Section>
          )}
        </div>

        <aside className="space-y-5">
          <Section title="Recruiter notes">
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={5}
              placeholder="Add internal notes about this candidate."
              className="w-full resize-y rounded-lg border border-white/[0.07] bg-white/[0.035] px-3.5 py-3 text-[13px] leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.055]"
            />
            <button
              type="button"
              onClick={saveNotes}
              disabled={savingNotes || notes === (app.notes ?? "")}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingNotes && <CircleNotch size={13} className="animate-spin" />}
              {savingNotes ? "Saving" : "Save notes"}
            </button>
          </Section>

          <Section title="Application info" icon={<Briefcase weight="duotone" size={16} />}>
            <dl className="space-y-3">
              <InfoRow label="Stage">
                <StagePill stage={app.stage} />
              </InfoRow>
              <InfoRow label="Role">{app.job?.title ?? "Role"}</InfoRow>
              <InfoRow label="Applied">{formatDate(app.createdAt)}</InfoRow>
              {app.scoredAt && <InfoRow label="Scored">{formatDate(app.scoredAt)}</InfoRow>}
              <InfoRow label="CV">
                <a
                  href={app.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-violet-300 transition hover:text-violet-200"
                >
                  Open CV
                  <ArrowSquareOut size={12} />
                </a>
              </InfoRow>
            </dl>
          </Section>
        </aside>
      </div>
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

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] p-3">
      <p className="text-[12px] font-semibold text-slate-600">{label}</p>
      <p
        className="mt-1 truncate text-[20px] font-black text-white tabular-nums capitalize"
        style={color ? { color } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

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
    <section className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-5">
      <div className="mb-4 flex items-center gap-2 text-violet-300">
        {icon}
        <h2 className="text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {title}
        </h2>
      </div>
      {children}
    </section>
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
      <dt className="text-[12px] font-semibold text-slate-600">{label}</dt>
      <dd className="text-right text-[13px] font-medium text-slate-300">
        {children}
      </dd>
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
