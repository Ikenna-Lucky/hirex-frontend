"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  MagnifyingGlass,
  MapPin,
  Briefcase,
  Clock,
  Buildings,
  ArrowRight,
  Funnel,
} from "@phosphor-icons/react";
import { jobsApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/types";

const JOB_TYPES = [
  { value: "", label: "All types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export default function PublicJobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobsApi.publicList({
        search: search || undefined,
        type: typeFilter || undefined,
        limit: 50,
      });
      const data = res.data.data;
      setJobs(Array.isArray(data) ? data : (data?.jobs ?? []));
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter]);

  useEffect(() => {
    const t = setTimeout(fetchJobs, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchJobs, search]);

  return (
    <div
      className="min-h-screen font-inter"
      style={{ background: "#0a0a0f", color: "#e5e7eb" }}
    >
      {/* ── Navbar ──────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12"
        style={{
          height: "64px",
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link href="/">
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "#fff",
              fontFamily: "'Syne', system-ui, sans-serif",
            }}
          >
            Hire<span style={{ color: "#a78bfa" }}>X</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-[13px] font-medium transition-colors"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "#fff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.45)")
            }
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-[13px] font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ background: "#7c3aed", color: "#fff" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#6d28d9")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = "#7c3aed")
            }
          >
            Post a job
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────── */}
      <div
        className="relative overflow-hidden px-6 md:px-12 py-16"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Background orbs */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 65%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold mb-6"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              color: "#a78bfa",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {jobs.length > 0
              ? `${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`
              : "Open positions"}
          </div>

          <h1 className="text-[36px] md:text-[52px] font-extrabold tracking-tight text-white mb-4 leading-tight">
            Find your next
            <br />
            <span style={{ color: "#a78bfa" }}>great role.</span>
          </h1>
          <p
            className="text-[16px] mb-10 max-w-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Browse roles from companies using AI-powered hiring. Apply once, get
            matched instantly.
          </p>

          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.25)" }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or keyword…"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-[14px] text-white placeholder-gray-600 focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(124,58,237,0.5)";
                  e.target.style.background = "rgba(255,255,255,0.08)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.background = "rgba(255,255,255,0.06)";
                }}
              />
            </div>

            <div className="relative">
              <Funnel
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.25)" }}
              />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none pl-9 pr-8 py-3 rounded-xl text-[14px] text-white focus:outline-none transition cursor-pointer min-w-[150px]"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {JOB_TYPES.map((t) => (
                  <option
                    key={t.value}
                    value={t.value}
                    style={{ background: "#1a1a28" }}
                  >
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Job list ─────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10">
        {loading ? (
          <SkeletonList />
        ) : jobs.length === 0 ? (
          <EmptyState hasFilter={!!(search || typeFilter)} />
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <div
                key={job.id}
                style={{
                  animation: `fade-up-in 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both`,
                }}
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <footer
        className="py-8 px-6 text-center text-[12px]"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          color: "rgba(255,255,255,0.2)",
        }}
      >
        © {new Date().getFullYear()} HireX — AI-powered hiring platform
      </footer>

      <style>{`
        @keyframes fade-up-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}

/* ── Job card ───────────────────────────────────────────── */
function JobCard({ job }: { job: Job }) {
  const initial = job.company?.name?.charAt(0).toUpperCase();
  const h =
    (job.company?.name ?? "")
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="flex items-center gap-4 px-6 py-5 rounded-2xl group transition-all"
      style={{
        background: "#111118",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(124,58,237,0.3)";
        (e.currentTarget as HTMLElement).style.background = "#13101e";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(255,255,255,0.06)";
        (e.currentTarget as HTMLElement).style.background = "#111118";
      }}
    >
      {initial ? (
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, hsl(${h},60%,40%), hsl(${(h + 40) % 360},60%,30%))`,
          }}
        >
          {initial}
        </div>
      ) : (
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <Buildings weight="duotone" size={18} style={{ color: "#a78bfa" }} />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-white transition-colors truncate group-hover:text-violet-300">
          {job.title}
        </p>
        <p
          className="text-[12px] mt-0.5 mb-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {job.company?.name}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {job.location && (
            <span
              className="flex items-center gap-1 text-[12px]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <MapPin weight="duotone" size={11} /> {job.location}
            </span>
          )}
          {job.type && (
            <span
              className="flex items-center gap-1 text-[12px] capitalize"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              <Briefcase weight="duotone" size={11} />{" "}
              {job.type.replace("-", " ")}
            </span>
          )}
          <span
            className="flex items-center gap-1 text-[12px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <Clock weight="duotone" size={11} /> {formatDate(job.createdAt)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        {job.closesAt && (
          <div className="hidden sm:block text-right">
            <p
              className="text-[11px]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Closes
            </p>
            <p
              className="text-[12px] font-medium"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {formatDate(job.closesAt)}
            </p>
          </div>
        )}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:translate-x-0.5"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          <ArrowRight weight="bold" size={14} />
        </div>
      </div>
    </Link>
  );
}

/* ── Empty state ────────────────────────────────────────── */
function EmptyState({ hasFilter }: { hasFilter: boolean }) {
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
        style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <Briefcase weight="duotone" size={20} style={{ color: "#a78bfa" }} />
      </div>
      <p className="text-[15px] font-semibold text-white">
        {hasFilter
          ? "No jobs match your search"
          : "No open positions right now"}
      </p>
      <p
        className="text-[13px] text-center max-w-xs"
        style={{ color: "rgba(255,255,255,0.3)" }}
      >
        {hasFilter
          ? "Try broadening your filters."
          : "Check back soon — new roles are added regularly."}
      </p>
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

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-5 rounded-2xl"
          style={{
            background: "#111118",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Bone style={{ width: 44, height: 44, borderRadius: 12 }} />
          <div className="flex-1 space-y-2">
            <Bone style={{ width: "40%", height: 15 }} />
            <Bone style={{ width: "25%", height: 12 }} />
            <div className="flex gap-4 pt-1">
              <Bone style={{ width: 80, height: 12 }} />
              <Bone style={{ width: 70, height: 12 }} />
            </div>
          </div>
          <Bone style={{ width: 24, height: 24, borderRadius: 8 }} />
        </div>
      ))}
    </div>
  );
}
