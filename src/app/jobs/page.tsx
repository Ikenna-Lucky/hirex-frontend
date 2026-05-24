"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Loader2,
  Building2,
} from "lucide-react";
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
    <div className="min-h-screen bg-surface-950 text-gray-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-surface-950/80 backdrop-blur-lg">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-white"
          >
            Hire<span className="text-accent-400">X</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-lg transition-colors"
            >
              Post a job
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="border-b border-white/5 bg-surface-900/30 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Find your next role.
          </h1>
          <p className="text-gray-400 mb-8">
            {jobs.length > 0
              ? `${jobs.length} open position${jobs.length !== 1 ? "s" : ""}`
              : "Browse open positions"}
          </p>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or keyword…"
                className="w-full bg-surface-900 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-600/60 focus:ring-1 focus:ring-brand-600/30 transition"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface-900 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-600/60 transition min-w-[140px]"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job list */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 font-medium mb-1">
              No jobs match your search
            </p>
            <p className="text-sm text-gray-600">
              Try broadening your filters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} HireX — AI-powered hiring platform
      </footer>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block bg-surface-900 border border-white/5 hover:border-brand-600/30 rounded-2xl px-6 py-5 transition-all group hover:bg-surface-900/80"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          {/* Company avatar */}
          <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center text-brand-400 font-bold text-sm shrink-0">
            {job.company?.name?.charAt(0).toUpperCase() ?? (
              <Building2 className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-white group-hover:text-brand-400 transition-colors truncate">
              {job.title}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{job.company?.name}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {job.location && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
              )}
              {job.type && (
                <span className="flex items-center gap-1 text-xs text-gray-500 capitalize">
                  <Briefcase className="w-3 h-3" /> {job.type.replace("-", " ")}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <Clock className="w-3 h-3" /> {formatDate(job.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {job.closesAt && (
          <div className="shrink-0 text-right hidden sm:block">
            <p className="text-xs text-gray-600">Closes</p>
            <p className="text-xs text-gray-400 font-medium">
              {formatDate(job.closesAt)}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
