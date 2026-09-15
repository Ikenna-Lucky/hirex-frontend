"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Buildings,
  Clock,
  Funnel,
  MagnifyingGlass,
  MapPin,
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
    const timer = setTimeout(fetchJobs, search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [fetchJobs, search]);

  return (
    <div className="min-h-screen bg-[#07080d] font-inter text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07080d]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-bold text-slate-500 transition hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500"
            >
              Post a role
              <ArrowRight weight="bold" size={14} />
            </Link>
          </div>
        </div>
      </nav>

      <header className="border-b border-white/[0.06] px-4 py-12 md:px-6 md:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-1.5 text-[12px] font-bold text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            {jobs.length > 0
              ? `${jobs.length} open role${jobs.length !== 1 ? "s" : ""}`
              : "Open roles"}
          </div>
          <h1 className="mx-auto max-w-3xl text-[38px] font-black leading-tight tracking-tight text-white md:text-[58px]">
            Find roles from teams hiring with HireX.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-500 md:text-[16px]">
            Browse open roles, understand the company, and apply with your CV in
            one focused flow.
          </p>

          <div className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-3 sm:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
              />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or keyword"
                className="h-11 w-full rounded-lg border border-white/[0.07] bg-white/[0.035] pl-10 pr-4 text-[14px] text-white outline-none transition placeholder:text-slate-700 focus:border-violet-400/30 focus:bg-white/[0.055]"
              />
            </div>
            <div className="relative sm:w-[170px]">
              <Funnel
                size={14}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
              />
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="h-11 w-full cursor-pointer rounded-lg border border-white/[0.07] bg-white/[0.035] pl-10 pr-4 text-[14px] text-white outline-none transition focus:border-violet-400/30 focus:bg-white/[0.055]"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type.value} value={type.value} className="bg-[#0d0f16]">
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        {loading ? (
          <SkeletonList />
        ) : jobs.length === 0 ? (
          <EmptyState hasFilter={!!(search || typeFilter)} />
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/[0.06] px-6 py-8 text-center text-[12px] text-slate-700">
        Copyright {new Date().getFullYear()} HireX. AI-powered hiring platform.
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <Link href="/" className="inline-flex items-center" aria-label="HireX home">
      <span
        style={{
          fontSize: "21px",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          color: "#fff",
          fontFamily: "'Syne', system-ui, sans-serif",
          lineHeight: 1,
        }}
      >
        Hire
        <span
          style={{
            color: "#a78bfa",
            fontFamily: "'Syne', system-ui, sans-serif",
          }}
        >
          X
        </span>
      </span>
    </Link>
  );
}

function JobCard({ job }: { job: Job }) {
  const initial = job.company?.name?.charAt(0).toUpperCase();
  const h =
    (job.company?.name ?? "")
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360;

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group grid gap-4 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4 transition hover:border-violet-400/20 hover:bg-violet-400/[0.035] sm:grid-cols-[minmax(0,1fr)_120px_32px] sm:items-center"
    >
      <div className="flex min-w-0 items-start gap-3">
        {initial ? (
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[14px] font-black text-white"
            style={{
              background: `linear-gradient(135deg, hsl(${h},60%,42%), hsl(${(h + 42) % 360},70%,32%))`,
            }}
          >
            {initial}
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
            <Buildings weight="duotone" size={18} />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-white transition group-hover:text-violet-200">
            {job.title}
          </p>
          <p className="mt-1 text-[12px] text-slate-600">
            {job.company?.name ?? "Hiring company"}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {job.location && (
              <Meta icon={<MapPin weight="duotone" size={11} />} text={job.location} />
            )}
            {job.type && (
              <Meta icon={<Briefcase weight="duotone" size={11} />} text={job.type.replace("-", " ")} />
            )}
            <Meta icon={<Clock weight="duotone" size={11} />} text={formatDate(job.createdAt)} />
          </div>
        </div>
      </div>

      {job.closesAt && (
        <div className="sm:text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
            Closes
          </p>
          <p className="mt-1 text-[12px] font-bold text-slate-500">
            {formatDate(job.closesAt)}
          </p>
        </div>
      )}

      <div className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-violet-300">
        <ArrowRight weight="bold" size={14} />
      </div>
    </Link>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] capitalize text-slate-600">
      {icon}
      {text}
    </span>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.08] bg-[#0d0f16] px-5 py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10 text-violet-300">
        <Briefcase weight="duotone" size={24} />
      </div>
      <p className="text-[16px] font-bold text-white">
        {hasFilter ? "No roles match your search" : "No open roles right now"}
      </p>
      <p className="mt-2 max-w-xs text-[13px] leading-6 text-slate-500">
        {hasFilter
          ? "Try broadening your filters."
          : "Check back soon. New roles are added as companies hire."}
      </p>
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

function SkeletonList() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="flex items-center gap-4 rounded-lg border border-white/[0.07] bg-[#0d0f16] p-4"
        >
          <Bone className="h-10 w-10 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-2/5" />
            <Bone className="h-3 w-1/4" />
            <Bone className="h-3 w-1/2" />
          </div>
          <Bone className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}
