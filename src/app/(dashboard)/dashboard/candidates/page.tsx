"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  CaretLeft,
  CaretRight,
  CheckCircle,
  CircleNotch,
  Clock,
  EnvelopeSimple,
  FunnelSimple,
  Globe,
  LinkedinLogo,
  MagnifyingGlass,
  Phone,
  UsersThree,
  Warning,
} from "@phosphor-icons/react";
import { candidatesApi } from "@/lib/api";

interface LatestApplication {
  id: string;
  stage: string;
  aiScore?: number | null;
  aiSummary?: string | null;
  scoringStatus: string;
  cvUrl: string;
  appliedAt: string;
  job: { id: string; title: string };
}

interface CandidateRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  latestApplication: LatestApplication;
}

const LIMIT = 20;

const STAGE_COLORS: Record<string, string> = {
  applied: "#60a5fa",
  screening: "#a78bfa",
  shortlisted: "#34d399",
  interview: "#fbbf24",
  offer: "#c084fc",
  rejected: "#f87171",
  withdrawn: "#6b7280",
};

function hue(name: string) {
  return name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

function stageColor(stage: string) {
  return STAGE_COLORS[stage] ?? "#a78bfa";
}

function Avatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const h = hue(`${firstName}${lastName}`);
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[13px] font-black text-white"
      style={{
        background: `linear-gradient(135deg, hsl(${h},60%,42%), hsl(${(h + 42) % 360},70%,32%))`,
      }}
    >
      {initials}
    </div>
  );
}

function ScoreBadge({ app }: { app: LatestApplication }) {
  if (app.scoringStatus === "completed" && app.aiScore != null) {
    const color =
      app.aiScore >= 75 ? "#34d399" : app.aiScore >= 50 ? "#fbbf24" : "#f87171";

    return (
      <div
        className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg border"
        style={{ background: color + "12", borderColor: color + "28" }}
        title="AI score"
      >
        <span
          className="text-[13px] font-black leading-none tabular-nums"
          style={{ color }}
        >
          {app.aiScore}
        </span>
      </div>
    );
  }

  const icon =
    app.scoringStatus === "pending" ? (
      <Clock weight="duotone" size={15} className="text-slate-600" />
    ) : app.scoringStatus === "processing" ? (
      <CircleNotch size={15} className="animate-spin text-violet-300" />
    ) : app.scoringStatus === "completed" ? (
      <CheckCircle weight="fill" size={15} className="text-emerald-300" />
    ) : (
      <Warning weight="fill" size={15} className="text-red-300" />
    );

  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.035]">
      {icon}
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const color = stageColor(stage);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-bold capitalize"
      style={{
        color,
        background: color + "12",
        borderColor: color + "26",
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {stage}
    </span>
  );
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

function SkeletonList() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Bone className="h-7 w-36" />
          <Bone className="h-4 w-64" />
        </div>
        <Bone className="h-10 w-28" />
      </div>
      <Bone className="h-11 w-full" />
      <div className="space-y-2">
        {[0, 1, 2, 3, 4, 5].map((item) => (
          <Bone key={item} className="h-[88px]" />
        ))}
      </div>
    </div>
  );
}

