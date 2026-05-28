"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  UsersThree,
  EnvelopeSimple,
  Phone,
  LinkedinLogo,
  Globe,
  CircleNotch,
  CaretRight,
  Briefcase,
  CheckCircle,
  Clock,
  Warning,
} from "@phosphor-icons/react";
import { candidatesApi } from "@/lib/api";

/* ── Types ─────────────────────────────────────────────── */
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

/* ── Helpers ────────────────────────────────────────────── */
function hue(name: string) {
  return name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
}

const STAGE_COLORS: Record<string, string> = {
  applied:     "#60a5fa",
  screening:   "#a78bfa",
  shortlisted: "#34d399",
  interview:   "#fbbf24",
  offer:       "#c084fc",
  rejected:    "#f87171",
  withdrawn:   "#6b7280",
};

function stageColor(stage: string) {
  return STAGE_COLORS[stage] ?? "#a78bfa";
}

/* ── Avatar ─────────────────────────────────────────────── */
function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const h = hue(`${firstName}${lastName}`);
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0"
      style={{
        background: `linear-gradient(135deg, hsl(${h},60%,45%), hsl(${(h + 40) % 360},70%,35%))`,
      }}
    >
      {initials}
    </div>
  );
}

/* ── Score badge ────────────────────────────────────────── */
function ScoreBadge({ app }: { app: LatestApplication }) {
  if (app.scoringStatus === "completed" && app.aiScore != null) {
    const color = app.aiScore >= 75 ? "#34d399" : app.aiScore >= 50 ? "#fbbf24" : "#f87171";
    return (
      <div
        className="w-9 h-9 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
        style={{ background: color + "15", border: `1px solid ${color}30` }}
      >
        <span className="text-[13px] font-extrabold leading-none" style={{ color }}>
          {app.aiScore}
        </span>
      </div>
    );
  }
  const icon =
    app.scoringStatus === "pending"    ? <Clock    weight="duotone" size={14} style={{ color: "#6b7280" }} /> :
    app.scoringStatus === "processing" ? <CircleNotch size={14} className="animate-spin" style={{ color: "#a78bfa" }} /> :
    app.scoringStatus === "completed"  ? <CheckCircle weight="fill" size={14} style={{ color: "#34d399" }} /> :
                                         <Warning  weight="fill"  size={14} style={{ color: "#f87171" }} />;
  return (
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {icon}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════ */
export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search,  setSearch]        = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page,    setPage]          = useState(1);
  const [total,   setTotal]         = useState(0);
  const LIMIT = 20;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
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
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-[24px] font-extrabold text-white tracking-tight">Candidates</h1>
        <p className="text-[13px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          {total > 0
            ? `${total} candidate${total !== 1 ? "s" : ""} in your talent pool`
            : "All applicants across your roles"}
        </p>
      </div>

      {/* ── Search bar ── */}
      <div className="relative">
        <MagnifyingGlass
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "rgba(255,255,255,0.25)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[14px] text-white placeholder-gray-600 focus:outline-none transition"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(124,58,237,0.4)";
            e.target.style.background  = "rgba(255,255,255,0.06)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.background  = "rgba(255,255,255,0.04)";
          }}
        />
      </div>

      {/* ── Content ── */}
      {loading ? (
        <SkeletonList />
      ) : candidates.length === 0 ? (
        <EmptyState hasSearch={!!debouncedSearch} />
      ) : (
        <>
          <div className="space-y-2">
            {candidates.map((c, i) => (
              <div
                key={c.id}
                style={{ animation: `fade-up-in 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}
              >
                <CandidateRowCard candidate={c} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <PagBtn disabled={page === 1}          onClick={() => setPage(p => p - 1)} label="← Prev" />
                <PagBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)} label="Next →" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ── Candidate row card ─────────────────────────────────── */
function CandidateRowCard({ candidate: c }: { candidate: CandidateRow }) {
  const app = c.latestApplication;
  return (
    <Link
      href={`/dashboard/candidates/${c.id}`}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl group block transition-all"
      style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.25)";
        (e.currentTarget as HTMLElement).style.background  = "#13101e";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.background  = "#111118";
      }}
    >
      <Avatar firstName={c.firstName} lastName={c.lastName} />
      <ScoreBadge app={app} />

      {/* Name + meta ─────────────────────────────── */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <p className="text-[15px] font-semibold text-white group-hover:text-violet-300 transition-colors">
            {c.firstName} {c.lastName}
          </p>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
            style={{
              color: stageColor(app.stage),
              background: stageColor(app.stage) + "18",
              border: `1px solid ${stageColor(app.stage)}30`,
            }}
          >
            {app.stage}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
          <span className="flex items-center gap-1 text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            <EnvelopeSimple size={11} /> {c.email}
          </span>
          {c.phone && (
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              <Phone size={11} /> {c.phone}
            </span>
          )}
          <span className="flex items-center gap-1 text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Briefcase weight="duotone" size={11} /> {app.job.title}
          </span>
        </div>
      </div>

      {/* Social links ───────────────────────────────── */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {c.linkedinUrl && (
          <a
            href={c.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#a78bfa")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
          >
            <LinkedinLogo size={16} weight="fill" />
          </a>
        )}
        {c.portfolioUrl && (
          <a
            href={c.portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ color: "rgba(255,255,255,0.25)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#a78bfa")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.25)")}
          >
            <Globe size={16} weight="bold" />
          </a>
        )}
        <CaretRight size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
    </Link>
  );
}

/* ── Empty state ────────────────────────────────────────── */
function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div
      className="rounded-2xl py-24 flex flex-col items-center gap-3"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
      >
        <UsersThree weight="duotone" size={20} style={{ color: "#a78bfa" }} />
      </div>
      <p className="text-[15px] font-semibold text-white">
        {hasSearch ? "No candidates match your search" : "No candidates yet"}
      </p>
      <p className="text-[13px] text-center max-w-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        {hasSearch
          ? "Try a different name or email address."
          : "Candidates will appear here once they apply to your roles."}
      </p>
      {!hasSearch && (
        <Link
          href="/dashboard/jobs"
          className="mt-2 text-[13px] font-medium"
          style={{ color: "#a78bfa" }}
        >
          View your roles →
        </Link>
      )}
    </div>
  );
}

/* ── Pagination button ──────────────────────────────────── */
function PagBtn({ disabled, onClick, label }: { disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="px-4 py-2 rounded-xl text-[12px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        color: "rgba(255,255,255,0.55)",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {label}
    </button>
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

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl"
          style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Bone style={{ width: 40, height: 40, borderRadius: 12 }} />
          <Bone style={{ width: 36, height: 36, borderRadius: 12 }} />
          <div className="flex-1 space-y-2">
            <Bone style={{ width: "28%", height: 15 }} />
            <Bone style={{ width: "45%", height: 12 }} />
          </div>
          <Bone style={{ width: 20, height: 20, borderRadius: 4 }} />
        </div>
      ))}
    </div>
  );
}