function CandidateRowCard({ candidate: c }: { candidate: CandidateRow }) {
  const app = c.latestApplication;
  const router = useRouter();
  const fullName = `${c.firstName} ${c.lastName}`.trim();

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/dashboard/candidates/${c.id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(`/dashboard/candidates/${c.id}`);
      }}
      className="group grid cursor-pointer gap-4 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4 transition hover:border-violet-400/20 hover:bg-violet-400/[0.035] md:grid-cols-[minmax(0,1fr)_124px_88px_32px] md:items-center"
    >
      <div className="flex min-w-0 items-start gap-3">
        <Avatar firstName={c.firstName} lastName={c.lastName} />

        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-slate-100 transition group-hover:text-violet-200">
            {fullName || "Unnamed candidate"}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex min-w-0 items-center gap-1 text-[12px] text-slate-600">
              <EnvelopeSimple size={11} className="flex-shrink-0" />
              <span className="truncate">{c.email}</span>
            </span>
            {c.phone && (
              <span className="inline-flex items-center gap-1 text-[12px] text-slate-600">
                <Phone size={11} />
                {c.phone}
              </span>
            )}
          </div>
          <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[12px] text-slate-500">
            <Briefcase weight="duotone" size={12} className="flex-shrink-0" />
            <span className="truncate">{app.job.title}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:justify-end">
        <StageBadge stage={app.stage} />
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 md:hidden">
          Score
        </p>
        <ScoreBadge app={app} />
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        {c.linkedinUrl && (
          <a
            href={c.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="text-slate-600 transition hover:text-violet-300"
            aria-label={`${fullName} LinkedIn`}
          >
            <LinkedinLogo size={16} weight="fill" />
          </a>
        )}
        {c.portfolioUrl && (
          <a
            href={c.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="text-slate-600 transition hover:text-violet-300"
            aria-label={`${fullName} portfolio`}
          >
            <Globe size={16} weight="bold" />
          </a>
        )}
        <CaretRight
          size={14}
          className="ml-1 text-slate-700 transition group-hover:text-violet-300"
        />
      </div>
    </article>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-[#0d0f16] px-5 py-20 text-center anim-2">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10">
        <UsersThree weight="duotone" size={24} className="text-violet-300" />
      </div>
      <p className="text-[16px] font-bold text-white">
        {hasSearch ? "No candidates match your search" : "No candidates yet"}
      </p>
      <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
        {hasSearch
          ? "Try a different name or email address."
          : "Candidates will appear here once they apply to your roles."}
      </p>
      {!hasSearch && (
        <Link
          href="/dashboard/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-violet-400/20 bg-violet-400/10 px-4 py-2.5 text-[13px] font-bold text-violet-200 transition hover:bg-violet-400/[0.16]"
        >
          View roles
          <CaretRight size={13} />
        </Link>
      )}
    </div>
  );
}

function PagBtn({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 text-[12px] font-bold text-slate-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await candidatesApi.list({
        page,
        limit: LIMIT,
        search: debouncedSearch || undefined,
      });
      const d = res.data;
      setCandidates(Array.isArray(d.data) ? d.data : []);
      setTotal(d.meta?.total ?? 0);
    } catch {
      setCandidates([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const scoredCount = candidates.filter(
    (candidate) =>
      candidate.latestApplication.scoringStatus === "completed" &&
      candidate.latestApplication.aiScore != null,
  ).length;

  if (loading) return <SkeletonList />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 anim-1 sm:flex-row sm:items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
            Candidates
          </p>
          <h1 className="mt-2 text-[26px] font-black leading-tight tracking-tight text-white">
            Review talent pool
          </h1>
          <p className="mt-1 text-[14px] text-slate-500">
            {total > 0
              ? `${total} candidate${total !== 1 ? "s" : ""} across your roles`
              : "All applicants across your roles"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:min-w-[260px]">
          <div className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-3">
            <p className="text-[11px] font-semibold text-slate-600">Visible</p>
            <p className="mt-1 text-[20px] font-black text-white tabular-nums">
              {candidates.length}
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-[#0d0f16] p-3">
            <p className="text-[11px] font-semibold text-slate-600">Scored</p>
            <p className="mt-1 text-[20px] font-black text-white tabular-nums">
              {scoredCount}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-3 anim-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="h-10 w-full rounded-lg border border-white/[0.07] bg-white/[0.035] pl-10 pr-4 text-[14px] text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.055]"
          />
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[12px] font-semibold text-slate-500">
          <FunnelSimple weight="duotone" size={15} className="text-slate-600" />
          Latest applications
        </div>
      </div>

      {candidates.length === 0 ? (
        <EmptyState hasSearch={!!debouncedSearch} />
      ) : (
        <div className="space-y-2 anim-3">
          {candidates.map((candidate) => (
            <CandidateRowCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
          <p className="text-[12px] text-slate-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <PagBtn
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <CaretLeft size={13} />
              Previous
            </PagBtn>
            <PagBtn
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              Next
              <CaretRight size={13} />
            </PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}
